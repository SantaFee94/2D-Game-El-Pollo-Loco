class MovableObject {
  x = 100;
  y = 155;
  img;
  height = 280;
  width = 130;
  speed = 5;
  imageCache = {};
  currentImage = 0;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  groundLevel = 155;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  loadImages(arr) {
    arr.forEach((path) => {
      const img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      } else {
        this.speedY = 0;
      }
    }, 1000 / 60);
  }

  isAboveGround() {
    return this.y < this.groundLevel;
  }

  jump() {
    this.speedY = 35;
  }

  isColliding(other) {
    const a = this.getHitbox();
    const b = other.getHitbox
      ? other.getHitbox()
      : {
          x: other.x,
          y: other.y,
          width: other.width,
          height: other.height,
        };

    return !(
      (
        a.x + a.width < b.x || // a ist links von b
        a.x > b.x + b.width || // a ist rechts von b
        a.y + a.height < b.y || // a ist über b
        a.y > b.y + b.height
      ) // a ist unter b
    );
  }
  
}
