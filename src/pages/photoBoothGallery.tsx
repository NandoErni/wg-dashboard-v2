"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  getDoc,
} from "firebase/firestore";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";

type Preview = {
  id: string;
  previewImage: string;
  fullResId?: string;
  createdAt?: { seconds: number; nanoseconds: number };
  userId?: string;
};

export default function PhotoBoothGallery() {
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<{
    id: string;
    previewImage: string;
    fullResImage?: string;
    createdAt?: { seconds: number; nanoseconds: number };
  } | null>(null);

  // Load all preview images first
  useEffect(() => {
    const q = query(
      collection(db, "photobooth_previews"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Preview[];
      setPreviews(docs);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // When a preview is selected, fetch its high-res image dynamically
  const handleSelect = async (preview: Preview) => {
    setSelected({ id: preview.id, previewImage: preview.previewImage });

    if (!preview.fullResId) return; // fallback in case it's missing

    try {
      const fullResRef = doc(db, "photobooth_fullres", preview.fullResId);
      const fullResSnap = await getDoc(fullResRef);
      const fullResImage = fullResSnap.data()?.fullResImage;

      if (fullResImage) {
        setSelected((prev) => (prev ? { ...prev, fullResImage } : prev));
      }
    } catch (err) {
      console.error("Error loading full-res image:", err);
    }
  };

  return (
    <div className="items-center gap-4 p-4 h-full justify-center overflow-y-auto">
      {/* Loading skeletons */}
      {loading ? (
        <div className="columns-2 sm:columns-3 md:columns-4 gap-4 space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton
              key={i}
              className="w-full h-48 rounded-lg bg-gray-200 dark:bg-gray-800"
            />
          ))}
        </div>
      ) : previews.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">No photos yet…</p>
      ) : (
        <div className="columns-2 sm:columns-3 md:columns-4 gap-4 space-y-4">
          <AnimatePresence>
            {previews.map((preview) => (
              <motion.div
                key={preview.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                whileHover={{ scale: 1.02 }}
                className="relative break-inside-avoid cursor-pointer"
                onClick={() => handleSelect(preview)}
              >
                <img
                  src={preview.previewImage}
                  alt="Preview"
                  className="rounded-lg w-full object-cover transition-opacity duration-200 hover:opacity-90"
                  loading="lazy"
                />
                <p className="text-[10px] text-gray-500 mt-1 text-center">
                  {preview.createdAt
                    ? new Date(
                        preview.createdAt.seconds * 1000
                      ).toLocaleString()
                    : ""}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent
          className="max-w-[90vw] max-h-[90vh] bg-transparent border-none shadow-none p-0 flex items-center justify-center"
          onClick={() => setSelected(null)}
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">Full-size photo view</DialogTitle>

          {selected && (
            <>
              <motion.img
                key={selected.id}
                src={selected.fullResImage}
                alt="Full resolution photo"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="rounded-lg object-contain max-w-[90vw] max-h-[90vh] w-auto h-auto pointer-events-none"
              />
              <DialogDescription className="sr-only">
                You are viewing the full version of the selected photo. Click
                anywhere to close.
              </DialogDescription>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
