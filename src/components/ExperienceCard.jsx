export default function ExperienceCard({ exp }) {
  return (
    <div className="w-full p-4 border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] bg-[#c3c7cb]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="shrink-0 sm:w-[220px] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] p-2">
          <div className="flex items-center justify-center border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white bg-[#c3c7cb] h-[200px]">
            <img
              src={exp.icon}
              alt={`${exp.company} logo`}
              className="h-[160px] w-[160px]"
            />
          </div>
        </div>

        <div className="flex-1">
          <div className="font-fixedsys text-[18px] text-[#24415f] truncate">
            {exp.role}
          </div>

          <div className=" font-fixedsys text-sm text-[#24415f]">
            {exp.start} — {exp.end}
          </div>

          <div className="font-fixedsys text-sm text-[#24415f]">
            <span className="truncate">{exp.company}</span>
          </div>

          <div className="my-3">
            <div className="h-[1px] bg-white" />
            <div className="h-[1px] bg-[#808080]" />
          </div>

          {exp.highlights?.length ? (
            <ul className="mt-2 list-disc space-y-1 pl-5 font-fixedsys text-sm text-[#24415f]">
              {exp.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          ) : null}

          {exp.tech?.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {exp.tech.map((t) => (
                <span
                  key={t}
                  className="border border-[#808080] bg-[#c0c0c0] px-2 py-[2px] font-fixedsys text-xs text-[#24415f]"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}

          {exp.links?.length ? (
            <div className="mt-4 flex flex-wrap gap-3">
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
                  {l.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
