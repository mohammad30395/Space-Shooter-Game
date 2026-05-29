"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import GameHUD from "@/components/GameHUD";
import MobileControls from "@/components/MobileControls";
import ResultModal from "@/components/ResultModal";
import { DEFAULT_PLAYGROUND_ID, getPlayground } from "@/lib/gameConfig";
import { getLevelByNumber, isLevelUnlocked } from "@/lib/levels";
import { getCurrentUserProfile, getSelectedPlaygroundId, saveGameRecord } from "@/lib/storage";
import { createKeyboardControls } from "@/game/controls";
import { SpaceShooterEngine } from "@/game/gameEngine";
import { SoundSystem } from "@/game/sound";

const initialHud = {
  score: 0,
  health: 3,
  maxHealth: 3,
  paused: false,
  finished: false,
  bossHealth: null
};

export default function SpaceShooterGame({ initialLevel }) {
  const router = useRouter();
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const soundRef = useRef(null);
  const activePointerRef = useRef(null);
  const [user, setUser] = useState(null);
  const [playground, setPlayground] = useState(() => getPlayground(DEFAULT_PLAYGROUND_ID));
  const [hud, setHud] = useState(initialHud);
  const [result, setResult] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [ready, setReady] = useState(false);
  const levelConfig = useMemo(() => getLevelByNumber(initialLevel), [initialLevel]);

  useEffect(() => {
    document.body.classList.add("game-lock");
    return () => {
      document.body.classList.remove("game-lock");
      soundRef.current?.close();
    };
  }, []);

  useEffect(() => {
    setReady(false);
    setResult(null);
    setHud(initialHud);
    const currentUser = getCurrentUserProfile();

    if (!currentUser) {
      router.replace("/play");
      return;
    }

    if (!isLevelUnlocked(currentUser, levelConfig.level)) {
      router.replace("/levels");
      return;
    }

    setUser(currentUser);
    setPlayground(getPlayground(getSelectedPlaygroundId() || DEFAULT_PLAYGROUND_ID));
    setReady(true);
  }, [levelConfig.level, router]);

  const handleFinish = useCallback(
    (engineResult) => {
      const activeUser = getCurrentUserProfile();
      if (!activeUser) {
        router.replace("/play");
        return;
      }

      const saved = saveGameRecord({
        username: activeUser.username,
        name: activeUser.name,
        level: levelConfig.level,
        playgroundId: playground.id,
        playgroundName: playground.name,
        score: engineResult.score,
        result: engineResult.result,
        won: engineResult.won
      });

      const savedUser = saved?.user ?? activeUser;
      setUser(savedUser);
      setResult({
        result: engineResult.result,
        won: engineResult.won,
        name: savedUser.name,
        username: savedUser.username,
        level: levelConfig.level,
        playgroundName: playground.name,
        score: Math.round(engineResult.score),
        nextLevelAvailable: engineResult.won && levelConfig.level < 10
      });
    },
    [levelConfig.level, playground.id, playground.name, router]
  );

  useEffect(() => {
    if (!ready || !canvasRef.current || !user) return undefined;

    if (!soundRef.current) {
      soundRef.current = new SoundSystem();
      setSoundEnabled(soundRef.current.enabled);
    }

    const engine = new SpaceShooterEngine(canvasRef.current, {
      levelConfig,
      playground,
      sound: soundRef.current,
      onHudChange: setHud,
      onFinish: handleFinish
    });

    engineRef.current = engine;

    const disposeKeyboard = createKeyboardControls({
      onDirectionChange: (direction, active) => engine.setDirection(direction, active),
      onShootingChange: (active) => engine.setShooting(active, "keyboard"),
      onPause: () => engine.togglePause(),
      onInputStart: () => engine.primeAudio()
    });

    const resizeObserver = new ResizeObserver(() => engine.resize());
    if (canvasRef.current.parentElement) {
      resizeObserver.observe(canvasRef.current.parentElement);
    }

    engine.start();

    return () => {
      disposeKeyboard();
      resizeObserver.disconnect();
      engine.dispose();
      engineRef.current = null;
    };
  }, [handleFinish, levelConfig, playground, ready, user]);

  const handlePlayAgain = useCallback(() => {
    setResult(null);
    setHud(initialHud);
    engineRef.current?.restart();
  }, []);

  const handleNextLevel = useCallback(() => {
    router.push(`/game?level=${levelConfig.level + 1}`);
  }, [levelConfig.level, router]);

  const handleBackToLevels = useCallback(() => {
    router.push("/levels");
  }, [router]);

  const handleHome = useCallback(() => {
    router.push("/");
  }, [router]);

  const handlePause = useCallback(() => {
    engineRef.current?.togglePause();
  }, []);

  const handleRestart = useCallback(() => {
    setResult(null);
    setHud(initialHud);
    engineRef.current?.restart();
  }, []);

  const handleDirectionChange = useCallback((direction, active) => {
    if (active) {
      engineRef.current?.primeAudio();
    }
    engineRef.current?.setDirection(direction, active);
  }, []);

  const handleShootingChange = useCallback((active) => {
    if (active) {
      engineRef.current?.primeAudio();
    }
    engineRef.current?.setShooting(active, "mobile-controls");
  }, []);

  const handleSoundToggle = useCallback(() => {
    if (!soundRef.current) {
      soundRef.current = new SoundSystem();
    }

    setSoundEnabled(soundRef.current.toggle());
  }, []);

  const getCanvasPoint = useCallback((event) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }, []);

  const handleCanvasPointerDown = useCallback(
    (event) => {
      const engine = engineRef.current;
      const point = getCanvasPoint(event);
      if (!engine || !point) return;

      event.preventDefault();
      event.currentTarget.setPointerCapture?.(event.pointerId);
      engine.primeAudio();
      engine.setPointerTarget(point);

      if (event.pointerType === "mouse") {
        if (event.button === 0) {
          engine.setShooting(true, "mouse");
        }
        return;
      }

      const startedOnPlayer = engine.isPointOnPlayer(point, 28);
      activePointerRef.current = {
        id: event.pointerId,
        shooting: startedOnPlayer
      };
      engine.setShooting(startedOnPlayer, "touch");
    },
    [getCanvasPoint]
  );

  const handleCanvasPointerMove = useCallback(
    (event) => {
      const engine = engineRef.current;
      const point = getCanvasPoint(event);
      if (!engine || !point) return;

      if (event.pointerType === "mouse") {
        engine.setPointerTarget(point);
        engine.setShooting((event.buttons & 1) === 1, "mouse");
        return;
      }

      if (activePointerRef.current?.id !== event.pointerId) return;
      event.preventDefault();
      engine.setPointerTarget(point);
      engine.setShooting(Boolean(activePointerRef.current.shooting), "touch");
    },
    [getCanvasPoint]
  );

  const handleCanvasPointerUp = useCallback((event) => {
    const engine = engineRef.current;
    if (!engine) return;

    if (event.pointerType === "mouse") {
      engine.setShooting(false, "mouse");
      return;
    }

    if (activePointerRef.current?.id === event.pointerId) {
      activePointerRef.current = null;
      engine.setShooting(false, "touch");
      engine.setPointerTarget(null);
    }
  }, []);

  if (!ready || !user) {
    return (
      <main className="game-page grid place-items-center bg-slate-950 text-white">
        <div className="glass-panel rounded-xl px-6 py-5 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-cyan-100">Loading mission</p>
        </div>
      </main>
    );
  }

  return (
    <main className="game-page space-bg flex flex-col gap-2 p-2 text-white sm:gap-3 sm:p-3">
      <GameHUD
        hud={hud}
        levelConfig={levelConfig}
        playground={playground}
        soundEnabled={soundEnabled}
        onPause={handlePause}
        onRestart={handleRestart}
        onExit={handleBackToLevels}
        onSoundToggle={handleSoundToggle}
      />

      <section className="relative min-h-0 flex-1 overflow-hidden rounded-xl border border-white/10 bg-slate-950 shadow-2xl">
        <canvas
          ref={canvasRef}
          className="game-canvas cursor-crosshair"
          aria-label="Space shooter game canvas"
          onPointerDown={handleCanvasPointerDown}
          onPointerMove={handleCanvasPointerMove}
          onPointerUp={handleCanvasPointerUp}
          onPointerCancel={handleCanvasPointerUp}
          onPointerLeave={handleCanvasPointerUp}
          onContextMenu={(event) => event.preventDefault()}
        />
        <MobileControls
          paused={hud.paused}
          onDirectionChange={handleDirectionChange}
          onShootingChange={handleShootingChange}
          onPause={handlePause}
        />
      </section>

      <ResultModal
        result={result}
        onPlayAgain={handlePlayAgain}
        onNextLevel={handleNextLevel}
        onBackToLevels={handleBackToLevels}
        onHome={handleHome}
      />
    </main>
  );
}
