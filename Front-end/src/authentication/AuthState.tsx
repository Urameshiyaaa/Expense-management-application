import { googleLogout } from '@react-oauth/google';
import { createContext, useContext, useState, type ReactNode } from 'react';


interface AuthUser {
  user_id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
}


interface AuthStateInterface { 
  authenticated: boolean;
  user: AuthUser | null; 
  login: (user: AuthUser) => void; 
  logout: () => void;
}

interface AuthProps{ 
  children: ReactNode
}

const AuthUserStorage = 'AuthUserObject'; 

const AuthState = createContext<AuthStateInterface | undefined>(undefined);
export const Auth = (props: AuthProps) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const storedUser = localStorage.getItem(AuthUserStorage);
    return storedUser ? (JSON.parse(storedUser) as AuthUser) : null; 
  });
  
  const authenticated = !!user;

  const login = (newUser: AuthUser) => {
    localStorage.setItem(AuthUserStorage, JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem(AuthUserStorage);
    googleLogout();
    setUser(null); 
   };

  return (
    <AuthState.Provider value={{ authenticated, user, login, logout }}>
      {props.children}
    </AuthState.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthState);
  return context;
};