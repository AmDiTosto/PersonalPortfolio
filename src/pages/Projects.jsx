// Experience.jsx
// Dynamic + scalable template: add new jobs by pushing to EXPERIENCES.

import birdWatcherIcon from "../assets/projectsIcons/birdWatcher.png";
import callMeMaybe from "../assets/projectsIcons/callMeMaybe.png";
import githubIcon from "../assets/github.png";
import websiteLinkIcon from "../assets/websiteLink.png";
import ExperienceCard from "../components/ExperienceCard";

export default function Projects() {
  const workExperinces = [
    {
      id: "Bird-Watcher",
      role: "Bird Watcher",
      icon: birdWatcherIcon,
      highlights: [
        "Grab your tin-foil hats, charge your phones, and get ready to catch them all! Bird Watcher is a playful mobile application that encourages the younger generation to get outside and explore the world by spotting and identifying “government bird spies.” Built with Flutter and powered by the OpenAI API, the app analyzes photos of birds taken by users to determine whether they might be a suspicious government surveillance bird.",
      ],
      tech: ["Flutter", "Python", "Dart", "Firebase"],
      links: [
        {
          icon: githubIcon,
          href: "https://github.com/AmDiTosto/HackThe6ix2024",
        },
      ],
    },
    {
      id: "Call-Me-Maybe",
      role: "Call Me Maybe",
      icon: callMeMaybe,
      highlights: [
        "Hey, I just met you, and this is crazy, but here’s my number, so call me maybe! This application allows users to generate phone calls with natural-sounding AI voices through an AI pipeline powered by OpenAI, ElevanLabs, and Twilio.",
      ],
      tech: [
        "React",
        "MUI",
        "Tailwind",
        "Flask",
        "OpenAI API",
        "ElevenLabs",
        "Twilio",
      ],
      links: [
        {
          icon: githubIcon,
          href: "https://github.com/AmDiTosto/HackThe6ix2024",
        },
        {
          icon: websiteLinkIcon,
          href: "https://hack-the6ix2024.vercel.app/",
        },
      ],
    },
  ];

  return (
    <div className="w-full bg-[#c3c7cb] p-3">
      <div className="flex w-full flex-col gap-3">
        <div className="flex flex-col gap-4">
          {workExperinces.map((exp) => (
            <ExperienceCard exp={exp} />
          ))}
        </div>
      </div>
    </div>
  );
}
