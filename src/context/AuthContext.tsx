'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType } from '@/types/authContextType'; 
import { User, SlimUser } from '@/types/user';
import { useRouter } from 'next/navigation';



const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<SlimUser | null>(null);
  const [ready,setReady] = useState(false);
  const [guest, setGuest] = useState<SlimUser | null>(null);
  const router = useRouter();
  useEffect(() => {
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  const storedGuest = localStorage.getItem('guest')
  if (token && storedUser) {
    try {
      setUser(JSON.parse(storedUser));
    } catch {
      setUser(null);
    }
  }
  else if(token && storedGuest){
    try{
      setGuest(JSON.parse(storedGuest))
    }catch{
      setGuest(null)
    }
  }
  setReady(true);
}, []);

  const login = (userData: SlimUser, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setGuest(null);
    router.push('/');
  };

  const asGuest = (guestData: SlimUser, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('guest', JSON.stringify(guestData));
    setGuest(guestData)
  };

  return (
    <AuthContext.Provider value={{ user,guest, login, logout, asGuest, ready }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};