import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./config";
export * from "../services/assessmentService";

/**
 * Create a user document in Firestore: users/{uid}
 */
export const createUserProfile = async (uid, data) => {
  if (!isFirebaseConfigured) {
    const profile = {
      uid,
      fullName: data.fullName,
      email: data.email,
      organization: data.organization || "Green Campus University",
      role: data.role || "student",
      createdAt: new Date().toISOString(),
      isDemo: true,
    };
    localStorage.setItem("ecopilot_demo_profile", JSON.stringify(profile));
    return profile;
  }

  try {
    const userRef = doc(db, "users", uid);
    const profileData = {
      uid,
      fullName: data.fullName,
      email: data.email,
      organization: data.organization || "Unspecified Campus",
      role: data.role || "student",
      createdAt: new Date().toISOString(),
    };
    await setDoc(userRef, profileData);
    return profileData;
  } catch (error) {
    console.error("Error creating user profile in Firestore:", error);
    throw new Error("Failed to save user profile to database.");
  }
};

/**
 * Fetch a user profile from Firestore: users/{uid}
 */
export const getUserProfile = async (uid) => {
  if (!isFirebaseConfigured) {
    const stored = localStorage.getItem("ecopilot_demo_profile");
    if (stored) return JSON.parse(stored);
    return {
      uid,
      fullName: "Campus Leader",
      email: "leader@ecopilot.campus",
      organization: "Eco Campus University",
      role: "student",
      createdAt: new Date().toISOString(),
      isDemo: true,
    };
  }

  try {
    const userRef = doc(db, "users", uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Failed to fetch user profile.");
  }
};

/**
 * Update user profile details (fullName, organization) in Firestore
 */
export const updateUserProfile = async (uid, updates) => {
  if (!isFirebaseConfigured) {
    const stored = localStorage.getItem("ecopilot_demo_profile");
    let profile = stored ? JSON.parse(stored) : {};
    profile = { ...profile, ...updates, uid };
    localStorage.setItem("ecopilot_demo_profile", JSON.stringify(profile));
    return profile;
  }

  try {
    const userRef = doc(db, "users", uid);
    const safeUpdates = { ...updates };
    delete safeUpdates.email;
    delete safeUpdates.uid;

    await setDoc(userRef, safeUpdates, { merge: true });
    return await getUserProfile(uid);
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Failed to update profile. Please try again.");
  }
};
