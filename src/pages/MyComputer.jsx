import adrianImage from "../assets/adrian.svg";
import cppIcon from "../assets/csIcons/cpp.svg";
import linuxIcon from "../assets/csIcons/linux.svg";
import pythonIcon from "../assets/csIcons/python.svg";
import reactIcon from "../assets/csIcons/react.svg";
import dockerIcon from "../assets/csIcons/docker.svg";
import firebaseIcon from "../assets/csIcons/firebase.svg";
import javascriptIcon from "../assets/csIcons/javascript.svg";
import mongoIcon from "../assets/csIcons/mongo.svg";
import djangoIcon from "../assets/csIcons/django.svg";
import htmlIcon from "../assets/csIcons/html.svg";
import nodejsIcon from "../assets/csIcons/nodejs.svg";
import cssIcon from "../assets/csIcons/css.svg";
import sqlIcon from "../assets/csIcons/sql.svg";
import cIcon from "../assets/csIcons/c.svg";

const SKILL_GROUPS = [
  {
    title: "Languages",
    items: [
      { id: "python", label: "Python", src: pythonIcon },
      { id: "cpp", label: "C++", src: cppIcon },
      { id: "c", label: "C", src: cIcon },
      { id: "javascript", label: "JavaScript", src: javascriptIcon },
      { id: "sql", label: "SQL", src: sqlIcon },
      { id: "html", label: "HTML", src: htmlIcon },
      { id: "css", label: "CSS", src: cssIcon },
    ],
  },
  {
    title: "Frameworks & Databases",
    items: [
      { id: "react", label: "React", src: reactIcon },
      { id: "nodejs", label: "Node.js", src: nodejsIcon },
      { id: "django", label: "Django", src: djangoIcon },
      { id: "mongo", label: "Mongo", src: mongoIcon },
      { id: "firebase", label: "Firebase", src: firebaseIcon },
    ],
  },
  {
    title: "Tools",
    items: [
      { id: "docker", label: "Docker", src: dockerIcon },
      { id: "linux", label: "Linux", src: linuxIcon },
    ],
  },
];

export default function MyComputerPage() {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="win-raise bg-win-face p-4 sm:p-5">
        <div className="flex items-center gap-4">
          <div className="win-sink shrink-0 bg-white p-1">
            <img
              src={adrianImage}
              alt="Adrian Di Tosto"
              draggable={false}
              className="h-20 w-20 object-cover sm:h-24 sm:w-24"
            />
          </div>

          <div className="min-w-0">
            <h1 className="font-ui text-2xl font-bold leading-tight text-win-text sm:text-3xl">
              Adrian Di Tosto
            </h1>
            <p className="mt-0.5 font-ui text-sm text-win-muted sm:text-base">
              Full-Stack Developer &middot; CS @ University of Guelph
            </p>
          </div>
        </div>

        <div className="mt-4 h-px w-full bg-win-shadow" />
        <div className="h-px w-full bg-win-light" />

        <div className="mt-4 space-y-3 font-ui text-sm leading-relaxed text-win-text sm:text-base">
          <p>
            Hello World! I&rsquo;m a Computer Science student based in Toronto,
            Ontario, currently studying at the University of Guelph. I love
            solving challenging problems and building software that tackles
            real-world needs and makes a meaningful impact.
          </p>
          <p>
            When I&rsquo;m not fixing bugs that I created, I&rsquo;m usually
            learning about AI, hitting some cardio at the gym, or enjoying a
            movie or TV show!
          </p>
        </div>

        <div className="win-sink mt-4 bg-black px-3 py-2">
          <span className="font-fixedsys text-sm text-[#33ff33] sm:text-base">
            C:\Users\Adrian&gt;
          </span>
          <span className="ml-2 inline-block h-4 w-2 animate-pulse bg-[#33ff33] align-middle" />
        </div>
      </div>

      <div className="win-raise bg-win-face p-5 sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <h2 className="font-ui text-lg font-bold uppercase tracking-wide text-win-text">
            Tools &amp; Skills
          </h2>
          <div className="h-0.5 flex-1 bg-win-shadow" />
        </div>

        <div className="flex flex-col gap-6">
          {SKILL_GROUPS.map((group) => (
            <div key={group.title}>
              <div className="mb-3 flex items-center gap-3">
                <span className="font-ui text-xs font-bold uppercase tracking-[0.12em] text-win-title">
                  {group.title}
                </span>
                <div className="h-px flex-1 bg-win-shadow" />
              </div>

              <div
                className="grid gap-2.5"
                style={{
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(150px, 1fr))",
                }}
              >
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    className="win-sink flex items-center gap-3 bg-white px-3 py-2.5 transition-colors hover:bg-[#dfdfdf]"
                  >
                    <img
                      src={item.src}
                      alt={item.label}
                      draggable={false}
                      className="h-7 w-7 shrink-0 object-contain"
                    />
                    <span className="truncate font-ui text-sm font-medium text-win-text sm:text-[15px]">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
