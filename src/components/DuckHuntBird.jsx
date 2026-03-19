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

  const outerStyle = bird.shot
    ? {
        left: `${bird.frozenX}px`,
        top: `${bird.frozenY}px`,
        width: `${bird.size}px`,
        height: `${bird.size}px`,
        pointerEvents: "auto",
        cursor: birdCursor,
        "--fall-x": `${bird.fromRight ? -90 : 90}px`,
        "--fall-distance": `${Math.max(
          220,
          viewport.height - bird.frozenY + bird.size
        )}px`,
        animation: "duckFall 1.05s ease-in forwards",
      }
    : {
        left: `${startX}px`,
        top: `${bird.top}px`,
        width: `${bird.size}px`,
        height: `${bird.size}px`,
        pointerEvents: "auto",
        cursor: birdCursor,
        "--fly-distance": `${endX - startX}px`,
        animation: `flyAcross ${bird.duration}s linear forwards`,
      };

  const innerStyle = bird.shot
    ? {
        backgroundImage: `url(${bird.sprite})`,
        backgroundSize: `${bird.size * DUCK_TOTAL_FRAMES}px ${bird.size}px`,
        backgroundPosition: `-${bird.size * DUCK_HIT_FRAME}px 0`,
        imageRendering: "pixelated",
        transform: `scaleX(${facingScale})`,
      }
    : {
        "--bird-size": `${bird.size}px`,
        "--frames": DUCK_FLYING_FRAMES,
        backgroundImage: `url(${bird.sprite})`,
        backgroundSize: `${bird.size * DUCK_TOTAL_FRAMES}px ${bird.size}px`,
        imageRendering: "pixelated",
        transform: `scaleX(${facingScale})`,
        animation: `duckFlap 0.55s steps(${DUCK_FLYING_FRAMES}) infinite`,
      };

  return (
    <button
      type="button"
      aria-label={`Shoot ${bird.birdType} duck`}
      onClick={(e) => onShootBird(bird.id, e)}
      onAnimationEnd={(e) => onBirdAnimationEnd(bird.id, e)}
      className="absolute border-0 bg-transparent p-0"
      style={outerStyle}
    >
      <span className="block h-full w-full bg-no-repeat" style={innerStyle} />
    </button>
  );
}
