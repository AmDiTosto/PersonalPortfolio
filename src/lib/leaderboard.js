import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { db, leaderboardConfigured } from "./firebase";

const COLLECTION = "scores";

export async function getTopScores(max = 10) {
  if (!leaderboardConfigured || !db) {
    return {
      ok: false,
      scores: [],
      error: "Leaderboard is not set up yet.",
    };
  }

  try {
    const topQuery = query(
      collection(db, COLLECTION),
      orderBy("score", "desc"),
      limit(max),
    );
    const snapshot = await getDocs(topQuery);
    const scores = snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      score: doc.data().score,
    }));
    return { ok: true, scores };
  } catch (error) {
    console.error("Failed to load leaderboard:", error);
    return {
      ok: false,
      scores: [],
      error: error?.code
        ? `Could not load scores (${error.code}).`
        : "Could not load scores.",
    };
  }
}

export async function submitScore(name, score) {
  if (!leaderboardConfigured || !db) {
    return { ok: false, error: "Leaderboard is not set up yet." };
  }

  try {
    const ref = await addDoc(collection(db, COLLECTION), {
      name,
      score: Math.round(score),
      createdAt: serverTimestamp(),
    });
    return { ok: true, id: ref.id };
  } catch (error) {
    console.error("Failed to submit score:", error);
    return {
      ok: false,
      error: error?.code
        ? `Could not submit (${error.code}).`
        : "Could not submit your score.",
    };
  }
}
