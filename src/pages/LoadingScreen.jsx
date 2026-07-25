import { useEffect, useRef, useState } from "react";
import adrianImage from "../assets/adrian.svg";

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  const hasFinishedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const finishTimeoutRef = useRef(null);

  const messages = [
    "Computer Science Student @ University of Guelph",
    "Full-Stack Developer @ Martinrea International Inc",
    "2+ Years of Technical Work Experience",
    "Experience in React, Python, and C++",
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
      className="flex min-h-[100svh] w-full items-center justify-center px-4 py-6"
      style={{ backgroundColor: "#008080" }}
    >
      <div className="win-frame w-full max-w-3xl overflow-hidden bg-win-face">
        <div className="aero-titlebar flex items-center gap-2 px-3 py-1.5">
          <span className="font-ui text-base font-bold text-white sm:text-lg">
            Adrian OS &mdash; Setup
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-[220px_1fr] sm:gap-6 sm:p-6">
          <div className="flex items-center justify-center">
            <div className="win-sink rounded-md bg-white p-1.5">
              <img
                src={adrianImage}
                alt="Adrian"
                draggable={false}
                className="pointer-events-none h-40 w-40 select-none rounded object-cover sm:h-52 sm:w-52"
              />
            </div>
          </div>

          <div className="flex min-w-0 flex-col justify-center">
            <div className="win-raise bg-win-face p-4">
              <h1 className="font-ui text-xl font-bold leading-tight text-win-text sm:text-2xl">
                Hey, I&apos;m Adrian
              </h1>
              <p className="mt-1 font-ui text-sm leading-relaxed text-win-text sm:text-base">
                Welcome to my Personal Portfolio!
              </p>
            </div>

            <div className="win-sink mt-4 rounded bg-black px-3 py-2">
              <p className="font-fixedsys text-sm leading-relaxed text-[#33ff33] sm:text-base">
                {messages[messageIndex]}
              </p>
            </div>

            <div className="mb-1.5 mt-5 flex items-center justify-between gap-3">
              <span className="font-ui text-sm font-medium text-win-text">
                Loading Desktop...
              </span>
              <span className="min-w-[52px] text-right font-ui text-sm font-semibold text-win-title">
                {displayedProgress}%
              </span>
            </div>

            <div className="win-sink rounded bg-white p-1">
              <div className="flex h-5 items-center gap-[2px] px-[3px] sm:h-6">
                {Array.from({ length: totalSegments }).map((_, index) => (
                  <div
                    key={index}
                    className={`h-[85%] flex-1 ${
                      index < filledSegments ? "bg-[#000080]" : "bg-transparent"
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
