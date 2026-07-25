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
        className={`win-frame overflow-hidden bg-win-face ${
          gameOverVisible ? "animate-[hudFlash_0.8s_steps(1)_infinite]" : ""
        }`}
      >
        {gameOverVisible ? (
          <div className="flex items-center justify-center bg-win-red px-3 py-1">
            <span className="font-ui text-xs font-bold uppercase tracking-[0.2em] text-white">
              Game Over
            </span>
          </div>
        ) : null}

        <div className="flex items-center gap-2 p-2">
          <div className="win-sink flex h-[58px] w-[150px] flex-col justify-center bg-white px-3">
            <span className="font-ui text-[11px] font-semibold uppercase tracking-wide text-win-muted">
              Score
            </span>
            <span className="mt-0.5 font-fixedsys text-[22px] leading-none tracking-[0.1em] text-win-title">
              {String(score).padStart(6, "0")}
            </span>
          </div>

          <div className="win-sink flex h-[58px] w-[150px] flex-col justify-center bg-white px-3">
            <span className="font-ui text-[11px] font-semibold uppercase tracking-wide text-win-muted">
              Misses
            </span>
            <span className="mt-0.5 font-fixedsys text-[22px] leading-none text-win-red">
              {String(misses).padStart(2, "0")} / {maxMisses}
            </span>
          </div>
        </div>

        {showIdleCountdown ? (
          <div className="px-2 pb-2">
            <div className="win-sink flex h-[30px] items-center justify-center bg-white px-3">
              <span className="font-ui text-[13px] font-semibold text-win-text">
                Idle in {(idleMsLeft / 1000).toFixed(1)}s
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
