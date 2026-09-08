import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, isFirebaseConfigured } from "../firebase/config";
import { signUpUser, signInUser, logOutUser } from "../firebase/auth";
import { getUserProfile, updateUserProfile as updateProfileFirestore } from "../firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.warn("useAuth hook invoked outside AuthProvider scope; returning safe loading fallback.");
    return {
      currentUser: null,
      userProfile: null,
      loading: true,
      register: async () => {},
      login: async () => {},
      logout: async () => {},
      updateProfile: async () => {},
      isDemo: false,
    };
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync auth state
  useEffect(() => {
    if (!isFirebaseConfigured) {
      // Check local storage for demo user state
      const savedUser = localStorage.getItem("ecopilot_demo_user");
      const savedProfile = localStorage.getItem("ecopilot_demo_profile");

      if (savedUser && savedProfile) {
        setCurrentUser(JSON.parse(savedUser));
        setUserProfile(JSON.parse(savedProfile));
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error("Failed to load user profile:", error);
          setUserProfile(null);
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Register function
  const register = async (email, password, fullName, organization) => {
    setLoading(true);
    try {
      const result = await signUpUser(email, password, fullName, organization);
      if (!isFirebaseConfigured) {
        setCurrentUser(result.user);
        setUserProfile(result.profile);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    try {
      const result = await signInUser(email, password);
      if (!isFirebaseConfigured) {
        setCurrentUser(result.user);
        setUserProfile(result.profile);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      await logOutUser();
      setCurrentUser(null);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  // Profile update handler
  const updateProfile = async (updates) => {
    if (!currentUser) return;
    const updated = await updateProfileFirestore(currentUser.uid, updates);
    setUserProfile(updated);
    return updated;
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    register,
    login,
    logout,
    updateProfile,
    isDemo: !isFirebaseConfigured,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
