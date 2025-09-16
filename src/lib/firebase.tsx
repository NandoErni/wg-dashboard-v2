import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyAuVXKxPz_qlL-S79qqFWfeu39W2tKfjJk",
  authDomain: "wg-dashboard-f795b.firebaseapp.com",
  projectId: "wg-dashboard-f795b",
  storageBucket: "wg-dashboard-f795b.appspot.com",
  messagingSenderId: "877411358459",
  appId: "1:877411358459:web:d645b81b0cc1a7d9f9c25e",
};  // shouldn't be here...

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
