class Clouds extends MovableObject {
y= 15;
height = 325;
width = 500;

  constructor() {
    super().loadImage('img/5_background/layers/4_clouds/1.png');
    this.x = Math.random() * 500;
    
    this.animate();
  }

  animate() {
    setInterval( () => {
      this.x -= 0.20
    }, 1000 / 60);
  }
}
