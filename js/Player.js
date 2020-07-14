import * as THREE        from "https://unpkg.com/three@0.118.3/build/three.module.js";
import { Car } from "./Car.js";

class Player {

    /*constructor(model, game) {
      this.model        = model;
      this.moveSpeed    = 1000;
      this.turnSpeed    = 4;
      this.game         = game;
      this.inputManager = game.getInputManager();
    }*/

    constructor(game) {
      this.model        = null;
      this.moveSpeed    = 1000;
      this.turnSpeed    = 4;
      this.game         = game;
      this.inputManager = game.getInputManager();
    }

    // Get current model for the player
    getModel() {
      return this.model;
    }

    // Set new model for the player when it changes
    setModel(model) {
      this.model = model;
    }

    // Called in main render function
    update(deltaTime) {
      if(!deltaTime || !this.model)   return;

      const turnDirection = (this.inputManager.keys.left.down  || this.inputManager.keys.A.down ?  1 : 0) +
                            (this.inputManager.keys.right.down || this.inputManager.keys.D.down ? -1 : 0);

      // Check if we have to rotate car wheels
      if (this.model instanceof Car) {
        const frontLeftWheel  = this.model.getFrontLeftWheel();
        const frontRightWheel = this.model.getFrontRightWheel();
        const backLeftWheel  = this.model.getBackLeftWheel();
        const backRightWheel = this.model.getBackRightWheel();

        frontLeftWheel.rotation.z  -= turnDirection * deltaTime;
        frontRightWheel.rotation.z -= turnDirection * deltaTime;

        frontLeftWheel.rotation.x  = deltaTime;
        frontRightWheel.rotation.x = deltaTime;
        backLeftWheel.rotation.x  = deltaTime;
        backRightWheel.rotation.x = deltaTime;
      }

      let difficultyFactor;

      switch (this.game.getDifficulty()) {
        case "medium":
          difficultyFactor = 1.3;
          break;
        case "hard":
          difficultyFactor = 1.7;
          break;
        default:
          difficultyFactor = 1;
      }

      // TODO: DIFFERENT SPEEDS FOR CHARACTER AND VEHICLES

      // TODO: FACTOR FOR METERS TRAVELED
      const metersFactor = this.game.getScore() * 0.001;

      // ISSUE! NOT ALL VEHICLES USE Y AND X axis
      this.model.model.rotation.y += this.turnSpeed * turnDirection * deltaTime;
      this.model.model.translateOnAxis(new THREE.Vector3(0, 0, 1), this.moveSpeed * deltaTime * difficultyFactor);
    }

  }

export {Player}
