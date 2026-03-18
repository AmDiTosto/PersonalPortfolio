import { useEffect, useRef, useState } from "react";
import adrianImage from "../assets/adrian.svg";

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

  const totalSegments = 18;
  const filledSegments = Math.round((progress / 100) * totalSegments);
  const displayedProgress = Math.round((filledSegments / totalSegments) * 100);

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
      className="flex min-h-[100svh] w-full items-center justify-center bg-[#000080] px-3 py-4 sm:px-5 sm:py-6"
      onPointerDown={onUserInteract}
      onKeyDown={onUserInteract}
      tabIndex={0}
    >
      <div className="w-full max-w-5xl border-2 border-t-white border-l-white border-r-[#1f1f1f] border-b-[#1f1f1f] bg-[#c0c0c0] p-1 shadow-[4px_4px_0_rgba(0,0,0,0.35)] sm:shadow-[8px_8px_0_rgba(0,0,0,0.35)]">
        <div className="border border-[#808080] bg-[#000080] px-2 py-2 sm:px-3">
          <p className="font-fixedsys text-base text-white sm:text-lg md:text-xl">
            OS Setup
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 p-3 sm:gap-5 sm:p-5 md:grid-cols-[220px_1fr] md:gap-6 md:p-6 lg:grid-cols-[260px_1fr]">
          <div className="flex items-center justify-center">
            <div className="border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white bg-black p-2">
              <div className="flex h-40 w-40 items-center justify-center overflow-hidden border border-black bg-[#e5e5e5] sm:h-48 sm:w-48 md:h-[220px] md:w-[220px] lg:h-[240px] lg:w-[240px]">
                <img
                  src={adrianImage}
                  alt="Adrian"
                  className="pointer-events-none h-full w-full select-none object-cover"
                />
              </div>
            </div>
          </div>

          <div className="flex min-w-0 flex-col justify-center">
            <div className="mb-4 border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white bg-white p-3 sm:mb-5 sm:p-4">
              <h1 className="mb-2 font-fixedsys text-lg leading-tight sm:text-xl md:text-2xl">
                Hey, I&apos;m Adrian
              </h1>
              <p className="font-fixedsys text-sm leading-relaxed sm:text-base md:text-lg">
                Welcome to my Personal Portfolio!
              </p>
            </div>

            <div className="border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white bg-black p-3 sm:mb-5 sm:p-4">
              <p className="font-fixedsys text-sm leading-relaxed text-[#00ff00] sm:text-base md:text-lg">
                {messages[messageIndex]}
              </p>
            </div>

            <div className="mb-1 flex items-center justify-between gap-3">
              <span className="font-fixedsys text-xs sm:text-sm md:text-base">
                Loading Desktop...
              </span>
              <span className="min-w-[52px] text-right font-fixedsys text-xs sm:min-w-[56px] sm:text-sm md:text-base">
                {displayedProgress}%
              </span>
            </div>

            <div className="border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white bg-[#c0c0c0] p-1">
              <div className="flex h-6 items-center gap-[2px] border border-[#7f7f7f] bg-white px-[3px] sm:h-7">
                {Array.from({ length: totalSegments }).map((_, index) => (
                  <div
                    key={index}
                    className={`h-[70%] flex-1 ${
                      index < filledSegments ? "bg-[#0000a8]" : "bg-transparent"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
