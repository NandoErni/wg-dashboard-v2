import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export default function PhotoBooth() {
  const { t } = useTranslation();
  const [progress, setProgress] = useState<number>(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);

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

  const takePhoto = () => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/png");
      setPhoto(dataUrl);
    }
  };

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

      {/* hidden canvas for snapshot */}
      <canvas ref={canvasRef} className="hidden" />

      {/* show captured photo */}
      {photo && (
        <img
          src={photo}
          alt="snapshot"
          className="rounded-xl border shadow w-full max-w-sm"
        />
      )}
    </div>
  );
}
