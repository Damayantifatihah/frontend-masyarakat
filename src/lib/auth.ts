export const getUser = () => {
  if (typeof window === "undefined")
    return null;

  const user =
    localStorage.getItem("user");

  return user
    ? JSON.parse(user)
    : null;
};

export const getToken = () => {
  if (typeof window === "undefined")
    return null;

  return localStorage.getItem(
    "token"
  );
};

export const logout = () => {
  // hapus localstorage
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // hapus cookie
  document.cookie =
    "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

  // redirect login
  window.location.href =
    "/auth/login";
};