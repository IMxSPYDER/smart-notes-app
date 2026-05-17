import { Link } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const Landing = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-slate-100">
      <header className="mx-auto flex max-w-[1100px] items-center justify-between px-6 py-6">
        <div>
          <h1 className="text-2xl font-bold">Smart Notes</h1>
          <p className="text-sm text-slate-400">Collaborative notes for teams and creators</p>
        </div>
        {/* <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="rounded-full bg-slate-800/60 p-2 text-slate-200 hover:bg-slate-800/80"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link to="/login" className="rounded-full bg-slate-800/60 px-4 py-2 text-sm font-semibold">Login</Link>
          <Link to="/register" className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-900">Register</Link>
        </div> */}
      </header>

      <main className="mx-auto flex max-w-[1100px] items-center gap-12 px-6 py-16">
        <section className="flex-1">
          <h2 className="text-4xl font-extrabold leading-snug">Collaborative notes, reimagined for teams</h2>
          <p className="mt-4 max-w-[48ch] text-slate-400">Write, share and collaborate in real-time. Rich editing, permissions, version history, and secure syncing for teams and creators.</p>

          <div className="mt-8 flex gap-4">
            <Link to="/register" className="rounded-2xl bg-cyan-500 px-6 py-3 font-semibold text-slate-900 hover:bg-cyan-400">Get started — it's free</Link>
            <Link to="/login" className="rounded-2xl border border-slate-700 px-6 py-3 font-semibold text-slate-200 hover:border-slate-600">Sign in</Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-900/60 p-4">
              <h4 className="font-semibold text-white">Live collaboration</h4>
              <p className="mt-2 text-sm text-slate-400">Invite teammates and see edits in real-time.</p>
            </div>
            <div className="rounded-2xl bg-slate-900/60 p-4">
              <h4 className="font-semibold text-white">Rich editor</h4>
              <p className="mt-2 text-sm text-slate-400">Formatting, code blocks, embeds and more.</p>
            </div>
            <div className="rounded-2xl bg-slate-900/60 p-4">
              <h4 className="font-semibold text-white">Version history</h4>
              <p className="mt-2 text-sm text-slate-400">Recover previous drafts and track changes.</p>
            </div>
            <div className="rounded-2xl bg-slate-900/60 p-4">
              <h4 className="font-semibold text-white">Access controls</h4>
              <p className="mt-2 text-sm text-slate-400">Share with view or edit permissions.</p>
            </div>
          </div>
        </section>

        <aside className="hidden w-96 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 shadow-lg sm:block">
          <h3 className="text-lg font-semibold">Quick tour</h3>
          <ol className="mt-4 space-y-3 text-sm text-slate-300">
            <li>• Create notes with rich formatting.</li>
            <li>• Share with teammates and control access.</li>
            <li>• Restore older versions instantly.</li>
            <li>• Real-time collaboration and syncing.</li>
          </ol>
        </aside>
      </main>
    </div>
  );
};

export default Landing;
