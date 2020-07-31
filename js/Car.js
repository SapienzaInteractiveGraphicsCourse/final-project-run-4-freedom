import { Model } from "./Model.js";

class Car extends Model {
  constructor(model3D, carInfo, game, name, wheels) {
    super(model3D, carInfo, game);
    this.name      = name;
    this.wheels    = wheels;
    this.moveSpeed = 1000;
    this.turnSpeed = 4;

    console.log("this.name: " + this.name);

    // Raycast Vehicle
		const tuning    = new Ammo.btVehicleTuning();
		const rayCaster = new Ammo.btDefaultVehicleRaycaster(game.getPhysicsWorld());
		this.vehicle    = new Ammo.btRaycastVehicle(tuning, super.getPhysicsBody(), rayCaster);
		this.vehicle.setCoordinateSystem(0, 1, 2);
		game.getPhysicsWorld().addAction(this.vehicle);

    this.steeringIncrement = 0.04;
    this.steeringClamp     = 0.5;
    this.maxEngineForce   = 2000;
    this.maxBreakingForce = 100;

    this.FRONT_LEFT_WHEEL_ID  = 0;
    this.FRONT_RIGHT_WHEEL_ID = 1;
    this.BACK_LEFT_WHEEL_ID   = 2;
    this.BACK_RIGHT_WHEEL_ID  = 3;

    // DEFAULT
    /*const wheelDirectionCS0 = new Ammo.btVector3(0, -1, 0);
		const wheelAxleCS       = new Ammo.btVector3(-1, 0, 0);*/

    // POLICE CAR
    const wheelDirectionCS0 = new Ammo.btVector3(0, -1, 0);
    const wheelAxleCS       = new Ammo.btVector3(-1, 0, 0);

    const friction = 1000;
    const suspensionStiffness   = 20.0;
    const suspensionDamping     = 2.3;
    const suspensionCompression = 4.4;
    const suspensionRestLength  = 0.6;
    const rollInfluence = 0.2;

    const wheelAxisPositionBack = -1;
		const wheelRadiusBack       = 0.4;
		const wheelWidthBack        = 0.3;
		const wheelHalfTrackBack    = 1;
		const wheelAxisHeightBack   = 0.3;

		const wheelAxisFrontPosition = 1.7;
		const wheelHalfTrackFront    = 1;
		const wheelAxisHeightFront   = 0.3;
		const wheelRadiusFront       = 0.35;
		const wheelWidthFront        = 0.2;

		const addWheel = (isFront, pos, radius, width) => {
			const wheelInfo = this.vehicle.addWheel(
					pos,
					wheelDirectionCS0,
					wheelAxleCS,
					suspensionRestLength,
					radius,
					tuning,
					isFront);

			wheelInfo.set_m_suspensionStiffness(suspensionStiffness);
			wheelInfo.set_m_wheelsDampingRelaxation(suspensionDamping);
			wheelInfo.set_m_wheelsDampingCompression(suspensionCompression);
			wheelInfo.set_m_frictionSlip(friction);
			wheelInfo.set_m_rollInfluence(rollInfluence);
    }

    /*addWheel(true, new Ammo.btVector3(wheelHalfTrackFront, wheelAxisHeightFront, wheelAxisFrontPosition),
             wheelRadiusFront, wheelWidthFront);
		addWheel(true, new Ammo.btVector3(-wheelHalfTrackFront, wheelAxisHeightFront, wheelAxisFrontPosition),
             wheelRadiusFront, wheelWidthFront);
		addWheel(false, new Ammo.btVector3(-wheelHalfTrackBack, wheelAxisHeightBack, wheelAxisPositionBack),
             wheelRadiusBack, wheelWidthBack);
		addWheel(false, new Ammo.btVector3(wheelHalfTrackBack, wheelAxisHeightBack, wheelAxisPositionBack),
             wheelRadiusBack, wheelWidthBack);//*/


    addWheel(true, new Ammo.btVector3( this.wheels[this.FRONT_LEFT_WHEEL_ID].position.x,
                                       this.wheels[this.FRONT_LEFT_WHEEL_ID].position.y,
                                       this.wheels[this.FRONT_LEFT_WHEEL_ID].position.z ),
             wheelRadiusFront, wheelWidthFront);

    addWheel(true, new Ammo.btVector3( this.wheels[this.FRONT_RIGHT_WHEEL_ID].position.x,
                                       this.wheels[this.FRONT_RIGHT_WHEEL_ID].position.y,
                                       this.wheels[this.FRONT_RIGHT_WHEEL_ID].position.z ),
             wheelRadiusFront, wheelWidthFront);
    addWheel(false, new Ammo.btVector3( this.wheels[this.BACK_LEFT_WHEEL_ID].position.x,
                                        this.wheels[this.BACK_LEFT_WHEEL_ID].position.y,
                                        this.wheels[this.BACK_LEFT_WHEEL_ID].position.z ),
             wheelRadiusBack, wheelWidthBack);
    addWheel(false, new Ammo.btVector3( this.wheels[this.BACK_RIGHT_WHEEL_ID].position.x,
                                        this.wheels[this.BACK_RIGHT_WHEEL_ID].position.y,
                                        this.wheels[this.BACK_RIGHT_WHEEL_ID].position.z ),
             wheelRadiusBack, wheelWidthBack);//*/
  }

  getName() {
    return this.name;
  }

  getWheels() {
    return this.wheels;
  }

  getFrontLeftWheel() {
    return this.wheels[0];
  }

  getFrontRightWheel() {
    return this.wheels[1];
  }

  getBackLeftWheel() {
    return this.wheels[2];
  }

  getBackRightWheel() {
    return this.wheels[3];
  }

  getMoveSpeed() {
    return this.moveSpeed;
  }

  getTurnSpeed() {
    return this.turnSpeed;
  }

}

export {Car}
