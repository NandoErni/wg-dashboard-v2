import React from "react";
import { useState, useRef } from "react";
import Webcam from "react-webcam";

export default function PhotoBooth() {
  const webcamRef = useRef<Webcam>(null);
  const [fullResImage, setFullResImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };
  const capturePhoto = React.useCallback(() => {
    if (webcamRef.current) {
      // Capture full-resolution image
      const fullResSrc = webcamRef.current.getScreenshot({
        width: 1280,
        height: 720,
      });
      setFullResImage(fullResSrc);
      
      // Capture smaller preview image
      const previewSrc = webcamRef.current.getScreenshot({
        width: 320,
        height: 180,
      });
      setPreviewImage(previewSrc);
    }
  }, [webcamRef]);

  return (
    <div className="flex flex-col items-center gap-4 p-4 h-full justify-center">
      <Webcam
        className="rounded-4xl transform scale-x-[-1]"
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
      />
      <button onClick={capturePhoto}>Capture photo</button>

    </div>
  );
}
