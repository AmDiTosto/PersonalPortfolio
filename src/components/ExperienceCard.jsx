export default function ExperienceCard({ exp }) {
  return (
    <div className="win-raise overflow-hidden bg-win-face">
      <div className="flex items-start gap-4 p-4">
        <div className="win-sink flex h-20 w-20 shrink-0 items-center justify-center bg-white sm:h-24 sm:w-24">
          <img
            src={exp.icon}
            alt={`${exp.company || exp.role} logo`}
            draggable={false}
            className="pointer-events-none h-16 w-16 select-none object-contain sm:h-[76px] sm:w-[76px]"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-ui text-lg font-bold text-win-text sm:text-xl">
            {exp.role}
          </h3>

          {exp.company ? (
            <div className="mt-0.5 font-ui text-sm font-semibold text-win-title sm:text-base">
              {exp.company}
            </div>
          ) : null}

          {exp.start && exp.end ? (
            <span className="win-sink mt-1.5 inline-block bg-white px-2 py-0.5 font-ui text-sm font-medium text-win-muted">
              {exp.start} — {exp.end}
            </span>
          ) : null}
        </div>
      </div>

      <div className="px-4 pb-4">
        {exp.highlights?.length ? (
          <div className="space-y-2 font-ui text-sm leading-relaxed text-win-text sm:text-[15px]">
            {exp.highlights.map((h, i) => (
              <p key={i}>{h}</p>
            ))}
          </div>
        ) : null}

        {exp.tech?.length ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {exp.tech.map((t) => (
              <span
                key={t}
                className="win-sink bg-white px-2 py-[3px] font-ui text-xs font-medium text-win-text sm:text-sm"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
