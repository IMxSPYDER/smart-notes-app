import { useContext } from "react";
import { LogOut, Sparkles, Sun, Moon } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

const Navbar = () => {
  const { logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const email = localStorage.getItem("userEmail") || "Guest";
  const initials = email.split("@")[0].slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1480px] items-center justify-between gap-4 px-4 py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400 to-sky-500 text-slate-950 shadow-lg shadow-cyan-500/20">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Smart Notes</p>
            <h1 className="text-xl font-semibold text-white">Collaborative Notes</h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden sm:flex items-center gap-3 rounded-3xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-slate-300 shadow-sm shadow-slate-950/10">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-800 text-slate-200">{initials}</div>
            <div>
              <p className="text-[0.85rem] text-slate-500">Signed in as</p>
              <p className="max-w-[180px] truncate text-sm font-medium text-white">{email}</p>
            </div>
          </div>
          {/* <button
            onClick={toggleTheme}
            title="Toggle theme"
            className="inline-flex items-center gap-2 rounded-3xl bg-slate-800 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 cursor-pointer"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button> */}
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-3xl bg-slate-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 cursor-pointer"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;