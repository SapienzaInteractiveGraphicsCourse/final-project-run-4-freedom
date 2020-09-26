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

      const turnRotation = this.model.getTurnSpeed() * turnDirection * deltaTime;

      const forwardDirection = (this.inputManager.backAction()    ?  1 : 0) +
                               (this.inputManager.forwardAction() ? -1 : 0);

      if (this.model /*instanceof Car*/) {
        const updateVehiclePhysics = () => {
          /*const speed = this.model.vehicle.getCurrentSpeedKmHour();
          console.log("Player speed: " + Math.abs(speed).toFixed(2) + ' km/h');

					let breakingForce = 0;
					let engineForce = 0;

					//if (this.inputManager.forwardAction()) {
						if (speed < -1)   breakingForce = this.model.maxBreakingForce;
						else              engineForce   = this.model.maxEngineForce;
					/*}
					if (this.inputManager.backAction()) {
						if (speed > 1)  breakingForce = this.model.maxBreakingForce;
						else            engineForce   = -this.model.maxEngineForce / 2;
					}*/


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

      /*else if (this.model instanceof Character) {
        // Animate body components
        const run = () => {
          // Debug
          /*console.log("this.model.getHead().rotation.z: "  + this.model.getHead().rotation.z);
          console.log("this.model.getUpperLeftArm().rotation.z: "  + this.model.getUpperLeftArm().rotation.z);
          console.log("this.model.getUpperRightArm().rotation.z: " + this.model.getUpperRightArm().rotation.z);
          console.log("this.model.getLowerLeftArm().rotation.z: "  + this.model.getLowerLeftArm().rotation.z);
          console.log("this.model.getLowerRightArm().rotation.z: " + this.model.getLowerRightArm().rotation.z);

          console.log("this.model.getUpperLeftLeg().rotation.z: "  + this.model.getUpperLeftLeg().rotation.z);
          console.log("this.model.getUpperRightLeg().rotation.z: " + this.model.getUpperRightLeg().rotation.z);
          console.log("this.model.getLowerLeftLeg().rotation.z: "  + this.model.getLowerLeftLeg().rotation.z);
          console.log("this.model.getLowerRightLeg().rotation.z: " + this.model.getLowerRightLeg().rotation.z);
          console.log("this.model.getLeftFoot().rotation.z: "  + this.model.getLeftFoot().rotation.z);
          console.log("this.model.getRightFoot().rotation.z: " + this.model.getRightFoot().rotation.z);*/

          /*if(this.deltaMovement >= this.movementThreshold) {
            this.deltaMovement = 0;
            this.movementThreshold = 1.4;
            this.forwardMovement = !this.forwardMovement;
          }

          const augment = 0.1;
          this.deltaMovement += augment;

          if(this.forwardMovement) {
            this.model.getHead().rotation.x += augment;
            this.model.getUpperLeftArm().rotation.z  += augment;
            this.model.getUpperRightArm().rotation.z -= augment;

            this.model.getLowerLeftArm().rotation.z  += augment;
            this.model.getLowerRightArm().rotation.z -= augment;

            this.model.getUpperLeftLeg().rotation.z  += augment;
            this.model.getUpperRightLeg().rotation.z -= augment;

            this.model.getLowerLeftLeg().rotation.z  += augment;
            this.model.getLowerRightLeg().rotation.z -= augment;

            this.model.getLeftFoot().rotation.z  += augment;
            this.model.getRightFoot().rotation.z -= augment;
          }
          else {
            this.model.getHead().rotation.x -= augment;
            this.model.getUpperLeftArm().rotation.z  -= augment;
            this.model.getUpperRightArm().rotation.z += augment;

            this.model.getLowerLeftArm().rotation.z  -= augment;
            this.model.getLowerRightArm().rotation.z += augment;

            this.model.getUpperLeftLeg().rotation.z  -= augment;
            this.model.getUpperRightLeg().rotation.z += augment;

            this.model.getLowerLeftLeg().rotation.z  -= augment;
            this.model.getLowerRightLeg().rotation.z += augment;

            this.model.getLeftFoot().rotation.z  -= augment;
            this.model.getRightFoot().rotation.z += augment;
          }
        }

        run();
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

      // TODO: FACTOR FOR METERS TRAVELED
      const metersFactor = this.game.getScore() * 0.001;*/

      // ISSUE! NOT ALL VEHICLES USE X AND Y axis
      //this.model.get3DModel().rotation.y += turnRotation;
      //this.model.get3DModel().translateOnAxis(new THREE.Vector3(0, 0, 1), this.model.getMoveSpeed() * deltaTime * difficultyFactor);

      //this.game.setScore(this.model.getMoveSpeed() * deltaTime * difficultyFactor);
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
