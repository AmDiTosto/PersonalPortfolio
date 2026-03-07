// Resume.jsx

import resumePdf from "../assets/resume.pdf";

export default function Resume() {
  return (
    <div className="w-full bg-[#c3c7cb] flex flex-col items-center gap-2">
      {/* Download Button */}
      <a
        href={resumePdf}
        download="Adrian_Di_Tosto_Resume.pdf"
        className="cursor-pointer text-white border-2 border-t-white border-l-white border-r-[#404040] border-b-[#404040] bg-[#0000aa] px-4 py-2 font-fixedsys text-sm active:border-t-[#404040] active:border-l-[#404040] active:border-r-white active:border-b-white"
      >
        Download Resume
      </a>

      {/* PDF Display */}
      <div className="w-full max-w-5xl h-[90vh] border-2 border-t-[#404040] border-l-[#404040] border-r-white border-b-white bg-white">
        <iframe
          src={`${resumePdf}#toolbar=0`}
          title="Resume"
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
