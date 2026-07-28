import { useEffect, useRef, useState } from "react";

const HOME_PATH = "C:\\Users\\Adrian";
const DOCS_PATH = "C:\\Users\\Adrian\\My Documents";
const HOME_PROMPT = `${HOME_PATH}>`;
const DOCS_PROMPT = `${DOCS_PATH}>`;
const DOCS_DIR_ALIASES = ["mydocuments", "documents", "docs"];

const FONT_PX = 15;

const APPS = [
  {
    id: "about",
    name: "computer",
    title: "My Computer",
    keywords: ["computer", "mycomputer", "about", "about.txt", "me"],
  },
  {
    id: "experience",
    name: "experience",
    title: "Experience",
    keywords: ["experience", "experience.log", "work", "exp"],
  },
  {
    id: "projects",
    name: "projects",
    title: "Projects",
    keywords: ["projects", "projects.dir"],
  },
  {
    id: "resume",
    name: "resume",
    title: "Resume.pdf",
    keywords: ["resume", "resume.pdf", "cv"],
  },
  {
    id: "contact",
    name: "contact",
    title: "Contact.exe",
    keywords: ["contact", "contact.exe", "email"],
  },
  {
    id: "secret",
    name: "secret",
    title: "Adrian SECRET folder",
    keywords: ["secret", "secret/"],
  },
  {
    id: "terminal",
    name: "terminal",
    title: "Terminal",
    keywords: ["terminal", "cmd"],
  },
];

const APP_TITLE = Object.fromEntries(APPS.map((app) => [app.id, app.title]));
const APP_TITLES = APPS.map((app) => app.title);

function normalizeAppKey(value) {
  return value.toLowerCase().replace(/\s+/g, "");
}

const APP_LOOKUP = {};
for (const app of APPS) {
  for (const key of [app.id, app.name, app.title, ...app.keywords]) {
    APP_LOOKUP[normalizeAppKey(key)] = app.id;
  }
}

const SKILLS = {
  Languages: ["Python", "C++", "C", "JavaScript", "SQL", "HTML", "CSS"],
  "Frameworks & Databases": ["React", "Node.js", "Django", "Mongo", "Firebase"],
  Tools: ["Docker", "Linux"],
};

const EXPERIENCE = [
  {
    company: "Martinrea International Inc.",
    role: "Full-Stack Developer",
    period: "May 2025 - Present",
    detail:
      "Building a real-time data-streaming app that processes production data from manufacturing robots and pushes live KPIs to dashboards.",
    tech: ["C++", "Docker", "React", "MQTT", "SQL", "PostgREST"],
  },
  {
    company: "UOG Google Developer Student Club",
    role: "Technical Director",
    period: "Sep 2023 - Sep 2024",
    detail:
      "Led technical workshops and helped organize a hackathon with 250+ attendees.",
    tech: ["React", "Firebase", "JavaScript"],
  },
  {
    company: "Martinrea International Inc.",
    role: "Full-Stack Developer",
    period: "May 2024 - Aug 2024",
    detail:
      "Rebuilt an internal data-sharing system: UI components, a scalable SQL redesign, and REST API endpoints.",
    tech: ["React", "Python", "SQL", "REST"],
  },
];

const PROJECTS = [
  {
    name: "Bird Watcher",
    detail:
      'A Flutter app that uses the OpenAI API to decide whether a bird is a "government surveillance drone."',
    tech: ["Flutter", "Python", "FastAPI", "Firebase", "OpenAI API"],
    links: [
      { label: "Code", href: "https://github.com/MoschellaV/BirdWatcher" },
    ],
  },
  {
    name: "Call Me Maybe",
    detail:
      "Generates phone calls with natural AI voices via OpenAI, ElevenLabs, and Twilio.",
    tech: ["React", "Python", "FastAPI", "OpenAI API", "ElevenLabs", "Twilio"],
    links: [
      { label: "Code", href: "https://github.com/AmDiTosto/HackThe6ix2024" },
      { label: "Live", href: "https://hack-the6ix2024.vercel.app/" },
    ],
  },
];

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/AmDiTosto" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/aditosto/" },
  { label: "Email", href: "mailto:amditosto@gmail.com" },
];

const COMMANDS = [
  ["help", "Show this help menu"],
  ["whoami", "Who is Adrian?"],
  ["ls", "List the current directory"],
  ["cd <dir>", 'Change directory (cd "My Documents")'],
  ["touch <file>", "Create an empty file (in My Documents)"],
  ["nano <file>", "Edit a file in the terminal (in My Documents)"],
  ["open <name>", "Open an app, or a doc in My Documents"],
  ["rm <file>", "Delete a file (in My Documents)"],
  ["skills", "Languages, frameworks & tools"],
  ["experience", "Work history"],
  ["projects", "Featured projects"],
  ["resume", "Open my resume"],
  ["contact", "How to reach me"],
  ["neofetch", "System info"],
  ["date", "Current date & time"],
  ["clear", "Clear the screen"],
];

const COMMAND_NAMES = [
  "about",
  "cd",
  "clear",
  "contact",
  "date",
  "edit",
  "exit",
  "experience",
  "github",
  "help",
  "linkedin",
  "ls",
  "nano",
  "neofetch",
  "open",
  "projects",
  "resume",
  "rm",
  "skills",
  "touch",
  "vim",
  "whoami",
];

function resolveDocName(raw) {
  const name = raw.trim().replace(/^["']|["']$/g, "").toLowerCase();
  if (!name) return "";
  return name.includes(".") ? name : `${name}.txt`;
}

function longestCommonPrefix(values) {
  if (values.length === 0) return "";
  let prefix = values[0];
  for (const value of values) {
    while (!value.startsWith(prefix)) {
      prefix = prefix.slice(0, -1);
      if (!prefix) return "";
    }
  }
  return prefix;
}

const DUCK_ART = `   __
 <(o )___
  ( ._> /
   \`---'`;

function TermLink({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="break-all text-[#5ad1ff] underline underline-offset-2 hover:opacity-80"
    >
      {children}
    </a>
  );
}

function Heading({ children }) {
  return <span className="font-bold text-[#ffcf5a]">{children}</span>;
}

function Muted({ children }) {
  return <span className="text-[#8a8a8a]">{children}</span>;
}

function ErrorLine({ children }) {
  return <span className="text-[#ff6b6b]">{children}</span>;
}

function TechRow({ items }) {
  return <Muted>[{items.join(", ")}]</Muted>;
}

export default function Terminal({
  onLaunch,
  onClose,
  onOpenDoc,
  docs = {},
  onSaveDoc,
  onDeleteDoc,
}) {
  const [entries, setEntries] = useState(() => [
    {
      id: "banner",
      node: (
        <div>
          <div>AdrianOS [Version 4.00.950]</div>
          <Muted>(C) Copyright Adrian Di Tosto 1981-2026.</Muted>
          <div className="mt-2">
            Welcome to my portfolio terminal. Type <Heading>help</Heading> to
            see what you can do.
          </div>
        </div>
      ),
    },
  ]);
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(true);
  const [editor, setEditor] = useState(null);
  const [cwd, setCwd] = useState("home");

  const inDocuments = cwd === "documents";
  const prompt = inDocuments ? DOCS_PROMPT : HOME_PROMPT;

  const screenRef = useRef(null);
  const inputRef = useRef(null);
  const editorRef = useRef(null);
  const entryIdRef = useRef(0);
  const historyRef = useRef([]);
  const historyIndexRef = useRef(-1);

  function nextEntryId() {
    entryIdRef.current += 1;
    return `e${entryIdRef.current}`;
  }

  function pushEntries(nodes) {
    setEntries((prev) => [
      ...prev,
      ...nodes.map((node) => ({ id: nextEntryId(), node })),
    ]);
  }

  function resolveAppId(name) {
    if (!name) return null;
    return APP_LOOKUP[normalizeAppKey(name)] ?? null;
  }

  function launch(appId) {
    if (typeof onLaunch === "function") onLaunch(appId);
  }

  function openEditor(name) {
    setEditor({ name, content: docs[name] ?? "", dirty: false });
  }

  function saveEditor() {
    if (!editor) return;
    if (typeof onSaveDoc === "function") onSaveDoc(editor.name, editor.content);
    pushEntries([
      <div>
        Saved <Heading>{editor.name}</Heading>{" "}
        <Muted>({editor.content.length} bytes)</Muted>
      </div>,
    ]);
    setEditor(null);
    focusInput();
  }

  function cancelEditor() {
    setEditor(null);
    focusInput();
  }

  function handleEditorKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
      e.preventDefault();
      saveEditor();
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      cancelEditor();
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const el = e.target;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const nextContent =
        editor.content.slice(0, start) + "  " + editor.content.slice(end);
      setEditor((prev) => ({ ...prev, content: nextContent, dirty: true }));
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + 2;
      });
    }
  }

  function runCommand(raw) {
    const trimmed = raw.trim();
    if (!trimmed) return { node: null };

    const [command, ...restParts] = trimmed.split(/\s+/);
    const cmd = command.toLowerCase();
    const arg = restParts.join(" ");

    switch (cmd) {
      case "help":
        return {
          node: (
            <div>
              <Heading>Available commands</Heading>
              <div className="mt-1 grid gap-x-4 gap-y-0.5 sm:grid-cols-[max-content_1fr]">
                {COMMANDS.map(([name, desc]) => (
                  <div key={name} className="sm:contents">
                    <span className="text-[#2fff2f]">{name}</span>{" "}
                    <Muted>{desc}</Muted>
                  </div>
                ))}
              </div>
            </div>
          ),
        };

      case "whoami":
      case "about":
        return {
          node: (
            <div>
              <Heading>Adrian Di Tosto</Heading> — Full-Stack Developer
              <div>
                <Muted>CS @ University of Guelph · Toronto, Ontario</Muted>
              </div>
              <div className="mt-2">
                I love solving challenging problems and building software that
                tackles real-world needs. When I&rsquo;m not fixing bugs I
                created, I&rsquo;m learning about AI, hitting the gym, or
                watching a movie.
              </div>
            </div>
          ),
        };

      case "ls":
      case "dir": {
        if (inDocuments) {
          const docNames = Object.keys(docs).sort();
          if (docNames.length === 0) {
            return {
              node: (
                <Muted>
                  Directory is empty. Use{" "}
                  <span className="text-[#2fff2f]">touch &lt;name&gt;</span> or{" "}
                  <span className="text-[#2fff2f]">nano &lt;name&gt;</span> to
                  create a file.
                </Muted>
              ),
            };
          }
          return {
            node: (
              <div className="flex flex-wrap gap-x-6 gap-y-0.5">
                {docNames.map((name) => (
                  <span key={name} className="text-[#5ad1ff]">
                    {name}
                  </span>
                ))}
              </div>
            ),
          };
        }

        return {
          node: (
            <div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-0.5 sm:grid-cols-2">
                <span className="text-[#ffcf5a]">&lt;DIR&gt; My Documents</span>
                {APP_TITLES.map((title) => (
                  <span key={title}>{title}</span>
                ))}
              </div>

              <div className="mt-2">
                <Muted>Use </Muted>
                <span className="text-[#2fff2f]">open &lt;app&gt;</span>
                <Muted>, or </Muted>
                <span className="text-[#2fff2f]">cd &quot;My Documents&quot;</span>
                <Muted> to reach your files.</Muted>
              </div>
            </div>
          ),
        };
      }

      case "cd": {
        const target = arg.trim().replace(/^["']|["']$/g, "");
        const lower = target.toLowerCase();

        if (!target) {
          return { node: <div>{inDocuments ? DOCS_PATH : HOME_PATH}</div> };
        }

        const goingUp =
          lower === ".." || lower === "\\" || lower === "/" || lower === "~";

        if (inDocuments) {
          if (goingUp || lower === ".") {
            setCwd("home");
            return { node: null };
          }
          return {
            node: (
              <ErrorLine>The system cannot find the path specified.</ErrorLine>
            ),
          };
        }

        if (goingUp || lower === ".") return { node: null };

        if (DOCS_DIR_ALIASES.includes(normalizeAppKey(lower))) {
          setCwd("documents");
          return { node: null };
        }

        return {
          node: (
            <ErrorLine>The system cannot find the path specified.</ErrorLine>
          ),
        };
      }

      case "touch": {
        if (!inDocuments)
          return {
            node: (
              <ErrorLine>
                touch: your files live in My Documents. Run &lsquo;cd &quot;My
                Documents&quot;&rsquo; first.
              </ErrorLine>
            ),
          };
        if (!arg)
          return { node: <ErrorLine>touch: missing file operand</ErrorLine> };
        const name = resolveDocName(arg);
        if (!(name in docs) && typeof onSaveDoc === "function") {
          onSaveDoc(name, "");
        }
        return { node: null };
      }

      case "edit":
      case "nano":
      case "vim": {
        if (!inDocuments)
          return {
            node: (
              <ErrorLine>
                nano: your files live in My Documents. Run &lsquo;cd &quot;My
                Documents&quot;&rsquo; first.
              </ErrorLine>
            ),
          };
        if (!arg)
          return {
            node: (
              <ErrorLine>nano: missing file name (try: nano notes)</ErrorLine>
            ),
          };
        return { edit: resolveDocName(arg) };
      }

      case "rm":
      case "del": {
        if (!inDocuments)
          return {
            node: (
              <ErrorLine>
                rm: your documents live in My Documents. Run &lsquo;cd &quot;My
                Documents&quot;&rsquo; first.
              </ErrorLine>
            ),
          };
        if (!arg)
          return { node: <ErrorLine>rm: missing file name</ErrorLine> };
        const name = resolveDocName(arg);
        if (!(name in docs))
          return {
            node: <ErrorLine>rm: {name}: no such file</ErrorLine>,
          };
        if (typeof onDeleteDoc === "function") onDeleteDoc(name);
        return {
          node: (
            <div>
              removed <Heading>{name}</Heading>
            </div>
          ),
        };
      }

      case "skills":
      case "tech":
        return {
          node: (
            <div className="flex flex-col gap-1">
              {Object.entries(SKILLS).map(([group, items]) => (
                <div key={group}>
                  <Heading>{group}:</Heading> {items.join(", ")}
                </div>
              ))}
            </div>
          ),
        };

      case "experience":
      case "work":
        return {
          node: (
            <div className="flex flex-col gap-3">
              {EXPERIENCE.map((job) => (
                <div key={job.company + job.period}>
                  <Heading>{job.role}</Heading> @ {job.company}
                  <div>
                    <Muted>{job.period}</Muted>
                  </div>
                  <div>{job.detail}</div>
                  <div>
                    <TechRow items={job.tech} />
                  </div>
                </div>
              ))}
            </div>
          ),
        };

      case "projects":
        return {
          node: (
            <div className="flex flex-col gap-3">
              {PROJECTS.map((project) => (
                <div key={project.name}>
                  <Heading>{project.name}</Heading>
                  <div>{project.detail}</div>
                  <div>
                    <TechRow items={project.tech} />
                  </div>
                  <div className="flex flex-wrap gap-x-4">
                    {project.links.map((link) => (
                      <span key={link.href}>
                        {link.label}:{" "}
                        <TermLink href={link.href}>{link.href}</TermLink>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              <Muted>
                Run <span className="text-[#2fff2f]">open projects</span> for
                the full gallery.
              </Muted>
            </div>
          ),
        };

      case "resume":
      case "cv":
        launch("resume");
        return {
          node: (
            <div>
              Opening <Heading>Resume.pdf</Heading>...
            </div>
          ),
        };

      case "contact":
        return {
          node: (
            <div className="flex flex-col gap-0.5">
              <div>
                Email:{" "}
                <TermLink href="mailto:amditosto@gmail.com">
                  amditosto@gmail.com
                </TermLink>
              </div>
              {SOCIALS.filter((s) => s.label !== "Email").map((s) => (
                <div key={s.href}>
                  {s.label}: <TermLink href={s.href}>{s.href}</TermLink>
                </div>
              ))}
              <Muted>
                Or run <span className="text-[#2fff2f]">open contact</span> to
                send a message.
              </Muted>
            </div>
          ),
        };

      case "github":
        return {
          node: (
            <div>
              <TermLink href="https://github.com/AmDiTosto">
                github.com/AmDiTosto
              </TermLink>
            </div>
          ),
        };

      case "linkedin":
        return {
          node: (
            <div>
              <TermLink href="https://www.linkedin.com/in/aditosto/">
                linkedin.com/in/aditosto
              </TermLink>
            </div>
          ),
        };

      case "open": {
        if (inDocuments) {
          const docNames = Object.keys(docs).sort();
          if (!arg)
            return {
              node: (
                <div>
                  <Muted>Usage: open &lt;file&gt;. Files:</Muted>{" "}
                  {docNames.length > 0 ? docNames.join(", ") : "(none)"}
                </div>
              ),
            };
          const name = resolveDocName(arg);
          if (!(name in docs))
            return {
              node: <ErrorLine>open: {name}: no such file</ErrorLine>,
            };
          if (typeof onOpenDoc === "function") onOpenDoc(name);
          return {
            node: (
              <div>
                Opening <Heading>{name}</Heading>...
              </div>
            ),
          };
        }

        if (!arg)
          return {
            node: (
              <div>
                <Muted>Usage: open &lt;app&gt;. Available:</Muted>{" "}
                {APP_TITLES.join(", ")}
              </div>
            ),
          };
        const appId = resolveAppId(arg);
        if (!appId)
          return {
            node: (
              <ErrorLine>
                open: no app named &lsquo;{arg}&rsquo; here. Run &lsquo;cd
                &quot;My Documents&quot;&rsquo; for your files.
              </ErrorLine>
            ),
          };
        launch(appId);
        return {
          node: (
            <div>
              Launching <Heading>{APP_TITLE[appId]}</Heading>...
            </div>
          ),
        };
      }

      case "neofetch":
        return {
          node: (
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
              <pre className="text-[#ffcf5a]">{DUCK_ART}</pre>
              <div className="flex flex-col">
                <div>
                  <Heading>adrian</Heading>@<Heading>adrian-os</Heading>
                </div>
                <div>
                  <Muted>OS:</Muted> AdrianOS 95
                </div>
                <div>
                  <Muted>Shell:</Muted> adrsh 1.0
                </div>
                <div>
                  <Muted>Kernel:</Muted> React 19 + Vite
                </div>
                <div>
                  <Muted>Role:</Muted> Full-Stack Developer
                </div>
                <div>
                  <Muted>School:</Muted> CS @ University of Guelph
                </div>
                <div>
                  <Muted>Likes:</Muted> AI, gym, movies
                </div>
                <div>
                  <Muted>Uptime:</Muted> heavily caffeinated
                </div>
              </div>
            </div>
          ),
        };

      case "date":
      case "time":
        return { node: <div>{new Date().toString()}</div> };

      case "sudo":
        if (arg.toLowerCase().includes("coffee"))
          return {
            node: <div>Brewing... error: I&rsquo;m a teapot (HTTP 418) ☕</div>,
          };
        return {
          node: (
            <ErrorLine>
              adrian is not in the sudoers file. This incident will be reported.
            </ErrorLine>
          ),
        };

      case "clear":
      case "cls":
        return { clear: true };

      case "exit":
      case "quit":
        return { close: true };

      default:
        return {
          node: (
            <ErrorLine>
              &lsquo;{command}&rsquo; is not recognized as an internal or
              external command. Type &lsquo;help&rsquo; for a list of commands.
            </ErrorLine>
          ),
        };
    }
  }

  function submit(value) {
    const echo = (
      <div>
        <span className="text-[#2fff2f]">{prompt}</span>{" "}
        <span className="break-all">{value}</span>
      </div>
    );

    const result = runCommand(value);

    if (result.close && typeof onClose === "function") {
      onClose();
      return;
    }

    if (result.edit) {
      pushEntries([echo]);
      openEditor(result.edit);
    } else if (result.clear) {
      setEntries([]);
    } else if (result.close) {
      pushEntries([
        echo,
        <Muted key="noexit">
          There is no escape. Type &lsquo;help&rsquo;.
        </Muted>,
      ]);
    } else {
      pushEntries(result.node === null ? [echo] : [echo, result.node]);
    }

    const trimmed = value.trim();
    if (trimmed) {
      historyRef.current = [...historyRef.current, trimmed];
    }
    historyIndexRef.current = -1;
  }

  function handleSubmit(e) {
    e.preventDefault();
    submit(input);
    setInput("");
  }

  function completeToken({ token, candidates, prefixBeforeToken, trailing }) {
    const lower = token.toLowerCase();
    const matches = candidates.filter((candidate) =>
      candidate.toLowerCase().startsWith(lower),
    );

    if (matches.length === 0) return;

    if (matches.length === 1) {
      setInput(prefixBeforeToken + matches[0] + trailing);
      return;
    }

    const common = longestCommonPrefix(matches);
    if (common.length > token.length) {
      setInput(prefixBeforeToken + common);
      return;
    }

    pushEntries([
      <div className="flex flex-wrap gap-x-4 gap-y-0.5">
        {matches.map((match) => (
          <span key={match} className="text-[#2fff2f]">
            {match}
          </span>
        ))}
      </div>,
    ]);
  }

  function argCandidatesFor(cmd) {
    if (cmd === "cd") return inDocuments ? [".."] : ["My Documents"];
    if (inDocuments) return Object.keys(docs).sort();
    if (cmd === "open") return APP_TITLES;
    return [];
  }

  function handleTab() {
    const commandMatch = input.match(/^(\s*)(\S*)$/);
    if (commandMatch) {
      const [, leading, token] = commandMatch;
      const lower = token.toLowerCase();

      if (
        ["open", "edit", "nano", "vim", "touch", "rm", "del", "cd"].includes(
          lower,
        )
      ) {
        const candidates = argCandidatesFor(lower);
        if (candidates.length > 0) {
          completeToken({
            token: "",
            candidates,
            prefixBeforeToken: leading + token + " ",
            trailing: "",
          });
        } else {
          setInput(leading + token + " ");
        }
        return;
      }

      completeToken({
        token,
        candidates: COMMAND_NAMES,
        prefixBeforeToken: leading,
        trailing: " ",
      });
      return;
    }

    const argMatch = input.match(
      /^(\s*)(open|edit|nano|vim|touch|rm|del|cd)(\s+)(.*)$/i,
    );
    if (argMatch) {
      const [, leading, cmd, gap, token] = argMatch;
      completeToken({
        token,
        candidates: argCandidatesFor(cmd.toLowerCase()),
        prefixBeforeToken: leading + cmd + gap,
        trailing: "",
      });
    }
  }

  function handleKeyDown(e) {
    const history = historyRef.current;

    if (e.key === "Tab") {
      e.preventDefault();
      handleTab();
      return;
    }

    if (e.key === "ArrowUp") {
      if (history.length === 0) return;
      e.preventDefault();
      const nextIndex =
        historyIndexRef.current === -1
          ? history.length - 1
          : Math.max(0, historyIndexRef.current - 1);
      historyIndexRef.current = nextIndex;
      setInput(history[nextIndex]);
    } else if (e.key === "ArrowDown") {
      if (historyIndexRef.current === -1) return;
      e.preventDefault();
      const nextIndex = historyIndexRef.current + 1;
      if (nextIndex >= history.length) {
        historyIndexRef.current = -1;
        setInput("");
      } else {
        historyIndexRef.current = nextIndex;
        setInput(history[nextIndex]);
      }
    }
  }

  function focusInput() {
    inputRef.current?.focus({ preventScroll: true });
  }

  useEffect(() => {
    const el = screenRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries]);

  useEffect(() => {
    focusInput();
  }, []);

  const editorName = editor?.name;
  useEffect(() => {
    if (editorName) editorRef.current?.focus({ preventScroll: true });
  }, [editorName]);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-black">
      <style>{`
        @keyframes termCursorBlink {
          0%, 50% { opacity: 1; }
          50.01%, 100% { opacity: 0; }
        }
        .term-cursor-blink { animation: termCursorBlink 1.06s steps(1, end) infinite; }
        @keyframes termFlicker {
          0% { opacity: 0.035; }
          50% { opacity: 0.06; }
          100% { opacity: 0.035; }
        }
        .term-flicker { animation: termFlicker 3.2s ease-in-out infinite; }
      `}</style>

      <div className="relative min-h-0 flex-1 overflow-hidden bg-black">
        <div
          ref={screenRef}
          onMouseDown={(e) => {
            if (e.target.tagName !== "A") focusInput();
          }}
          className="absolute inset-0 overflow-auto whitespace-pre-wrap break-words p-2 font-fixedsys text-[#33ff33] sm:p-3"
          style={{
            fontSize: `${FONT_PX}px`,
            lineHeight: 1.5,
            textShadow: "0 0 4px rgba(51, 255, 51, 0.35)",
          }}
        >
          {entries.map((entry) => (
            <div key={entry.id} className="mb-1">
              {entry.node}
            </div>
          ))}

          <form onSubmit={handleSubmit} className="flex items-start">
            <span className="shrink-0 whitespace-pre text-[#2fff2f]">
              {prompt}&nbsp;
            </span>

            <span className="relative min-w-0 flex-1">
              <span
                aria-hidden="true"
                className="block whitespace-pre-wrap break-all"
              >
                {input}
                <span
                  className={
                    focused
                      ? "term-cursor-blink text-[#33ff33]"
                      : "text-[#33ff33] opacity-40"
                  }
                >
                  &#9608;
                </span>
              </span>

              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="send"
                aria-label="Terminal command input"
                className="absolute inset-0 h-full w-full border-0 bg-transparent p-0 text-transparent outline-none"
                style={{ caretColor: "transparent", font: "inherit" }}
              />
            </span>
          </form>
        </div>

        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 1px, rgba(0,0,0,0.28) 2px, rgba(0,0,0,0.28) 3px)",
          }}
        />
        <div className="term-flicker pointer-events-none absolute inset-0 bg-[#33ff33]" />

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 120% at 50% 50%, rgba(0,0,0,0) 58%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        {editor ? (
          <div className="absolute inset-0 z-30 flex flex-col bg-black">
            <div className="flex h-8 shrink-0 items-center justify-between gap-2 border-b border-[#166516] bg-[#0a0a0a] px-2">
              <span className="min-w-0 truncate font-fixedsys text-xs text-[#33ff33]">
                {editor.name}
                {editor.dirty ? " *" : ""}
              </span>

              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  type="button"
                  onClick={cancelEditor}
                  className="border border-[#8a8a8a] px-2 py-0.5 font-ui text-[11px] text-[#c0c0c0] active:opacity-70"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveEditor}
                  className="bg-[#33ff33] px-2.5 py-0.5 font-ui text-[11px] font-bold text-black active:opacity-80"
                >
                  Save
                </button>
              </div>
            </div>

            <textarea
              ref={editorRef}
              value={editor.content}
              onChange={(e) =>
                setEditor((prev) => ({
                  ...prev,
                  content: e.target.value,
                  dirty: true,
                }))
              }
              onKeyDown={handleEditorKeyDown}
              spellCheck={false}
              autoCapitalize="none"
              autoCorrect="off"
              placeholder="Start typing... (Ctrl+S save, Esc cancel)"
              className="min-h-0 flex-1 resize-none border-0 bg-black p-2 font-fixedsys text-[15px] leading-relaxed text-[#33ff33] outline-none placeholder:text-[#33ff33]/30 sm:p-3"
              style={{ caretColor: "#33ff33" }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
