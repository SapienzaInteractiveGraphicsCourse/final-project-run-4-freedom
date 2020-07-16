import * as THREE   from "https://unpkg.com/three@0.118.3/build/three.module.js";
import { Car }      from "./Car.js";
import { Utils }    from "./Utils.js";

class Player {
    constructor(game) {
      this.game         = game;
      this.inputManager = game.getInputManager();
      this.model        = null;
      this.name         = null;
    }

    // Get current model for the player (model is not 3D model)
    getModel() {
      return this.model;
    }

    // Set new model for the player when it changes (model is not 3D model)
    setModel(model) {
      this.model = model;
    }

    // Called in main render function
    update(deltaTime) {
      if(!deltaTime || !this.model)   return;

      const turnDirection = (this.inputManager.keys.left.down  || this.inputManager.keys.A.down ?  1 : 0) +
                            (this.inputManager.keys.right.down || this.inputManager.keys.D.down ? -1 : 0);

      const turnRotation = this.model.getTurnSpeed() * turnDirection * deltaTime;

      // Check if we have to rotate car wheels
      if (this.model instanceof Car) {
        const frontLeftWheel  = this.model.getFrontLeftWheel();
        const frontRightWheel = this.model.getFrontRightWheel();
        const backLeftWheel  = this.model.getBackLeftWheel();
        const backRightWheel = this.model.getBackRightWheel();

        frontLeftWheel.rotation.z  = Utils.clamp(frontLeftWheel.rotation.z  - turnRotation, -0.5, 0.5);
        frontRightWheel.rotation.z = Utils.clamp(frontRightWheel.rotation.z - turnRotation, -0.5, 0.5);

        // If X rotation, Z rotation is affected
        //frontLeftWheel.rotation.x  = deltaTime;
        //frontRightWheel.rotation.x = deltaTime;
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
      this.model.get3DModel().rotation.y += turnRotation;
      this.model.get3DModel().translateOnAxis(new THREE.Vector3(0, 0, 1), this.model.getMoveSpeed() * deltaTime * difficultyFactor);
    }

    // Get current player position using the model one
    getPosition() {
      return this.model ? this.model.getPosition() : null;
    }

  }

export {Player}
