import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth, isFirebaseConfigured } from "../firebase/config";
import { calculateCategoryScore } from "../utils/sustainabilityCalculator";

const ASSESSMENTS_COLLECTION = "assessments";

/**
 * Helper to get currently authenticated Firebase user UID safely
 */
const getCurrentUserId = () => {
  if (!isFirebaseConfigured) {
    const savedUser = localStorage.getItem("ecopilot_demo_user");
    return savedUser ? JSON.parse(savedUser).uid : "demo-user-123";
  }
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User must be authenticated to perform assessment operations.");
  }
  return user.uid;
};

/**
 * Create a new assessment in Firestore collection 'assessments'
 */
export const createAssessment = async ({ category, period, data }) => {
  const userId = getCurrentUserId();
  const normalizedCategory = (category || "").toLowerCase();
  const calculatedScore = calculateCategoryScore(normalizedCategory, data);

  const docPayload = {
    userId,
    category: normalizedCategory,
    period: period || new Date().toISOString().substring(0, 7), // e.g. "2026-08"
    data,
    score: calculatedScore,
    createdAt: isFirebaseConfigured ? serverTimestamp() : new Date().toISOString(),
    updatedAt: isFirebaseConfigured ? serverTimestamp() : new Date().toISOString(),
  };

  if (!isFirebaseConfigured) {
    const newAssessment = {
      id: "demo-assess-" + Date.now(),
      ...docPayload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDemo: true,
    };
    const existing = JSON.parse(localStorage.getItem("ecopilot_demo_assessments") || "[]");
    existing.unshift(newAssessment);
    localStorage.setItem("ecopilot_demo_assessments", JSON.stringify(existing));
    return newAssessment;
  }

  try {
    const assessmentsRef = collection(db, ASSESSMENTS_COLLECTION);
    const docRef = await addDoc(assessmentsRef, docPayload);
    return {
      id: docRef.id,
      ...docPayload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error creating assessment in Firestore:", error);
    throw new Error("Unable to save your assessment. Please check your connection and try again.");
  }
};

/**
 * Fetch all assessments belonging to the authenticated user
 */
export const getUserAssessments = async (userIdInput) => {
  let userId;
  try {
    userId = userIdInput || getCurrentUserId();
  } catch (err) {
    console.warn("No authenticated user ID found for fetching assessments:", err.message);
    return [];
  }

  if (!isFirebaseConfigured) {
    const existing = JSON.parse(localStorage.getItem("ecopilot_demo_assessments") || "[]");
    return (Array.isArray(existing) ? existing : [])
      .filter((a) => a.userId === userId || !a.userId)
      .sort((a, b) => new Date(b.createdAt || b.period) - new Date(a.createdAt || a.period));
  }

  try {
    const assessmentsRef = collection(db, ASSESSMENTS_COLLECTION);
    const q = query(assessmentsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const assessments = [];
    querySnapshot.forEach((docSnap) => {
      const d = docSnap.data();
      // Format timestamps for frontend parsing
      const createdAt = d.createdAt?.toDate ? d.createdAt.toDate().toISOString() : d.createdAt || new Date().toISOString();
      const updatedAt = d.updatedAt?.toDate ? d.updatedAt.toDate().toISOString() : d.updatedAt || createdAt;

      assessments.push({
        id: docSnap.id,
        ...d,
        createdAt,
        updatedAt,
      });
    });

    // Sort by period / createdAt descending
    return assessments.sort(
      (a, b) => new Date(b.period || b.createdAt) - new Date(a.period || a.createdAt)
    );
  } catch (error) {
    console.error("Error fetching user assessments from Firestore:", error);
    throw new Error("Unable to load assessments. Please check your connection and try again.");
  }
};

/**
 * Get a single assessment by document ID verifying ownership
 */
export const getAssessmentById = async (assessmentId) => {
  const userId = getCurrentUserId();

  if (!isFirebaseConfigured) {
    const existing = JSON.parse(localStorage.getItem("ecopilot_demo_assessments") || "[]");
    const found = existing.find((a) => a.id === assessmentId);
    if (!found || found.userId !== userId) {
      throw new Error("Assessment not found or unauthorized.");
    }
    return found;
  }

  try {
    const docRef = doc(db, ASSESSMENTS_COLLECTION, assessmentId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Assessment document not found.");
    }

    const d = docSnap.data();
    if (d.userId !== userId) {
      throw new Error("Unauthorized to access this assessment.");
    }

    return {
      id: docSnap.id,
      ...d,
      createdAt: d.createdAt?.toDate ? d.createdAt.toDate().toISOString() : d.createdAt,
      updatedAt: d.updatedAt?.toDate ? d.updatedAt.toDate().toISOString() : d.updatedAt,
    };
  } catch (error) {
    console.error("Error getting assessment by ID:", error);
    throw error;
  }
};

/**
 * Update an existing assessment document by ID
 */
export const updateAssessment = async (assessmentId, { category, period, data }) => {
  const userId = getCurrentUserId();
  const normalizedCategory = (category || "").toLowerCase();
  const calculatedScore = calculateCategoryScore(normalizedCategory, data);

  const updates = {
    category: normalizedCategory,
    period,
    data,
    score: calculatedScore,
    updatedAt: isFirebaseConfigured ? serverTimestamp() : new Date().toISOString(),
  };

  if (!isFirebaseConfigured) {
    const existing = JSON.parse(localStorage.getItem("ecopilot_demo_assessments") || "[]");
    const index = existing.findIndex((a) => a.id === assessmentId && a.userId === userId);
    if (index === -1) {
      throw new Error("Assessment not found or unauthorized.");
    }
    existing[index] = {
      ...existing[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem("ecopilot_demo_assessments", JSON.stringify(existing));
    return existing[index];
  }

  try {
    const docRef = doc(db, ASSESSMENTS_COLLECTION, assessmentId);
    // Verify ownership before update
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists() || docSnap.data().userId !== userId) {
      throw new Error("Unauthorized update attempt.");
    }

    await updateDoc(docRef, updates);
    return {
      id: assessmentId,
      userId,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error updating assessment:", error);
    throw new Error("Unable to update assessment. Please check your data and retry.");
  }
};

/**
 * Delete an assessment document by ID
 */
export const deleteAssessment = async (assessmentId) => {
  const userId = getCurrentUserId();

  if (!isFirebaseConfigured) {
    let existing = JSON.parse(localStorage.getItem("ecopilot_demo_assessments") || "[]");
    existing = existing.filter((a) => !(a.id === assessmentId && a.userId === userId));
    localStorage.setItem("ecopilot_demo_assessments", JSON.stringify(existing));
    return true;
  }

  try {
    const docRef = doc(db, ASSESSMENTS_COLLECTION, assessmentId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists() || docSnap.data().userId !== userId) {
      throw new Error("Unauthorized deletion attempt.");
    }

    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting assessment:", error);
    throw new Error("Unable to delete assessment. Please try again.");
  }
};
