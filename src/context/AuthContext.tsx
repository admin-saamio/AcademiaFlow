"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth, loginWithGoogle, logoutUser, fetchUserAcademicRecord } from "@/lib/firebase";
import { AcademicTrackerState } from "@/types/academic";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInGoogle: () => Promise<void>;
  logOut: () => Promise<void>;
  cloudData: AcademicTrackerState | null;
  setCloudData: (data: AcademicTrackerState | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInGoogle: async () => {},
  logOut: async () => {},
  cloudData: null,
  setCloudData: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [cloudData, setCloudData] = useState<AcademicTrackerState | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch Cloud Firestore records automatically upon login
        const record = await fetchUserAcademicRecord(currentUser.uid);
        if (record) {
          setCloudData(record);
        }
      } else {
        setCloudData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInGoogle = async () => {
    try {
      const loggedInUser = await loginWithGoogle();
      if (loggedInUser) {
        setUser(loggedInUser);
        const record = await fetchUserAcademicRecord(loggedInUser.uid);
        if (record) {
          setCloudData(record);
        }
      }
    } catch (err) {
      console.error("Auth signin error:", err);
    }
  };

  const logOut = async () => {
    try {
      await logoutUser();
      setUser(null);
      setCloudData(null);
    } catch (err) {
      console.error("Auth logout error:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInGoogle, logOut, cloudData, setCloudData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
