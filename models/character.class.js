class Character extends MovableObject {
  IMAGES_WALKING = window.CHARACTER_IMAGES.WALKING;
  IMAGES_JUMPING = window.CHARACTER_IMAGES.JUMPING;
  IMAGES_IDLE = window.CHARACTER_IMAGES.IDLE;
  IMAGES_LONG_IDLE = window.CHARACTER_IMAGES.LONG_IDLE;

  movmentIntervalId = null;
  animateIntervalId = null;
  mainLoopId = null;

  isIdling = false;
  currentImage = 0;
  jumpImage = 0;
  canJump = true;

  idleAnimationIndex = 0;
  longIdleAnimationIndex = 0;
  idleAnimationPhase = null; 

  animationIntervalTime = 100;
  idleAnimationTime = 200;
  longIdleAnimationTime = 175;
  lastIdleUpdate = 0;
  lastAnimationUpdate = 0;

  constructor() {
    super();
    this.loadImage(this.IMAGES_IDLE[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
    this.x = 100;
    this.applyGravity();
    this.animate();
    

  }

  animate() {
    this.startMainLoop();
    this.StartIdle();
  }

  startMainLoop() {
    this.mainLoopId = setInterval(() => {
      const now = Date.now();

      this.handleMovement();
      this.updateCameraPosition();

      if (!this.isIdling) {
        if (now - this.lastAnimationUpdate >= this.animationIntervalTime) {
          this.updateAnimation();
          this.lastAnimationUpdate = now;
        }
      } else {
        this.updateIdleAnimation(now);
      }
    }, 1000 / 60);
  }

  updateAnimation() {
    const KEYS = this.world?.keyboard;
    if (this.isAboveGround()) {
      this.playJumpingAnimation();
    } else if (KEYS?.ArrowRight || KEYS?.ArrowLeft) {
      this.playWalkingAnimation();
    } else {
      this.showIdleFrame();
    }
  }

  updateIdleAnimation(now) {
    if (this.idleAnimationPhase === "idle") {
      if (now - this.lastIdleUpdate >= this.idleAnimationTime) {
        this.img = this.imageCache[this.IMAGES_IDLE[this.idleAnimationIndex]];
        this.idleAnimationIndex++;
        if (this.idleAnimationIndex >= this.IMAGES_IDLE.length) {
          this.idleAnimationPhase = "long_idle";
          this.longIdleAnimationIndex = 0;
        }
        this.lastIdleUpdate = now;
      }
    } else if (this.idleAnimationPhase === "long_idle") {
      if (now - this.lastIdleUpdate >= this.longIdleAnimationTime) {
        this.img = this.imageCache[this.IMAGES_LONG_IDLE[this.longIdleAnimationIndex]];
        this.longIdleAnimationIndex = (this.longIdleAnimationIndex + 1) % this.IMAGES_LONG_IDLE.length;
        this.lastIdleUpdate = now;
      }
    }
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
    if (KEYS?.Space && !this.isAboveGround() && this.canJump) {
      this.jump();
      this.jumpImage = 0;
      this.canJump = false;
    }
    if (!KEYS?.Space) {
      this.canJump = true;
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

  playWalkingAnimation() {
    const i = this.currentImage % this.IMAGES_WALKING.length;
    const path = this.IMAGES_WALKING[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  playJumpingAnimation() {
    const maxIndex = this.IMAGES_JUMPING.length - 1;
    if (this.speedY > 20) {
      this.jumpImage = Math.min(Math.floor((30 - this.speedY) / 50), Math.floor(maxIndex / 2));
    } else if (this.speedY > 0) {
      this.jumpImage = Math.floor(maxIndex / 2);
    } else {
      this.jumpImage = Math.min(
        Math.floor(maxIndex / 2) + Math.floor(Math.abs(this.speedY) / 50),
        maxIndex
      );
    }
    this.jumpImage = Math.max(0, Math.min(this.jumpImage, maxIndex));
    const path = this.IMAGES_JUMPING[this.jumpImage];
    if (this.imageCache[path]) {
      this.img = this.imageCache[path];
    }
  }

  showIdleFrame() {
    this.img = this.imageCache[this.IMAGES_IDLE[0]];
  }

  StopIdle() {
    this.isIdling = false;
    this.idleAnimationPhase = null;
    this.idleAnimationIndex = 0;
    this.longIdleAnimationIndex = 0;
  }

  StartIdle() {
    this.StopIdle();
    this.isIdling = true;
    this.idleAnimationPhase = "idle";
    this.idleAnimationIndex = 0;
    this.lastIdleUpdate = Date.now();
  }
}

window.Character = Character;
