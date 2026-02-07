import toast from "react-hot-toast";
import { api } from "../lib/axios.js";
import { create } from "zustand";
import io from "socket.io-client";

const defaultSocketUrl = "https://threadlybackend-8v2id5kc.b4a.run";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || defaultSocketUrl;

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLogging: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  checkAuth: async () => {
    try {
      const res = await api.get("/auth/check"); //? we always get output.data --> as the actual data using axios
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth store : ", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await api.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created succesfully");
      get().connectSocket();
    } catch (error) {
      console.log("Error in signup", error);
      toast.error(error);
    } finally {
      set({ isSigningUp: false });
    }
  },
  logout: async () => {
    try {
      await api.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      console.log("Error in logout store : " + error);
      toast.error(error);
    }
  },
  login: async (data) => {
    set({ isLogging: true });
    try {
      const res = await api.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      console.log("Error in login : ", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isLogging: false });
    }
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await api.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error in updateProfile : ", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  connectSocket: () => {
    //* if the user is not authenticated or already connected, we dont want to create any connection
    const { authUser, onlineUsers } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(SOCKET_URL, {
      //? this is for client
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();
    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
      console.log({ onlineUsers });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
