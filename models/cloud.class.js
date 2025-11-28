class Clouds extends MovableObject {
  y = 15;
  height = 265;
  width = 350;
  images = window.BACKGROUND_CLOUDS.CLOUDS;

  constructor() {
    const images = window.BACKGROUND_CLOUDS.CLOUDS;
    const randomIndex = Math.floor(Math.random() * images.length);
    const randomPath = images[randomIndex];
    super().loadImage(randomPath);
    this.x = 200 + Math.random() * 4800;
    this.speed = 0.1 + Math.random() * 0.3;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 60);
  }
}