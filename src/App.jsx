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
import blackDuckSprite from "./assets/black_duck_strip.png";
import redDuckSprite from "./assets/red_duck_strip.png";
import blueDuckSprite from "./assets/blue_duck_strip.png";
import MyComputerPage from "./pages/MyComputer";
import Experience from "./pages/Experience";
import Projects from "./pages/Projects";
import Resume from "./pages/Resume";
import Contact from "./pages/Contact";
import LoadingScreen from "./pages/LoadingScreen";
import gunshotSound from "./assets/sounds/gunshot.mp3";
import gameStartSound from "./assets/sounds/start.mp3";
import gameOverSound from "./assets/sounds/game-over.mp3";
import DuckHuntField from "./components/DuckHuntField";
import DuckHuntMetrics from "./components/DuckHuntMetrics";
import scopeCursorImage from "./assets/scope.png"; // add this

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
      viewportHeight - TASKBAR_HEIGHT - 24
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
    viewportHeight
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
      : getViewportSize()
  );

  const [pageIsActive, setPageIsActive] = useState(() =>
    typeof document === "undefined" ? true : getPageIsActive()
  );

  const isMobile = viewport.width < MOBILE_BREAKPOINT;

  const [currentTime, setCurrentTime] = useState(new Date());
  const [appPhase, setAppPhase] = useState("loading");
  const [mobileActiveApp, setMobileActiveApp] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [birds, setBirds] = useState([]);
  const [gameActive, setGameActive] = useState(false);
  const [gameOverVisible, setGameOverVisible] = useState(false);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [idleMsLeft, setIdleMsLeft] = useState(GAME_IDLE_MS);
  const [flashMode, setFlashMode] = useState("none");

  const zCounter = useRef(10);
  const openOffset = useRef(0);
  const desktopRef = useRef(null);
  const birdsRef = useRef([]);

  const gunshotAudioRef = useRef(null);
  const gameStartAudioRef = useRef(null);
  const gameOverAudioRef = useRef(null);
  const audioRef = useRef(null);

  const transitionTimeoutRef = useRef(null);
  const birdSpawnTimeoutRef = useRef(null);
  const gameTimeoutRef = useRef(null);
  const flashTimeoutRef = useRef(null);
  const gameOverHudFallbackTimeoutRef = useRef(null);
  const idleCountdownIntervalRef = useRef(null);

  const hasPlayedStartupAudioRef = useRef(false);
  const hasStartedTransitionRef = useRef(false);

  const gameActiveRef = useRef(false);
  const scoreRef = useRef(0);
  const missesRef = useRef(0);
  const pageIsActiveRef = useRef(pageIsActive);
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
      url: "https://www.youtube.com/watch?v=a7Lq6ZlSqys",
    },
  ];

  const desktopItemMap = Object.fromEntries(
    desktopItems
      .filter((item) => item.type === "window")
      .map((item) => [item.id, item])
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
      window.innerHeight
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
        window.id === id ? { ...window, z: nextZ } : window
      )
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

    if (item.type === "external-link" && item.url) {
      window.open(item.url, "_blank", "noopener,noreferrer");
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
          window.id === item.id ? { ...window, z: nextZ } : window
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

    const audio = gameOverAudioRef.current;
    if (audio) {
      audio.onended = null;
    }
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
    setGameOverVisible(false);
    setIdleMsLeft(GAME_IDLE_MS);
    syncGameState(0, 0);
  }

  function playGameOverAndHoldHud() {
    const audio = gameOverAudioRef.current;
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
    clearFlashTimer();
    setFlashMode(mode);

    flashTimeoutRef.current = window.setTimeout(() => {
      setFlashMode("none");
    }, duration);
  }

  function resetGameSessionTimeout() {
    clearGameTimeout();

    idleDeadlineRef.current = Date.now() + GAME_IDLE_MS;
    setIdleMsLeft(GAME_IDLE_MS);
    startIdleCountdownInterval();

    gameTimeoutRef.current = window.setTimeout(() => {
      endGame();
    }, GAME_IDLE_MS);
  }

  function startGameSession() {
    clearGameOverHold();
    setGameOverVisible(false);
    setOpenWindows([]);
    setMobileActiveApp(null);

    gameActiveRef.current = true;
    setGameActive(true);
    setIdleMsLeft(GAME_IDLE_MS);
    syncGameState(0, 0);
    playGameStart();
    triggerFlash("start", 180);
    resetGameSessionTimeout();
  }

  function endGame() {
    if (!gameActiveRef.current) return;

    gameActiveRef.current = false;
    setGameActive(false);
    clearGameTimeout();
    clearBirdSpawnTimer();
    clearIdleCountdownInterval();
    setIdleMsLeft(GAME_IDLE_MS);
    setBirds([]);
    birdsRef.current = [];
    triggerFlash("end", 240);
    playGameOverAndHoldHud();
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

    bringToFront(id);

    setDragging({
      id,
      offsetX: e.clientX - currentWindow.x,
      offsetY: e.clientY - currentWindow.y,
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
    if (gameOverVisible) return;
    if (birdsRef.current.length >= MAX_ACTIVE_BIRDS) return;

    const birdType = pickRandomBirdType();
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    let size = 72 + Math.floor(Math.random() * 24);

    const minTop = 96;
    const maxTop = Math.max(
      minTop,
      viewport.height - TASKBAR_HEIGHT - size - 24
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
      })
    );

    if (!didShoot) return;

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
    viewport.height
  );


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
      clearGameTimeout();
      clearFlashTimer();
      clearGameOverHold();
      clearIdleCountdownInterval();

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
      setViewport(getViewportSize());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setDragging(null);
      return;
    }

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
  }, [viewport, isMobile]);

  useEffect(() => {
    function handleMouseMove(e) {
      if (!dragging || isMobile) return;

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
  }, [dragging, openWindows, viewport, isMobile]);

  useEffect(() => {
    zCounter.current = openWindows.reduce(
      (max, window) => Math.max(max, window.z),
      10
    );
  }, [openWindows]);

  useEffect(() => {
    clearBirdSpawnTimer();

    if (appPhase !== "desktop" || isMobile) {
      setBirds([]);
      birdsRef.current = [];
      gameActiveRef.current = false;
      setGameActive(false);
      setGameOverVisible(false);
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
      clearGameTimeout();
      clearIdleCountdownInterval();
      setIdleMsLeft(GAME_IDLE_MS);
      setBirds([]);
      birdsRef.current = [];
      return;
    }

    if (gameOverVisible) {
      clearBirdSpawnTimer();
      clearIdleCountdownInterval();
      setIdleMsLeft(GAME_IDLE_MS);
      setBirds([]);
      birdsRef.current = [];
      return;
    }

    if (gameActiveRef.current) {
      resetGameSessionTimeout();
    }

    function scheduleNextBird() {
      birdSpawnTimeoutRef.current = window.setTimeout(() => {
        if (!pageIsActiveRef.current) return;
        if (gameOverVisible) return;

        spawnBird();

        if (gameActiveRef.current && Math.random() < 0.35) {
          window.setTimeout(() => {
            if (!pageIsActiveRef.current) return;
            if (gameOverVisible) return;
            spawnBird();
          }, 180 + Math.random() * 240);
        }

        scheduleNextBird();
      }, getNextBirdDelay());
    }

    scheduleNextBird();

    return () => {
      clearBirdSpawnTimer();
    };
  }, [
    appPhase,
    isMobile,
    viewport.height,
    gameActive,
    pageIsActive,
    gameOverVisible,
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

  const mobileActiveItem = mobileActiveApp
    ? desktopItemMap[mobileActiveApp]
    : null;

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
            className="min-h-[100svh] w-full overflow-hidden bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${background})` }}
          >
            <div
              ref={desktopRef}
              onClick={handleDesktopClick}
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
                        : "rgba(255,120,80,0.08)",
                  }}
                />
              ) : null}

              {isMobile ? (
                <div
                  className="h-full w-full px-3 pt-3"
                  style={{
                    paddingBottom: `calc(${
                      TASKBAR_HEIGHT + 16
                    }px + env(safe-area-inset-bottom))`,
                  }}
                >
                  {mobileActiveItem ? (
                    <div className="h-full overflow-hidden border-2 border-t-white border-l-white border-r-[#404040] border-b-[#404040] bg-[#c3c7cb] shadow-[3px_3px_0_#000]">
                      <div className="flex h-11 items-center justify-between border-b border-[#c9f0b2] bg-[#0000aa] px-3 text-white">
                        <div className="min-w-0 flex-1">
                          <span className="block truncate font-fixedsys text-base tracking-wide">
                            {mobileActiveItem.title}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMobileActiveApp(null);
                          }}
                          className="ml-3 shrink-0"
                        >
                          <img
                            src={xIcon}
                            alt="Close app"
                            className="h-6 w-6"
                          />
                        </button>
                      </div>

                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="h-[calc(100%-44px)] overflow-auto bg-[#c3c7cb] p-3 text-sm text-[#24415f]"
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

                          <span className="mt-1 max-w-full break-words font-fixedsys text-[11px] leading-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
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

                        <span className="max-w-full px-1 font-fixedsys text-[11px] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] sm:text-sm">
                          {item.title}
                        </span>
                      </button>
                    ))}
                  </div>

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

                  <DuckHuntField
                    birds={birds}
                    viewport={viewport}
                    birdCursor={birdCursor}
                    onShootBird={shootBird}
                    onBirdAnimationEnd={handleBirdAnimationEnd}
                  />

                  {openWindows.map((window) => (
                    <div
                      key={window.id}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        bringToFront(window.id);
                      }}
                      className="absolute overflow-hidden border-2 border-t-white border-l-white border-r-[#404040] border-b-[#404040] shadow-[3px_3px_0_#000]"
                      style={{
                        left: `${window.x}px`,
                        top: `${window.y}px`,
                        width: `${window.width}px`,
                        height: `${window.height}px`,
                        zIndex: window.z,
                      }}
                    >
                      <div
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          startDragging(e, window.id);
                        }}
                        className="flex h-10 cursor-move items-center justify-between border-b border-[#c9f0b2] bg-[#0000aa] px-3 text-white sm:h-12 sm:px-4"
                      >
                        <div className="flex min-w-0 items-center gap-2 bg-[#0000aa]">
                          <span className="truncate font-fixedsys text-base tracking-wide sm:text-xl">
                            {window.title}
                          </span>
                        </div>

                        <button
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            closeWindow(window.id);
                          }}
                          className="cursor-pointer"
                        >
                          <img
                            src={xIcon}
                            draggable={false}
                            alt="Close window"
                            className="h-6 w-6"
                          />
                        </button>
                      </div>

                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="h-[calc(100%-40px)] overflow-auto bg-[#c3c7cb] p-3 text-sm text-[#24415f] sm:h-[calc(100%-48px)] sm:p-5 sm:text-base"
                      >
                        {window.content}
                      </div>
                    </div>
                  ))}
                </>
              )}

              <div
                className="absolute bottom-0 left-0 right-0 z-50 border-t border-[#dfdfdf] bg-[#c0c0c0]"
                style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="flex items-center justify-between px-1.5 sm:px-2"
                  style={{ height: `${TASKBAR_HEIGHT}px` }}
                >
                  <div className="flex min-w-0 items-center gap-1.5 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => {
                        if (isMobile) {
                          setMobileActiveApp(null);
                        }
                      }}
                      className="flex h-9 shrink-0 items-center justify-center gap-2 border-2 border-t-white border-l-white border-r-[#404040] border-b-[#404040] bg-[#c0c0c0] px-2 text-black active:border-t-[#404040] active:border-l-[#404040] active:border-r-white active:border-b-white sm:px-3"
                    >
                      <img
                        src={windoesIcon}
                        draggable={false}
                        alt="Windows icon"
                        className="h-6 w-6 shrink-0 object-contain"
                      />
                      <span className="font-fixedsys text-base font-bold sm:text-lg">
                        Start
                      </span>
                    </button>

                    <div className="flex h-9 max-w-[140px] items-center justify-center gap-2 overflow-hidden border-2 border-t-white border-l-white border-r-[#404040] border-b-[#404040] bg-[#c0c0c0] px-2 text-black sm:max-w-none sm:px-3">
                      <img
                        src={computerIcon}
                        alt="Desktop icon"
                        draggable={false}
                        className="h-6 w-6 shrink-0 object-contain select-none pointer-events-none"
                      />
                      <span className="truncate font-fixedsys text-sm font-bold sm:text-lg">
                        My Desktop
                      </span>
                    </div>
                  </div>

                  <div className="flex h-9 items-center border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white bg-[#c0c0c0] px-2 text-black sm:px-3">
                    <span className="font-fixedsys text-sm font-bold sm:text-lg">
                      {formatWindowsTime(currentTime)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {appPhase !== "desktop" ? (
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

      <Analytics />
    </>
  );
}

export default App;
