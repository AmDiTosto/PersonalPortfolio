import { useCallback, useEffect, useRef, useState } from "react";

// A Windows-95-style scrollbar drawn in the DOM. The native scrollbar is hidden
// (`.winscroll-hide`) and this fake one is synced to a scroll element, so it
// looks identical in every browser/OS (Safari overlay + Firefox + mobile).
// Pointer events are used so the thumb/arrows work with mouse AND touch, while
// native swipe/wheel scrolling keeps working underneath.

const BAR = 16; // scrollbar width & arrow-button height
const MIN_THUMB = 20;
const ARROW_STEP = 40;

const UP_ARROW =
  "url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='8' height='6' viewBox='0 0 8 6'><path d='M4 0 0 6h8z' fill='%23000'/></svg>\")";
const DOWN_ARROW =
  "url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='8' height='6' viewBox='0 0 8 6'><path d='M0 0h8L4 6z' fill='%23000'/></svg>\")";
const CHECKER =
  "url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='2' height='2' shape-rendering='crispEdges'><rect width='1' height='1' fill='%23fff'/><rect x='1' y='1' width='1' height='1' fill='%23fff'/></svg>\")";
const BEVEL_RAISE =
  "inset -1px -1px 0 0 #0a0a0a, inset 1px 1px 0 0 #ffffff, inset -2px -2px 0 0 #808080, inset 2px 2px 0 0 #dfdfdf";

// Renders a Win95 scrollbar for an existing scroll element (`targetRef`).
export function WinScrollBar({ targetRef }) {
  const [m, setM] = useState({ scrollTop: 0, scrollHeight: 0, clientHeight: 0 });
  const dragRef = useRef(null);
  const repeatRef = useRef(null);

  const measure = useCallback(() => {
    const el = targetRef.current;
    if (!el) return;
    setM({
      scrollTop: el.scrollTop,
      scrollHeight: el.scrollHeight,
      clientHeight: el.clientHeight,
    });
  }, [targetRef]);

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;
    measure();
    const onChange = () => measure();
    el.addEventListener("scroll", onChange, { passive: true });
    el.addEventListener("input", onChange); // textarea typing
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    return () => {
      el.removeEventListener("scroll", onChange);
      el.removeEventListener("input", onChange);
      ro.disconnect();
    };
  }, [targetRef, measure]);

  const scrollable = m.scrollHeight > m.clientHeight + 1;
  const trackLen = Math.max(0, m.clientHeight - BAR * 2);
  const thumbLen = scrollable
    ? Math.max(MIN_THUMB, (m.clientHeight / m.scrollHeight) * trackLen)
    : 0;
  const maxScroll = Math.max(0, m.scrollHeight - m.clientHeight);
  const maxThumb = Math.max(0, trackLen - thumbLen);
  const thumbTop = maxScroll > 0 ? (m.scrollTop / maxScroll) * maxThumb : 0;

  function nudge(delta) {
    const el = targetRef.current;
    if (el) el.scrollTop += delta;
  }

  function stopRepeat() {
    if (repeatRef.current) {
      window.clearInterval(repeatRef.current);
      repeatRef.current = null;
    }
  }
  useEffect(() => stopRepeat, []);

  function onThumbDown(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    dragRef.current = {
      y: e.clientY,
      top: targetRef.current?.scrollTop ?? 0,
      maxThumb,
      maxScroll,
    };
  }
  function onThumbMove(e) {
    const d = dragRef.current;
    const el = targetRef.current;
    if (!d || !el || d.maxThumb <= 0) return;
    el.scrollTop = d.top + ((e.clientY - d.y) / d.maxThumb) * d.maxScroll;
  }
  function onThumbUp(e) {
    dragRef.current = null;
    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    } catch {
      /* no-op */
    }
  }

  function onArrowDown(e, delta) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    nudge(delta);
    stopRepeat();
    repeatRef.current = window.setInterval(() => nudge(delta), 60);
  }

  function onTrackDown(e) {
    if (e.target !== e.currentTarget) return;
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    nudge(e.clientY - rect.top < thumbTop ? -m.clientHeight : m.clientHeight);
  }

  if (!scrollable) return null;

  const arrowStyle = {
    height: `${BAR}px`,
    backgroundColor: "#c0c0c0",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    touchAction: "none",
  };

  return (
    <div
      className="relative h-full shrink-0 select-none"
      style={{ width: `${BAR}px` }}
    >
      <button
        type="button"
        aria-label="Scroll up"
        onPointerDown={(e) => onArrowDown(e, -ARROW_STEP)}
        onPointerUp={stopRepeat}
        onPointerCancel={stopRepeat}
        onPointerLeave={stopRepeat}
        className="win-btn absolute left-0 right-0 top-0 active:win-pressed"
        style={{ ...arrowStyle, backgroundImage: UP_ARROW }}
      />

      <div
        onPointerDown={onTrackDown}
        className="absolute inset-x-0"
        style={{
          top: `${BAR}px`,
          bottom: `${BAR}px`,
          backgroundColor: "#c0c0c0",
          backgroundImage: CHECKER,
          touchAction: "none",
        }}
      >
        <div
          onPointerDown={onThumbDown}
          onPointerMove={onThumbMove}
          onPointerUp={onThumbUp}
          onPointerCancel={onThumbUp}
          className="absolute inset-x-0"
          style={{
            top: `${thumbTop}px`,
            height: `${thumbLen}px`,
            backgroundColor: "#c0c0c0",
            boxShadow: BEVEL_RAISE,
            touchAction: "none",
          }}
        />
      </div>

      <button
        type="button"
        aria-label="Scroll down"
        onPointerDown={(e) => onArrowDown(e, ARROW_STEP)}
        onPointerUp={stopRepeat}
        onPointerCancel={stopRepeat}
        onPointerLeave={stopRepeat}
        className="win-btn absolute bottom-0 left-0 right-0 active:win-pressed"
        style={{ ...arrowStyle, backgroundImage: DOWN_ARROW }}
      />
    </div>
  );
}

// Wraps its children in a scroll viewport with a Win95 scrollbar beside it.
export default function WinScroll({ className = "", children }) {
  const viewportRef = useRef(null);
  return (
    <div className="flex h-full w-full">
      <div
        ref={viewportRef}
        className={`winscroll-hide min-w-0 flex-1 overflow-auto ${className}`}
      >
        <div>{children}</div>
      </div>
      <WinScrollBar targetRef={viewportRef} />
    </div>
  );
}
