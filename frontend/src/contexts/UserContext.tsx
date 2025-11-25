import { createContext, type ReactNode, useContext } from 'react';
import useFetch from '../hooks/useFetch';

interface UserContextType<T> {
  user: T | null;
  loading: boolean
}

export const UserContext = createContext<UserContextType<any>>({
  user: null,
  loading: false
});

interface UserContextProviderProps<T> {
  children: ReactNode;
  type?: T; 
}

export const UserContextProvider = <T,>({ children }: UserContextProviderProps<T>) => {
  const { data, loading } = useFetch('/api/auth');

  return (
    <UserContext.Provider value={{ user: { ...data?.user, role: data?.role } as T | null, loading }}>
      {children}
    </UserContext.Provider>
  );
};


export const useUser = <T,>(): UserContextType<T> => useContext(UserContext);
