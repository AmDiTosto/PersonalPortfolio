// Pixel-art heart (extra-life pickup). Authored on a small grid so it renders
// as crisp blocks — matching the pixelated duck sprites.
const HEART_GRID = [
  "00110001100",
  "01111011110",
  "11111111111",
  "11111111111",
  "11111111111",
  "01111111110",
  "00111111100",
  "00011111000",
  "00001110000",
  "00000100000",
];
const HEART_ROWS = HEART_GRID.length;
const HEART_COLS = HEART_GRID[0].length;
const HEART_HILITE = new Set(["1,2", "2,2", "2,3"]);

function heartFilled(r, c) {
  return (
    r >= 0 &&
    r < HEART_ROWS &&
    c >= 0 &&
    c < HEART_COLS &&
    HEART_GRID[r][c] === "1"
  );
}

// Precompute fill + outline cells once at module load.
const HEART_FILL_CELLS = [];
const HEART_OUTLINE_CELLS = [];
for (let r = -1; r <= HEART_ROWS; r++) {
  for (let c = -1; c <= HEART_COLS; c++) {
    if (heartFilled(r, c)) {
      HEART_FILL_CELLS.push([r, c, HEART_HILITE.has(`${r},${c}`)]);
    } else if (
      heartFilled(r - 1, c) ||
      heartFilled(r + 1, c) ||
      heartFilled(r, c - 1) ||
      heartFilled(r, c + 1)
    ) {
      HEART_OUTLINE_CELLS.push([r, c]);
    }
  }
}

function PixelHeart({ size, pulse }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      style={
        pulse ? { animation: "heartPulse 0.9s ease-in-out infinite" } : undefined
      }
    >
      <svg
        width={size}
        height={size}
        viewBox="-1 -1 13 12"
        preserveAspectRatio="xMidYMid meet"
        shapeRendering="crispEdges"
        style={{ filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.35))" }}
      >
        {HEART_OUTLINE_CELLS.map(([r, c]) => (
          <rect key={`o${r}-${c}`} x={c} y={r} width="1" height="1" fill="#6b0f1b" />
        ))}
        {HEART_FILL_CELLS.map(([r, c, light]) => (
          <rect
            key={`f${r}-${c}`}
            x={c}
            y={r}
            width="1"
            height="1"
            fill={light ? "#ff8fa0" : "#e01e37"}
          />
        ))}
      </svg>
    </span>
  );
}

export default function DuckHuntBird({
  bird,
  viewport,
  birdCursor,
  onShootBird,
  onBirdAnimationEnd,
}) {
  const DUCK_TOTAL_FRAMES = 9;
  const DUCK_FLYING_FRAMES = 6;
  const DUCK_HIT_FRAME = 6;

  const startX = bird.fromRight ? viewport.width + bird.size : -bird.size;
  const endX = bird.fromRight ? -bird.size : viewport.width + bird.size;
  const facingScale = bird.fromRight ? -1 : 1;
  const isHeart = bird.kind === "heart";

  const outerBase = {
    position: "absolute",
    width: `${bird.size}px`,
    height: `${bird.size}px`,
    pointerEvents: "auto",
    cursor: birdCursor,
  };

  let outerStyle;
  if (bird.shot) {
    outerStyle = isHeart
      ? {
          ...outerBase,
          left: `${bird.frozenX}px`,
          top: `${bird.frozenY}px`,
          animation: "heartBurst 0.42s ease-out forwards",
        }
      : {
          ...outerBase,
          left: `${bird.frozenX}px`,
          top: `${bird.frozenY}px`,
          "--fall-x": `${bird.fromRight ? -90 : 90}px`,
          "--fall-distance": `${Math.max(
            220,
            viewport.height - bird.frozenY + bird.size,
          )}px`,
          animation: "duckFall 1.05s ease-in forwards",
        };
  } else {
    outerStyle = {
      ...outerBase,
      left: `${startX}px`,
      top: `${bird.top}px`,
      "--fly-distance": `${endX - startX}px`,
      animation: `flyAcross ${bird.duration}s linear forwards`,
    };
  }

  const innerStyle = bird.shot
    ? {
        width: "100%",
        height: "100%",
        backgroundImage: `url(${bird.sprite})`,
        backgroundSize: `${bird.size * DUCK_TOTAL_FRAMES}px ${bird.size}px`,
        backgroundPosition: `-${bird.size * DUCK_HIT_FRAME}px 0`,
        backgroundRepeat: "no-repeat",
        imageRendering: "pixelated",
        transform: `scaleX(${facingScale})`,
      }
    : {
        width: "100%",
        height: "100%",
        "--bird-size": `${bird.size}px`,
        "--frames": DUCK_FLYING_FRAMES,
        backgroundImage: `url(${bird.sprite})`,
        backgroundSize: `${bird.size * DUCK_TOTAL_FRAMES}px ${bird.size}px`,
        backgroundRepeat: "no-repeat",
        imageRendering: "pixelated",
        transform: `scaleX(${facingScale})`,
        animation: `duckFlap 0.55s steps(${DUCK_FLYING_FRAMES}) infinite`,
      };

  return (
    <button
      type="button"
      aria-label={isHeart ? "Shoot the heart for an extra life" : `Shoot ${bird.birdType} duck`}
      onClick={(e) => onShootBird(bird.id, e)}
      onAnimationEnd={(e) => onBirdAnimationEnd(bird.id, e)}
      className="border-0 bg-transparent p-0"
      style={outerStyle}
    >
      {isHeart ? (
        <PixelHeart size={bird.size} pulse={!bird.shot} />
      ) : (
        <span className="block" style={innerStyle} />
      )}
    </button>
  );
}
