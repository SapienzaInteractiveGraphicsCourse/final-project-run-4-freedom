class Game {
  constructor(inputManager, difficulty, physicsWorld) {
    this.score        = 0;
    this.difficulty   = difficulty;
    this.inputManager = inputManager;
    this.physicsWorld = physicsWorld;
    this.rigidBodies  = [];

    this.player = null;
    this.police = null;

    this.isPaused = false;
  }

  getScore() {
    return this.score;
  }

  setScore(score) {
    this.score = score;
  }

  getDifficulty() {
    return this.difficulty;
  }

  setDifficulty(difficulty) {
    this.difficulty = difficulty;
  }

  getInputManager() {
    return this.inputManager;
  }

  getPhysicsWorld() {
    return this.physicsWorld;
  }

  getRigidBodies() {
    return this.rigidBodies;
  }

  addRigidBody(rb) {
    this.rigidBodies.push(rb)
  }

  removeRigidBody(rb) {
    // Removes an element from the array without leaving a hole in it
    const i = this.rigidBodies.indexOf(rb);
    if(i >= 0)
      this.rigidBodies.splice(i, 1);
  }

  getPlayer() {
    return this.player;
  }

  setPlayer(player) {
    this.player = player;
  }

  getPolice() {
    return this.police;
  }

  setPolice(police) {
    this.police = police;
  }

  update(deltaTime) {
    if(!deltaTime || !this.player || !this.police)   return;

    //this.police.incrementInterpolation();

    this.player.update(deltaTime);
    this.police.update(deltaTime, this.player.getPosition());
  }

  // Pause or resume the game
  pauseGame() {
      if (!this.isPaused) {
        // Pause
        document.getElementById("pause").style.display     = "inherit";
        document.getElementById("resumeBtn").style.display = "inherit";
      }
      else {
        // Resume
        document.getElementById("pause").style.display     = "none";
        document.getElementById("resumeBtn").style.display = "none";
      }

      this.isPaused = !this.isPaused;
  }

  isPaused() {
    return this.isPaused;
  }

}

export {Game}
