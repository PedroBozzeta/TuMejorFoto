export const getUrlFunction = async (id) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/image/${id}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
export const fetchUser = () => {
  const userInfo =
    localStorage.getItem("user") !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : localStorage.clear();
  return userInfo;
};

export const getCategories = async () => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/categories`
    );
    const data = await response.json();
    if (Array.isArray(data)) {
      return data;
    } else {
      console.error("Data is not an array:", data);
    }
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
