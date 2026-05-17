import { Link, useLocation } from "react-router-dom";
import { Home, Plus, Sparkles } from "lucide-react";

const navItems = [
  {
    title: "Notes",
    subtitle: "All notes in one place",
    path: "/dashboard",
    icon: Home
  },
  {
    title: "New note",
    subtitle: "Create a new workspace",
    path: "/note/new",
    icon: Plus
  }
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden xl:flex xl:w-[280px] xl:flex-col xl:gap-8 p-4 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-[0_30px_80px_rgba(15,23,42,0.45)] sticky top-4 h-[calc(100vh-32px)]">
      <div className="space-y-4">
        <div className="px-3 py-4 rounded-3xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs uppercase tracking-[0.24em] text-slate-400 mb-2">Workspace</div>
          <div className="text-xl font-semibold text-white">Smart Notes</div>
          <p className="mt-2 text-slate-400 text-sm">A modern collaborative note workspace.</p>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center gap-3 p-4 rounded-3xl transition border border-transparent ${active ? "bg-slate-800/90 shadow-xl shadow-slate-950/30" : "bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/80"}`}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-800 text-slate-200">
                  <Icon size={18} />
                </span>
                <div className="min-w-0">
                  <div className="font-semibold text-white truncate">{item.title}</div>
                  <p className="text-sm text-slate-400 truncate">{item.subtitle}</p>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto rounded-3xl bg-slate-900/80 border border-slate-800 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Pro workflow</p>
            <p className="mt-2 text-white font-semibold">Keep every note organized.</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/10">
            <Sparkles size={18} />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
