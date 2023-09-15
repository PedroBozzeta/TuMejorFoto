import express from 'express'
import cors from 'cors'
import {createClient} from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import {
  categories,
  userQuery,
  feedQuery,
  searchQuery,
  userCreatedPinsQuery,
  userSavedPinsQuery,
  pinDetailMorePinQuery,
  pinDetailQuery,
} from '../utils/data.js'

import dotenv from 'dotenv'
import multer from 'multer'
import bodyParser from 'body-parser'
import {v4 as uuidv4} from 'uuid'

dotenv.config()
const app = express()
const PORT = 3001
console.log(process.env.SANITY_PROJECT_ID)
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2021-11-16',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
})
const storage = multer.memoryStorage()
const upload = multer({storage: storage})

app.use(
  cors({
    origin: '*', // ajusta esto para ser más específico si es necesario
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type'],
    // Aquí puedes especificar otros encabezados si es necesario
  }),
)

app.use(bodyParser.json())

app.get('/user/:googleId', (req, res) => {
  const googleId = req.params.googleId

  const query = userQuery(googleId)

  client
    .fetch(query)
    .then((users) => {
      if (users.length > 0) {
        res.status(200).json(users[0])
      } else {
        res.status(404).json({message: 'Usuario no encontrado'})
      }
    })
    .catch((err) => {
      console.error('Error al obtener el usuario:', err.message)
      res.status(500).json({error: err.message})
    })
})

app.post('/login', (req, res) => {
  client
    .createIfNotExists(req.body)
    .then((data) => {
      console.log('Usuario creado o ya existente')
      res.status(200).json(data)
    })
    .catch((err) => {
      console.error('Error al crear usuario:', err.message)
      res.status(500).json({error: err.message})
    })
})

app.get('/pins', (req, res) => {
  console.log('llega la petición')
  let query = ''

  const {categoryId} = req.query
  if (categoryId && categoryId !== 'undefined') {
    query = searchQuery(categoryId)
  } else {
    query = feedQuery
  }
  client
    .fetch(query)
    .then((data) => res.json(data))
    .catch((err) => res.status(500).json({error: err.message}))
})

app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({error: 'No file provided'})
  }

  const {originalname, mimetype, buffer} = req.file

  client.assets
    .upload('image', buffer, {
      contentType: mimetype,
      filename: originalname,
    })
    .then((document) => {
      res.json(document)
    })
    .catch((error) => {
      console.error('Image upload error', error)
      res.status(500).json({error: 'Image upload error'})
    })
})

app.delete('/pin/:id', (req, res) => {
  const pinId = req.params.id

  client
    .delete(pinId)
    .then((res) => {
      res.status(200).json({message: 'Pin eliminado exitosamente.'})
    })
    .catch((err) => {
      console.error('Error al eliminar el pin:', err.message)
      res.status(500).json({error: err.message})
    })
})

app.post('/save', (req, res) => {
  console.log('pin guardado')
  client.create(req.body)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.patch('/like', (req, res) => {
  const userId = req.body.userId
  const pinId = req.body.pinId

  if (!userId || !pinId) {
    return res.status(400).send('Se requiere userId y pinId')
  }
  client
    .fetch(
      `*[_type == "pin" && _id == "${pinId}" && save[userId == "${userId}"]][0]
    `,
    )
    .then((doc) => {
      if (doc) {
        res.send({isSaved: true})
      } else {
        client
          .patch(pinId)
          .setIfMissing({save: []})
          .insert('after', 'save[-1]', [
            {
              _key: uuidv4(),
              userId: userId,
              postedBy: {
                _type: 'postedBy',
                _ref: userId,
              },
            },
          ])
          .commit()
          .then(() => {
            res.send({isSaved: false, nowSaved: true})
          })
          .catch((error) => {
            console.error(error)
            res.status(500).send('Error al guardar el pin')
          })
      }
    })
    .catch((error) => {
      console.error(error)
      res.status(500).send('Error al verificar el pin')
    })
})

app.patch('/unlike', (req, res) => {
  const userId = req.body.userId
  const pinId = req.body.pinId

  if (!userId || !pinId) {
    return res.status(400).send('Se requiere userId y pinId')
  }

  client
    .fetch(`*[_type == "pin" && _id == "${pinId}"]{save}[0]`)
    .then((doc) => {
      if (!doc || !doc.save) {
        return res.status(404).send('Pin no encontrado o no tiene sección de guardados')
      }
      const itemToRemove = doc.save.find((item) => item.userId === userId)

      if (!itemToRemove) {
        return res.status(404).send('El pin no fue guardado por este usuario')
      }

      client
        .patch(pinId)
        .unset([`save[_key == "${itemToRemove._key}"]`])
        .commit()
        .then(() => {
          res.send({removed: true})
        })
        .catch((error) => {
          console.error(error)
          res.status(500).send('Error al quitar el pin guardado')
        })
    })
    .catch((error) => {
      console.error(error)
      res.status(500).send('Error al buscar el pin')
    })
})

app.patch('/comment', (req, res) => {
  const userId = req.body.userId
  const pinId = req.body.pinId
  const comment = req.body.comment

  if (!userId || !pinId || !comment) {
    return res.status(400).send('Se requiere userId, el comentario y pinId')
  }
  client
    .patch(pinId)
    .setIfMissing({comments: []})
    .insert('after', 'comments[-1]', [
      {
        comment,
        _key: uuidv4(),
        postedBy: {_type: 'postedBy', _ref: userId},
      },
    ])
    .commit()
    .then(() => {
      res.send({send: true})
    })
    .catch((error) => {
      console.error(error)
      res.status(500).send('Error al enviar comentario')
    })
})

app.get('/posts', (req, res) => {
  console.log('llega la petición de pins creados')
  const {userId} = req.query
  const query = userCreatedPinsQuery(userId)
  client
    .fetch(query)
    .then((data) => res.json(data))
    .catch((err) => res.status(500).json({error: err.message}))
})

app.get('/saved', (req, res) => {
  console.log('llega la petición de pins guardados')
  const {userId} = req.query
  const query = userSavedPinsQuery(userId)
  client
    .fetch(query)
    .then((data) => res.json(data))
    .catch((err) => res.status(500).json({error: err.message}))
})

app.get('/categories', (req, res) => {
  res.json(categories)
})

const builder = imageUrlBuilder(client)
const urlFor = (source) => builder.image(source)

app.get('/image/:id', async (req, res) => {
  const pinId = req.params.id
  const query = `*[_type == "pin" && _id == "${pinId}"]{ image }`
  const results = await client.fetch(query)

  if (results && results.length > 0) {
    const pinImage = results[0].image
    const imageUrl = urlFor(pinImage).url()
    res.json({imageUrl})
  } else {
    res.status(404).json({error: 'Pin o imagen no encontrados'})
  }
})

app.get('/pin-details', (req, res) => {
  const {pinId} = req.query

  const query = pinDetailQuery(pinId)

  client
    .fetch(query)
    .then((data) => {
      if (data && data[0]) {
        const query1 = pinDetailMorePinQuery(data[0])
        return client.fetch(query1).then((secondData) => {
          return {pinData: data[0], relatedPins: secondData}
        })
      } else {
        res.status(404).json({error: 'Pin no encontrado'})
      }
    })
    .then((combinedData) => {
      res.json(combinedData)
    })
    .catch((err) => {
      console.error('Error al obtener el pin:', err.message)
      res.status(500).json({error: err.message})
    })
})
