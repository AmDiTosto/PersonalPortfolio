import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import computerIcon from "./assets/desktopIcons/computer_explorer-5.svg";
import folderIcon from "./assets/desktopIcons/directory_open_file_mydocs-4.svg";
import emailIcon from "./assets/desktopIcons/outlook_express-4.svg";
import documentIcon from "./assets/desktopIcons/document-0.svg";
import terminalIcon from "./assets/desktopIcons/ms_dos_prompt.svg";
import windoesIcon from "./assets/desktopIcons/windows-0.svg";
import startupSound from "./assets/sounds/startSound.mp3";
import blackDuckSprite from "./assets/black_duck_strip.png";
import redDuckSprite from "./assets/red_duck_strip.png";
import blueDuckSprite from "./assets/blue_duck_strip.png";
import MyComputerPage from "./pages/MyComputer";
import Experience from "./pages/Experience";
import Projects from "./pages/Projects";
import Resume from "./pages/Resume";
import Contact from "./pages/Contact";
import SecretVideo from "./pages/SecretVideo";
import Terminal from "./pages/Terminal";
import DocumentsFolder from "./pages/DocumentsFolder";
import LoadingScreen from "./pages/LoadingScreen";
import gunshotSound from "./assets/sounds/gunshot.mp3";
import gameStartSound from "./assets/sounds/start.mp3";
import gameOverSound from "./assets/sounds/game-over.mp3";
import DuckHuntField from "./components/DuckHuntField";
import DuckHuntMetrics from "./components/DuckHuntMetrics";

const Leaderboard = lazy(() => import("./components/Leaderboard"));
import scopeCursorImage from "./assets/scope.png";

const WINDOW_ICON_SRC = {
  about: computerIcon,
  experience: folderIcon,
  projects: folderIcon,
  resume: documentIcon,
  contact: emailIcon,
  secret: folderIcon,
  terminal: terminalIcon,
  display: computerIcon,
  documents: folderIcon,
  leaderboard: folderIcon,
};

function windowIcon(id) {
  return WINDOW_ICON_SRC[id] ?? documentIcon;
}

function Notepad({ name, content, onSave, onClose, onDelete }) {
  const [text, setText] = useState(content);
  const [menuOpen, setMenuOpen] = useState(false);

  function save() {
    onSave(name, text);
  }

  function handleKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
      e.preventDefault();
      save();
    }
  }

  return (
    <div className="relative flex h-full flex-col bg-win-face">
      <div className="flex h-7 shrink-0 items-center border-b border-win-shadow px-1">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className={`px-2 py-0.5 font-ui text-sm ${
            menuOpen
              ? "bg-win-title text-win-title-text"
              : "text-win-text hover:bg-win-title hover:text-win-title-text"
          }`}
        >
          File
        </button>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        placeholder="Type here, then File > Save (or Ctrl+S)."
        className="win-sink min-h-0 flex-1 resize-none border-0 bg-white p-2 font-ui text-sm leading-relaxed text-black outline-none placeholder:text-win-muted"
      />

      {menuOpen ? (
        <>
          <div
            className="absolute inset-0 z-20"
            onClick={() => setMenuOpen(false)}
          />
          <div className="win-frame absolute left-1 top-7 z-30 w-48 bg-win-face py-1">
            <button
              type="button"
              onClick={() => {
                save();
                setMenuOpen(false);
              }}
              className="flex w-full items-center justify-between px-3 py-1 font-ui text-sm text-win-text hover:bg-win-title hover:text-win-title-text"
            >
              <span>Save</span>
              <span className="text-win-muted">Ctrl+S</span>
            </button>
            <button
              type="button"
              onClick={() => {
                save();
                onClose();
              }}
              className="flex w-full items-center px-3 py-1 font-ui text-sm text-win-text hover:bg-win-title hover:text-win-title-text"
            >
              Save &amp; Close
            </button>

            <div className="mx-2 my-1">
              <div className="h-px bg-win-shadow" />
              <div className="h-px bg-win-light" />
            </div>

            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onDelete(name);
              }}
              className="flex w-full items-center px-3 py-1 font-ui text-sm text-win-red hover:bg-win-red hover:text-white"
            >
              Delete
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex w-full items-center px-3 py-1 font-ui text-sm text-win-text hover:bg-win-title hover:text-win-title-text"
            >
              Close
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}

const DESKTOP_THEMES = [
  { id: "teal", name: "Teal (Default)", background: "#008080" },
  {
    id: "clouds",
    name: "Clouds",
    background:
      "linear-gradient(180deg, #5b9bd5 0%, #a9d0f5 55%, #d6ecff 100%)",
  },
  { id: "midnight", name: "Midnight", background: "#0a0a1c" },
  { id: "rainy-day", name: "Rainy Day", background: "#4d6b7a" },
  { id: "eggplant", name: "Eggplant", background: "#3f2a4d" },
  { id: "desert", name: "Desert", background: "#b39a63" },
  { id: "spruce", name: "Spruce", background: "#0b3d2e" },
  {
    id: "slate",
    name: "Slate",
    background:
      "repeating-linear-gradient(45deg, #2f3b40 0 10px, #374349 10px 20px)",
  },
  {
    id: "windows",
    name: "Windows",
    background: "linear-gradient(135deg, #000080 0%, #1084d0 100%)",
  },
];

function MonitorPreview({ background }) {
  return (
    <div className="flex flex-col items-center">
      <div className="win-raise bg-win-face p-1.5">
        <div
          className="win-sink relative overflow-hidden"
          style={{ width: 148, height: 104, background }}
        >
          <div className="absolute inset-x-0 bottom-0 flex h-3 items-center gap-1 bg-win-face px-1">
            <div className="win-raise h-2 w-5 bg-win-face" />
          </div>
        </div>
      </div>
      <div className="win-raise h-2 w-16 bg-win-face" />
      <div className="win-raise h-1.5 w-24 bg-win-face" />
    </div>
  );
}

function DisplayProperties({ themes, current, onApply, onClose }) {
  const [selected, setSelected] = useState(current);
  const selectedTheme =
    themes.find((theme) => theme.id === selected) ?? themes[0];

  return (
    <div className="flex h-full min-h-full flex-col bg-win-face p-4">
      <div className="flex justify-center pb-4">
        <MonitorPreview background={selectedTheme.background} />
      </div>

      <div className="mb-1 font-ui text-sm text-win-text">Wallpaper</div>

      <div className="win-sink min-h-0 flex-1 overflow-auto bg-white">
        {themes.map((theme) => {
          const active = theme.id === selected;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => setSelected(theme.id)}
              className={`flex w-full items-center gap-2 px-2 py-1 text-left font-ui text-sm ${
                active
                  ? "bg-win-title text-white"
                  : "text-win-text hover:bg-[#e8e8e8]"
              }`}
            >
              <span
                className="h-4 w-4 shrink-0 border border-win-shadow"
                style={{ background: theme.background }}
              />
              {theme.name}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            onApply(selected);
            onClose();
          }}
          className="win-btn min-w-[72px] px-4 py-1 font-ui text-sm font-bold text-black active:win-pressed"
        >
          OK
        </button>
        <button
          type="button"
          onClick={onClose}
          className="win-btn min-w-[72px] px-4 py-1 font-ui text-sm text-black active:win-pressed"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onApply(selected)}
          className="win-btn min-w-[72px] px-4 py-1 font-ui text-sm text-black active:win-pressed"
        >
          Apply
        </button>
      </div>
    </div>
  );
}

function nowMs() {
  return Date.now();
}

function App() {
  const scopeCursor = `url(${scopeCursorImage}) 32 32, crosshair`;

  const TASKBAR_HEIGHT = 56;
  const MOBILE_BREAKPOINT = 768;

  const MAX_MISSES = 5;
  const GAME_IDLE_MS = 15000;
  const MAX_ACTIVE_BIRDS = 6;

  const BIRD_TYPES = [
    {
      type: "black",
      sprite: blackDuckSprite,
      points: 100,
      weight: 0.65,
    },
    {
      type: "red",
      sprite: redDuckSprite,
      points: 250,
      weight: 0.25,
    },
    {
      type: "blue",
      sprite: blueDuckSprite,
      points: 500,
      weight: 0.1,
    },
  ];

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function getViewportSize() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  function getPageIsActive() {
    if (typeof document === "undefined") return true;
    return !document.hidden && document.hasFocus();
  }

  function getTopSafeArea() {
    return 12;
  }

  function pickRandomBirdType() {
    const roll = Math.random();
    let runningTotal = 0;

    for (const birdType of BIRD_TYPES) {
      runningTotal += birdType.weight;
      if (roll <= runningTotal) {
        return birdType;
      }
    }

    return BIRD_TYPES[0];
  }

  function getResponsiveWindowSize(viewportWidth, viewportHeight) {
    const maxAllowedWidth = Math.max(220, viewportWidth - 24);
    const maxAllowedHeight = Math.max(
      200,
      viewportHeight - TASKBAR_HEIGHT - 24,
    );

    let targetWidth = 700;
    let targetHeight = 500;

    if (viewportWidth < 1024) {
      targetWidth = Math.min(560, viewportWidth - 48);
      targetHeight = Math.min(420, viewportHeight - TASKBAR_HEIGHT - 36);
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
    viewportHeight,
  ) {
    const minX = 12;
    const minY = getTopSafeArea();

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
      : getViewportSize(),
  );

  const [pageIsActive, setPageIsActive] = useState(() =>
    typeof document === "undefined" ? true : getPageIsActive(),
  );

  const isMobile = viewport.width < MOBILE_BREAKPOINT;

  const [currentTime, setCurrentTime] = useState(new Date());
  const [appPhase, setAppPhase] = useState("loading");
  const [mobileActiveApp, setMobileActiveApp] = useState(null);
  const [docs, setDocs] = useState({});
  const [desktopTheme, setDesktopTheme] = useState("teal");
  const [contextMenu, setContextMenu] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [resizing, setResizing] = useState(null);
  const [birds, setBirds] = useState([]);
  const [pointPopups, setPointPopups] = useState([]);
  const [gameActive, setGameActive] = useState(false);
  const [gameOverVisible, setGameOverVisible] = useState(false);
  const [leaderboardScore, setLeaderboardScore] = useState(null);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [idleMsLeft, setIdleMsLeft] = useState(GAME_IDLE_MS);
  const [flashMode, setFlashMode] = useState("none");
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [firstBirdHintVisible, setFirstBirdHintVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const zCounter = useRef(10);
  const openOffset = useRef(0);
  const desktopRef = useRef(null);
  const birdsRef = useRef([]);
  const duckHintShownRef = useRef(false);
  const duckHintTimeoutRef = useRef(null);
  const longPressTimerRef = useRef(null);

  const gunshotAudioRef = useRef(null);
  const gameStartAudioRef = useRef(null);
  const gameOverAudioRef = useRef(null);
  const audioRef = useRef(null);

  const transitionTimeoutRef = useRef(null);
  const birdSpawnTimeoutRef = useRef(null);
  const secondaryBirdSpawnTimeoutRef = useRef(null);
  const gameTimeoutRef = useRef(null);
  const flashTimeoutRef = useRef(null);
  const gameOverHudFallbackTimeoutRef = useRef(null);
  const idleCountdownIntervalRef = useRef(null);

  const hasPlayedStartupAudioRef = useRef(false);
  const hasStartedTransitionRef = useRef(false);

  const gameActiveRef = useRef(false);
  const scoreRef = useRef(0);
  const missesRef = useRef(0);
  const reducedMotionRef = useRef(false);
  const pageIsActiveRef = useRef(pageIsActive);
  const gameOverVisibleRef = useRef(false);
  const idleDeadlineRef = useRef(0);

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
      id: "terminal",
      type: "window",
      title: "Terminal",
      icon: (
        <img
          src={terminalIcon}
          alt="Terminal"
          className="h-12 w-12 object-contain"
          draggable="false"
        />
      ),
      content: (
        <Terminal
          onLaunch={launchApp}
          onClose={closeTerminal}
          onOpenDoc={openDoc}
          docs={docs}
          onSaveDoc={saveDoc}
          onDeleteDoc={deleteDoc}
        />
      ),
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
      type: "window",
      title: "Adrian SECRET Folder",
      icon: (
        <img
          src={folderIcon}
          alt="Secret"
          className="h-12 w-12 object-contain"
          draggable="false"
        />
      ),
      content: <SecretVideo />,
    },
    {
      id: "documents",
      type: "window",
      title: "My Documents",
      icon: (
        <img
          src={folderIcon}
          alt="My Documents"
          className="h-12 w-12 object-contain"
          draggable="false"
        />
      ),
      content: (
        <DocumentsFolder
          docs={docs}
          onOpenDoc={openDoc}
          onDelete={deleteDoc}
          onCreate={createDoc}
          onRename={renameDoc}
        />
      ),
    },
    {
      id: "leaderboard",
      type: "window",
      title: "Leaderboard",
      icon: (
        <img
          src={folderIcon}
          alt="Leaderboard"
          className="h-12 w-12 object-contain"
          draggable="false"
        />
      ),
      content: (
        <Suspense
          fallback={
            <div className="p-4 font-ui text-sm text-win-muted">Loading…</div>
          }
        >
          <Leaderboard variant="panel" />
        </Suspense>
      ),
    },
  ];

  const desktopItemMap = Object.fromEntries(
    desktopItems
      .filter((item) => item.type === "window")
      .map((item) => [item.id, item]),
  );

  function getInitialWindows() {
    if (typeof window === "undefined") return [];
    if (window.innerWidth < MOBILE_BREAKPOINT) return [];
    if (!desktopItemMap.about) return [];

    const size = getResponsiveWindowSize(window.innerWidth, window.innerHeight);
    const position = clampWindowPosition(
      150,
      getTopSafeArea(),
      size.width,
      size.height,
      window.innerWidth,
      window.innerHeight,
    );

    return [
      {
        id: desktopItemMap.about.id,
        title: desktopItemMap.about.title,
        content: desktopItemMap.about.content,
        width: size.width,
        height: size.height,
        x: position.x,
        y: position.y,
        z: 11,
        minimized: false,
        maximized: false,
        restoreRect: null,
      },
    ];
  }

  const [openWindows, setOpenWindows] = useState(getInitialWindows);

  function getNextZ() {
    zCounter.current += 1;
    return zCounter.current;
  }

  function bringToFront(id) {
    const nextZ = getNextZ();

    setOpenWindows((prev) =>
      prev.map((window) =>
        window.id === id ? { ...window, z: nextZ } : window,
      ),
    );
  }

  function getDesktopIconLayout(viewportWidth, viewportHeight) {
    const topOffset = 12;
    const bottomOffset = 12;
    const usableHeight =
      viewportHeight - TASKBAR_HEIGHT - topOffset - bottomOffset;

    const itemHeight = 108;
    const itemWidth = 112;

    const maxRows = Math.max(1, Math.floor(usableHeight / itemHeight));

    return {
      itemHeight,
      itemWidth,
      maxRows,
    };
  }

  function openDesktopItem(item) {
    if (gameActiveRef.current && item.type === "window") {
      return;
    }

    if (item.type !== "window") return;

    if (isMobile) {
      setMobileActiveApp(item.id);
      return;
    }

    const size = getResponsiveWindowSize(viewport.width, viewport.height);

    setOpenWindows((prev) => {
      const existing = prev.find((window) => window.id === item.id);

      if (existing) {
        const nextZ = getNextZ();
        return prev.map((window) =>
          window.id === item.id
            ? { ...window, z: nextZ, minimized: false }
            : window,
        );
      }

      const offset = openOffset.current * 28;
      openOffset.current = (openOffset.current + 1) % 6;

      const initialPosition = clampWindowPosition(
        150 + offset,
        getTopSafeArea() + offset,
        size.width,
        size.height,
        viewport.width,
        viewport.height,
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
          minimized: false,
          maximized: false,
          restoreRect: null,
        },
      ];
    });
  }

  function closeWindow(id) {
    setOpenWindows((prev) => prev.filter((window) => window.id !== id));
  }

  function getMaximizedRect() {
    return {
      x: 0,
      y: 0,
      width: viewport.width,
      height: Math.max(200, viewport.height - TASKBAR_HEIGHT),
    };
  }

  function minimizeWindow(id) {
    setOpenWindows((prev) =>
      prev.map((window) =>
        window.id === id ? { ...window, minimized: true } : window,
      ),
    );
  }

  function toggleMaximizeWindow(id) {
    setOpenWindows((prev) =>
      prev.map((window) => {
        if (window.id !== id) return window;

        if (window.maximized) {
          const restore = window.restoreRect ?? {
            x: window.x,
            y: window.y,
            width: window.width,
            height: window.height,
          };

          return {
            ...window,
            maximized: false,
            restoreRect: null,
            ...restore,
          };
        }

        const maxRect = getMaximizedRect();

        return {
          ...window,
          maximized: true,
          restoreRect: {
            x: window.x,
            y: window.y,
            width: window.width,
            height: window.height,
          },
          ...maxRect,
        };
      }),
    );
  }

  function getTopWindowId() {
    let topId = null;
    let topZ = -Infinity;

    for (const window of openWindows) {
      if (window.minimized) continue;
      if (window.z > topZ) {
        topZ = window.z;
        topId = window.id;
      }
    }

    return topId;
  }

  function handleTaskbarWindowClick(id) {
    const target = openWindows.find((window) => window.id === id);
    if (!target) return;

    if (target.minimized) {
      const nextZ = getNextZ();
      setOpenWindows((prev) =>
        prev.map((window) =>
          window.id === id ? { ...window, minimized: false, z: nextZ } : window,
        ),
      );
      return;
    }

    if (getTopWindowId() === id) {
      minimizeWindow(id);
      return;
    }

    bringToFront(id);
  }

  function openStartMenuItem(item) {
    setStartMenuOpen(false);
    openDesktopItem(item);
  }

  function launchApp(id) {
    const item = desktopItemMap[id];
    if (item) openDesktopItem(item);
  }

  function closeTerminal() {
    closeWindow("terminal");
    setMobileActiveApp((current) => (current === "terminal" ? null : current));
  }

  function saveDoc(name, content) {
    setDocs((prev) => ({ ...prev, [name]: content }));
  }

  function deleteDoc(name) {
    setDocs((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });

    closeWindow(`doc:${name}`);
    setMobileActiveApp((current) =>
      current === `doc:${name}` ? null : current,
    );
  }

  function createDoc(rawName) {
    const trimmed = rawName.trim().toLowerCase();
    if (!trimmed) return;

    const name = trimmed.includes(".") ? trimmed : `${trimmed}.txt`;
    setDocs((prev) => (name in prev ? prev : { ...prev, [name]: "" }));
  }

  function renameDoc(oldName, rawNewName) {
    const trimmed = rawNewName.trim().toLowerCase();
    if (!trimmed) return;

    const newName = trimmed.includes(".") ? trimmed : `${trimmed}.txt`;
    if (newName === oldName) return;

    setDocs((prev) => {
      if (!(oldName in prev) || newName in prev) return prev;
      const next = {};
      for (const key of Object.keys(prev)) {
        next[key === oldName ? newName : key] = prev[key];
      }
      return next;
    });

    setOpenWindows((prev) =>
      prev.map((window) =>
        window.id === `doc:${oldName}`
          ? { ...window, id: `doc:${newName}`, title: newName }
          : window,
      ),
    );
    setMobileActiveApp((current) =>
      current === `doc:${oldName}` ? `doc:${newName}` : current,
    );
  }

  function openDoc(name) {
    if (gameActiveRef.current) return;

    if (isMobile) {
      setMobileActiveApp(`doc:${name}`);
      return;
    }

    const id = `doc:${name}`;
    const size = getResponsiveWindowSize(viewport.width, viewport.height);

    setOpenWindows((prev) => {
      const existing = prev.find((window) => window.id === id);

      if (existing) {
        const nextZ = getNextZ();
        return prev.map((window) =>
          window.id === id ? { ...window, z: nextZ, minimized: false } : window,
        );
      }

      const offset = openOffset.current * 28;
      openOffset.current = (openOffset.current + 1) % 6;

      const position = clampWindowPosition(
        150 + offset,
        getTopSafeArea() + offset,
        size.width,
        size.height,
        viewport.width,
        viewport.height,
      );

      return [
        ...prev,
        {
          id,
          title: name,
          content: null,
          width: size.width,
          height: size.height,
          x: position.x,
          y: position.y,
          z: getNextZ(),
          minimized: false,
          maximized: false,
          restoreRect: null,
        },
      ];
    });
  }

  function openDisplayProperties() {
    setContextMenu(null);

    if (gameActiveRef.current) return;

    if (isMobile) {
      setMobileActiveApp("display");
      return;
    }

    const id = "display";
    const width = Math.min(420, Math.max(300, viewport.width - 24));
    const height = Math.min(
      470,
      Math.max(320, viewport.height - TASKBAR_HEIGHT - 24),
    );

    setOpenWindows((prev) => {
      const existing = prev.find((window) => window.id === id);

      if (existing) {
        const nextZ = getNextZ();
        return prev.map((window) =>
          window.id === id ? { ...window, z: nextZ, minimized: false } : window,
        );
      }

      const offset = openOffset.current * 28;
      openOffset.current = (openOffset.current + 1) % 6;

      const position = clampWindowPosition(
        180 + offset,
        getTopSafeArea() + offset,
        width,
        height,
        viewport.width,
        viewport.height,
      );

      return [
        ...prev,
        {
          id,
          title: "Display Properties",
          content: null,
          width,
          height,
          x: position.x,
          y: position.y,
          z: getNextZ(),
          minimized: false,
          maximized: false,
          restoreRect: null,
        },
      ];
    });
  }

  function closeDisplayProperties() {
    closeWindow("display");
    setMobileActiveApp((current) => (current === "display" ? null : current));
  }

  function handleDesktopContextMenu(e) {
    if (isMobile) return;

    e.preventDefault();

    if (
      e.target.closest(".win-frame") ||
      e.target.closest(".aero-taskbar") ||
      gameActiveRef.current
    ) {
      return;
    }

    const menuWidth = 176;
    const menuHeight = 88;

    setContextMenu({
      x: Math.min(e.clientX, viewport.width - menuWidth - 8),
      y: Math.min(e.clientY, viewport.height - TASKBAR_HEIGHT - menuHeight - 8),
    });
  }

  function clearLongPress() {
    if (longPressTimerRef.current) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }

  function handleHomeTouchStart(e) {
    if (mobileActiveApp) return;
    if (e.target.closest("button")) return;

    clearLongPress();
    longPressTimerRef.current = window.setTimeout(() => {
      openDisplayProperties();
    }, 500);
  }

  function playClonedAudio(audioTargetRef, volume = 1) {
    const audio = audioTargetRef.current;
    if (!audio) return;

    try {
      const instance = audio.cloneNode();
      instance.volume = volume;
      instance.play().catch(() => {});
    } catch (error) {
      console.error("Audio could not play:", error);
    }
  }

  function playGunshot() {
    playClonedAudio(gunshotAudioRef, 0.8);
  }

  function playGameStart() {
    playClonedAudio(gameStartAudioRef, 0.9);
  }

  function clearBirdSpawnTimer() {
    if (birdSpawnTimeoutRef.current) {
      window.clearTimeout(birdSpawnTimeoutRef.current);
      birdSpawnTimeoutRef.current = null;
    }
  }

  function clearSecondaryBirdSpawnTimer() {
    if (secondaryBirdSpawnTimeoutRef.current) {
      window.clearTimeout(secondaryBirdSpawnTimeoutRef.current);
      secondaryBirdSpawnTimeoutRef.current = null;
    }
  }

  function clearGameTimeout() {
    if (gameTimeoutRef.current) {
      window.clearTimeout(gameTimeoutRef.current);
      gameTimeoutRef.current = null;
    }
  }

  function clearFlashTimer() {
    if (flashTimeoutRef.current) {
      window.clearTimeout(flashTimeoutRef.current);
      flashTimeoutRef.current = null;
    }
  }

  function clearIdleCountdownInterval() {
    if (idleCountdownIntervalRef.current) {
      window.clearInterval(idleCountdownIntervalRef.current);
      idleCountdownIntervalRef.current = null;
    }
  }

  function stopGameOverAudio() {
    const audio = gameOverAudioRef.current;
    if (!audio) return;

    audio.onended = null;
    audio.pause();
    audio.currentTime = 0;
  }

  function removePointPopup(id) {
    setPointPopups((prev) => prev.filter((popup) => popup.id !== id));
  }

  function startIdleCountdownInterval() {
    clearIdleCountdownInterval();

    idleCountdownIntervalRef.current = window.setInterval(() => {
      if (!gameActiveRef.current) return;

      const remaining = Math.max(0, idleDeadlineRef.current - Date.now());
      setIdleMsLeft(remaining);

      if (remaining <= 0) {
        clearIdleCountdownInterval();
      }
    }, 50);
  }

  function clearGameOverHold() {
    if (gameOverHudFallbackTimeoutRef.current) {
      window.clearTimeout(gameOverHudFallbackTimeoutRef.current);
      gameOverHudFallbackTimeoutRef.current = null;
    }

    stopGameOverAudio();
  }

  function syncGameState(nextScore, nextMisses) {
    scoreRef.current = nextScore;
    missesRef.current = nextMisses;

    setScore(nextScore);
    setMisses(nextMisses);
  }

  function hideGameOverHudAndReset() {
    clearGameOverHold();
    clearIdleCountdownInterval();
    gameOverVisibleRef.current = false;
    setGameOverVisible(false);
    setIdleMsLeft(GAME_IDLE_MS);
    setPointPopups([]);
    syncGameState(0, 0);
  }

  function playGameOverSound() {
    const audio = gameOverAudioRef.current;
    if (!audio) return;

    try {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = 0.9;
      audio.onended = null;
      const maybePromise = audio.play();
      if (maybePromise && typeof maybePromise.catch === "function") {
        maybePromise.catch(() => {});
      }
    } catch (error) {
      console.error("Game over audio could not play:", error);
    }
  }

  function playGameOverAndHoldHud() {
    const audio = gameOverAudioRef.current;
    gameOverVisibleRef.current = true;
    setGameOverVisible(true);

    if (!audio) {
      gameOverHudFallbackTimeoutRef.current = window.setTimeout(() => {
        hideGameOverHudAndReset();
      }, 1800);
      return;
    }

    clearGameOverHold();

    try {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = 0.9;

      audio.onended = () => {
        hideGameOverHudAndReset();
      };

      const maybePromise = audio.play();

      if (maybePromise && typeof maybePromise.catch === "function") {
        maybePromise.catch(() => {
          gameOverHudFallbackTimeoutRef.current = window.setTimeout(() => {
            hideGameOverHudAndReset();
          }, 1800);
        });
      }

      const fallbackMs =
        Number.isFinite(audio.duration) && audio.duration > 0
          ? Math.ceil(audio.duration * 1000) + 250
          : 2500;

      gameOverHudFallbackTimeoutRef.current = window.setTimeout(() => {
        hideGameOverHudAndReset();
      }, fallbackMs);
    } catch (error) {
      console.error("Game over audio could not play:", error);
      gameOverHudFallbackTimeoutRef.current = window.setTimeout(() => {
        hideGameOverHudAndReset();
      }, 1800);
    }
  }

  function triggerFlash(mode, duration) {
    if (reducedMotionRef.current) return;

    clearFlashTimer();
    setFlashMode(mode);

    flashTimeoutRef.current = window.setTimeout(() => {
      setFlashMode("none");
    }, duration);
  }

  function resetGameSessionTimeout() {
    clearGameTimeout();

    idleDeadlineRef.current = nowMs() + GAME_IDLE_MS;
    setIdleMsLeft(GAME_IDLE_MS);
    startIdleCountdownInterval();

    gameTimeoutRef.current = window.setTimeout(() => {
      endGame();
    }, GAME_IDLE_MS);
  }

  function startGameSession() {
    clearGameOverHold();
    clearSecondaryBirdSpawnTimer();
    gameOverVisibleRef.current = false;
    setGameOverVisible(false);
    setOpenWindows([]);
    setMobileActiveApp(null);
    setPointPopups([]);

    gameActiveRef.current = true;
    setGameActive(true);
    setFirstBirdHintVisible(false);
    if (duckHintTimeoutRef.current) {
      window.clearTimeout(duckHintTimeoutRef.current);
      duckHintTimeoutRef.current = null;
    }
    setIdleMsLeft(GAME_IDLE_MS);
    syncGameState(0, 0);
    playGameStart();
    triggerFlash("start", 180);
    resetGameSessionTimeout();
  }

  function maybeShowDuckHint() {
    if (duckHintShownRef.current) return;
    if (gameActiveRef.current) return;

    duckHintShownRef.current = true;
    setFirstBirdHintVisible(true);

    duckHintTimeoutRef.current = window.setTimeout(() => {
      setFirstBirdHintVisible(false);
      duckHintTimeoutRef.current = null;
    }, 4500);
  }

  function endGame() {
    if (!gameActiveRef.current) return;

    gameActiveRef.current = false;
    gameOverVisibleRef.current = true;
    setGameActive(false);
    clearGameTimeout();
    clearBirdSpawnTimer();
    clearSecondaryBirdSpawnTimer();
    clearIdleCountdownInterval();
    setIdleMsLeft(GAME_IDLE_MS);
    setBirds([]);
    setPointPopups([]);
    birdsRef.current = [];
    triggerFlash("end", 240);

    const finalScore = scoreRef.current;
    if (finalScore > 0) {
      setGameOverVisible(true);
      playGameOverSound();
      setLeaderboardScore(finalScore);
    } else {
      playGameOverAndHoldHud();
    }
  }

  function closeLeaderboard() {
    setLeaderboardScore(null);
    hideGameOverHudAndReset();
  }

  function playAgainFromLeaderboard() {
    setLeaderboardScore(null);
    hideGameOverHudAndReset();
    startGameSession();
  }

  function registerHit(points) {
    const nextScore = scoreRef.current + points;
    syncGameState(nextScore, missesRef.current);
    resetGameSessionTimeout();
  }

  function registerMiss() {
    if (!gameActiveRef.current) return;

    const nextMisses = missesRef.current + 1;
    syncGameState(scoreRef.current, nextMisses);

    triggerFlash("miss", 170);

    if (nextMisses >= MAX_MISSES) {
      endGame();
      return;
    }

    resetGameSessionTimeout();
  }

  function getNextBirdDelay() {
    if (gameActiveRef.current) {
      return 650 + Math.random() * 700;
    }

    return 12000 + Math.random() * 4000;
  }

  function startDragging(e, id) {
    if (isMobile) return;

    e.preventDefault();

    const currentWindow = openWindows.find((window) => window.id === id);
    if (!currentWindow) return;
    if (currentWindow.maximized) return;

    bringToFront(id);

    setDragging({
      id,
      offsetX: e.clientX - currentWindow.x,
      offsetY: e.clientY - currentWindow.y,
    });
  }

  function startResizing(e, id) {
    if (isMobile) return;

    e.preventDefault();
    e.stopPropagation();

    const currentWindow = openWindows.find((window) => window.id === id);
    if (!currentWindow) return;
    if (currentWindow.maximized) return;

    bringToFront(id);

    setResizing({
      id,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startWidth: currentWindow.width,
      startHeight: currentWindow.height,
      winX: currentWindow.x,
      winY: currentWindow.y,
    });
  }

  function handleBirdAnimationEnd(id, e) {
    if (e.target !== e.currentTarget) return;

    let escapedUnshot = false;

    setBirds((prev) => {
      const bird = prev.find((item) => item.id === id);
      escapedUnshot = Boolean(bird && !bird.shot);
      return prev.filter((item) => item.id !== id);
    });

    if (escapedUnshot) {
      registerMiss();
    }
  }

  function spawnBird() {
    if (!pageIsActiveRef.current) return;
    if (gameOverVisibleRef.current) return;
    if (birdsRef.current.length >= MAX_ACTIVE_BIRDS) return;

    const birdType = pickRandomBirdType();
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const size = 72 + Math.floor(Math.random() * 24);

    const minTop = 96;
    const maxTop = Math.max(
      minTop,
      viewport.height - TASKBAR_HEIGHT - size - 24,
    );

    const top = Math.floor(Math.random() * (maxTop - minTop + 1)) + minTop;

    let duration = gameActiveRef.current
      ? 4 + Math.random() * 1.8
      : 6.5 + Math.random() * 3;

    if (birdType.type === "red") duration -= 0.35;
    if (birdType.type === "blue") duration -= 0.65;

    const fromRight = Math.random() < 0.5;

    setBirds((prev) => [
      ...prev,
      {
        id,
        top,
        size,
        duration: Math.max(2.8, duration),
        fromRight,
        shot: false,
        frozenX: 0,
        frozenY: 0,
        birdType: birdType.type,
        sprite: birdType.sprite,
        points: birdType.points,
      },
    ]);

    maybeShowDuckHint();
  }

  function shootBird(id, e) {
    e.stopPropagation();

    const birdRect = e.currentTarget.getBoundingClientRect();
    const desktopRect = desktopRef.current?.getBoundingClientRect() ?? {
      left: 0,
      top: 0,
    };

    let shotBirdPoints = 0;
    let didShoot = false;

    setBirds((prev) =>
      prev.map((bird) => {
        if (bird.id !== id || bird.shot) return bird;

        didShoot = true;
        shotBirdPoints = bird.points;

        return {
          ...bird,
          shot: true,
          frozenX: birdRect.left - desktopRect.left,
          frozenY: birdRect.top - desktopRect.top,
        };
      }),
    );

    if (!didShoot) return;

    const popupId = `${id}-points`;

    setPointPopups((prev) => [
      ...prev,
      {
        id: popupId,
        x: birdRect.right - desktopRect.left + 8,
        y: birdRect.top - desktopRect.top + 6,
        points: shotBirdPoints,
      },
    ]);

    playGunshot();

    if (!gameActiveRef.current) {
      startGameSession();
    }

    registerHit(shotBirdPoints);
  }

  function handleDesktopClick() {
    if (!gameActiveRef.current) return;
    if (!pageIsActiveRef.current) return;

    playGunshot();
    registerMiss();
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
    viewport.height,
  );

  const topWindowId = getTopWindowId();

  const currentTheme =
    DESKTOP_THEMES.find((theme) => theme.id === desktopTheme) ??
    DESKTOP_THEMES[0];

  const desktopGameCursor =
    !isMobile && appPhase === "desktop" && gameActive && !gameOverVisible
      ? scopeCursor
      : "default";

  const birdCursor =
    !isMobile && appPhase === "desktop" && !gameOverVisible
      ? scopeCursor
      : "pointer";

  useEffect(() => {
    birdsRef.current = birds;
  }, [birds]);

  useEffect(() => {
    const audio = new Audio(startupSound);
    audio.preload = "auto";
    audio.volume = 1;
    audioRef.current = audio;

    const gunshot = new Audio(gunshotSound);
    gunshot.preload = "auto";
    gunshot.volume = 0.8;
    gunshotAudioRef.current = gunshot;

    const start = new Audio(gameStartSound);
    start.preload = "auto";
    start.volume = 0.9;
    gameStartAudioRef.current = start;

    const over = new Audio(gameOverSound);
    over.preload = "auto";
    over.volume = 0.9;
    gameOverAudioRef.current = over;

    return () => {
      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current);
      }

      clearBirdSpawnTimer();
      clearSecondaryBirdSpawnTimer();
      clearGameTimeout();
      clearFlashTimer();
      clearGameOverHold();
      clearIdleCountdownInterval();

      if (duckHintTimeoutRef.current) {
        window.clearTimeout(duckHintTimeoutRef.current);
        duckHintTimeoutRef.current = null;
      }

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      if (gunshotAudioRef.current) {
        gunshotAudioRef.current.pause();
        gunshotAudioRef.current = null;
      }

      if (gameStartAudioRef.current) {
        gameStartAudioRef.current.pause();
        gameStartAudioRef.current = null;
      }

      if (gameOverAudioRef.current) {
        gameOverAudioRef.current.pause();
        gameOverAudioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    pageIsActiveRef.current = pageIsActive;
  }, [pageIsActive]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const query = window.matchMedia("(prefers-reduced-motion: reduce)");

    function updateReducedMotion() {
      reducedMotionRef.current = query.matches;
      setReducedMotion(query.matches);
    }

    updateReducedMotion();
    query.addEventListener("change", updateReducedMotion);

    return () => query.removeEventListener("change", updateReducedMotion);
  }, []);

  useEffect(() => {
    gameOverVisibleRef.current = gameOverVisible;
  }, [gameOverVisible]);

  useEffect(() => {
    function updatePageActivity() {
      setPageIsActive(getPageIsActive());
    }

    updatePageActivity();

    window.addEventListener("focus", updatePageActivity);
    window.addEventListener("blur", updatePageActivity);
    document.addEventListener("visibilitychange", updatePageActivity);

    return () => {
      window.removeEventListener("focus", updatePageActivity);
      window.removeEventListener("blur", updatePageActivity);
      document.removeEventListener("visibilitychange", updatePageActivity);
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
      const nextViewport = getViewportSize();
      setViewport(nextViewport);

      if (nextViewport.width < MOBILE_BREAKPOINT) {
        setDragging(null);
        return;
      }

      const nextSize = getResponsiveWindowSize(
        nextViewport.width,
        nextViewport.height,
      );

      setOpenWindows((prev) =>
        prev.map((window) => {
          if (window.maximized) {
            return {
              ...window,
              x: 0,
              y: 0,
              width: nextViewport.width,
              height: Math.max(200, nextViewport.height - TASKBAR_HEIGHT),
            };
          }

          const nextPosition = clampWindowPosition(
            window.x,
            window.y,
            nextSize.width,
            nextSize.height,
            nextViewport.width,
            nextViewport.height,
          );

          return {
            ...window,
            width: nextSize.width,
            height: nextSize.height,
            x: nextPosition.x,
            y: nextPosition.y,
          };
        }),
      );
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    function handleMouseMove(e) {
      if (!dragging || isMobile) return;

      const activeWindow = openWindows.find(
        (window) => window.id === dragging.id,
      );

      if (!activeWindow) return;

      const nextPosition = clampWindowPosition(
        e.clientX - dragging.offsetX,
        e.clientY - dragging.offsetY,
        activeWindow.width,
        activeWindow.height,
        viewport.width,
        viewport.height,
      );

      setOpenWindows((prev) =>
        prev.map((window) =>
          window.id === dragging.id
            ? { ...window, x: nextPosition.x, y: nextPosition.y }
            : window,
        ),
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
  }, [dragging, openWindows, viewport, isMobile]);

  useEffect(() => {
    if (!resizing || isMobile) return;

    const MIN_WIDTH = 320;
    const MIN_HEIGHT = 220;

    function handleResizeMove(e) {
      const maxWidth = Math.max(MIN_WIDTH, viewport.width - resizing.winX - 12);
      const maxHeight = Math.max(
        MIN_HEIGHT,
        viewport.height - TASKBAR_HEIGHT - resizing.winY - 12,
      );

      const nextWidth = clamp(
        resizing.startWidth + (e.clientX - resizing.startMouseX),
        MIN_WIDTH,
        maxWidth,
      );
      const nextHeight = clamp(
        resizing.startHeight + (e.clientY - resizing.startMouseY),
        MIN_HEIGHT,
        maxHeight,
      );

      setOpenWindows((prev) =>
        prev.map((window) =>
          window.id === resizing.id
            ? { ...window, width: nextWidth, height: nextHeight }
            : window,
        ),
      );
    }

    function handleResizeUp() {
      setResizing(null);
    }

    window.addEventListener("mousemove", handleResizeMove);
    window.addEventListener("mouseup", handleResizeUp);

    return () => {
      window.removeEventListener("mousemove", handleResizeMove);
      window.removeEventListener("mouseup", handleResizeUp);
    };
  }, [resizing, viewport, isMobile]);

  useEffect(() => {
    zCounter.current = openWindows.reduce(
      (max, window) => Math.max(max, window.z),
      10,
    );
  }, [openWindows]);

  useEffect(() => {
    clearBirdSpawnTimer();
    clearSecondaryBirdSpawnTimer();

    if (appPhase !== "desktop" || isMobile || reducedMotion) {
      setBirds([]);
      setPointPopups([]);
      birdsRef.current = [];
      gameActiveRef.current = false;
      setGameActive(false);
      gameOverVisibleRef.current = false;
      setGameOverVisible(false);
      setLeaderboardScore(null);
      setIdleMsLeft(GAME_IDLE_MS);
      syncGameState(0, 0);
      clearGameTimeout();
      clearFlashTimer();
      clearGameOverHold();
      clearIdleCountdownInterval();
      setFlashMode("none");
      return;
    }

    if (!pageIsActive) {
      clearBirdSpawnTimer();
      clearSecondaryBirdSpawnTimer();
      clearGameTimeout();
      clearIdleCountdownInterval();
      setIdleMsLeft(GAME_IDLE_MS);
      setBirds([]);
      setPointPopups([]);
      birdsRef.current = [];
      return;
    }

    if (gameOverVisible) {
      clearBirdSpawnTimer();
      clearSecondaryBirdSpawnTimer();
      clearIdleCountdownInterval();
      setIdleMsLeft(GAME_IDLE_MS);
      setBirds([]);
      setPointPopups([]);
      birdsRef.current = [];
      return;
    }

    if (gameActiveRef.current) {
      resetGameSessionTimeout();
    }

    function scheduleNextBird() {
      birdSpawnTimeoutRef.current = window.setTimeout(() => {
        if (!pageIsActiveRef.current) return;
        if (gameOverVisibleRef.current) return;

        spawnBird();

        if (
          gameActiveRef.current &&
          !gameOverVisibleRef.current &&
          Math.random() < 0.35
        ) {
          clearSecondaryBirdSpawnTimer();

          secondaryBirdSpawnTimeoutRef.current = window.setTimeout(
            () => {
              if (!pageIsActiveRef.current) return;
              if (gameOverVisibleRef.current) return;

              spawnBird();
            },
            180 + Math.random() * 240,
          );
        }

        if (!gameOverVisibleRef.current && pageIsActiveRef.current) {
          scheduleNextBird();
        }
      }, getNextBirdDelay());
    }

    scheduleNextBird();

    return () => {
      clearBirdSpawnTimer();
      clearSecondaryBirdSpawnTimer();
    };
  }, [
    appPhase,
    isMobile,
    viewport.height,
    gameActive,
    pageIsActive,
    gameOverVisible,
    reducedMotion,
  ]);

  function handleLoadingComplete() {
    if (hasStartedTransitionRef.current) return;

    hasStartedTransitionRef.current = true;

    void playStartupSound();

    setAppPhase("transitioning");

    transitionTimeoutRef.current = window.setTimeout(() => {
      setAppPhase("desktop");
    }, 1200);
  }

  let mobileActiveItem = null;
  if (mobileActiveApp) {
    if (mobileActiveApp.startsWith("doc:")) {
      const docName = mobileActiveApp.slice(4);
      mobileActiveItem = {
        id: mobileActiveApp,
        title: docName,
        content: (
          <Notepad
            name={docName}
            content={docs[docName] ?? ""}
            onSave={saveDoc}
            onClose={() => setMobileActiveApp(null)}
            onDelete={deleteDoc}
          />
        ),
      };
    } else if (mobileActiveApp === "display") {
      mobileActiveItem = {
        id: "display",
        title: "Display Properties",
        content: (
          <DisplayProperties
            themes={DESKTOP_THEMES}
            current={desktopTheme}
            onApply={setDesktopTheme}
            onClose={closeDisplayProperties}
          />
        ),
      };
    } else {
      mobileActiveItem = desktopItemMap[mobileActiveApp];
    }
  }

  const showDesktopHud = gameActive || gameOverVisible;

  return (
    <>
      <div className="relative min-h-[100svh] w-full overflow-hidden bg-black">
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
            className="min-h-[100svh] w-full overflow-hidden bg-desktop"
            style={{ background: currentTheme.background }}
          >
            <div
              ref={desktopRef}
              onClick={handleDesktopClick}
              onContextMenu={handleDesktopContextMenu}
              className="relative w-full select-none"
              style={{
                height: "100dvh",
                minHeight: "100svh",
                cursor: desktopGameCursor,
              }}
            >
              {!isMobile ? (
                <div
                  className={`pointer-events-none absolute inset-0 z-[35] transition-opacity duration-150 ${
                    flashMode === "none" ? "opacity-0" : "opacity-100"
                  }`}
                  style={{
                    background:
                      flashMode === "start"
                        ? "rgba(255,255,255,0.06)"
                        : flashMode === "miss"
                          ? "rgba(255, 80, 80, 0.22)"
                          : "rgba(255,120,80,0.08)",
                  }}
                />
              ) : null}

              {isMobile ? (
                <div
                  className="h-full w-full px-3 pt-3"
                  onTouchStart={handleHomeTouchStart}
                  onTouchEnd={clearLongPress}
                  onTouchMove={clearLongPress}
                  onContextMenu={(e) => e.preventDefault()}
                  style={{
                    paddingBottom: `calc(${
                      TASKBAR_HEIGHT + 16
                    }px + env(safe-area-inset-bottom))`,
                  }}
                >
                  {mobileActiveItem ? (
                    <div className="win-frame h-full overflow-hidden bg-win-content">
                      {mobileActiveItem.id !== "terminal" ? (
                        <div className="aero-azure flex h-11 items-center justify-between px-2">
                          <div className="min-w-0 flex-1 px-1">
                            <span className="block truncate font-ui text-base font-bold tracking-wide">
                              {mobileActiveItem.title}
                            </span>
                          </div>

                          <button
                            type="button"
                            aria-label="Close app"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMobileActiveApp(null);
                            }}
                            className="aero-orb ml-3 flex h-6 w-6 shrink-0 items-center justify-center active:win-pressed"
                          >
                            <span className="font-ui text-sm font-bold leading-none text-black">
                              &times;
                            </span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex h-8 items-center justify-between border-b border-[#166516] bg-[#0a0a0a] px-2">
                          <span className="font-fixedsys text-xs leading-none text-[#33ff33]/70">
                            C:\&gt;
                          </span>

                          <button
                            type="button"
                            aria-label="Close terminal"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMobileActiveApp(null);
                            }}
                            className="aero-orb flex h-6 w-6 shrink-0 items-center justify-center active:win-pressed"
                          >
                            <span className="font-ui text-sm font-bold leading-none text-black">
                              &times;
                            </span>
                          </button>
                        </div>
                      )}

                      <div
                        onClick={(e) => e.stopPropagation()}
                        className={
                          mobileActiveItem.id === "terminal"
                            ? "h-[calc(100%-32px)] overflow-hidden"
                            : mobileActiveItem.id.startsWith("doc:")
                              ? "h-[calc(100%-44px)] overflow-hidden"
                              : mobileActiveItem.id === "display" ||
                                  mobileActiveItem.id === "leaderboard"
                                ? "h-[calc(100%-44px)] overflow-auto"
                                : "h-[calc(100%-44px)] overflow-auto bg-win-content p-3 text-sm text-win-text"
                        }
                      >
                        {mobileActiveItem.content}
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-x-2 gap-y-4 pt-2">
                      {desktopItems.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDesktopItem(item);
                          }}
                          className="flex min-h-[96px] flex-col items-center justify-start rounded px-1 py-2 text-center active:bg-white/10"
                        >
                          <div className="flex h-14 w-full items-center justify-center">
                            {item.icon}
                          </div>

                          <span className="mt-1 max-w-full break-words font-ui text-[11px] leading-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                            {item.title}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <>
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
                        onClick={(e) => {
                          e.stopPropagation();
                          openDesktopItem(item);
                        }}
                        className="flex cursor-pointer flex-col items-center justify-start text-center"
                        style={{
                          width: `${desktopIconLayout.itemWidth}px`,
                          height: `${desktopIconLayout.itemHeight}px`,
                        }}
                      >
                        <div className="flex w-full justify-center py-2">
                          {item.icon}
                        </div>

                        <span className="max-w-full px-1 font-ui text-[11px] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] sm:text-sm">
                          {item.title}
                        </span>
                      </button>
                    ))}
                  </div>

                  {firstBirdHintVisible && !gameActive && !gameOverVisible ? (
                    <div className="pointer-events-none absolute left-1/2 top-4 z-[38] -translate-x-1/2">
                      <div className="win-raise bg-win-face px-4 py-2">
                        <span className="font-ui text-sm font-medium text-win-text">
                          Try Shooting the Ducks!
                        </span>
                      </div>
                    </div>
                  ) : null}

                  {showDesktopHud ? (
                    <DuckHuntMetrics
                      score={score}
                      misses={misses}
                      maxMisses={MAX_MISSES}
                      gameOverVisible={gameOverVisible}
                      idleMsLeft={idleMsLeft}
                      showIdleCountdown={gameActive && idleMsLeft <= 5000}
                    />
                  ) : null}

                  {leaderboardScore != null ? (
                    <Suspense fallback={null}>
                      <Leaderboard
                        finalScore={leaderboardScore}
                        onPlayAgain={playAgainFromLeaderboard}
                        onClose={closeLeaderboard}
                      />
                    </Suspense>
                  ) : null}

                  <DuckHuntField
                    birds={birds}
                    viewport={viewport}
                    birdCursor={birdCursor}
                    onShootBird={shootBird}
                    onBirdAnimationEnd={handleBirdAnimationEnd}
                  />

                  <div className="pointer-events-none absolute inset-0 z-[34] overflow-hidden">
                    {pointPopups.map((popup) => (
                      <div
                        key={popup.id}
                        onAnimationEnd={() => removePointPopup(popup.id)}
                        className="absolute font-fixedsys text-3xl font-bold text-[#fff2c8] drop-shadow-[2px_2px_0_rgba(0,0,0,0.9)]"
                        style={{
                          left: `${popup.x}px`,
                          top: `${popup.y}px`,
                          animation: "pointPopupFloat 1500ms ease-out forwards",
                        }}
                      >
                        +{popup.points}
                      </div>
                    ))}
                  </div>

                  {openWindows.map((window) => {
                    if (window.minimized) return null;

                    const isActive = window.id === topWindowId;
                    const isTerminal = window.id === "terminal";
                    const isDoc = window.id.startsWith("doc:");
                    const isDisplay = window.id === "display";
                    const isDocuments = window.id === "documents";
                    const isLeaderboard = window.id === "leaderboard";

                    const windowContent = isTerminal ? (
                      <Terminal
                        onLaunch={launchApp}
                        onClose={closeTerminal}
                        onOpenDoc={openDoc}
                        docs={docs}
                        onSaveDoc={saveDoc}
                        onDeleteDoc={deleteDoc}
                      />
                    ) : isDoc ? (
                      <Notepad
                        name={window.id.slice(4)}
                        content={docs[window.id.slice(4)] ?? ""}
                        onSave={saveDoc}
                        onClose={() => closeWindow(window.id)}
                        onDelete={deleteDoc}
                      />
                    ) : isDocuments ? (
                      <DocumentsFolder
                        docs={docs}
                        onOpenDoc={openDoc}
                        onDelete={deleteDoc}
                        onCreate={createDoc}
                        onRename={renameDoc}
                      />
                    ) : isDisplay ? (
                      <DisplayProperties
                        themes={DESKTOP_THEMES}
                        current={desktopTheme}
                        onApply={setDesktopTheme}
                        onClose={closeDisplayProperties}
                      />
                    ) : (
                      window.content
                    );

                    return (
                      <div
                        key={window.id}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          bringToFront(window.id);
                        }}
                        className={`win-frame absolute overflow-hidden bg-win-content transition-shadow duration-150 ${
                          isActive ? "" : "opacity-95"
                        }`}
                        style={{
                          left: `${window.x}px`,
                          top: `${window.y}px`,
                          width: `${window.width}px`,
                          height: `${window.height}px`,
                          zIndex: window.z,
                        }}
                      >
                        {!isTerminal ? (
                          <div
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              startDragging(e, window.id);
                            }}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              toggleMaximizeWindow(window.id);
                            }}
                            className={`flex h-10 items-center justify-between px-2 sm:h-12 sm:px-2 ${
                              isActive
                                ? "aero-titlebar"
                                : "aero-titlebar-inactive"
                            } ${
                              window.maximized
                                ? "cursor-default"
                                : "cursor-move"
                            }`}
                          >
                            <div className="flex min-w-0 items-center gap-2 px-1">
                              <img
                                src={windowIcon(window.id)}
                                alt=""
                                draggable={false}
                                className="pointer-events-none h-5 w-5 shrink-0 select-none object-contain"
                              />
                              <span
                                className={`truncate font-ui text-base font-bold tracking-wide sm:text-lg ${
                                  isActive ? "text-white" : "text-white/75"
                                }`}
                              >
                                {window.title}
                              </span>
                            </div>

                            <div className="flex shrink-0 items-center gap-1">
                              <button
                                type="button"
                                aria-label="Minimize"
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  minimizeWindow(window.id);
                                }}
                                className="aero-orb flex h-[22px] w-[22px] items-end justify-center pb-1 active:win-pressed"
                              >
                                <span className="h-[3px] w-2.5 bg-black" />
                              </button>

                              <button
                                type="button"
                                aria-label={
                                  window.maximized ? "Restore" : "Maximize"
                                }
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleMaximizeWindow(window.id);
                                }}
                                className="aero-orb flex h-[22px] w-[22px] items-center justify-center active:win-pressed"
                              >
                                <span className="h-2.5 w-2.5 border border-black border-t-2" />
                              </button>

                              <button
                                type="button"
                                aria-label="Close"
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  closeWindow(window.id);
                                }}
                                className="aero-orb ml-0.5 flex h-[22px] w-[22px] items-center justify-center active:win-pressed"
                              >
                                <span className="font-ui text-sm font-bold leading-none text-black">
                                  &times;
                                </span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              startDragging(e, window.id);
                            }}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              toggleMaximizeWindow(window.id);
                            }}
                            className={`relative flex h-6 shrink-0 items-center border-b border-[#166516] bg-[#0a0a0a] px-1.5 ${
                              window.maximized
                                ? "cursor-default"
                                : "cursor-move"
                            }`}
                          >
                            <span className="font-fixedsys text-[11px] leading-none text-[#33ff33]/70">
                              C:\&gt;
                            </span>

                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-1">
                              {[0, 1, 2, 3, 4].map((dot) => (
                                <span
                                  key={dot}
                                  className="h-[3px] w-[3px] rounded-full bg-[#33ff33]/35"
                                />
                              ))}
                            </div>

                            <div className="relative z-10 ml-auto flex items-center gap-1">
                              <button
                                type="button"
                                aria-label="Minimize"
                                onMouseDown={(e) => e.stopPropagation()}
                                onDoubleClick={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  minimizeWindow(window.id);
                                }}
                                className="aero-orb flex h-[18px] w-[18px] items-end justify-center pb-[3px] active:win-pressed"
                              >
                                <span className="h-[2px] w-2 bg-black" />
                              </button>

                              <button
                                type="button"
                                aria-label={
                                  window.maximized ? "Restore" : "Maximize"
                                }
                                onMouseDown={(e) => e.stopPropagation()}
                                onDoubleClick={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleMaximizeWindow(window.id);
                                }}
                                className="aero-orb flex h-[18px] w-[18px] items-center justify-center active:win-pressed"
                              >
                                <span className="h-2 w-2 border border-black border-t-2" />
                              </button>

                              <button
                                type="button"
                                aria-label="Close"
                                onMouseDown={(e) => e.stopPropagation()}
                                onDoubleClick={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  closeWindow(window.id);
                                }}
                                className="aero-orb ml-0.5 flex h-[18px] w-[18px] items-center justify-center active:win-pressed"
                              >
                                <span className="font-ui text-xs font-bold leading-none text-black">
                                  &times;
                                </span>
                              </button>
                            </div>
                          </div>
                        )}

                        <div
                          onClick={(e) => e.stopPropagation()}
                          className={
                            isTerminal
                              ? "h-[calc(100%-24px)] overflow-hidden"
                              : isDoc
                                ? "h-[calc(100%-40px)] overflow-hidden sm:h-[calc(100%-48px)]"
                                : isDisplay || isLeaderboard
                                  ? "h-[calc(100%-40px)] overflow-auto sm:h-[calc(100%-48px)]"
                                  : "h-[calc(100%-40px)] overflow-auto bg-win-content p-3 text-sm text-win-text sm:h-[calc(100%-48px)] sm:p-5 sm:text-base"
                          }
                        >
                          {windowContent}
                        </div>

                        {isTerminal && !window.maximized ? (
                          <div
                            onMouseDown={(e) => startResizing(e, window.id)}
                            className="absolute bottom-0 right-0 z-20 h-4 w-4 cursor-nwse-resize"
                            style={{
                              background:
                                "linear-gradient(135deg, transparent 0 54%, rgba(51,255,51,0.55) 54% 61%, transparent 61% 76%, rgba(51,255,51,0.55) 76% 83%, transparent 83%)",
                            }}
                            aria-label="Resize terminal"
                          />
                        ) : null}
                      </div>
                    );
                  })}
                </>
              )}

              {!isMobile && contextMenu ? (
                <>
                  <div
                    className="absolute inset-0 z-[65]"
                    onClick={() => setContextMenu(null)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setContextMenu(null);
                    }}
                  />

                  <div
                    className="win-frame absolute z-[70] w-44 bg-win-face py-1"
                    style={{
                      left: `${contextMenu.x}px`,
                      top: `${contextMenu.y}px`,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setContextMenu(null);
                        startGameSession();
                      }}
                      className="flex w-full items-center px-4 py-1 text-left font-ui text-sm text-win-text hover:bg-win-title hover:text-win-title-text"
                    >
                      Play Duck Hunt
                    </button>

                    <div className="mx-2 my-1">
                      <div className="h-px bg-win-shadow" />
                      <div className="h-px bg-win-light" />
                    </div>

                    <button
                      type="button"
                      onClick={openDisplayProperties}
                      className="flex w-full items-center px-4 py-1 text-left font-ui text-sm text-win-text hover:bg-win-title hover:text-win-title-text"
                    >
                      Properties
                    </button>
                  </div>
                </>
              ) : null}

              {!isMobile && startMenuOpen ? (
                <>
                  <div
                    className="absolute inset-0 z-[55]"
                    onClick={(e) => {
                      e.stopPropagation();
                      setStartMenuOpen(false);
                    }}
                  />

                  <div
                    className="win-frame absolute left-1.5 z-[60] w-64 overflow-hidden bg-win-content sm:left-2"
                    style={{ bottom: `${TASKBAR_HEIGHT + 6}px` }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex">
                      <div
                        className="flex w-9 shrink-0 items-end justify-center pb-3"
                        style={{ background: "#000080" }}
                      >
                        <span
                          className="font-ui text-lg font-bold tracking-widest text-white"
                          style={{
                            writingMode: "vertical-rl",
                            transform: "rotate(180deg)",
                          }}
                        >
                          Adrian OS
                        </span>
                      </div>

                      <div className="min-w-0 flex-1 py-1">
                        {desktopItems.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => openStartMenuItem(item)}
                            className="group flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-win-title"
                          >
                            <img
                              src={WINDOW_ICON_SRC[item.id] || folderIcon}
                              alt=""
                              draggable={false}
                              className="pointer-events-none h-6 w-6 shrink-0 select-none object-contain"
                            />
                            <span className="truncate font-ui text-base text-win-text group-hover:text-win-title-text">
                              {item.title}
                            </span>
                          </button>
                        ))}

                        <div className="mx-2 my-1">
                          <div className="h-px bg-win-shadow" />
                          <div className="h-px bg-win-light" />
                        </div>

                        <a
                          href="https://github.com/AmDiTosto"
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => setStartMenuOpen(false)}
                          className="flex w-full items-center gap-3 px-3 py-2 text-left text-win-text hover:bg-win-title hover:text-win-title-text"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="h-6 w-6 shrink-0"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.05-.02-2.06-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.24-3.23-.12-.3-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.77.84 1.24 1.92 1.24 3.23 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22 0 1.61-.01 2.9-.01 3.29 0 .32.22.7.83.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z" />
                          </svg>
                          <span className="font-ui text-base">GitHub</span>
                        </a>

                        <a
                          href="https://www.linkedin.com/in/aditosto/"
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => setStartMenuOpen(false)}
                          className="flex w-full items-center gap-3 px-3 py-2 text-left text-win-text hover:bg-win-title hover:text-win-title-text"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="h-6 w-6 shrink-0"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
                          </svg>
                          <span className="font-ui text-base">LinkedIn</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </>
              ) : null}

              <div
                className="aero-taskbar absolute bottom-0 left-0 right-0 z-50"
                style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="flex items-center justify-between gap-2 px-2 sm:px-3"
                  style={{ height: `${TASKBAR_HEIGHT}px` }}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
                    <button
                      type="button"
                      aria-label="Start"
                      onClick={() => {
                        if (isMobile) {
                          setMobileActiveApp(null);
                        } else {
                          setStartMenuOpen((prev) => !prev);
                        }
                      }}
                      className={`aero-start flex h-10 shrink-0 items-center gap-1.5 px-2.5 ${
                        startMenuOpen ? "win-pressed" : ""
                      }`}
                    >
                      <img
                        src={windoesIcon}
                        draggable={false}
                        alt="Windows icon"
                        className="h-6 w-6 shrink-0 object-contain"
                      />
                      <span className="font-ui text-lg font-bold text-black">
                        Start
                      </span>
                    </button>

                    {!isMobile &&
                      openWindows.map((w) => {
                        const active = !w.minimized && topWindowId === w.id;

                        return (
                          <button
                            key={w.id}
                            type="button"
                            onClick={() => handleTaskbarWindowClick(w.id)}
                            className={`flex h-9 min-w-0 max-w-[180px] shrink items-center gap-2 px-2 text-black sm:px-3 ${
                              active ? "win-pressed bg-[#b8b8b8]" : "win-raise"
                            }`}
                          >
                            <img
                              src={windowIcon(w.id)}
                              alt=""
                              draggable={false}
                              className="pointer-events-none h-5 w-5 shrink-0 select-none object-contain"
                            />
                            <span
                              className={`truncate font-ui text-sm sm:text-base ${
                                active ? "font-bold" : "font-semibold"
                              }`}
                            >
                              {w.title}
                            </span>
                          </button>
                        );
                      })}
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <div className="win-sink flex h-9 items-center bg-win-face px-3 text-black">
                      <span className="font-ui text-sm font-semibold sm:text-base">
                        {formatWindowsTime(currentTime)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {appPhase === "loading" || appPhase === "transitioning" ? (
          <div
            className={`absolute inset-0 z-[999] transition-all duration-[1200ms] ease-in-out ${
              appPhase === "transitioning"
                ? "pointer-events-none opacity-0 scale-[1.03] blur-[4px]"
                : "opacity-100 scale-100 blur-0"
            }`}
          >
            <LoadingScreen onComplete={handleLoadingComplete} />
          </div>
        ) : null}
      </div>

      <style>{`
        @keyframes pointPopupFloat {
          0% {
            opacity: 0;
            transform: translateY(8px) scale(0.9);
          }
          15% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-28px) scale(1.05);
          }
        }
      `}</style>

      <Analytics />
    </>
  );
}

export default App;
