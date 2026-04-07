import { create } from "zustand";

export const useAuthStore = create((set) => ({
  // 🔐 STATE
  user: null,
  token: localStorage.getItem("token") || null,

  // ✅ LOGIN
  login: (data) => {
    const { token, user } = data;

    // store token
    localStorage.setItem("token", token);

    set({
      token,
      user,
    });
  },

  // 🚪 LOGOUT
  logout: () => {
    localStorage.removeItem("token");

    set({
      token: null,
      user: null,
    });
  },

  // 🔄 OPTIONAL: restore user (for refresh)
  setUser: (user) => {
    set({ user });
  },
}));
