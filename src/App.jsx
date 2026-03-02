import { useEffect, useRef, useState } from "react";
import background from "./assets/background.png";
import computerIcon from "./assets/computer_explorer-5.png";
import folderIcon from "./assets/directory_open_file_mydocs-4.png";
import emailIcon from "./assets/outlook_express-4.png";
import documentIcon from "./assets/document-0.png";

const desktopItems = [
  {
    id: "about",
    title: "My Computer",
    icon: <img src={computerIcon} className="" alt="About Me" />,
    content: (
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-[#2d5f9c]">About Me</h2>
        <p>
          Hi, I’m Adrian. I’m a computer science student interested in software
          development, manufacturing systems, and building practical tools that
          solve real problems.
        </p>
        <p>
          I enjoy working with full-stack applications, industrial software, and
          creative web experiences.
        </p>
      </div>
    ),
  },
  {
    id: "experience",
    title: "Experience",
    icon: <img src={folderIcon} alt="Experince" />,
    content: (
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-[#2d5f9c]">Experience</h2>
        <p>
          Add your internships, co-op roles, leadership experience, and major
          accomplishments here.
        </p>
        <div className="rounded-xl border border-[#95c6ec] bg-[#f2fbff] p-4">
          <p className="font-semibold text-[#2d5f9c]">Example ideas</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Co-op / internship experience</li>
            <li>Software development work</li>
            <li>Leadership roles</li>
            <li>Hackathons and student involvement</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: "projects",
    title: "Projects",
    icon: <img src={folderIcon} alt="Projects" />,
    content: (
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-[#2d5f9c]">Projects</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Factory analytics and manufacturing software tools</li>
          <li>React-based web applications and dashboards</li>
          <li>NLP and skill extraction research work</li>
          <li>Personal software and UI experiments</li>
        </ul>
      </div>
    ),
  },
  {
    id: "resume",
    title: "Resume.pdf",
    icon: <img src={documentIcon} alt="Resume" />,
    content: (
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-[#2d5f9c]">Resume</h2>
        <p>
          You can replace this section with your actual resume preview, embedded
          PDF, or a download button later.
        </p>
        <div className="rounded-xl border border-[#a8d08d] bg-[#f5fff0] p-4">
          <p className="font-semibold text-[#46743d]">Coming soon</p>
          <p className="text-sm text-[#567b50]">
            Add your education, experience, projects, and technical skills here.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "contact",
    title: "Contact.exe",
    icon: <img src={emailIcon} alt="Contact" />,
    content: (
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-[#2d5f9c]">Contact</h2>
        <div className="space-y-2">
          <p>Email: your-email@example.com</p>
          <p>LinkedIn: linkedin.com/in/your-name</p>
          <p>GitHub: github.com/your-name</p>
        </div>
      </div>
    ),
  },
];

const WINDOW_WIDTH = 560;
const WINDOW_HEIGHT = 360;

function App() {
  const [openWindows, setOpenWindows] = useState([]);
  const [dragging, setDragging] = useState(null);

  const zCounter = useRef(10);
  const openOffset = useRef(0);

  function getNextZ() {
    zCounter.current += 1;
    return zCounter.current;
  }

  function bringToFront(id) {
    const nextZ = getNextZ();

    setOpenWindows((prev) =>
      prev.map((window) =>
        window.id === id ? { ...window, z: nextZ } : window
      )
    );
  }

  function openDesktopItem(item) {
    setOpenWindows((prev) => {
      const existing = prev.find((window) => window.id === item.id);

      if (existing) {
        const nextZ = getNextZ();
        return prev.map((window) =>
          window.id === item.id ? { ...window, z: nextZ } : window
        );
      }

      const offset = openOffset.current * 28;
      openOffset.current = (openOffset.current + 1) % 6;

      return [
        ...prev,
        {
          id: item.id,
          title: item.title,
          content: item.content,
          x: 200 + offset,
          y: 90 + offset,
          z: getNextZ(),
        },
      ];
    });
  }

  function closeWindow(id) {
    setOpenWindows((prev) => prev.filter((window) => window.id !== id));
  }

  function startDragging(e, id) {
    e.preventDefault();

    const currentWindow = openWindows.find((window) => window.id === id);
    if (!currentWindow) return;

    bringToFront(id);

    setDragging({
      id,
      offsetX: e.clientX - currentWindow.x,
      offsetY: e.clientY - currentWindow.y,
    });
  }

  useEffect(() => {
    function handleMouseMove(e) {
      if (!dragging) return;

      const maxX = window.innerWidth - WINDOW_WIDTH - 20;
      const maxY = window.innerHeight - WINDOW_HEIGHT - 25;

      let nextX = e.clientX - dragging.offsetX;
      let nextY = e.clientY - dragging.offsetY;

      nextX = Math.max(12, Math.min(nextX, maxX));
      nextY = Math.max(12, Math.min(nextY, maxY));

      setOpenWindows((prev) =>
        prev.map((window) =>
          window.id === dragging.id ? { ...window, x: nextX, y: nextY } : window
        )
      );
    }

    function handleMouseUp() {
      setDragging(null);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  return (
    <div
      className="min-h-screen w-full overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="min-h-screen w-full">
        <div className="relative h-screen w-full select-none p-3">
          {/* Desktop icons */}
          <div className="flex w-28 flex-col gap-6">
            {desktopItems.map((item) => (
              <div
                className="flex justify-center flex-col text-center"
                key={item.id}
                onClick={() => openDesktopItem(item)}
              >
                <div className="flex w-full justify-center py-2">
                  {item.icon}
                </div>
                <span className="font-fixedsys text-white">{item.title}</span>
              </div>
            ))}
          </div>

          {/* Open windows */}
          {openWindows.map((window) => (
            <div
              key={window.id}
              onMouseDown={() => bringToFront(window.id)}
              className="absolute overflow-hidden rounded-2xl border border-[#b8e1ff] bg-white/85 shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur-md"
              style={{
                left: `${window.x}px`,
                top: `${window.y}px`,
                width: `${WINDOW_WIDTH}px`,
                height: `${WINDOW_HEIGHT}px`,
                zIndex: window.z,
              }}
            >
              {/* Window top bar */}
              <div
                onMouseDown={(e) => startDragging(e, window.id)}
                className="flex h-12 cursor-move items-center justify-between border-b border-[#c9f0b2] bg-gradient-to-r from-[#2d72d2] via-[#5fa7ef] to-[#9edb7f] px-4 text-white"
              >
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-white/80" />
                  <span className="font-semibold tracking-wide drop-shadow-sm">
                    {window.title}
                  </span>
                </div>

                <button
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={() => closeWindow(window.id)}
                  className="rounded-md border border-white/50 bg-[#e85b5b] px-3 py-1 text-sm font-semibold text-white transition hover:bg-[#d84b4b]"
                >
                  X
                </button>
              </div>

              {/* Window content */}
              <div className="h-[calc(100%-48px)] overflow-auto bg-gradient-to-br from-[#f5fbff] via-[#f8fdff] to-[#f4fff0] p-5 text-[#24415f]">
                {window.content}
              </div>
            </div>
          ))}

          {/* Bottom taskbar */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-14 border-t border-white/30 bg-gray-500 backdrop-blur-sm">
            <div className="flex h-full items-center px-4 text-white">
              <div className="rounded-full border border-white/50 bg-[#58b947] px-5 py-1 text-sm font-bold shadow-md">
                Test
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
