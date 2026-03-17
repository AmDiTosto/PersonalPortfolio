export default function ExperienceCard({ exp }) {
  return (
    <div className="w-full p-4 border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] bg-[#c3c7cb]">
      <div className="flex flex-col gap-4 ">
        <div className=" border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] p-2">
          <div className="flex items-center justify-center border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white bg-[#c3c7cb] h-[200px]">
            <img
              src={exp.icon}
              alt={`${exp.company} logo`}
              className="h-[160px] w-[160px] select-none pointer-events-none"
            />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-start gap-x-4 font-fixedsys text-xl text-[#24415f] truncate">
            <span>{exp.role}</span>

            {exp.links?.length ? (
              <div className="flex items-center gap-3">
                {exp.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      font-fixedsys text-sm text-[#0000aa]
                      underline
                      hover:text-[#000088]
                    "
                  >
                    <img
                      src={l.icon}
                      alt={`${l.icon} logo`}
                      className="h-[30px] w-[30px] select-none pointer-events-none"
                    />
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <div className=" font-fixedsys text-md text-[#24415f]">
            {exp.start && exp.end && (
              <>
                {exp.start} — {exp.end}
              </>
            )}
          </div>

          <div className="font-fixedsys text-md text-[#24415f]">
            <span className="truncate">{exp.company}</span>
          </div>

          <div className="my-3">
            <div className="h-[1px] bg-white" />
            <div className="h-[1px] bg-[#808080]" />
          </div>

          {exp.highlights?.length ? (
            <div className="space-y-1 font-fixedsys text-md text-[#24415f]">
              {exp.highlights.map((h, i) => (
                <p key={i}>{h}</p>
              ))}
            </div>
          ) : null}

          {exp.tech?.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {exp.tech.map((t) => (
                <span
                  key={t}
                  className="border border-[#808080] bg-[#c0c0c0] px-2 py-[2px] font-fixedsys text-sm text-[#24415f]"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
