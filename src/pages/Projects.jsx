import birdWatcherIcon from "../assets/projectsIcons/birdWatcher.svg";
import callMeMaybe from "../assets/projectsIcons/callMeMaybe.svg";
import githubIcon from "../assets/github.svg";
import websiteLinkIcon from "../assets/websiteLink.svg";

const projects = [
  {
    id: "Bird-Watcher",
    title: "Bird Watcher",
    icon: birdWatcherIcon,
    banner: "#008080",
    blurb:
      "Grab your tin-foil hats and get ready to catch them all! A playful mobile app that gets the younger generation outside to spot and identify “government bird spies.” Built with Flutter and powered by the OpenAI API to analyze user photos and decide whether a bird might be a suspicious surveillance drone.",
    tech: ["Flutter", "Python", "FastAPI", "Firebase", "OpenAI API"],
    links: [
      {
        label: "Code",
        icon: githubIcon,
        href: "https://github.com/MoschellaV/BirdWatcher",
      },
    ],
  },
  {
    id: "Call-Me-Maybe",
    title: "Call Me Maybe",
    icon: callMeMaybe,
    banner: "#800080",
    blurb:
      "Hey, I just met you, and this is crazy — but here’s my number, so call me maybe! Generate phone calls with natural-sounding AI voices through a pipeline powered by OpenAI, ElevenLabs, and Twilio.",
    tech: [
      "React",
      "MUI",
      "Tailwind",
      "Python",
      "FastAPI",
      "Firebase",
      "OpenAI API",
      "ElevenLabs",
      "Twilio",
    ],
    links: [
      {
        label: "Code",
        icon: githubIcon,
        href: "https://github.com/AmDiTosto/HackThe6ix2024",
      },
      {
        label: "Link",
        icon: websiteLinkIcon,
        href: "https://hack-the6ix2024.vercel.app/",
      },
    ],
  },
];

export default function Projects() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {projects.map((project) => (
        <div
          key={project.id}
          className="win-raise flex flex-col bg-win-face p-3"
        >
          <div
            className="win-sink flex h-40 items-center justify-center"
            style={{ backgroundColor: project.banner }}
          >
            <img
              src={project.icon}
              alt={`${project.title} icon`}
              draggable={false}
              className="h-28 w-28 select-none object-contain drop-shadow-[2px_2px_0_rgba(0,0,0,0.45)]"
            />
          </div>

          <div className="flex flex-1 flex-col pt-3">
            <h3 className="font-ui text-lg font-bold text-win-text">
              {project.title}
            </h3>

            <p className="mt-2 flex-1 font-ui text-sm leading-relaxed text-win-text">
              {project.blurb}
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="win-sink bg-white px-2 py-[3px] font-ui text-xs font-medium text-win-text"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {project.links.map((l) => (
                <a
                  key={l.href + l.label}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="win-btn inline-flex items-center gap-2 px-3 py-1.5 font-ui text-sm font-bold text-black active:win-pressed"
                >
                  <img src={l.icon} alt="" className="h-4 w-4" />
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
