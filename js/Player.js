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
      this.deltaMovement = 0;
      this.movementThreshold = 0.7;
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

      const turnDirection = (this.inputManager.leftAction() ?  1 : 0) +
                            (this.inputManager.rightAction() ? -1 : 0);

      const turnRotation = this.model.getTurnSpeed() * turnDirection * deltaTime;

      if (this.model instanceof Car) {
        const rotateWheels = () => {
          const frontLeftWheel  = this.model.getFrontLeftWheel();
          const frontRightWheel = this.model.getFrontRightWheel();
          const backLeftWheel  = this.model.getBackLeftWheel();
          const backRightWheel = this.model.getBackRightWheel();

          frontLeftWheel.rotation.z  = Utils.clamp(frontLeftWheel.rotation.z  + turnRotation, -0.5, 0.5);
          frontRightWheel.rotation.z = Utils.clamp(frontRightWheel.rotation.z + turnRotation, -0.5, 0.5);

          // If X rotation, Z rotation is affected
          //frontLeftWheel.rotation.x  = deltaTime;
          //frontRightWheel.rotation.x = deltaTime;
          backLeftWheel.rotation.x  = deltaTime;
          backRightWheel.rotation.x = deltaTime;
        }

        const updateVehiclePhysics = () => {
          const speed = this.model.vehicle.getCurrentSpeedKmHour();
          console.log("Player speed: " + Math.abs(speed).toFixed(1) + ' km/h');

					let breakingForce = 0;
					let engineForce = 0;

					//if (actions.acceleration) {
						if (speed < -1)   breakingForce = this.model.maxBreakingForce;
						else              engineForce   = this.model.maxEngineForce;
					//}
					/*if (actions.braking) {
						if (speed > 1)  breakingForce = maxBreakingForce;
						else            engineForce = -maxEngineForce / 2;
					}*/


					if (this.inputManager.leftAction()) {
						if (this.model.vehicleSteering < this.model.steeringClamp)
							this.model.vehicleSteering += this.model.steeringIncrement;
					}
					else {
						if (this.inputManager.rightAction()) {
							if (this.model.vehicleSteering > -this.model.steeringClamp)
								this.model.vehicleSteering -= this.model.steeringIncrement;
						}
						else {
							if (this.model.vehicleSteering < -this.model.steeringIncrement)
								this.model.vehicleSteering += this.model.steeringIncrement;
							else {
								if (this.model.vehicleSteering > this.model.steeringIncrement)
									this.model.vehicleSteering -= this.model.steeringIncrement;
								else
									this.model.vehicleSteering = 0;
							}
						}
					}

          console.log("frontLeftWheel.position.x: " + frontLeftWheel.position.x);
          console.log("frontLeftWheel.position.y: " + frontLeftWheel.position.y);
          console.log("frontLeftWheel.position.z: " + frontLeftWheel.position.z);
          console.log("frontRightWheel.position.x: " + frontRightWheel.position.x);
          console.log("frontRightWheel.position.y: " + frontRightWheel.position.y);
          console.log("frontRightWheel.position.z: " + frontRightWheel.position.z);
          console.log("backLeftWheel.position.x: " + backLeftWheel.position.x);
          console.log("backLeftWheel.position.y: " + backLeftWheel.position.y);
          console.log("backLeftWheel.position.z: " + backLeftWheel.position.z);
          console.log("backRightWheel.position.x: " + backRightWheel.position.x);
          console.log("backRightWheel.position.y: " + backRightWheel.position.y);
          console.log("backRightWheel.position.z: " + backRightWheel.position.z);


					/*this.model.vehicle.applyEngineForce(engineForce, this.model.BACK_LEFT_WHEEL_ID);
					this.model.vehicle.applyEngineForce(engineForce, this.model.BACK_RIGHT_WHEEL_ID);

          this.model.vehicle.setBrake(breakingForce / 2, this.model.FRONT_LEFT_WHEEL_ID);
					this.model.vehicle.setBrake(breakingForce / 2, this.model.FRONT_RIGHT_WHEEL_ID);
					this.model.vehicle.setBrake(breakingForce, this.model.BACK_LEFT_WHEEL_ID);
					this.model.vehicle.setBrake(breakingForce, this.model.BACK_RIGHT_WHEEL_ID);

					this.model.vehicle.setSteeringValue(this.model.vehicleSteering, this.model.FRONT_LEFT_WHEEL_ID);
					this.model.vehicle.setSteeringValue(this.model.vehicleSteering, this.model.FRONT_RIGHT_WHEEL_ID);

          let tm, p, q, i;
					const n = this.model.vehicle.getNumWheels();
          const wheels = this.model.getWheels();
					for (i = 0; i < n; i++) {
						this.model.vehicle.updateWheelTransform(i, true);
						tm = this.model.vehicle.getWheelTransformWS(i);
						p = tm.getOrigin();
						q = tm.getRotation();
						wheels[i].position.set(p.x(), p.y(), p.z());
						wheels[i].quaternion.set(q.x(), q.y(), q.z(), q.w());
					}

					tm = this.model.vehicle.getChassisWorldTransform();
					p = tm.getOrigin();
					q = tm.getRotation();
					this.model.get3DModel().position.set(p.x(), p.y(), p.z());
					this.model.get3DModel().quaternion.set(q.x(), q.y(), q.z(), q.w());*/
        }

        rotateWheels();
        updateVehiclePhysics();
      }

      else if (this.model instanceof Character) {
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

          if(this.deltaMovement >= this.movementThreshold) {
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
      const metersFactor = this.game.getScore() * 0.001;

      // ISSUE! NOT ALL VEHICLES USE X AND Y axis
      //this.model.get3DModel().rotation.y += turnRotation;
      //this.model.get3DModel().translateOnAxis(new THREE.Vector3(0, 0, 1), this.model.getMoveSpeed() * deltaTime * difficultyFactor);

      this.game.setScore(this.model.getMoveSpeed() * deltaTime * difficultyFactor);
    }

    // Get current player position using the model one
    getPosition() {
      return this.model ? this.model.getPosition() : null;
    }

  }

export {Player}
