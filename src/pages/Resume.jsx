import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import downloadIcon from "../assets/desktopIcons/download-icon.svg";
import resumePdf from "../assets/resume.pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function Resume() {
  const [numPages, setNumPages] = useState(null);
  const [pageWidth, setPageWidth] = useState(800);
  const viewerRef = useRef(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  useEffect(() => {
    function updatePageWidth() {
      if (!viewerRef.current) return;
      const viewerWidth = viewerRef.current.clientWidth - 25;
      setPageWidth(viewerWidth);
    }

    updatePageWidth();

    const observer = new ResizeObserver(updatePageWidth);
    if (viewerRef.current) {
      observer.observe(viewerRef.current);
    }

    window.addEventListener("resize", updatePageWidth);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updatePageWidth);
    };
  }, []);

  return (
    <div className="w-full h-full bg-[#c3c7cb] flex flex-col items-center gap-2 p-2">
      <a
        href={resumePdf}
        download="Adrian_Di_Tosto_Resume.pdf"
        className="group inline-flex items-center gap-3 cursor-pointer select-none text-white border-2 border-t-white border-l-white border-r-[#404040] border-b-[#404040] bg-[#0000aa] px-4 py-2 font-fixedsys text-sm shadow-[1px_1px_0_#000] hover:bg-[#0000cc] active:border-t-[#404040] active:border-l-[#404040] active:border-r-white active:border-b-white active:translate-x-[1px] active:translate-y-[1px]"
      >
        <div className="flex items-center justify-center h-8 w-8 border border-t-white border-l-white border-r-[#404040] border-b-[#404040] bg-[#c3c7cb] text-black">
          <img src={downloadIcon} alt="Download" className="h-4 w-4" />
        </div>

        <div className="flex flex-col">
          <span>Download Resume</span>
        </div>
      </a>

      <div
        ref={viewerRef}
        className="w-full max-w-5xl h-[90vh] overflow-y-auto overflow-x-hidden border-2 border-t-[#404040] border-l-[#404040] border-r-white border-b-white bg-[#808080] p-3"
      >
        <Document
          file={resumePdf}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="text-center font-fixedsys">Loading PDF...</div>
          }
          error={
            <div className="text-center font-fixedsys text-red-700">
              Failed to load PDF.
            </div>
          }
        >
          <div className="flex flex-col items-center gap-4">
            {Array.from(new Array(numPages || 0), (_, index) => (
              <div key={`page_${index + 1}`} className="bg-white shadow-md">
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
