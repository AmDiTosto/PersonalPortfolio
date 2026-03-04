import cppIcon from "../assets/csIcons/C++.png";
import linuxIcon from "../assets/csIcons/linux.png";
import pythonIcon from "../assets/csIcons/python.png";
import reactIcon from "../assets/csIcons/react.png";
import dockerIcon from "../assets/csIcons/docker.png";
import firebaseIcon from "../assets/csIcons/firebase.png";
import javascriptIcon from "../assets/csIcons/javascript.png";
import mongoIcon from "../assets/csIcons/mongo.png";
import djangoIcon from "../assets/csIcons/django.png";
import htmlIcon from "../assets/csIcons/html.png";
import nodejsIcon from "../assets/csIcons/nodejs.png";
import cssIcon from "../assets/csIcons/css.png";

const SKILL_ICONS = [
  { id: "python", label: "Python", src: pythonIcon },
  { id: "cpp", label: "C++", src: cppIcon },
  { id: "html", label: "HTML", src: htmlIcon },
  { id: "css", label: "CSS", src: cssIcon },
  { id: "javascript", label: "Javascript", src: javascriptIcon },
  { id: "react", label: "React", src: reactIcon },
  { id: "nodejs", label: "Node.JS", src: nodejsIcon },
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
            <div className="font-fixedsys text-[22px] text-white">
              Hello World!
            </div>

            <div className="mt-4 space-y-3 font-fixedsys text-[16px] leading-relaxed text-white">
              <p>
                My name is Adrian Di Tosto. I’m a Computer Science student
                focused on building real-world software systems.
              </p>
              <p>
                I work on manufacturing analytics, edge systems, React
                dashboards, and NLP research.
              </p>
            </div>

            <div className="mt-6 font-fixedsys text-white">
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
                <div className=" flex items-center justify-center border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] bg-[#c3c7cb] transition-all duration-150 group-hover:bg-[#b0b4b8] group-hover:border-t-[#808080] group-hover:border-l-[#808080] group-hover:border-r-white group-hover:border-b-white">
                  <img
                    src={item.src}
                    alt={item.label}
                    draggable={false}
                    className="h-10 w-10 object-contain [image-rendering:pixelated]"
                  />
                </div>

                <div className="font-fixedsys text-sm text-[#24415f] transition-colors duration-150 group-hover:text-[#1b2f44]">
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
