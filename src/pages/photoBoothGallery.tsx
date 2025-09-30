import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Photo = {
  id: string;
  previewImage: string;
  fullResImage: string;
  createdAt?: { seconds: number; nanoseconds: number };
  timestamp?: number;
  userId?: string;
};

export default function PhotoBoothGallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "photobooth"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Photo[];
      setPhotos(docs);
    });

    return () => unsub();
  }, []);

  return (
    <div className="p-6">
      {photos.length === 0 ? (
        <p className="text-gray-500">No photos yet…</p>
      ) : (
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full max-w-sm mx-auto sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl"
        >
          <CarouselContent>
            {photos.map((photo) => (
              <CarouselItem key={photo.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <img
                        src={photo.previewImage}
                        alt="Preview"
                        className="rounded-md w-full cursor-pointer hover:opacity-80"
                      />
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <img
                        src={photo.fullResImage}
                        alt="Full"
                        className="rounded-lg w-full"
                      />
                    </DialogContent>
                  </Dialog>
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    {photo.createdAt
                      ? new Date(photo.createdAt.seconds * 1000).toLocaleString()
                      : ""}
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}
    </div>
  );
}