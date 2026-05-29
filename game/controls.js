export const EMPTY_INPUT = {
  up: false,
  down: false,
  left: false,
  right: false,
  shooting: false,
  pointerTarget: null
};

const directionKeyMap = {
  ArrowUp: "up",
  KeyW: "up",
  ArrowDown: "down",
  KeyS: "down",
  ArrowLeft: "left",
  KeyA: "left",
  ArrowRight: "right",
  KeyD: "right"
};

export function getInputVector(input) {
  const x = Number(Boolean(input.right)) - Number(Boolean(input.left));
  const y = Number(Boolean(input.down)) - Number(Boolean(input.up));

  if (x !== 0 && y !== 0) {
    return { x: x * 0.7071, y: y * 0.7071 };
  }

  return { x, y };
}

export function createKeyboardControls({ onDirectionChange, onShootingChange, onPause, onInputStart }) {
  const pressedKeys = new Set();
  const fireCodes = new Set(["Space", "KeyF"]);
  const handledCodes = new Set([...Object.keys(directionKeyMap), ...fireCodes, "KeyP"]);

  function handleKeyDown(event) {
    if (!handledCodes.has(event.code)) return;
    event.preventDefault();
    onInputStart?.();

    if (pressedKeys.has(event.code) && !fireCodes.has(event.code)) return;
    pressedKeys.add(event.code);

    if (directionKeyMap[event.code]) {
      onDirectionChange(directionKeyMap[event.code], true);
    }

    if (fireCodes.has(event.code)) {
      onShootingChange(true);
    }

    if (event.code === "KeyP") {
      onPause();
    }
  }

  function handleKeyUp(event) {
    if (!handledCodes.has(event.code)) return;
    event.preventDefault();
    pressedKeys.delete(event.code);

    if (directionKeyMap[event.code]) {
      onDirectionChange(directionKeyMap[event.code], false);
    }

    if (fireCodes.has(event.code)) {
      onShootingChange(false);
    }
  }

  window.addEventListener("keydown", handleKeyDown, { passive: false });
  window.addEventListener("keyup", handleKeyUp, { passive: false });

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);
  };
}
