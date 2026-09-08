import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth, isFirebaseConfigured } from "../firebase/config";

const AI_ANALYSES_COLLECTION = "ai_analyses";

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
    throw new Error("User must be authenticated to perform AI history operations.");
  }
  return user.uid;
};

/**
 * Save an AI analysis result to Firestore / localStorage history
 */
export const saveAIAnalysis = async (analysisData) => {
  let userId;
  try {
    userId = getCurrentUserId();
  } catch (err) {
    console.warn("Skipping AI history save: User not authenticated.", err.message);
    return null;
  }

  const docPayload = {
    userId,
    category: analysisData.category || "all",
    summary: analysisData.summary || "",
    overall_assessment: analysisData.overall_assessment || { status: "moderate", priority: "medium" },
    key_findings: analysisData.key_findings || [],
    recommendations: analysisData.recommendations || [],
    action_plan: analysisData.action_plan || [],
    expected_impact: analysisData.expected_impact || [],
    sources: analysisData.sources || [],
    model_used: analysisData.model_used || "Groq Llama 3.3 70B",
    createdAt: isFirebaseConfigured ? serverTimestamp() : new Date().toISOString(),
  };

  if (!isFirebaseConfigured) {
    const newDoc = {
      id: "ai-hist-" + Date.now(),
      ...docPayload,
      createdAt: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem("ecopilot_demo_ai_analyses") || "[]");
    existing.unshift(newDoc);
    localStorage.setItem("ecopilot_demo_ai_analyses", JSON.stringify(existing.slice(0, 20)));
    return newDoc;
  }

  try {
    const ref = collection(db, AI_ANALYSES_COLLECTION);
    const docRef = await addDoc(ref, docPayload);
    return {
      id: docRef.id,
      ...docPayload,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    if (error?.code === "permission-denied") {
      console.warn("Firestore permissions denied when saving AI analysis history. Please ensure rules are deployed.");
    } else {
      console.error("Error saving AI analysis to Firestore:", error);
    }
    return null; // Graceful non-blocking fallback
  }
};

/**
 * Fetch saved AI analyses for user
 */
export const getUserAIAnalyses = async (userIdInput) => {
  let userId;
  try {
    userId = userIdInput || getCurrentUserId();
  } catch (err) {
    console.warn("Skipping AI history fetch: User not authenticated.", err.message);
    return [];
  }

  if (!isFirebaseConfigured) {
    const existing = JSON.parse(localStorage.getItem("ecopilot_demo_ai_analyses") || "[]");
    return (Array.isArray(existing) ? existing : [])
      .filter((a) => a.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  try {
    const ref = collection(db, AI_ANALYSES_COLLECTION);
    const q = query(ref, where("userId", "==", userId));
    const snap = await getDocs(q);

    const list = [];
    snap.forEach((docSnap) => {
      const d = docSnap.data();
      const createdAt = d.createdAt?.toDate ? d.createdAt.toDate().toISOString() : d.createdAt || new Date().toISOString();
      list.push({
        id: docSnap.id,
        ...d,
        createdAt,
      });
    });

    return list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  } catch (error) {
    if (error?.code === "permission-denied") {
      console.warn("Firestore permissions denied when fetching AI analysis history. Please deploy updated firestore.rules.");
    } else {
      console.error("Error fetching AI analyses from Firestore:", error);
    }
    return [];
  }
};
