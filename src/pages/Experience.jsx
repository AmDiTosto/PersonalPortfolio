// Experience.jsx
// Dynamic + scalable template: add new jobs by pushing to EXPERIENCES.

import martinreaIcon from "../assets/martinrea.png";
import gdscIcon from "../assets/gdsc.png";
import ExperienceCard from "../components/ExperienceCard";

export default function Experience() {
  const workExperinces = [
    {
      id: "martinrea-present",
      company: "Martinrea International Inc.",
      role: "Full-Stack Developer",
      start: "May 2025",
      end: "Present",
      icon: martinreaIcon,
      highlights: ["Impact statement #1 (what you built + outcome)"],
      tech: ["React", "Tailwind", "Python", "Django"],
      links: [
        // { label: "Company", href: "https://example.com" },
        // { label: "Project", href: "https://example.com" },
      ],
    },
    {
      id: "martinrea-2024",
      company: "UOG Google Developer Student Club",
      role: "Lead Software Developer",
      start: "Sep 2023",
      end: "Sep 2024",
      icon: gdscIcon,
      highlights: ["Impact statement #1 (what you built + outcome)"],
      tech: ["React", "Tailwind", "Python", "Django"],
      links: [
        // { label: "Company", href: "https://example.com" },
        // { label: "Project", href: "https://example.com" },
      ],
    },
    {
      id: "martinrea-2024",
      company: "Martinrea International Inc",
      role: "Role Title",
      start: "May 2024",
      end: "Aug 2024",
      icon: martinreaIcon,
      highlights: ["Impact statement #1 (what you built + outcome)"],
      tech: ["React", "Tailwind", "Python", "Django"],
      links: [
        // { label: "Company", href: "https://example.com" },
        // { label: "Project", href: "https://example.com" },
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
