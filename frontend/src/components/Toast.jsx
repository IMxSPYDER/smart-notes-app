import { X } from "lucide-react";

const toastStyles = {
  success: "bg-emerald-500/95 text-slate-950",
  error: "bg-rose-500/95 text-white",
  info: "bg-slate-900/95 text-slate-100"
};

const Toast = ({ toasts, onDismiss }) => {
  if (!toasts.length) return null;

  return (
    <div className="fixed right-4 bottom-4 z-50 flex w-full max-w-sm flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start justify-between gap-4 rounded-3xl px-4 py-3 shadow-2xl shadow-slate-950/20 backdrop-blur-sm border border-slate-800 ${toastStyles[toast.variant] || toastStyles.info}`}
        >
          <div className="space-y-1">
            <p className="font-semibold text-sm">{toast.title}</p>
            <p className="text-[0.95rem] opacity-90">{toast.message}</p>
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="rounded-full border border-slate-700/80 bg-slate-950/10 p-2 text-slate-100 hover:bg-slate-900"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
