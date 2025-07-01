import { createContext, useContext, useState, type ReactNode } from "react";
import type { IUser } from "../interfaces/IUser";
import { clearStorage, setStorage } from "../utils/localStorage";

interface IAuthContext {
  user: IUser;
  isAuth: boolean;
  login: (user: IUser) => void;
  logout: () => void;
}
const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState({} as IUser);
  const [isAuth, setIsAuth] = useState(false);

  const login = (user: IUser) => {
    setStorage("user", user);
    setUser(user);
    setIsAuth(true);
  };

  const logout = () => {
    clearStorage();
    setIsAuth(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
