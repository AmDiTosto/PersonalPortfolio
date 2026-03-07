import { useEffect, useRef, useState } from "react";
import background from "./assets/background.png";
import computerIcon from "./assets/computer_explorer-5.png";
import folderIcon from "./assets/directory_open_file_mydocs-4.png";
import emailIcon from "./assets/outlook_express-4.png";
import documentIcon from "./assets/document-0.png";
import xIcon from "./assets/msg_error-0.png";
import windoesIcon from "./assets/windows-0.png";
import MyComputerPage from "./pages/MyComputer";
import Experience from "./pages/Experience";
import Projects from "./pages/Projects";
import Resume from "./pages/Resume";
import Contact from "./pages/Contact";

function App() {
  const [viewport, setViewport] = useState(() =>
    typeof window === "undefined"
      ? { width: 1440, height: 900 }
      : getViewportSize()
  );

  const [openWindows, setOpenWindows] = useState([]);
  const [dragging, setDragging] = useState(null);

  const zCounter = useRef(10);
  const openOffset = useRef(0);

  const [currentTime, setCurrentTime] = useState(new Date());

  const TASKBAR_HEIGHT = 56;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function getViewportSize() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  function getTopSafeArea(viewportWidth) {
    // On small screens the icons move to the top,
    // so windows should open a bit lower.
    return viewportWidth < 640 ? 100 : 12;
  }

  function getResponsiveWindowSize(viewportWidth, viewportHeight) {
    const maxAllowedWidth = Math.max(220, viewportWidth - 24);
    const maxAllowedHeight = Math.max(
      200,
      viewportHeight - TASKBAR_HEIGHT - 24
    );

    let targetWidth = 700;
    let targetHeight = 500;

    if (viewportWidth < 640) {
      targetWidth = viewportWidth - 24;
      targetHeight = viewportHeight - TASKBAR_HEIGHT - 120;
    } else if (viewportWidth < 1024) {
      targetWidth = Math.min(500, viewportWidth - 56);
      targetHeight = Math.min(340, viewportHeight - TASKBAR_HEIGHT - 36);
    }

    return {
      width: clamp(targetWidth, 220, maxAllowedWidth),
      height: clamp(targetHeight, 200, maxAllowedHeight),
    };
  }

  function clampWindowPosition(
    x,
    y,
    width,
    height,
    viewportWidth,
    viewportHeight
  ) {
    const minX = 12;
    const minY = getTopSafeArea(viewportWidth);

    const maxX = Math.max(minX, viewportWidth - width - 12);
    const maxY = Math.max(minY, viewportHeight - TASKBAR_HEIGHT - height - 12);

    return {
      x: clamp(x, minX, maxX),
      y: clamp(y, minY, maxY),
    };
  }

  const desktopItems = [
    {
      id: "about",
      type: "window",
      title: "My Computer",
      icon: (
        <img
          src={computerIcon}
          className="h-12 w-12 object-contain"
          alt="About Me"
          draggable="false"
        />
      ),
      content: <MyComputerPage />,
    },
    {
      id: "experience",
      type: "window",
      title: "Experience",
      icon: (
        <img
          src={folderIcon}
          alt="Experience"
          className="h-12 w-12 object-contain"
          draggable="false"
        />
      ),
      content: <Experience />,
    },
    {
      id: "projects",
      type: "window",
      title: "Projects",
      icon: (
        <img
          src={folderIcon}
          alt="Projects"
          className="h-12 w-12 object-contain"
          draggable="false"
        />
      ),
      content: <Projects />,
    },
    {
      id: "resume",
      type: "window",
      title: "Resume.pdf",
      icon: (
        <img
          src={documentIcon}
          alt="Resume"
          className="h-12 w-12 object-contain"
          draggable="false"
        />
      ),
      content: <Resume />,
    },
    {
      id: "contact",
      type: "window",
      title: "Contact.exe",
      icon: (
        <img
          src={emailIcon}
          alt="Contact"
          className="h-12 w-12 object-contain"
          draggable="false"
        />
      ),
      content: <Contact />,
    },
    {
      id: "secret",
      type: "external-link",
      title: "Adrian SECRET folder",
      icon: (
        <img
          src={folderIcon}
          alt="Secret"
          className="h-12 w-12 object-contain"
          draggable="false"
        />
      ),
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
  ];

  function formatWindowsTime(date) {
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const suffix = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    if (hours === 0) hours = 12;

    return `${hours}:${minutes} ${suffix}`;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
    if (item.type === "external-link" && item.url) {
      window.open(item.url, "_blank", "noopener,noreferrer");
      return;
    }

    if (item.type !== "window") return;

    const topSafeArea = getTopSafeArea(viewport.width);

    const size = getResponsiveWindowSize(viewport.width, viewport.height);

    const isSmallScreen = viewport.width < 640;

    setOpenWindows((prev) => {
      const existing = prev.find((window) => window.id === item.id);

      if (existing) {
        const nextZ = getNextZ();
        return prev.map((window) =>
          window.id === item.id ? { ...window, z: nextZ } : window
        );
      }

      const offset = openOffset.current * (isSmallScreen ? 12 : 28);
      openOffset.current = (openOffset.current + 1) % 6;

      const initialPosition = clampWindowPosition(
        isSmallScreen ? 12 + offset : 150 + offset,
        topSafeArea + offset,
        size.width,
        size.height,
        viewport.width,
        viewport.height
      );

      return [
        ...prev,
        {
          id: item.id,
          title: item.title,
          content: item.content,
          width: size.width,
          height: size.height,
          x: initialPosition.x,
          y: initialPosition.y,
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
    function handleResize() {
      setViewport(getViewportSize());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const nextSize = getResponsiveWindowSize(viewport.width, viewport.height);

    setOpenWindows((prev) =>
      prev.map((window) => {
        const nextPosition = clampWindowPosition(
          window.x,
          window.y,
          nextSize.width,
          nextSize.height,
          viewport.width,
          viewport.height
        );

        return {
          ...window,
          width: nextSize.width,
          height: nextSize.height,
          x: nextPosition.x,
          y: nextPosition.y,
        };
      })
    );
  }, [viewport]);

  useEffect(() => {
    function handleMouseMove(e) {
      if (!dragging) return;

      const activeWindow = openWindows.find(
        (window) => window.id === dragging.id
      );

      if (!activeWindow) return;

      const nextPosition = clampWindowPosition(
        e.clientX - dragging.offsetX,
        e.clientY - dragging.offsetY,
        activeWindow.width,
        activeWindow.height,
        viewport.width,
        viewport.height
      );

      setOpenWindows((prev) =>
        prev.map((window) =>
          window.id === dragging.id
            ? { ...window, x: nextPosition.x, y: nextPosition.y }
            : window
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
  }, [dragging, openWindows, viewport]);

  return (
    <div
      className="min-h-screen w-full overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="min-h-screen w-full">
        <div className="relative h-screen w-full select-none p-3 sm:p-4">
          {/* Desktop icons */}
          <div className="absolute left-3 right-3 top-3 z-10 flex flex-row flex-wrap gap-x-3 gap-y-5 sm:right-auto sm:w-28 sm:flex-col sm:gap-6">
            {desktopItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => openDesktopItem(item)}
                className="flex w-20 flex-col items-center text-center sm:w-full cursor-pointer                "
              >
                <div className="flex w-full justify-center py-2">
                  {item.icon}
                </div>
                <span className="font-fixedsys text-[11px] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] sm:text-sm">
                  {item.title}
                </span>
              </button>
            ))}
          </div>

          {/* Open windows */}
          {openWindows.map((window) => (
            <div
              key={window.id}
              onMouseDown={() => bringToFront(window.id)}
              className="absolute overflow-hidden"
              style={{
                left: `${window.x}px`,
                top: `${window.y}px`,
                width: `${window.width}px`,
                height: `${window.height}px`,
                zIndex: window.z,
              }}
            >
              {/* Window top bar */}
              <div
                onMouseDown={(e) => startDragging(e, window.id)}
                className="flex h-10 cursor-move items-center justify-between border-b border-[#c9f0b2] bg-[#0000aa] px-3 text-white sm:h-12 sm:px-4"
              >
                <div className="flex min-w-0 items-center gap-2 bg-[#0000aa]">
                  <span className="font-fixedsys text-xl tracking-wide">
                    {window.title}
                  </span>
                </div>

                <button
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={() => closeWindow(window.id)}
                  className="cursor-pointer"
                >
                  <img src={xIcon} alt="xIcon" />
                </button>
              </div>

              {/* Window content */}
              <div className="h-[calc(100%-40px)] overflow-auto bg-[#c3c7cb] p-3 text-sm text-[#24415f] sm:h-[calc(100%-48px)] sm:p-5 sm:text-base">
                {window.content}
              </div>
            </div>
          ))}

          {/* Bottom taskbar */}
          {/* Bottom taskbar */}
          <div className="absolute bottom-0 left-0 right-0 h-12 border-t border-[#dfdfdf] bg-[#c0c0c0] sm:h-14">
            <div className="flex h-full items-center justify-between px-1.5 sm:px-2">
              {/* Left side */}
              <div className="flex min-w-0 items-center gap-1.5">
                <button
                  type="button"
                  className="flex h-8 items-center justify-center gap-2 border-2 border-t-white border-l-white border-r-[#404040] border-b-[#404040] bg-[#c0c0c0] px-2 text-black active:border-t-[#404040] active:border-l-[#404040] active:border-r-white active:border-b-white sm:h-9 sm:px-3"
                >
                  <img
                    src={windoesIcon}
                    alt="Windows icon"
                    className="h-6 w-6 shrink-0 object-contain"
                  />
                  <span className="font-fixedsys font-bold text-lg">Start</span>
                </button>

                <div className="flex h-8 items-center justify-center gap-2 border-2 border-t-white border-l-white border-r-[#404040] border-b-[#404040] bg-[#c0c0c0] px-2 text-black sm:h-9 sm:px-3">
                  <img
                    src={computerIcon}
                    alt="Desktop icon"
                    className="h-6 w-6 shrink-0 object-contain "
                  />
                  <span className="font-fixedsys font-bold text-lg">
                    My Desktop
                  </span>
                </div>
              </div>

              {/* Right side clock */}
              <div className="flex h-8 items-center border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white bg-[#c0c0c0] px-2 text-black sm:h-9 sm:px-3">
                <span className="font-fixedsys text-lg font-bold">
                  {formatWindowsTime(currentTime)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
