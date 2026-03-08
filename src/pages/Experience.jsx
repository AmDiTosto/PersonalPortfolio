import martinreaIcon from "../assets/companyIcons/martinrea.png";
import gdscIcon from "../assets/companyIcons/gdsc.png";
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
      highlights: [
        "I’m currently developing a real-time data-streaming application that processes production data from multiple manufacturing robots. It calculates key performance metrics and outputs the results to various dashboards, allowing teams to monitor performance and efficiency in real time.",
      ],
      tech: ["C++", "Docker", "React", "Tailwind", "MQTT", "Mongo"],
    },
    {
      id: "gdsc-2023-2024",
      company: "UOG Google Developer Student Club",
      role: "Technical Director",
      start: "Sep 2023",
      end: "Sep 2024",
      icon: gdscIcon,
      highlights: [
        "I was the Technical Lead for the Google Developer Student Club at the University of Guelph during the 2023–2024 academic year. In this role, I created and led several technical workshops that introduced students to a variety of technologies. I also had the opportunity to help organize a hackathon that welcomed over 250 attendees!",
      ],
      tech: ["HTML", "CSS", "JavaScript", "Firebase"],
    },
    {
      id: "martinrea-2024",
      company: "Martinrea International Inc",
      role: "Full-Stack Developer",
      start: "May 2024",
      end: "Aug 2024",
      icon: martinreaIcon,
      highlights: [
        "Reconfigured an internal system that serves as a central source of information across the organization, by improving how data is shared and accessed by teams globally. I developed responsive user interface components that allow employees to input and manage machine specifications. I also redesigned the backend and SQL data structures to support a more dynamic and scalable system, and designed REST API endpoints that allow data submitted from the frontend to be stored and managed on the backend.",
      ],
      tech: ["React", "Tailwind", "Python", "SQL", "REST"],
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
