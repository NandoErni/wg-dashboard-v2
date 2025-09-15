import { useEffect, useRef } from "react";
//import { useTranslation } from "react-i18next";

export default function PhotoBooth() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // ask for webcam
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" }, // "user" = front camera on phones
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };

    startCamera();

    return () => {
      // cleanup camera on unmount
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 p-4 h-full justify-center">
      {/* live preview */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="rounded-4xl bg-clip-border scale-x-[-1] shadow w-full aspect-video object-cover"
      />
    </div>
  );
}
