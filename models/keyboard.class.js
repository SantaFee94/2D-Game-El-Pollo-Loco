class GameKeyboard {
  ALL_KEYS = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space"];
  ArrowLeft = false;
  ArrowRight = false;
  ArrowUp = false;
  ArrowDown = false;
  Space = false;
  idleStartTimeoutId = null;
  startIdleAnimationTime = 1000; // Zeit in ms bis die Idle-Animation startet

  constructor() {
    window.addEventListener("keydown", (e) => {
      this.onKey(e, true);
    });
    window.addEventListener("keyup", (e) => {
      this.onKey(e, false);
    });
  }
  onKey(e, isPressed) {
    if (this.ALL_KEYS.includes(e.code)) {
      this[e.code] = isPressed;
    }

    this.clearIdleTimer();

    if (isPressed) {
      this.stopIdleAnimation();
    } else {
      this.startIdleTimer();
    }
  }

  clearIdleTimer() {
    if (this.idleStartTimeoutId) {
      clearTimeout(this.idleStartTimeoutId);
      this.idleStartTimeoutId = null;
    }
  }

  stopIdleAnimation() {
    if (window.world?.character) {
      window.world.character.StopIdle();
    }
  }

  startIdleTimer() {
    this.idleStartTimeoutId = setTimeout(() => {
      if (window.world?.character) {
        window.world.character.StartIdle();
      }
      this.idleStartTimeoutId = null;
    }, this.startIdleAnimationTime);
  }
}

window.GameKeyboard = GameKeyboard;
