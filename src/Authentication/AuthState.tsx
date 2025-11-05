import { googleLogout } from '@react-oauth/google';
import { createContext, useContext, useState, type ReactNode } from 'react';


interface AuthState {
  authenticated: boolean;
  login:() => void;
  logout:() => void;
}
interface AuthProps{
  children: ReactNode
}

const AuthStorage = 'Authenticated';
const AuthState = createContext<AuthState | undefined>(undefined);
export const Auth = (props: AuthProps) => {
  const [authenticated, setAuthenticated] = useState(() => {
    const storedState = localStorage.getItem(AuthStorage);
    return storedState === 'true'; 
  });
  const login = () => {
    localStorage.setItem(AuthStorage, 'true');
    setAuthenticated(true);
  };
  const logout = () => {
    localStorage.removeItem(AuthStorage);
    googleLogout();
    setAuthenticated(false);
  };

  return (
    <AuthState.Provider value={{ authenticated, login, logout }}>
      {props.children}
    </AuthState.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthState);
  return context;
};