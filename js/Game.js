class Game {

  /*constructor(inputManager) {
    this.score        = 0;
    this.difficulty   = "easy";
    this.inputManager = inputManager;
  }*/

  constructor(inputManager, difficulty) {
    this.score        = 0;
    this.difficulty   = difficulty;
    this.inputManager = inputManager;
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

}

export {Game}
