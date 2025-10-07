"use client";

import { useRef, useState } from "react";
import Webcam from "react-webcam";
import { db, auth, googleProvider } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { signInWithPopup } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function PhotoBooth() {
  const webcamRef = useRef<Webcam>(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  const capturePhoto = async () => {
    if (!webcamRef.current || loading) return;

    // Ensure login
    if (!auth.currentUser) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        console.log("User signed in:", result.user?.displayName);
      } catch (err) {
        console.error("Login failed:", err);
        return;
      }
    }

    // Start countdown
    let counter = 3;
    setCountdown(counter);

    const interval = setInterval(() => {
      counter -= 1;
      if (counter > 0) {
        setCountdown(counter);
      } else {
        clearInterval(interval);
        setCountdown(null);
        takePhoto();
      }
    }, 1000);
  };

  const takePhoto = async () => {
    if (!webcamRef.current) return;
    try {
      setLoading(true);

      const fullResSrc = webcamRef.current.getScreenshot({
        width: 1280,
        height: 720,
      });
      const previewSrc = webcamRef.current.getScreenshot({
        width: 320,
        height: 180,
      });

      if (!fullResSrc || !previewSrc) return;

      setCapturedImage(fullResSrc);
      setTimeout(() => {
        setCapturedImage(null);
      }, 5000); // Display for 5 seconds

      // Create the preview document first
      const previewRef = await addDoc(collection(db, "photobooth_previews"), {
        previewImage: previewSrc,
        createdAt: serverTimestamp(),
        timestamp: Date.now(),
        userId: auth.currentUser?.uid,
      });

      // Use the preview ID as the fullRes doc ID for easy linking
      const fullResRef = await addDoc(collection(db, "photobooth_fullres"), {
        fullResImage: fullResSrc,
        createdAt: serverTimestamp(),
        timestamp: Date.now(),
        userId: auth.currentUser?.uid,
        previewId: previewRef.id,
      });

      // Optionally update the preview doc with the fullResId
      await updateDoc(previewRef, {
        fullResId: fullResRef.id,
      });

      console.log("Photo saved with preview ID:", previewRef.id);
      toast.success("Saved!", {
        description: "Go watch it in the gallery 📸",
      });
    } catch (err) {
      console.error("Error saving photo:", err);
      toast.error("Error saving photo 😢");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center gap-4 p-4 h-full justify-center">
      <div className="relative">
        {capturedImage ? (
          <motion.img
            key="captured"
            src={capturedImage}
            alt="Captured photo"
            className="rounded-2xl transform scale-x-[-1]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          />
        ) : (
          <Webcam
            className="rounded-2xl transform scale-x-[-1]"
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
          />
        )}

        {/* Countdown overlay */}
        <AnimatePresence>
          {countdown !== null && (
            <motion.div
              key={countdown}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-2xl"
            >
              <span className="text-8xl font-bold drop-shadow-lg">
                {countdown}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Button
        onClick={capturePhoto}
        disabled={loading || countdown !== null || capturedImage !== null}
        className="px-6 py-3 rounded-xl  disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Saving..." : countdown ? "Get ready..." : "Capture photo"}
      </Button>
    </div>
  );
}