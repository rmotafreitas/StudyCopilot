import React, { createContext, useContext, useEffect, useState } from "react";
// @ts-expect-error Because we are using js-cookie
import Cookies from "js-cookie";
import { auth, me, update } from "../api";

// Define types for authentication data
type AuthData = {
  user: User | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  update: (user: User) => Promise<boolean>;
  save: (user: User) => Promise<boolean>;
  fetchUserFromCookies: () => Promise<boolean>;
  me: () => Promise<User | null>;
};

export interface IWorkspace {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

export interface IQuestion {
  id: string;
  prompt: string;
  answer: string;
  screenshot?: string;
}

export interface IHomeWork {
  id: string;
  created_at: string;
  questions: IQuestion[];
}

export type User = {
  email: string;
  name: string;
  Workspace: IWorkspace[];
  // Add more user-related fields as needed
};

// Create context for authentication data
const AuthContext = createContext<AuthData | undefined>(undefined);

// Custom hook to use authentication context
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// AuthProvider component to wrap your app and provide authentication context
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);

  const signIn = async (login: string, password: string): Promise<boolean> => {
    const res = await auth(login, password);
    if (res) {
      const user = await me();
      if (user) {
        setUser(user);
      } else {
        return false;
      }
    }
    return res;
  };

  const signOut = () => {
    Cookies.remove("hanko");
    Cookies.remove("token");
    setUser(null);
  };

  const fetchUserFromCookies = async (): Promise<boolean> => {
    const storedUser = Cookies.get("token");
    if (storedUser) {
      const res = await me();
      if (res) {
        console.log(res);
        setUser(res);
        return true;
      }
    }
    signOut();
    return false;
  };

  const save = async (user: User): Promise<boolean> => {
    const res = await update(user);
    if (res) {
      const updatedUser = await me();
      if (updatedUser) {
        setUser(updatedUser);
      }
    }
    return res;
  };

  useEffect(() => {
    console.log("Fetching user from cookies");
    fetchUserFromCookies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Memoize value to prevent unnecessary re-renders
  const authData = React.useMemo(
    () => ({
      user,
      signIn,
      signOut,
      update,
      save,
      fetchUserFromCookies,
      me,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user]
  );

  return (
    <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export { useAuth };
