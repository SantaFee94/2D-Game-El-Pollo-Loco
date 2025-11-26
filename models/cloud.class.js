class Clouds extends MovableObject {
  y = 15;
  height = 325;
  width = 500;
  speed = 0.2;

  constructor() {
    super().loadImage("img/5_background/layers/4_clouds/1.png");
    this.x = Math.random() * 500;

    this.animate();
  }

  animate() {
    this.moveLeft();
  }
}
