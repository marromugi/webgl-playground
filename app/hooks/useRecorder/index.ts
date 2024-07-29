import { useEffect, useRef, useState } from "react";

export function useRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const recordedChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (mediaRecorder) {
      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          const prev = recordedChunksRef.current;
          console.log(prev);
          recordedChunksRef.current = [...prev, event.data];
        }
      };

      mediaRecorder.onstop = () => {
        console.log(recordedChunksRef.current);
        const blob = new Blob(recordedChunksRef.current, {
          type: "video/webm",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "threejs_scene.webm";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      };

      if (isRecording) {
        mediaRecorder.start();
      } else {
        mediaRecorder.stop();
      }
    }
  }, [mediaRecorder, isRecording]);

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  return { isRecording, setMediaRecorder, startRecording, stopRecording };
}
