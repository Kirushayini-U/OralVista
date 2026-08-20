export const saveAuthentication = (
  token,
  user
) => {
  localStorage.setItem("token", token);
  localStorage.setItem(
    "user",
    JSON.stringify(user)
  );
};

export const updateStoredUser = (user) => {
  localStorage.setItem(
    "user",
    JSON.stringify(user)
  );
};

export const getStoredToken = () => {
  return localStorage.getItem("token");
};

export const getStoredUser = () => {
  try {
    const savedUser =
      localStorage.getItem("user");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

export const clearAuthentication = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};