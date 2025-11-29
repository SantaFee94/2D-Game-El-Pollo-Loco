class NormalChicken extends MovableObject {
  y = 330;
  height = 100;
  width = 80;
  IMAGES_WALKING = window.ENEMIE_IMAGES.WALKING_CHICKEN_NORMAL;
  hitboxColor = 'grey';

  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.x = 200 + Math.random() * 4800; // Spawnt zwischen 200 und 5000
    this.speed = 0.2 + Math.random() * 0.5;
    this.getHitbox();
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 60);

    setInterval(() => {
      const i = this.currentImage % this.IMAGES_WALKING.length;
      const path = this.IMAGES_WALKING[i];
      if (this.imageCache[path]) this.img = this.imageCache[path];
      this.currentImage++;
    }, 150);
  }
  getHitbox() {
    const offsetX = 0;
    const offsetY = 5;
    const hitboxWidth = this.width - 0;
    const hitboxHeight = this.height - 10;

    return {
      x: this.x + offsetX,
      y: this.y + offsetY,
      width: hitboxWidth,
      height: hitboxHeight,
    };
  }
}

class SmallChicken extends MovableObject {
  y = 365;
  height = 60;
  width = 50;
  IMAGES_WALKING = window.ENEMIE_IMAGES.WALKING_CHICKEN_SMALL;
  hitboxColor = 'black';

  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.x = 200 + Math.random() * 4800; // Spawnt zwischen 200 und 5000
    this.speed = 0.3 + Math.random() * 0.6;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 60);

    setInterval(() => {
      const i = this.currentImage % this.IMAGES_WALKING.length;
      const path = this.IMAGES_WALKING[i];
      if (this.imageCache[path]) this.img = this.imageCache[path];
      this.currentImage++;
    }, 150);
  }

  getHitbox() {
    const offsetX = 4;
    const offsetY = 3;
    const hitboxWidth = this.width - 8;
    const hitboxHeight = this.height - 8;

    return {
      x: this.x + offsetX,
      y: this.y + offsetY,
      width: hitboxWidth,
      height: hitboxHeight,
    };
  }
}
