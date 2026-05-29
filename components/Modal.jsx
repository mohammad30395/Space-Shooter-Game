import { X } from "lucide-react";

export default function Modal({ title, children, onClose, showClose = true }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/80 px-4 py-6 backdrop-blur-md">
      <section className="glass-panel w-full max-w-xl rounded-xl p-5 sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 className="text-xl font-black text-white sm:text-2xl">{title}</h2>
          {showClose && onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10"
              aria-label="Close modal"
              title="Close"
            >
              <X size={18} />
            </button>
          ) : null}
        </div>
        {children}
      </section>
    </div>
  );
}
