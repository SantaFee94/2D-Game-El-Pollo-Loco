class Character extends MovableObject {
  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];

  IMAGES_IDLE = [
    "img/2_character_pepe/1_idle/idle/I-1.png",
    "img/2_character_pepe/1_idle/idle/I-2.png",
    "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-4.png",
    "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png",
    "img/2_character_pepe/1_idle/idle/I-9.png",
    "img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  IMAGES_LONG_IDLE = [
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  movmentIntervalId = null;
  animateIntervalId = null;
  idleIntervalId = null;
  longIdleIntervalId = null;
  isIdling = false;
  currentImage = 0;

  constructor() {
    super();
    this.loadImage(this.IMAGES_IDLE[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
    this.x = 100;
    this.animate();
  }

  animate() {
    this.startMovementInterval();
    this.startAnimationInterval();
  }

  startMovementInterval() {
    this.movmentIntervalId = setInterval(() => {
      this.handleMovement();
      this.updateCameraPosition();
    }, 1000 / 60);
  }

  handleMovement() {
    const KEYS = this.world?.keyboard;
    if (KEYS?.ArrowRight) {
      this.x += this.speed;
      this.otherDirection = false;
    }
    if (KEYS?.ArrowLeft) {
      this.x -= this.speed;
      this.otherDirection = true;
    }
  }

  updateCameraPosition() {
    if (!this.world) return;

    if (this.x < 0) this.x = 0;
    
    const levelWidth = this.world.getLevelWidth?.() || 0;
    if (levelWidth > 0) {
      const maxX = Math.max(0, levelWidth - this.width);
      if (this.x > maxX) this.x = maxX;
    }
    
    this.world.camera_x = -this.x + 100;
  }

  startAnimationInterval() {
    this.animateIntervalId = setInterval(() => {
      if (this.isIdling) return;
      
      const KEYS = this.world?.keyboard;
      if (KEYS?.ArrowRight || KEYS?.ArrowLeft) {
        this.playWalkingAnimation();
      } else {
        this.showIdleFrame();
      }
    }, 100);
  }

  playWalkingAnimation() {
    const i = this.currentImage % this.IMAGES_WALKING.length;
    const path = this.IMAGES_WALKING[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  showIdleFrame() {
    this.img = this.imageCache[this.IMAGES_IDLE[0]];
  }

  jump() {}

  StopIdle() {
    this.clearIdleIntervals();
    this.isIdling = false;
  }

  clearIdleIntervals() {
    if (this.idleIntervalId) {
      clearInterval(this.idleIntervalId);
      this.idleIntervalId = null;
    }
    if (this.longIdleIntervalId) {
      clearInterval(this.longIdleIntervalId);
      this.longIdleIntervalId = null;
    }
  }

  StartIdle() {
    this.StopIdle();
    this.isIdling = true;
    this.playIdleAnimation();
  }

  playIdleAnimation() {
    let index = 0;
    this.idleIntervalId = setInterval(() => {
      this.img = this.imageCache[this.IMAGES_IDLE[index]];
      index++;
      if (index >= this.IMAGES_IDLE.length) {
        clearInterval(this.idleIntervalId);
        this.StartLongIdle();
      }
    }, 200);
  }

  StartLongIdle() {
    let index = 0;
    this.longIdleIntervalId = setInterval(() => {
      this.img = this.imageCache[this.IMAGES_LONG_IDLE[index]];
      index = (index + 1) % this.IMAGES_LONG_IDLE.length;
    }, 125);
  }
}

window.Character = Character;
