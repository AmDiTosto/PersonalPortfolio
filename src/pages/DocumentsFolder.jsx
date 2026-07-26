import { useRef, useState } from "react";
import documentIcon from "../assets/desktopIcons/document-0.svg";

const DEFAULT_DOC_NAME = "New Text Document";

function stripDocExt(name) {
  return name.replace(/\.[^.]+$/, "");
}

export default function DocumentsFolder({
  docs,
  onOpenDoc,
  onDelete,
  onCreate,
  onRename,
}) {
  const [menu, setMenu] = useState(null);
  const [pendingName, setPendingName] = useState(null);
  const [renaming, setRenaming] = useState(null);
  const committedRef = useRef(false);
  const names = Object.keys(docs).sort();

  function uniqueDefaultName() {
    const base = DEFAULT_DOC_NAME.toLowerCase();
    if (!(`${base}.txt` in docs)) return DEFAULT_DOC_NAME;
    let index = 2;
    while (`${base} (${index}).txt` in docs) index += 1;
    return `${DEFAULT_DOC_NAME} (${index})`;
  }

  function startCreate() {
    setMenu(null);
    setRenaming(null);
    committedRef.current = false;
    setPendingName(uniqueDefaultName());
  }

  function commitCreate() {
    if (committedRef.current) return;
    committedRef.current = true;
    onCreate(pendingName?.trim() || DEFAULT_DOC_NAME);
    setPendingName(null);
  }

  function cancelCreate() {
    committedRef.current = true;
    setPendingName(null);
  }

  function startRename(name) {
    setMenu(null);
    setPendingName(null);
    committedRef.current = false;
    setRenaming({ original: name, value: stripDocExt(name) });
  }

  function commitRename() {
    if (committedRef.current) return;
    committedRef.current = true;
    if (renaming && renaming.value.trim()) {
      onRename(renaming.original, renaming.value);
    }
    setRenaming(null);
  }

  function cancelRename() {
    committedRef.current = true;
    setRenaming(null);
  }

  const isEmpty = names.length === 0 && pendingName === null;

  return (
    <div
      className="min-h-full"
      onContextMenu={(e) => {
        e.preventDefault();
        setMenu({ type: "new", x: e.clientX, y: e.clientY });
      }}
    >
      {isEmpty ? (
        <p className="font-ui text-sm text-win-muted">
          This folder is empty. Right-click here and choose{" "}
          <span className="font-bold text-win-text">New Text Document</span> to
          create one.
        </p>
      ) : (
        <div className="flex flex-wrap content-start gap-1">
          {names.map((name) =>
            renaming?.original === name ? (
              <div
                key={name}
                className="flex w-[84px] flex-col items-center gap-1 p-2"
              >
                <img
                  src={documentIcon}
                  alt=""
                  draggable="false"
                  className="h-10 w-10 object-contain"
                />
                <input
                  autoFocus
                  value={renaming.value}
                  onChange={(e) =>
                    setRenaming({ ...renaming, value: e.target.value })
                  }
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitRename();
                    else if (e.key === "Escape") cancelRename();
                  }}
                  onBlur={commitRename}
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  className="win-sink w-full bg-white px-1 py-0.5 text-center font-ui text-xs text-black outline-none"
                />
              </div>
            ) : (
              <button
                key={name}
                type="button"
                onClick={() => onOpenDoc(name)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setMenu({ type: "doc", name, x: e.clientX, y: e.clientY });
                }}
                className="flex w-[84px] flex-col items-center gap-1 rounded p-2 text-center hover:bg-win-title/10"
              >
                <img
                  src={documentIcon}
                  alt=""
                  draggable="false"
                  className="h-10 w-10 object-contain"
                />
                <span className="w-full break-words font-ui text-xs text-win-text">
                  {name}
                </span>
              </button>
            ),
          )}

          {pendingName !== null ? (
            <div className="flex w-[84px] flex-col items-center gap-1 p-2">
              <img
                src={documentIcon}
                alt=""
                draggable="false"
                className="h-10 w-10 object-contain"
              />
              <input
                autoFocus
                value={pendingName}
                onChange={(e) => setPendingName(e.target.value)}
                onFocus={(e) => e.target.select()}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitCreate();
                  else if (e.key === "Escape") cancelCreate();
                }}
                onBlur={commitCreate}
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                className="win-sink w-full bg-white px-1 py-0.5 text-center font-ui text-xs text-black outline-none"
              />
            </div>
          ) : null}
        </div>
      )}

      {menu ? (
        <>
          <div
            className="fixed inset-0 z-[80]"
            onClick={() => setMenu(null)}
            onContextMenu={(e) => {
              e.preventDefault();
              setMenu(null);
            }}
          />
          <div
            className="win-frame fixed z-[90] w-40 bg-win-face py-1"
            style={{ left: `${menu.x}px`, top: `${menu.y}px` }}
          >
            {menu.type === "doc" ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onOpenDoc(menu.name);
                    setMenu(null);
                  }}
                  className="flex w-full items-center px-3 py-1 font-ui text-sm font-bold text-win-text hover:bg-win-title hover:text-win-title-text"
                >
                  Open
                </button>
                <button
                  type="button"
                  onClick={() => startRename(menu.name)}
                  className="flex w-full items-center px-3 py-1 font-ui text-sm text-win-text hover:bg-win-title hover:text-win-title-text"
                >
                  Rename
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDelete(menu.name);
                    setMenu(null);
                  }}
                  className="flex w-full items-center px-3 py-1 font-ui text-sm text-win-red hover:bg-win-red hover:text-white"
                >
                  Delete
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={startCreate}
                className="flex w-full items-center gap-2 px-3 py-1 font-ui text-sm text-win-text hover:bg-win-title hover:text-win-title-text"
              >
                <img src={documentIcon} alt="" className="h-4 w-4" />
                New Text Document
              </button>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
