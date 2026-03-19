export default function DuckHuntMetrics({
  score,
  misses,
  maxMisses,
  gameOverVisible,
  idleMsLeft,
  showIdleCountdown,
}) {
  return (
    <div className="pointer-events-none absolute bottom-[74px] left-1/2 z-[40] -translate-x-1/2">
      <div
        className={`rounded-none border-2 px-2 py-2 shadow-[4px_4px_0_#000] ${
          gameOverVisible ? "animate-[hudFlash_0.8s_steps(1)_infinite]" : ""
        }`}
        style={{
          backgroundColor: "#7c4a12",
          borderTopColor: "#d8a15d",
          borderLeftColor: "#d8a15d",
          borderRightColor: "#4a2808",
          borderBottomColor: "#4a2808",
        }}
      >
        {gameOverVisible ? (
          <div className="mb-2 text-center">
            <span
              className="font-fixedsys text-sm tracking-[0.2em] text-[#fff2c8] sm:text-[15px]"
              style={{ textShadow: "2px 2px 0 #000" }}
            >
              GAME OVER
            </span>
          </div>
        ) : null}

        <div className="flex items-center gap-2">
          <div
            className="flex h-[62px] w-[152px] flex-col justify-center border px-3"
            style={{
              backgroundColor: "#111111",
              borderColor: "#6d5d39",
            }}
          >
            <span
              className="font-fixedsys text-[11px] tracking-[0.14em]"
              style={{ color: "#ffb347" }}
            >
              SCORE
            </span>
            <span
              className="mt-1 font-fixedsys text-[22px] leading-none tracking-[0.12em]"
              style={{ color: "#fff08a" }}
            >
              {String(score).padStart(6, "0")}
            </span>
          </div>

          <div
            className="flex h-[62px] w-[152px] flex-col justify-center border px-3"
            style={{
              backgroundColor: "#111111",
              borderColor: "#6d5d39",
            }}
          >
            <span
              className="font-fixedsys text-[11px] tracking-[0.14em]"
              style={{ color: "#ffb347" }}
            >
              MISSES
            </span>
            <span
              className="mt-1 font-fixedsys text-[22px] leading-none tracking-[0.08em]"
              style={{ color: "#fff08a" }}
            >
              {String(misses).padStart(2, "0")} / {maxMisses}
            </span>
          </div>
        </div>

        {showIdleCountdown ? (
          <div
            className="mt-2 flex h-[34px] items-center justify-center border px-3"
            style={{
              backgroundColor: "#111111",
              borderColor: "#6d5d39",
            }}
          >
            <span
              className="font-fixedsys text-[14px] tracking-[0.08em]"
              style={{ color: "#fff08a" }}
            >
              Idle in {(idleMsLeft / 1000).toFixed(5)}s
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
