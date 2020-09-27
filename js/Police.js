import * as THREE     from "https://unpkg.com/three@0.118.3/build/three.module.js";
import { Car }        from "./Car.js";
import { Character }  from "./Character.js";
import { Utils }      from "./Utils.js";

class Police {
    constructor(game) {
      this.game         = game;
      this.inputManager = game.getInputManager();
      this.model        = null;
      this.name         = null;

      //this.interpolationFactor = 0.005;
    }

    // Get current model for the police (model is not 3D model)
    getModel() {
      return this.model;
    }

    // Set new model for the police when it changes (model is not 3D model)
    setModel(model) {
      this.model = model;
    }

    // Called in main animate function
    update(deltaTime) {
      if(!deltaTime || !this.model)   return;

      /*const move = () => {
        // Make the police chasing the player
        const posPlayer = this.game.getPlayer().getPosition();
        const posPolice = this.getPosition();
        const newPos   = posPolice.lerp(posPlayer, this.interpolationFactor);

        let ms = this.model.getPhysicsBody().getMotionState();
        if (ms) {
            const transform = new Ammo.btTransform();
            ms.getWorldTransform(transform);
            transform.setOrigin( new Ammo.btVector3(
              newPos.x,
              posPolice.y,
              newPos.z ) );
            transform.setRotation( new Ammo.btQuaternion(
              this.model.get3DModel().quaternion.x,
              this.model.get3DModel().quaternion.y,
              this.model.get3DModel().quaternion.z,
              this.model.get3DModel().quaternion.w ) );

            ms = new Ammo.btDefaultMotionState(transform);
            this.model.getPhysicsBody().setMotionState(ms);
        }
      }

      move();*/


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


      if (this.model instanceof Car) {
        this.model.rotateWheels();
        this.model.blinkRoofLights();
      }
    }

    // Get current police 3D model using the model one
    get3DModel() {
      return this.model ? this.model.get3DModel() : null;
    }

    // Get current police physics body using the model one
    getPhysicsBody() {
      return this.model ? this.model.getPhysicsBody() : null;
    }

    // Get current police position using the model one
    getPosition() {
      return this.model ? this.model.getPosition() : null;
    }

    // Get current police velocity vector using the model one
    getVelocity() {
      return this.model ? this.model.getVelocity() : null;
    }

    // Get current police orientation using the model one
    getOrientation() {
      return this.model ? this.model.getOrientation() : null;
    }

    // Get current police speed using the model one
    getSpeed() {
      return this.model ? this.model.getCurrentSpeedKmHour() : null;
    }

    /*incrementInterpolation() {
      this.interpolationFactor = Utils.clamp(this.interpolationFactor + 0.00005, 0.005, 0.4);
      //console.log("this.interpolationFactor: " + this.interpolationFactor);
    }*/

  }

export {Police}
