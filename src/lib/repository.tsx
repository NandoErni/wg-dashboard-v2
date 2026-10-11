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
import type { ChoreRotationConfig } from "@/config/app-config";

const choreCompletionsCollection = "chore_completions";
const chorePeriodsCollection = "chore_periods";

export const Repository = {
  getCurrentUser: () => {
    return auth.currentUser;
  },

  getLatestChoreCompletion: async (choreType: string) => {
    const q = query(
      collection(db, choreCompletionsCollection),
      where("choreType", "==", choreType),
      orderBy("completionTime", "desc"),
      limit(1),
    );
    const snapshot = await getDocs(q);
    return snapshot.empty ? null : snapshot.docs[0].data();
  },

  getChoreCompletionsByUser: async (username: string) => {
    const q = query(
      collection(db, choreCompletionsCollection),
      where("completedBy", "==", username),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data());
  },

  getAllChoreCompletions: async () => {
    const q = query(collection(db, choreCompletionsCollection));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data());
  },

  completeChore: async (choreType: string, userName: string) => {
    return await addDoc(collection(db, choreCompletionsCollection), {
      choreType,
      completedBy: userName,
      completionTime: serverTimestamp(),
    });
  },

  getLatestChorePeriod: async () => {
    const q = query(
      collection(db, chorePeriodsCollection),
      orderBy("startTime", "desc"),
      limit(1),
    );
    const snapshot = await getDocs(q);
    return snapshot.empty ? null : snapshot.docs[0].data();
  },

  createChorePeriod: async (startDate: Date, endDate: Date, rotation: ChoreRotationConfig, assignments: any[]) => {
    return await addDoc(collection(db, chorePeriodsCollection), {
      startTime: startDate,
      endTime: endDate,
      rotation: rotation,
      assignments: assignments, // Stores who does what for this period
    });
  },

  ensureChorePeriodExists: async (rotation: ChoreRotationConfig, people: any[], chores: any[], getRotationsPassedForDate: (date: Date) => number) => {
    let latestPeriod = await Repository.getLatestChorePeriod();
    const now = new Date();

    const generateAssignmentsForDate = (date: Date) => {
      const rotationsPassed = getRotationsPassedForDate(date);
      const rotatedPeople = people.map((_, i) => people[(i + rotationsPassed) % people.length]);
      return chores.map((chore, i) => ({
        personName: rotatedPeople[i % rotatedPeople.length].name,
        personImg: rotatedPeople[i % rotatedPeople.length].img,
        choreId: chore.id,
      }));
    };

    if (latestPeriod != null) {
      if (latestPeriod.endTime.toDate() > now) {
        return;
      } else {
        const nextStart = latestPeriod.endTime.toDate();
        const nextEnd = getEndTime(nextStart, rotation);
        const assignments = generateAssignmentsForDate(nextStart);
        await Repository.createChorePeriod(nextStart, nextEnd, rotation, assignments);
        return;
      }
    }

    const start = now;
    const end = getEndTime(now, rotation);
    const assignments = generateAssignmentsForDate(start);
    await Repository.createChorePeriod(start, end, rotation, assignments);
  },

  getCompletionCountThisPeriod: async (choreType: string): Promise<number> => {
    try {
      const latestPeriod = await Repository.getLatestChorePeriod();
      if (!latestPeriod) return 0;

      const { startTime, endTime } = latestPeriod;

      const q = query(
        collection(db, choreCompletionsCollection),
        where("choreType", "==", choreType),
        where("completionTime", ">=", startTime),
        where("completionTime", "<=", endTime)
      );

      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (err) {
      console.error("Error fetching completion count for period:", err);
      return 0;
    }
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

function getEndTime(startDate: Date, rotation: ChoreRotationConfig): Date {
  switch (rotation.type) {
    case "monthly":
      return new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1);

    case "weekly": {
      const day = startDate.getDay();
      const daysUntilNextMonday = ((8 - day) % 7) || 7;

      const end = new Date(startDate);
      end.setDate(startDate.getDate() + daysUntilNextMonday);
      end.setHours(0, 0, 0, 0);

      return end;
    }

    case "days": {
      const end = new Date(startDate);
      end.setDate(startDate.getDate() + rotation.days);
      return end;
    }

    default:
      throw new Error(`Unsupported rotation type`);
  }
}