class Game {
  constructor(inputManager, difficulty, physicsWorld) {
    this.score        = 0;
    this.difficulty   = difficulty;
    this.inputManager = inputManager;
    this.physicsWorld = physicsWorld;
    this.rigidBodies  = [];
    this.player = null;
    this.police = null;
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

    this.player.update(deltaTime);
    this.police.update(deltaTime);
  }
}

export {Game}
