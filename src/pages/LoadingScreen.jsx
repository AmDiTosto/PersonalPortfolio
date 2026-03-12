import { useEffect, useRef, useState } from "react";
import adrianImage from "../assets/adrian.png";

export default function LoadingScreen({ onComplete, onUserInteract }) {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  const hasFinishedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const finishTimeoutRef = useRef(null);

  const messages = [
    "Booting OS...",
    "Loading portfolio files...",
    "Initializing projects...",
    "Preparing experience folder...",
    "Connecting contact.exe...",
    "Launching desktop environment...",
  ];

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const duration = 7000;
    const startTime = performance.now();
    let animationFrameId;

    function updateProgress(now) {
      const elapsed = now - startTime;
      const nextProgress = Math.min(
        100,
        Math.round((elapsed / duration) * 100)
      );

      setProgress(nextProgress);

      const nextMessageIndex = Math.min(
        messages.length - 1,
        Math.floor((nextProgress / 100) * messages.length)
      );
      setMessageIndex(nextMessageIndex);

      if (elapsed < duration) {
        animationFrameId = window.requestAnimationFrame(updateProgress);
        return;
      }

      if (!hasFinishedRef.current) {
        hasFinishedRef.current = true;
        setProgress(100);

        finishTimeoutRef.current = window.setTimeout(() => {
          onCompleteRef.current?.();
        }, 150);
      }
    }

    animationFrameId = window.requestAnimationFrame(updateProgress);

    return () => {
      window.cancelAnimationFrame(animationFrameId);

      if (finishTimeoutRef.current) {
        window.clearTimeout(finishTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center bg-[#000080] px-6"
      onPointerDown={onUserInteract}
      onKeyDown={onUserInteract}
    >
      <div className="w-full max-w-5xl border-2 border-t-white border-l-white border-r-[#1f1f1f] border-b-[#1f1f1f] bg-[#c0c0c0] p-1 shadow-[8px_8px_0_rgba(0,0,0,0.35)]">
        <div className="border border-[#808080] bg-[#000080] px-3 py-2">
          <p className="font-fixedsys text-xl text-white">OS Setup</p>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-[260px_1fr]">
          <div className="flex items-center justify-center">
            <div className="border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white bg-black p-2">
              <div className="flex aspect-square items-center justify-center overflow-hidden border border-black bg-[#e5e5e5]">
                {/* When you want to add your image back, replace this block with: */}

                <img
                  src={adrianImage}
                  alt="Adrian"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="flex min-w-0 flex-col justify-center">
            <div className="mb-5 border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white bg-white p-4">
              <h1 className="mb-2 font-fixedsys text-2xl">
                Hey, I&apos;m Adrian
              </h1>
              <p className="font-fixedsys text-lg">
                Welcome to my Personal Portfolio!
              </p>
            </div>

            <div className="mb-5 border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white bg-black p-4">
              <p className="font-fixedsys text-[#00ff00]">
                {messages[messageIndex]}
              </p>
            </div>

            <div className="mb-1 flex items-center justify-between gap-4">
              <span className="font-fixedsys">Loading Desktop...</span>
              <span className="min-w-[56px] text-right font-fixedsys">
                {progress}%
              </span>
            </div>

            <div className="border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white bg-[#c0c0c0] p-1">
              <div className="h-6 border border-black bg-white">
                <div
                  className="h-full bg-[#000080]"
                  style={{
                    width: `${progress}%`,
                    transition: "width 90ms linear",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
