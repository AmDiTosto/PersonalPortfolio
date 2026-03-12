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

const SKILL_ICONS = [
  { id: "python", label: "Python", src: pythonIcon },
  { id: "cpp", label: "C++", src: cppIcon },
  { id: "c", label: "C", src: cIcon },
  { id: "html", label: "HTML", src: htmlIcon },
  { id: "css", label: "CSS", src: cssIcon },
  { id: "javascript", label: "Javascript", src: javascriptIcon },
  { id: "react", label: "React", src: reactIcon },
  { id: "django", label: "Django", src: djangoIcon },
  { id: "mongo", label: "Mongo", src: mongoIcon },
  { id: "firebase", label: "Firebase", src: firebaseIcon },
  { id: "docker", label: "Docker", src: dockerIcon },
  { id: "linux", label: "Linux", src: linuxIcon },
];

export default function MyComputerPage() {
  return (
    <div className="w-full bg-[#c3c7cb] p-3">
      <div className="flex w-full flex-col gap-3">
        {/* Intro Panel */}
        <div className="border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] bg-[#c0c0c0]">
          <div className="bg-[#0000aa] p-5">
            <div className="font-fixedsys text-2xl text-white">
              Hello World!
            </div>
            <div className="mt-4 space-y-4 font-fixedsys text-lg leading-relaxed text-white">
              <p>
                My name is Adrian, and welcome to my site! I&rsquo;m a student
                based in Toronto, Ontario, where I currently study Computer
                Science at the University of Guelph. I love solving challenging
                problems and developing software that addresses real-world
                problems and makes a meaningful impact.
              </p>
              <p>
                When I&rsquo;m not fixing bugs that I created, I&rsquo;m usually
                learning about AI, hitting some cardio at the gym, or enjoying a
                movie or TV show!
              </p>
            </div>

            <div className="mt-6 text-lg font-fixedsys text-white">
              <span>C:\Users\Adrian&gt;</span>
              <span className="ml-2 inline-block h-[18px] w-[10px] animate-pulse bg-white align-middle" />
            </div>
          </div>
        </div>

        {/* Icons Panel */}
        <div className="border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] bg-[#c0c0c0] p-4">
          <div className="mb-3 font-fixedsys text-sm text-[#24415f]">
            Tools / Skills
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {SKILL_ICONS.map((item) => (
              <div
                key={item.id}
                className="group flex cursor-pointer flex-col items-center gap-2"
              >
                <div className="flex items-center justify-center border-4 p-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] bg-[#c3c7cb] transition-all duration-150 group-hover:bg-[#b0b4b8] group-hover:border-t-[#808080] group-hover:border-l-[#808080] group-hover:border-r-white group-hover:border-b-white">
                  <img
                    src={item.src}
                    alt={item.label}
                    draggable={false}
                    className="object-contain [image-rendering:pixelated]"
                  />
                </div>

                <div className="font-fixedsys text-lg text-[#24415f] transition-colors duration-150 group-hover:text-[#1b2f44]">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
