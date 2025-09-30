// src/components/PhotoBooth.tsx
import { useRef, useState } from "react";
import Webcam from "react-webcam";
import { db, auth, googleProvider } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { signInWithPopup } from "firebase/auth";

export default function PhotoBooth() {
  const webcamRef = useRef<Webcam>(null);
  const [loading, setLoading] = useState(false);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  const capturePhoto = async () => {
    if (!webcamRef.current) return;

    // Try to ensure the user is logged in
    if (!auth.currentUser) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        console.log("User signed in:", user?.displayName);
      } catch (err) {
        console.error("Login failed:", err);
        return;
      }
    }

    const fullResSrc = webcamRef.current.getScreenshot({
      width: 1280,
      height: 720,
    });
    const previewSrc = webcamRef.current.getScreenshot({
      width: 320,
      height: 180,
    });

    if (!fullResSrc || !previewSrc) return;

    try {
      setLoading(true);
      const timestamp = Date.now();

      const docRef = await addDoc(collection(db, "photobooth"), {
        fullResImage: fullResSrc,
        previewImage: previewSrc,
        createdAt: serverTimestamp(),
        timestamp,
        userId: auth.currentUser?.uid,
      });

      console.log("Photo saved with ID:", docRef.id);
    } catch (err) {
      console.error("Error saving photo:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 h-full justify-center">
      <Webcam
        className="rounded-2xl transform scale-x-[-1]"
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
      />
      <button
        onClick={capturePhoto}
        disabled={loading}
        className="px-4 py-2 rounded-lg"
      >
        {loading ? "Saving..." : "Capture photo"}
      </button>
    </div>
  );
}
