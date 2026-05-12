import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
  addDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "./firebase";

export const Repository = {
  getCurrentUser: () => {
    return auth.currentUser;
  },

  getLatestChoreCompletion: async (choreType: string) => {
    const q = query(
      collection(db, "chore_completions"),
      where("choreType", "==", choreType),
      orderBy("completionTime", "desc"),
      limit(1),
    );
    const snapshot = await getDocs(q);
    return snapshot.empty ? null : snapshot.docs[0].data();
  },

  getChoreCompletionsByUser: async (username: string) => {
    const q = query(
      collection(db, "chore_completions"),
      where("completedBy", "==", username),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data());
  },

  getAllChoreCompletions: async () => {
    const q = query(collection(db, "chore_completions"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data());
  },

  completeChore: async (choreType: string, userName: string) => {
    return await addDoc(collection(db, "chore_completions"), {
      choreType,
      completedBy: userName,
      completionTime: serverTimestamp(),
    });
  },

  getPhotoboothPreviews: async () => {
    const q = query(
      collection(db, "photobooth_previews"),
      orderBy("createdAt", "desc"),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  getFullResImage: async (fullResId: string) => {
    if (!fullResId) return null;
    const docRef = doc(db, "photobooth_fullres", fullResId);
    const snap = await getDoc(docRef);
    return snap.exists() ? snap.data().fullResImage : null;
  },

  subscribeToPhotobooth: (callback: (previews: any[]) => void) => {
    const q = query(
      collection(db, "photobooth_previews"),
      orderBy("createdAt", "desc"),
    );

    return onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(docs);
    });
  },

  logout: async () => {
    await auth.signOut();
  },

  loginWithGoogle: async () => {
    const { signInWithPopup, GoogleAuthProvider } =
      await import("firebase/auth");
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(auth, provider);
  },
};
