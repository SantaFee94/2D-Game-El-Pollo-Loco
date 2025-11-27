class World {
  character = new Character();
  enemies = [];
  enemyCount = 12; 
  clouds = [new Clouds()];
  canvas;
  ctx;
  keyboard;
  camera_x = -100;
  anchorX = 100;
  cameraSmooth = 0.05;

  backgroundObjects = [
    new BackgroundObject("img/5_background/layers/air.png", 0),
    new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 0),
    new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 0),
    new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 0),
    new BackgroundObject("img/5_background/layers/air.png", 719),
    new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719),
    new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719),
    new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719),
    new BackgroundObject("img/5_background/layers/air.png", 719 * 2),
    new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 719 * 2),
    new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 719 * 2),
    new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 719 * 2),
    new BackgroundObject("img/5_background/layers/air.png", 719 * 3),
    new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719 * 3),
    new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719 * 3),
    new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719 * 3),
    new BackgroundObject("img/5_background/layers/air.png", 719 * 4),
    new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 719 * 4),
    new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 719 * 4),
    new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 719 * 4),
    new BackgroundObject("img/5_background/layers/air.png", 719 * 5),
    new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719 * 5),
    new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719 * 5),
    new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719 * 5),
    new BackgroundObject("img/5_background/layers/air.png", 719 * 6),
    new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 719 * 6),
    new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 719 * 6),
    new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 719 * 6),
  ];

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.spawnEnemies();
    this.draw();
    this.setWorld();
  }

  setWorld() {
    this.character.world = this;
  }

  draw() {
    this.updateCamera();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.backgroundObjects);
    this.addObjectsToMap(this.clouds);
    this.addToMap(this.character);
    this.maintainEnemyCount();
    this.addObjectsToMap(this.enemies);
    this.ctx.translate(-this.camera_x, 0);

    requestAnimationFrame(() => this.draw());
  }

  updateCamera() {
    const target = -this.character.x + this.anchorX;
    this.camera_x += (target - this.camera_x) * this.cameraSmooth;
    this.clampCameraXToLevel();
  }

  getLevelWidth() {
    return this.backgroundObjects?.length
      ? Math.max(...this.backgroundObjects.map((o) => (o?.x || 0) + (o?.width || 0)))
      : this.canvas?.width || 0;
  }

  clampCameraXToLevel() {
    const levelWidth = this.getLevelWidth();
    const canvasWidth = this.canvas?.width || 0;
    const minX = Math.min(0, canvasWidth - levelWidth);
    this.camera_x = Math.max(minX, Math.min(this.camera_x, 0));
  }

  addObjectsToMap(objects) {
    objects.forEach((object) => {
      this.addToMap(object);
    });
  }

  spawnEnemies() {
    const levelWidth = this.getLevelWidth();
    const padding = 100; // Abstand vom Rand
    const minGap = 120; // minimaler Abstand zwischen Gegnern
    const maxAttempts = 10;

    const positions = [];

    for (let i = 0; i < this.enemyCount; i++) {
      let x;
      let attempts = 0;
      do {
        x = padding + Math.random() * Math.max(0, levelWidth - padding * 2);
        attempts++;
      } while (
        positions.some((p) => Math.abs(p - x) < minGap) &&
        attempts < maxAttempts
      );

      positions.push(x);

      const enemy = Math.random() < 0.6 ? new NormalChicken() : new SmallChicken();
      enemy.x = x;
      this.enemies.push(enemy);
    }
  }

  /**
   * Ensure the world always has at least `enemyCount` enemies.
   * Spawns new enemies preferentially ahead of the player when possible.
   */
  maintainEnemyCount() {
    const levelWidth = this.getLevelWidth();
    const padding = 100;
    const minGap = 120;

    // If levelWidth is small, don't attempt complex spawning
    if (levelWidth <= padding * 2) return;

    while (this.enemies.length < this.enemyCount) {
      // Try to spawn ahead of the player (prefer visible/forward area)
      const canvasWidth = this.canvas?.width || 0;
      const aheadSpace = levelWidth - (this.character.x + canvasWidth);

      let spawnX;
      if (aheadSpace > 200) {
        const start = this.character.x + canvasWidth + 50;
        const end = Math.min(levelWidth - padding, start + 400);
        spawnX = start + Math.random() * Math.max(0, end - start);
      } else {
        // Not much room ahead — pick a random safe position across level
        spawnX = padding + Math.random() * Math.max(0, levelWidth - padding * 2);
      }

      // Avoid placing too close to existing enemies
      let attempts = 0;
      while (
        this.enemies.some((e) => Math.abs((e.x || 0) - spawnX) < minGap) &&
        attempts++ < 8
      ) {
        spawnX += (Math.random() - 0.5) * minGap * 2;
        // clamp
        spawnX = Math.max(padding, Math.min(levelWidth - padding, spawnX));
      }

      const enemy = Math.random() < 0.6 ? new NormalChicken() : new SmallChicken();
      enemy.x = spawnX;
      // Debug: log spawn for easier verification in browser console
      if (typeof console !== "undefined" && console.debug) {
        console.debug(`World: spawned enemy at ${Math.round(spawnX)}; total after spawn = ${this.enemies.length + 1}`);
      }
      this.enemies.push(enemy);
    }
  }

  addToMap(movableObject) {
    if (!movableObject.img) return;
    
    if (movableObject.otherDirection) {
      this.ctx.save();
      this.ctx.translate(movableObject.x + movableObject.width, movableObject.y);
      this.ctx.scale(-1, 1);
      this.ctx.drawImage(movableObject.img, 0, 0, movableObject.width, movableObject.height);
      this.ctx.restore();
      return;
    }

    this.ctx.drawImage(
      movableObject.img,
      movableObject.x,
      movableObject.y,
      movableObject.width,
      movableObject.height
    );
  }
}
