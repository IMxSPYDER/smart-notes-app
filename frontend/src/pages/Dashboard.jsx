import { useEffect, useMemo, useState } from "react";
import { Search, Plus, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import NoteCard from "../components/NoteCard";

const filterDefinitions = [
  { id: "all", label: "All Notes" },
  { id: "owned", label: "Owned" },
  { id: "shared", label: "Shared" },
  { id: "editors", label: "Editors" },
  { id: "viewers", label: "Viewers" }
];

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const currentUserId = localStorage.getItem("userId");

  const normalizeNotes = (results) =>
    results.map((note) => ({
      ...note,
      access:
        note.access ||
        (note.ownerId === currentUserId ? "owner" : "shared")
    }));

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await API.get("/notes");
      setNotes(normalizeNotes(res.data));
    } finally {
      setLoading(false);
    }
  };

  const searchNotes = async () => {
    setLoading(true);
    try {
      if (!search.trim()) {
        await fetchNotes();
        return;
      }

      const res = await API.get(`/notes/search?q=${encodeURIComponent(search)}`);
      setNotes(normalizeNotes(res.data));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      if (activeTab === "all") return true;
      if (activeTab === "owned") return note.access === "owner";
      if (activeTab === "shared") return note.access !== "owner";
      if (activeTab === "editors") return note.access === "editor";
      if (activeTab === "viewers") return note.access === "viewer";
      return true;
    });
  }, [activeTab, notes]);

  const tabCounts = useMemo(() => {
    return {
      all: notes.length,
      owned: notes.filter((note) => note.access === "owner").length,
      shared: notes.filter((note) => note.access !== "owner").length,
      editors: notes.filter((note) => note.access === "editor").length,
      viewers: notes.filter((note) => note.access === "viewer").length
    };
  }, [notes]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <div className="mx-auto flex max-w-[1480px] gap-6 px-4 py-6 lg:px-8">
        <Sidebar />

        <main className="flex-1 space-y-6">
          <section className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.45)]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-[0.26em] text-cyan-400">Dashboard</p>
                <h2 className="text-3xl font-semibold text-white">Your collaborative notes</h2>
                <p className="max-w-2xl text-slate-400">Quickly find notes, see what’s shared, and open a new workspace with one click.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={fetchNotes}
                  className="inline-flex items-center gap-2 rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-200 transition hover:border-slate-700 hover:bg-slate-800 cursor-pointer"
                >
                  <RefreshCcw size={16} />
                  Refresh
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/note/new")}
                  className="inline-flex items-center gap-2 rounded-3xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 cursor-pointer"
                >
                  <Plus size={16} />
                  New note
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && searchNotes()}
                  placeholder="Search notes, titles, and content"
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950/90 px-12 py-4 text-slate-100 shadow-inner shadow-black/10 outline-none transition focus:border-cyan-400"
                />
              </div>
              <button
                type="button"
                onClick={searchNotes}
                className="rounded-3xl bg-blue-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-blue-400 cursor-pointer"
              >
                Search
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {filterDefinitions.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveTab(filter.id)}
                  className={`rounded-3xl px-4 py-3 text-sm font-medium transition ${activeTab === filter.id ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20" : "border border-slate-800 bg-slate-900/90 text-slate-300 hover:bg-slate-900 cursor-pointer"}`}
                >
                  {filter.label} <span className="ml-2 text-slate-400">{tabCounts[filter.id]}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Notes</p>
                <h3 className="text-2xl font-semibold text-white">{activeTab === "all" ? "All Notes" : filterDefinitions.find((tab) => tab.id === activeTab)?.label}</h3>
              </div>
              <p className="text-sm text-slate-400">{filteredNotes.length} note{filteredNotes.length === 1 ? "" : "s"} found</p>
            </div>

            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-56 animate-pulse rounded-3xl bg-slate-900/70" />
                ))}
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-slate-800 bg-slate-900/80 p-10 text-center text-slate-400">
                <p className="text-lg font-semibold text-white">No notes match this view yet.</p>
                <p className="mt-3 text-sm text-slate-500">Try a different filter, search term, or create a new note to start collaborating.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredNotes.map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>

      <button
        type="button"
        onClick={() => navigate("/note/new")}
        className="fixed bottom-6 right-6 z-30 inline-flex items-center gap-3 rounded-full bg-cyan-500 px-5 py-4 text-sm font-semibold text-slate-950 shadow-2xl shadow-cyan-500/20 transition hover:bg-cyan-400 cursor-pointer"
      >
        <Plus size={18} />
        Create note
      </button>
    </div>
  );
};

export default Dashboard;