import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "./config";
import { createUserProfile } from "./firestore";

/**
 * Format Firebase Auth errors into clean, user-friendly messages
 */
export const formatAuthError = (error) => {
  if (!error) return "An unexpected error occurred.";
  const code = error.code || "";
  
  switch (code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/operation-not-allowed":
      return "Email/Password sign-in is not enabled in Firebase console.";
    case "auth/weak-password":
      return "Your password is too weak. Please use at least 6 characters.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Unable to sign in. Please check your email and password.";
    case "auth/network-request-failed":
      return "Network connection error. Please check your internet connection.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    case "demo-mode":
      return error.message;
    default:
      return error.message || "An error occurred during authentication.";
  }
};

/**
 * Register a new user with Firebase Auth and create Firestore profile
 */
export const signUpUser = async (email, password, fullName, organization) => {
  if (!isFirebaseConfigured) {
    // Return mock registration for local demo if Firebase keys are default
    const mockUid = "demo-uid-" + Date.now();
    const mockUser = {
      uid: mockUid,
      email,
      displayName: fullName,
    };
    const mockProfile = {
      uid: mockUid,
      fullName,
      email,
      organization: organization || "Green Campus Institute",
      role: "student",
      createdAt: new Date().toISOString(),
      isDemo: true,
    };
    // Save to localStorage for demo persistence
    localStorage.setItem("ecopilot_demo_user", JSON.stringify(mockUser));
    localStorage.setItem("ecopilot_demo_profile", JSON.stringify(mockProfile));
    return { user: mockUser, profile: mockProfile };
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update Firebase auth profile display name
    await updateProfile(user, { displayName: fullName });

    // Create Firestore document in users/{uid}
    const profileData = {
      fullName,
      email,
      organization: organization || "Unspecified Campus",
      role: "student",
    };
    await createUserProfile(user.uid, profileData);

    return { user, profile: profileData };
  } catch (error) {
    throw new Error(formatAuthError(error));
  }
};

/**
 * Sign in an existing user with Firebase Auth
 */
export const signInUser = async (email, password) => {
  if (!isFirebaseConfigured) {
    // Return mock login for local preview
    const mockUser = {
      uid: "demo-user-123",
      email,
      displayName: email.split("@")[0],
    };
    const mockProfile = {
      uid: "demo-user-123",
      fullName: email.split("@")[0],
      email,
      organization: "Sustainable State University",
      role: "student",
      createdAt: new Date().toISOString(),
      isDemo: true,
    };
    localStorage.setItem("ecopilot_demo_user", JSON.stringify(mockUser));
    localStorage.setItem("ecopilot_demo_profile", JSON.stringify(mockProfile));
    return { user: mockUser, profile: mockProfile };
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(formatAuthError(error));
  }
};

/**
 * Sign out current user
 */
export const logOutUser = async () => {
  if (!isFirebaseConfigured) {
    localStorage.removeItem("ecopilot_demo_user");
    localStorage.removeItem("ecopilot_demo_profile");
    return;
  }
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(formatAuthError(error));
  }
};
