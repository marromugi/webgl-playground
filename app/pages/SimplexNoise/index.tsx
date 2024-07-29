import clsx from "clsx";
import { useMemo, useRef } from "react";
import { Button } from "~/components/ui";
import { useRecorder } from "~/hooks";
import { useThreeSetup } from "./useThreeSetup";

export const SimplexNoisePage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isRecording, setMediaRecorder, startRecording, stopRecording } =
    useRecorder();
  useThreeSetup(containerRef, isRecording, setMediaRecorder);

  const handleRecord = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const container = useMemo(() => <div ref={containerRef} />, []);

  return (
    <>
      {container}
      {/* <Button
        className={clsx("mg-fixed mg-top-4 mg-right-4")}
        onClick={handleRecord}
      >
        {!isRecording ? "録画する" : "停止する"}
      </Button> */}
    </>
  );
};
