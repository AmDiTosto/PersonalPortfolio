import { useEffect, useRef, useState } from "react";
import { getTopScores, submitScore } from "../lib/leaderboard";
import { validateUsername } from "../lib/profanity";
import trophyIcon from "../assets/desktopIcons/leaderboard.svg";

const MEDALS = ["🥇", "🥈", "🥉"];

function ScoreList({ scores, loading, loadError, highlightId }) {
  return (
    <div className="win-sink overflow-hidden bg-white">
      <div className="flex items-center gap-2 bg-win-title px-2 py-1">
        <span className="w-6 shrink-0 text-center font-ui text-[10px] font-bold text-white/70">
          #
        </span>
        <span className="min-w-0 flex-1 font-ui text-[10px] font-bold uppercase tracking-wide text-white">
          Name
        </span>
        <span className="font-ui text-[10px] font-bold uppercase tracking-wide text-white">
          Score
        </span>
      </div>

      <div className="max-h-[260px] overflow-auto">
        {loading ? (
          <p className="p-5 text-center font-ui text-sm text-win-muted">
            Loading&hellip;
          </p>
        ) : loadError ? (
          <p className="p-5 text-center font-ui text-sm text-win-red">
            {loadError}
          </p>
        ) : scores.length === 0 ? (
          <p className="p-5 text-center font-ui text-sm text-win-muted">
            No scores yet &mdash; be the first!
          </p>
        ) : (
          <ol>
            {scores.map((entry, index) => (
              <li
                key={entry.id}
                className={`flex items-center gap-2 px-2 py-1.5 font-ui text-sm ${
                  entry.id === highlightId
                    ? "bg-[#fff3b0] font-bold"
                    : index % 2 === 1
                      ? "bg-[#f2f2f2]"
                      : "bg-white"
                }`}
              >
                <span className="w-6 shrink-0 text-center text-base leading-none">
                  {MEDALS[index] ?? (
                    <span className="font-ui text-sm text-win-muted">
                      {index + 1}
                    </span>
                  )}
                </span>
                <span className="min-w-0 flex-1 truncate tracking-wide text-win-text">
                  {entry.name}
                </span>
                <span className="font-fixedsys text-[16px] tracking-wide text-win-title">
                  {String(entry.score).padStart(6, "0")}
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

export default function Leaderboard({
  finalScore = null,
  variant = "overlay",
  onPlayAgain,
  onClose,
}) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [highlightId, setHighlightId] = useState(null);

  const inputRef = useRef(null);

  const isGameOver = finalScore != null;
  const showForm = isGameOver && !submitted;

  async function fetchScores() {
    const result = await getTopScores(10);
    if (result.ok) {
      setScores(result.scores);
      setLoadError("");
    } else {
      setLoadError(result.error || "Could not load scores.");
    }
    setLoading(false);
  }

  useEffect(() => {
    let active = true;
    getTopScores(10).then((result) => {
      if (!active) return;
      if (result.ok) {
        setScores(result.scores);
        setLoadError("");
      } else {
        setLoadError(result.error || "Could not load scores.");
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (showForm) inputRef.current?.focus();
  }, [showForm]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;

    const check = validateUsername(name);
    if (!check.ok) {
      setSubmitError(check.error);
      return;
    }

    setSubmitError("");
    setSubmitting(true);
    const result = await submitScore(check.name, finalScore);
    setSubmitting(false);

    if (!result.ok) {
      setSubmitError(result.error || "Could not submit your score.");
      return;
    }

    setHighlightId(result.id);
    setSubmitted(true);
    await fetchScores();
  }

  const titleBlock = (
    <div className="flex items-center justify-center gap-2">
      <img src={trophyIcon} alt="" className="h-8 w-8 object-contain" />
      <div className="text-center leading-none">
        <div className="font-ui text-[10px] font-bold uppercase tracking-[0.3em] text-win-muted">
          Duck Hunt
        </div>
        <div className="font-fixedsys text-2xl tracking-[0.12em] text-win-title">
          HIGH SCORES
        </div>
      </div>
    </div>
  );

  if (variant === "panel") {
    return (
      <div className="flex min-h-full flex-col bg-win-face p-4">
        <div className="mb-3">{titleBlock}</div>
        <ScoreList
          scores={scores}
          loading={loading}
          loadError={loadError}
          highlightId={highlightId}
        />
      </div>
    );
  }

  return (
    <div className="pointer-events-auto absolute inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="win-frame w-full max-w-[400px] bg-win-face">
        <div className="aero-titlebar flex h-9 items-center justify-between px-2">
          <span className="font-ui text-sm font-bold tracking-wide text-white">
            Duck Hunt &mdash; High Scores
          </span>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="aero-orb flex h-[22px] w-[22px] items-center justify-center active:win-pressed"
          >
            <span className="font-ui text-sm font-bold leading-none text-black">
              &times;
            </span>
          </button>
        </div>

        <div className="p-3">
          <div className="win-sink mb-3 flex items-center justify-between gap-3 bg-white px-3 py-2">
            <div>
              <div className="font-ui text-xs font-bold uppercase tracking-[0.2em] text-win-red">
                Game Over
              </div>
              <div className="font-ui text-[10px] uppercase tracking-wide text-win-muted">
                Your Score
              </div>
            </div>
            <div className="font-fixedsys text-3xl leading-none tracking-[0.1em] text-win-title">
              {String(finalScore).padStart(6, "0")}
            </div>
          </div>

          {showForm ? (
            <form onSubmit={handleSubmit} className="mb-3">
              <label className="mb-1 block font-ui text-sm text-win-text">
                Enter your name for the leaderboard:
              </label>
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={12}
                  autoCapitalize="off"
                  autoComplete="off"
                  spellCheck={false}
                  className="win-sink min-w-0 flex-1 bg-white px-2 py-1 font-ui text-sm tracking-wide text-black outline-none"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="win-btn px-4 py-1 font-ui text-sm font-bold text-black active:win-pressed disabled:opacity-60"
                >
                  {submitting ? "..." : "Submit"}
                </button>
              </div>
              {submitError ? (
                <p className="mt-1 font-ui text-xs text-win-red">
                  {submitError}
                </p>
              ) : null}
            </form>
          ) : null}

          <ScoreList
            scores={scores}
            loading={loading}
            loadError={loadError}
            highlightId={highlightId}
          />

          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={onPlayAgain}
              className="win-btn px-4 py-1 font-ui text-sm font-bold text-black active:win-pressed"
            >
              Play Again
            </button>
            <button
              type="button"
              onClick={onClose}
              className="win-btn px-4 py-1 font-ui text-sm text-black active:win-pressed"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
