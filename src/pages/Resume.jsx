import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import downloadIcon from "../assets/desktopIcons/download-icon.svg";
import resumePdf from "../assets/resume.pdf";
import pdfWorkerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;

const MIN_ZOOM = 0.6;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.15;

export default function Resume() {
  const [numPages, setNumPages] = useState(null);
  const [baseWidth, setBaseWidth] = useState(760);
  const [zoom, setZoom] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const viewerRef = useRef(null);
  const pageRefs = useRef([]);

  const pageWidth = Math.round(baseWidth * zoom);
  const zoomPct = Math.round(zoom * 100);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    pageRefs.current = [];
  }

  function zoomOut() {
    setZoom((z) => Math.max(MIN_ZOOM, Math.round((z - ZOOM_STEP) * 100) / 100));
  }

  function zoomIn() {
    setZoom((z) => Math.min(MAX_ZOOM, Math.round((z + ZOOM_STEP) * 100) / 100));
  }

  function fitWidth() {
    setZoom(1);
  }

  function handleScroll() {
    const container = viewerRef.current;
    if (!container) return;

    const anchor = container.getBoundingClientRect().top + 80;
    let closest = 1;
    let closestDist = Infinity;

    pageRefs.current.forEach((el, index) => {
      if (!el) return;
      const dist = Math.abs(el.getBoundingClientRect().top - anchor);
      if (dist < closestDist) {
        closestDist = dist;
        closest = index + 1;
      }
    });

    setCurrentPage(closest);
  }

  useEffect(() => {
    function updateBaseWidth() {
      if (!viewerRef.current) return;
      const width = viewerRef.current.clientWidth - 40;
      setBaseWidth(Math.max(240, width));
    }

    updateBaseWidth();

    const observer = new ResizeObserver(updateBaseWidth);
    if (viewerRef.current) observer.observe(viewerRef.current);
    window.addEventListener("resize", updateBaseWidth);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateBaseWidth);
    };
  }, []);

  const toolBtn =
    "win-raise flex items-center justify-center gap-1.5 bg-win-face px-2.5 py-1 font-ui text-sm text-win-text transition hover:brightness-[1.03] active:win-pressed disabled:opacity-45";

  return (
    <div className="flex h-full w-full flex-col gap-2">
      <div className="win-raise flex flex-wrap items-center gap-1.5 bg-win-face px-2 py-1.5">
        <a
          href={resumePdf}
          download="Adrian_Di_Tosto_Resume.pdf"
          className="win-btn inline-flex items-center gap-2 px-3 py-1 font-ui text-sm font-bold text-black active:win-pressed"
        >
          <img src={downloadIcon} alt="" className="h-4 w-4" />
          Download
        </a>

        <div className="mx-1 h-6 w-px bg-win-shadow" />

        <button
          type="button"
          onClick={zoomOut}
          disabled={zoom <= MIN_ZOOM}
          aria-label="Zoom out"
          className={toolBtn}
        >
          <span className="text-base leading-none">&minus;</span>
        </button>

        <span className="min-w-[46px] text-center font-ui text-sm font-semibold tabular-nums text-win-text">
          {zoomPct}%
        </span>

        <button
          type="button"
          onClick={zoomIn}
          disabled={zoom >= MAX_ZOOM}
          aria-label="Zoom in"
          className={toolBtn}
        >
          <span className="text-base leading-none">+</span>
        </button>

        <button type="button" onClick={fitWidth} className={toolBtn}>
          Fit width
        </button>

        {numPages ? (
          <div className="win-sink ml-auto bg-white px-2.5 py-1 font-ui text-sm text-win-text">
            Page <span className="font-semibold tabular-nums">{currentPage}</span>{" "}
            / <span className="tabular-nums">{numPages}</span>
          </div>
        ) : null}
      </div>

      <div
        ref={viewerRef}
        onScroll={handleScroll}
        className="win-sink min-h-0 w-full flex-1 overflow-auto bg-[#808080] p-4"
      >
        <Document
          file={resumePdf}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="py-10 text-center font-ui text-white/90">
              Loading resume&hellip;
            </div>
          }
          error={
            <div className="py-10 text-center font-ui text-[#ffd3cd]">
              Failed to load PDF. Try the Download button above.
            </div>
          }
        >
          <div className="mx-auto flex w-fit min-w-full flex-col items-center gap-5">
            {Array.from(new Array(numPages || 0), (_, index) => (
              <div
                key={`page_${index + 1}`}
                ref={(el) => (pageRefs.current[index] = el)}
                className="overflow-hidden rounded-[2px] bg-white shadow-[0_6px_20px_-4px_rgba(0,0,0,0.5)] ring-1 ring-black/10"
              >
                <Page
                  pageNumber={index + 1}
                  width={pageWidth}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </div>
            ))}
          </div>
        </Document>
      </div>
    </div>
  );
}
