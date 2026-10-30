import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

const storedToken = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");

const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const decoded = jwtDecode(token);

    return !decoded.exp || decoded.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

const useAuthStore = create((set) => ({
  token: storedToken,
  user: storedUser ? JSON.parse(storedUser) : null,

  login: ({ token, user }) => {
    localStorage.setItem("token", token);

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }

    set({
      token,
      user: user ?? null,
    });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    set({
      token: null,
      user: null,
    });
  },
  isTokenExpired: () => isTokenExpired(localStorage.getItem("token")),
}));

export default useAuthStore;