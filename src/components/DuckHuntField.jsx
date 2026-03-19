import DuckHuntBird from "./DuckHuntBird";

export default function DuckHuntField({
  birds,
  viewport,
  birdCursor,
  onShootBird,
  onBirdAnimationEnd,
}) {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 z-[9] overflow-hidden">
        {birds.map((bird) => (
          <DuckHuntBird
            key={bird.id}
            bird={bird}
            viewport={viewport}
            birdCursor={birdCursor}
            onShootBird={onShootBird}
            onBirdAnimationEnd={onBirdAnimationEnd}
          />
        ))}
      </div>

      <style>{`
        @keyframes flyAcross {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(var(--fly-distance));
          }
        }

        @keyframes duckFlap {
          from {
            background-position: 0 0;
          }
          to {
            background-position: calc(var(--bird-size) * var(--frames) * -1) 0;
          }
        }

        @keyframes duckFall {
          from {
            transform: translate(0, 0) rotate(0deg);
          }
          to {
            transform: translate(var(--fall-x), var(--fall-distance))
              rotate(90deg);
          }
        }

        @keyframes hudFlash {
          0%, 100% {
            transform: scale(1);
            filter: brightness(1);
          }
          50% {
            transform: scale(1.03);
            filter: brightness(1.18);
          }
        }
      `}</style>
    </>
  );
}
