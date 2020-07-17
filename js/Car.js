import { Model } from "./Model.js";

class Car extends Model {
  constructor(model3D, mass, game, name, wheels) {
    super(model3D, mass, game);
    this.name      = name;
    this.wheels    = wheels;
    this.moveSpeed = 1000;
    this.turnSpeed = 4;

    console.log("this.name: " + this.name);

    this.steeringIncrement = .04;
    this.steeringClamp     = .5;
    this.maxEngineForce   = 0.02;  //2000;
    this.maxBreakingForce = 0.01;  //100;

    // Raycast Vehicle
		this.engineForce     = 0;
		this.vehicleSteering = 0;
		this.breakingForce   = 0;
		const tuning    = new Ammo.btVehicleTuning();
		const rayCaster = new Ammo.btDefaultVehicleRaycaster(game.getPhysicsWorld());
		this.vehicle    = new Ammo.btRaycastVehicle(tuning, super.getPhysicsBody(), rayCaster);
		this.vehicle.setCoordinateSystem(0, 1, 2);
		game.getPhysicsWorld().addAction(this.vehicle);

    this.FRONT_LEFT_WHEEL_ID  = 0;
    this.FRONT_RIGHT_WHEEL_ID = 1;
    this.BACK_LEFT_WHEEL_ID   = 2;
    this.BACK_LEFT_WHEEL_ID   = 3;

    //const wheelDirectionCS0 = new Ammo.btVector3(0, -1, 0);
		//const wheelAxleCS       = new Ammo.btVector3(-1, 0, 0);

    const wheelDirectionCS0 = new Ammo.btVector3(0, 1, 0);
    const wheelAxleCS       = new Ammo.btVector3(-1, 0, 0);

    const friction = 1000;
    const suspensionStiffness   = 20.0;
    const suspensionDamping     = 2.3;
    const suspensionCompression = 4.4;
    const suspensionRestLength = 0.6;
    const rollInfluence = 0.2;

    const wheelAxisPositionBack = -1;
		const wheelRadiusBack       = .4;
		const wheelWidthBack        = .3;
		const wheelHalfTrackBack    = 1;
		const wheelAxisHeightBack   = .3;

		const wheelAxisFrontPosition = 1.7;
		const wheelHalfTrackFront    = 1;
		const wheelAxisHeightFront   = .3;
		const wheelRadiusFront       = .35;
		const wheelWidthFront        = .2;

		const addWheel = (isFront, pos, radius, width, index) => {
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

    addWheel(true, new Ammo.btVector3(wheelHalfTrackFront, wheelAxisHeightFront, wheelAxisFrontPosition),
             wheelRadiusFront, wheelWidthFront, this.FRONT_LEFT_WHEEL_ID);
		addWheel(true, new Ammo.btVector3(-wheelHalfTrackFront, wheelAxisHeightFront, wheelAxisFrontPosition), wheelRadiusFront,
             wheelWidthFront, this.FRONT_RIGHT_WHEEL_ID);
		addWheel(false, new Ammo.btVector3(-wheelHalfTrackBack, wheelAxisHeightBack, wheelAxisPositionBack), wheelRadiusBack,
             wheelWidthBack, this.BACK_LEFT_WHEEL_ID);
		addWheel(false, new Ammo.btVector3(wheelHalfTrackBack, wheelAxisHeightBack, wheelAxisPositionBack), wheelRadiusBack,
             wheelWidthBack, this.BACK_RIGHT_WHEEL_ID);

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
