export default function DuckHuntMetrics({
  score,
  misses,
  maxMisses,
  multiplier = 1,
  gameActive = false,
  gameOverVisible,
  idleMsLeft,
  showIdleCountdown,
}) {
  const showCombo = gameActive && !gameOverVisible && multiplier >= 2;

  return (
    <div className="pointer-events-none absolute bottom-[74px] left-1/2 z-[40] -translate-x-1/2">
      {showCombo ? (
        <div className="absolute -top-11 left-1/2 -translate-x-1/2">
          <div
            key={multiplier}
            className="whitespace-nowrap rounded-sm border-2 border-[#7a5b00] bg-gradient-to-b from-[#ffe97a] to-[#ffb300] px-2.5 py-1 font-fixedsys text-lg font-bold leading-none tracking-wide text-[#5a3d00] shadow-[0_2px_0_rgba(0,0,0,0.4)]"
            style={{ animation: "comboPop 0.3s ease-out" }}
          >
            <span className="mr-1 text-[11px] uppercase tracking-[0.2em]">
              Combo
            </span>
            ×{multiplier}
          </div>
        </div>
      ) : null}

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
              {String(score).padStart(7, "0")}
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
