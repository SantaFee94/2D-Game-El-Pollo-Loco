class GameKeyboard {
  ALL_KEYS = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space"];
  idleStartTimeoutId = null;
  idleDelay = 1000; 

  constructor() {
    this.ALL_KEYS.forEach(key => {
      this[key] = false;
    });
    
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
    } else if (!this.hasActiveKeys()) {
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
      if (!this.hasActiveKeys() && window.world?.character) {
        window.world.character.StartIdle();
      }
      this.idleStartTimeoutId = null;
    }, this.idleDelay);
  }

  hasActiveKeys() {
    return this.ALL_KEYS.some((code) => this[code]);
  }
}

window.GameKeyboard = GameKeyboard;
