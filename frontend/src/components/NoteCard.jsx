import { Link } from "react-router-dom";

const NoteCard = ({ note }) => {
  const plainText = note.content
    ?.replace(/<[^>]+>/g, "")
    ?.slice(0, 120)
    .trim();

  const accessLabel =
    note.access === "owner"
      ? "Owner"
      : note.access === "editor"
      ? "Editor"
      : note.access === "viewer"
      ? "Viewer"
      : "Shared";

  const pillClasses =
    note.access === "owner"
      ? "bg-blue-500 text-slate-950"
      : note.access === "editor"
      ? "bg-emerald-500 text-slate-950"
      : note.access === "viewer"
      ? "bg-amber-500 text-slate-950"
      : "bg-slate-700 text-white";

  const formattedDate = note.updatedAt
    ? new Date(note.updatedAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric"
      })
    : note.createdAt
    ? new Date(note.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric"
      })
    : "Today";

  return (
    <Link to={`/note/${note.id}`} className="group block h-full">
      <div className="h-full rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-[0_22px_50px_rgba(15,23,42,0.35)] transition hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-900/95">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-xl font-semibold leading-tight text-white line-clamp-2">{note.title || "Untitled note"}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400 line-clamp-3">{plainText || "No content yet. Open the note to begin collaborating."}</p>
          </div>
          <span className={`rounded-2xl px-3 py-1 text-xs font-semibold ${pillClasses}`}>{accessLabel}</span>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-slate-400">
          <span>{formattedDate} updated</span>
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-1">
            {note.access === "owner" ? "Private" : "Shared"}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default NoteCard;