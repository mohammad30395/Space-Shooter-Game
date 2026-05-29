import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Pause, Play, Zap } from "lucide-react";

function ControlButton({ children, className = "", ...props }) {
  return (
    <button
      type="button"
      className={`grid h-12 w-12 place-items-center rounded-xl border border-white/15 bg-slate-950/72 text-white shadow-lg backdrop-blur-md transition active:scale-95 active:bg-cyan-300/25 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default function MobileControls({ onDirectionChange, onShootingChange, onPause, paused }) {
  function directionHandlers(direction) {
    return {
      onPointerDown: (event) => {
        event.preventDefault();
        event.currentTarget.setPointerCapture?.(event.pointerId);
        onDirectionChange(direction, true);
      },
      onPointerUp: (event) => {
        event.preventDefault();
        onDirectionChange(direction, false);
      },
      onPointerCancel: () => onDirectionChange(direction, false),
      onPointerLeave: () => onDirectionChange(direction, false)
    };
  }

  function shootingHandlers() {
    return {
      onPointerDown: (event) => {
        event.preventDefault();
        event.currentTarget.setPointerCapture?.(event.pointerId);
        onShootingChange(true);
      },
      onPointerUp: (event) => {
        event.preventDefault();
        onShootingChange(false);
      },
      onPointerCancel: () => onShootingChange(false),
      onPointerLeave: () => onShootingChange(false)
    };
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex items-end justify-between px-3 sm:hidden">
      <div className="pointer-events-auto grid grid-cols-3 grid-rows-3 gap-1">
        <span />
        <ControlButton aria-label="Move up" title="Move up" {...directionHandlers("up")}>
          <ChevronUp size={24} />
        </ControlButton>
        <span />
        <ControlButton aria-label="Move left" title="Move left" {...directionHandlers("left")}>
          <ChevronLeft size={24} />
        </ControlButton>
        <span className="h-12 w-12 rounded-xl border border-white/10 bg-white/5" />
        <ControlButton aria-label="Move right" title="Move right" {...directionHandlers("right")}>
          <ChevronRight size={24} />
        </ControlButton>
        <span />
        <ControlButton aria-label="Move down" title="Move down" {...directionHandlers("down")}>
          <ChevronDown size={24} />
        </ControlButton>
        <span />
      </div>

      <div className="pointer-events-auto flex items-end gap-2">
        <ControlButton aria-label="Pause" title="Pause" onClick={onPause}>
          {paused ? <Play size={22} /> : <Pause size={22} />}
        </ControlButton>
        <button
          type="button"
          aria-label="Shoot"
          title="Shoot"
          className="grid h-16 w-16 place-items-center rounded-full border border-cyan-200/40 bg-cyan-300 text-slate-950 shadow-glow transition active:scale-95"
          {...shootingHandlers()}
        >
          <Zap size={28} />
        </button>
      </div>
    </div>
  );
}
