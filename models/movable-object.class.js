class MovableObject {
  x = 80;
  y = 155;
  img;
  height = 280;
  width = 130;
  imageCache = {};
  currentImage = 0;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  moveRight() {}

  moveLeft() {
    setInterval( () => {
        this.x -= this.speed;
      }, 1000 / 60);
  }

  
}
