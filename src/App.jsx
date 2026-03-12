import { useEffect, useRef, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import background from "./assets/desktopIcons/background.svg";
import computerIcon from "./assets/desktopIcons/computer_explorer-5.svg";
import folderIcon from "./assets/desktopIcons/directory_open_file_mydocs-4.svg";
import emailIcon from "./assets/desktopIcons/outlook_express-4.svg";
import documentIcon from "./assets/desktopIcons/document-0.svg";
import xIcon from "./assets/desktopIcons/msg_error-0.svg";
import windoesIcon from "./assets/desktopIcons/windows-0.svg";
import startupSound from "./assets/sounds/startSound.mp3";
import MyComputerPage from "./pages/MyComputer";
import Experience from "./pages/Experience";
import Projects from "./pages/Projects";
import Resume from "./pages/Resume";
import Contact from "./pages/Contact";
import LoadingScreen from "./pages/LoadingScreen";

function App() {
  const TASKBAR_HEIGHT = 60;

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

  function formatWindowsTime(date) {
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const suffix = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    if (hours === 0) hours = 12;

    return `${hours}:${minutes} ${suffix}`;
  }

  const [viewport, setViewport] = useState(() =>
    typeof window === "undefined"
      ? { width: 1440, height: 900 }
      : getViewportSize()
  );

  const [currentTime, setCurrentTime] = useState(new Date());
  const [appPhase, setAppPhase] = useState("loading");

  const zCounter = useRef(10);
  const openOffset = useRef(0);

  const audioRef = useRef(null);
  const transitionTimeoutRef = useRef(null);
  const hasPlayedStartupAudioRef = useRef(false);
  const hasStartedTransitionRef = useRef(false);

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
      url: "https://www.youtube.com/watch?v=QDia3e12czc",
    },
  ];

  const desktopItemMap = Object.fromEntries(
    desktopItems
      .filter((item) => item.type === "window")
      .map((item) => [item.id, item])
  );

  function createWindowFromItem(item, overrides = {}) {
    const defaultSize = getResponsiveWindowSize(
      viewport.width,
      viewport.height
    );

    const width = overrides.width ?? defaultSize.width;
    const height = overrides.height ?? defaultSize.height;

    const position = clampWindowPosition(
      overrides.x ?? (viewport.width < 640 ? 12 : 150),
      overrides.y ?? getTopSafeArea(viewport.width),
      width,
      height,
      viewport.width,
      viewport.height
    );

    return {
      id: item.id,
      title: item.title,
      content: item.content,
      width,
      height,
      x: position.x,
      y: position.y,
      z: overrides.z ?? 11,
    };
  }

  const [openWindows, setOpenWindows] = useState(() => {
    if (desktopItemMap.about) {
      return [createWindowFromItem(desktopItemMap.about, { z: 11 })];
    }
    return [];
  });

  const [dragging, setDragging] = useState(null);

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

  function getDesktopIconLayout(viewportWidth, viewportHeight) {
    const topOffset = 12;
    const bottomOffset = 12;
    const usableHeight =
      viewportHeight - TASKBAR_HEIGHT - topOffset - bottomOffset;

    const itemHeight = viewportWidth < 640 ? 92 : 108;
    const itemWidth = viewportWidth < 640 ? 88 : 112;

    const maxRows = Math.max(1, Math.floor(usableHeight / itemHeight));

    return {
      itemHeight,
      itemWidth,
      maxRows,
    };
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

  async function playStartupSound() {
    const audio = audioRef.current;

    if (!audio || hasPlayedStartupAudioRef.current) return;

    try {
      audio.currentTime = 0;
      await audio.play();
      hasPlayedStartupAudioRef.current = true;
    } catch (error) {
      console.error("Startup audio could not play:", error);
    }
  }

  const desktopIconLayout = getDesktopIconLayout(
    viewport.width,
    viewport.height
  );

  useEffect(() => {
    const audio = new Audio(startupSound);
    audio.preload = "auto";
    audio.volume = 1;
    audioRef.current = audio;

    return () => {
      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current);
      }

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (appPhase === "loading") return;

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [appPhase]);

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

  useEffect(() => {
    zCounter.current = openWindows.reduce(
      (max, window) => Math.max(max, window.z),
      10
    );
  }, [openWindows]);

  function handleLoadingComplete() {
    if (hasStartedTransitionRef.current) return;

    hasStartedTransitionRef.current = true;

    void playStartupSound();

    setAppPhase("transitioning");

    transitionTimeoutRef.current = window.setTimeout(() => {
      setAppPhase("desktop");
    }, 1200);
  }

  return (
    <>
      <div className="relative min-h-screen w-full overflow-hidden bg-black">
        <div
          className={`absolute inset-0 transition-all duration-[1200ms] ease-in-out ${
            appPhase === "loading"
              ? "pointer-events-none opacity-0 scale-[1.02]"
              : "opacity-100 scale-100"
          } ${
            appPhase === "desktop"
              ? "pointer-events-auto"
              : "pointer-events-none"
          }`}
        >
          <div
            className="min-h-screen w-full overflow-hidden bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${background})` }}
          >
            <div className="min-h-screen w-full">
              <div className="relative h-screen w-full select-none p-3 sm:p-4">
                <div
                  className="absolute left-3 top-3 z-10"
                  style={{
                    display: "grid",
                    gridAutoFlow: "column",
                    gridTemplateRows: `repeat(${desktopIconLayout.maxRows}, ${desktopIconLayout.itemHeight}px)`,
                    gridAutoColumns: `${desktopIconLayout.itemWidth}px`,
                    maxHeight: `${viewport.height - TASKBAR_HEIGHT - 24}px`,
                    maxWidth: `${viewport.width - 24}px`,
                  }}
                >
                  {desktopItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => openDesktopItem(item)}
                      className="flex cursor-pointer flex-col items-center justify-start text-center"
                      style={{
                        width: `${desktopIconLayout.itemWidth}px`,
                        height: `${desktopIconLayout.itemHeight}px`,
                      }}
                    >
                      <div className="flex w-full justify-center py-2">
                        {item.icon}
                      </div>

                      <span className="max-w-full px-1 font-fixedsys text-[11px] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] sm:text-sm">
                        {item.title}
                      </span>
                    </button>
                  ))}
                </div>

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
                        <img src={xIcon} alt="Close window" />
                      </button>
                    </div>

                    <div className="h-[calc(100%-40px)] overflow-auto bg-[#c3c7cb] p-3 text-sm text-[#24415f] sm:h-[calc(100%-48px)] sm:p-5 sm:text-base">
                      {window.content}
                    </div>
                  </div>
                ))}

                <div className="absolute bottom-0 left-0 right-0 h-12 border-t border-[#dfdfdf] bg-[#c0c0c0] sm:h-14">
                  <div className="flex h-full items-center justify-between px-1.5 sm:px-2">
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
                        <span className="font-fixedsys font-bold text-lg">
                          Start
                        </span>
                      </button>

                      <div className="flex h-8 items-center justify-center gap-2 border-2 border-t-white border-l-white border-r-[#404040] border-b-[#404040] bg-[#c0c0c0] px-2 text-black sm:h-9 sm:px-3">
                        <img
                          src={computerIcon}
                          alt="Desktop icon"
                          className="h-6 w-6 shrink-0 object-contain"
                        />
                        <span className="font-fixedsys font-bold text-lg">
                          My Desktop
                        </span>
                      </div>
                    </div>

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
        </div>

        {appPhase !== "desktop" && (
          <div
            className={`absolute inset-0 z-[999] transition-all duration-[1200ms] ease-in-out ${
              appPhase === "transitioning"
                ? "pointer-events-none opacity-0 scale-[1.03] blur-[4px]"
                : "opacity-100 scale-100 blur-0"
            }`}
          >
            <LoadingScreen onComplete={handleLoadingComplete} />
          </div>
        )}
      </div>
      <Analytics />
    </>
  );
}

export default App;
