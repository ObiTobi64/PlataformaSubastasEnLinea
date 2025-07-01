import { create } from "zustand";
import type { IUser } from "../interfaces/IUser";
import { persist } from "zustand/middleware";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "../services/userService";

interface IUserStore {
  users: IUser[];
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => void;
  getUserById: (id: string) => IUser | undefined;
  createUser: (user: IUser) => void;
  updateUser: (user: IUser) => void;
  deleteUser: (id: string) => void;
}

export const useUserStore = create<IUserStore>()(
  persist(
    (set, get) => ({
      users: [],
      isLoading: false,
      error: null,
      fetchUsers: async () => {
        try {
          set({ isLoading: true, error: null });
          const users = await getUsers();
          set({ users: users });
        } catch (error) {
          const err = error as Error;
          set({ error: err.message });
        } finally {
          set({ isLoading: false });
        }
      },
      getUserById: (id: string) => {
        const { users } = get();
        return users.find((user) => user.id!.toString() === id);
      },
      createUser: async (user: IUser) => {
        try {
          set({ isLoading: true });
          const newUser = await createUser(user);
          if (!newUser) {
            throw new Error("user.createError");
          }
          set((state) => ({
            users: [...state.users, newUser],
          }));
        } catch (error) {
          const err = error as Error;
          set({ error: err.message });
        } finally {
          set({ isLoading: false });
        }
      },
      deleteUser: async (id: string) => {
        try {
          set({ isLoading: true });
          await deleteUser(id);
          set((state) => ({
            users: state.users.filter((user) => user.id!.toString() !== id),
          }));
        } catch (error) {
          const err = error as Error;
          set({ error: err.message });
        } finally {
          set({ isLoading: false });
        }
      },
      updateUser: async (user: IUser) => {
        try {
          set({ isLoading: true });
          const updatedUser = await updateUser(user.id!, user);
          if (!updatedUser) {
            throw new Error("user.updateError");
          }
          set((state) => ({
            users: state.users.map((u) =>
              u.id === updatedUser.id ? updatedUser : u
            ),
          }));
        } catch (error) {
          const err = error as Error;
          set({ error: err.message });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    { name: "users" }
  )
);
