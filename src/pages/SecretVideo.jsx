const VIDEO_ID = "a7Lq6ZlSqys";
const EMBED_SRC = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;

export default function SecretVideo() {
  return (
    <div className="win-sink h-full w-full overflow-hidden bg-black">
      <iframe
        src={EMBED_SRC}
        title="Adrian SECRET folder"
        className="h-full w-full border-0"
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
