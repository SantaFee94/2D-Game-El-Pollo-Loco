class Clouds extends MovableObject {
y= 15;
height = 325;
width = 500;

  constructor() {
    super().loadImage('img/5_background/layers/4_clouds/1.png');
    this.x = Math.random() * 500;
    
  }
}
