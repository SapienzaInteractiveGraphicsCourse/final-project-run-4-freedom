import * as THREE     from "https://unpkg.com/three@0.118.3/build/three.module.js";
import { Car }        from "./Car.js";
import { Character }  from "./Character.js";
import { Utils }      from "./Utils.js";

class Player {
    constructor(game) {
      this.game         = game;
      this.inputManager = game.getInputManager();
      this.model        = null;
      this.name         = null;

      // Character animation
      /*this.deltaMovement = 0;
      this.movementThreshold = 0.7;*/
    }

    // Get current model for the player (model is not 3D model)
    getModel() {
      return this.model;
    }

    // Set new model for the player when it changes (model is not 3D model)
    setModel(model) {
      this.model = model;
    }

    // Called in main animate function
    update(deltaTime) {
      if(!deltaTime || !this.model)   return;

      const turnDirection = (this.inputManager.rightAction() ?  1 : 0) +
                            (this.inputManager.leftAction()  ? -1 : 0);

      /*const turnRotation = this.model.getTurnSpeed() * turnDirection * deltaTime;

      const forwardDirection = (this.inputManager.backAction()    ?  1 : 0) +
                               (this.inputManager.forwardAction() ? -1 : 0);*/

      if (this.model) {
        const updateVehiclePhysics = () => {
					if (this.inputManager.leftAction()) {
						if (this.model.steeringAngle < this.model.steeringClamp)
							this.model.steeringAngle += this.model.steeringIncrement;
					}
					else {
						if (this.inputManager.rightAction()) {
							if (this.model.steeringAngle > -this.model.steeringClamp)
								this.model.steeringAngle -= this.model.steeringIncrement;
						}
						else {
							if (this.model.steeringAngle < -this.model.steeringIncrement)
								this.model.steeringAngle += this.model.steeringIncrement;
							else {
								if (this.model.steeringAngle > this.model.steeringIncrement)
									this.model.steeringAngle -= this.model.steeringIncrement;
								else
									this.model.steeringAngle = 0;
							}
						}
					}

          //console.log("getPosition(): ");
          //console.log(this.getPosition());
          //this.model.move(turnDirection, 0, forwardDirection);
          this.model.move(turnDirection, 0, -1); // Auto-acceleration
        }

        updateVehiclePhysics();
      }
    }

    // Get current player 3D model using the model one
    get3DModel() {
      return this.model ? this.model.get3DModel() : null;
    }

    // Get current player physics body using the model one
    getPhysicsBody() {
      return this.model ? this.model.getPhysicsBody() : null;
    }

    // Get current player position using the model one
    getPosition() {
      return this.model ? this.model.getPosition() : null;
    }

    // Get current player velocity vector using the model one
    getVelocity() {
      return this.model ? this.model.getVelocity() : null;
    }

    // Get current player orientation using the model one
    getOrientation() {
      return this.model ? this.model.getOrientation() : null;
    }

    // Get current player speed using the model one
    getSpeed() {
      return this.model ? this.model.getCurrentSpeedKmHour() : null;
    }
  }

export {Player}
