export const getUser = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const user =
    localStorage.getItem("user");

  return user
    ? JSON.parse(user)
    : null;
};

export const getToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(
    "token"
  );
};

export const getRole = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const user =
    localStorage.getItem("user");

  if (!user) {
    return null;
  }

  const parsedUser =
    JSON.parse(user);

  return parsedUser.role || null;
};

export const logout = () => {
  // =========================
  // HAPUS LOCAL STORAGE
  // =========================
  localStorage.removeItem("token");

  localStorage.removeItem("user");

  // =========================
  // HAPUS COOKIE TOKEN
  // =========================
  document.cookie =
    "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

  // =========================
  // HAPUS COOKIE ROLE

  document.cookie =
    "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

  // =========================
  // REDIRECT LOGIN
  // =========================
  window.location.href =
    "/auth/login";
};