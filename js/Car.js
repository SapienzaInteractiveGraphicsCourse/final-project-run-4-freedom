import { Model } from "./Model.js";
import { Utils } from "./Utils.js";

import * as THREE from "https://unpkg.com/three@0.118.3/build/three.module.js";


class Car extends Model {
  constructor(model3D, carInfo, game, name, components) { //wheels) {
    super(model3D, carInfo, game);
    this.name      = name;
    //this.wheels    = wheels;
    this.wheels    = components.wheels;
    this.maxSpeed  = carInfo.maxSpeed;

    this.moveSpeed = 1000;
    this.turnSpeed = 4;

    this.orientation = new THREE.Vector3(0, 0, -1);
    this.direction   = new THREE.Vector3(0, 0, 0);
    //const pos = model3D.position;
    //this.direction = new THREE.Vector3(pos.x, pos.y, pos.z);

    this.steeringIncrement = 0.04;
    this.steeringClamp     = 0.5;
    this.steeringAngle     = 0;

    console.log("this.name: " + this.name);

    // Raycast Vehicle
		/*const tuning    = new Ammo.btVehicleTuning();
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
    // The direction of ray cast (chassis space)
    const wheelDirectionCS0 = new Ammo.btVector3(0, -1, 0);
    // The axis the wheel rotates around (chassis space)
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

      // OK WITH LAMBORGHINI
      /*if (name === "Lamborghini") {
        addWheel(true, new Ammo.btVector3( -this.wheels[this.FRONT_LEFT_WHEEL_ID].position.x,
                                           this.wheels[this.FRONT_LEFT_WHEEL_ID].position.y,
                                           -this.wheels[this.FRONT_LEFT_WHEEL_ID].position.z ),
                 wheelRadiusFront, wheelWidthFront);
        addWheel(true, new Ammo.btVector3( -this.wheels[this.FRONT_RIGHT_WHEEL_ID].position.x,
                                           this.wheels[this.FRONT_RIGHT_WHEEL_ID].position.y,
                                           -this.wheels[this.FRONT_RIGHT_WHEEL_ID].position.z ),
                 wheelRadiusFront, wheelWidthFront);
        addWheel(false, new Ammo.btVector3( -this.wheels[this.BACK_LEFT_WHEEL_ID].position.x,
                                            this.wheels[this.BACK_LEFT_WHEEL_ID].position.y,
                                            -this.wheels[this.BACK_LEFT_WHEEL_ID].position.z ),
                 wheelRadiusBack, wheelWidthBack);
        addWheel(false, new Ammo.btVector3( -this.wheels[this.BACK_RIGHT_WHEEL_ID].position.x,
                                            this.wheels[this.BACK_RIGHT_WHEEL_ID].position.y,
                                            -this.wheels[this.BACK_RIGHT_WHEEL_ID].position.z ),
                 wheelRadiusBack, wheelWidthBack);
      }*/

      // POLICE CAR
      /*else {
        addWheel(true, new Ammo.btVector3( this.wheels[this.FRONT_LEFT_WHEEL_ID].position.x,
                                           this.wheels[this.FRONT_LEFT_WHEEL_ID].position.y,
                                           this.wheels[this.FRONT_LEFT_WHEEL_ID].position.z ),
                wheelRadiusFront, wheelWidthFront);
        addWheel(true, new Ammo.btVector3( this.wheels[this.FRONT_RIGHT_WHEEL_ID].position.x,
                                           this.wheels[this.FRONT_RIGHT_WHEEL_ID].position.y,
                                           this.wheels[this.FRONT_RIGHT_WHEEL_ID].position.z ),
                                wheelRadiusFront, wheelWidthFront);
        addWheel(false, new Ammo.btVector3( -this.wheels[this.BACK_LEFT_WHEEL_ID].position.x - 1.6,
                                            this.wheels[this.BACK_RIGHT_WHEEL_ID].position.y + 0.5,
                                            24.7 ),
                 wheelRadiusBack, wheelWidthBack);
        addWheel(false, new Ammo.btVector3( -this.wheels[this.BACK_RIGHT_WHEEL_ID].position.x - 1.6,
                                            this.wheels[this.BACK_RIGHT_WHEEL_ID].position.y + 0.5,
                                            24.7 ),
                 wheelRadiusBack, wheelWidthBack);
      }*/
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

  getMaxSpeed() {
    return this.maxSpeed;
  }

  getMoveSpeed() {
    return this.moveSpeed;
  }

  getTurnSpeed() {
    return this.turnSpeed;
  }

  rotateWheels(deltaTime=0, turnRotation=0) {
    /*const frontLeftWheel  = this.getFrontLeftWheel();
    const frontRightWheel = this.getFrontRightWheel();

    /*frontLeftWheel.rotation.z  = Utils.clamp(frontLeftWheel.rotation.z  + turnRotation, -0.5, 0.5);

    // Lamborghini right wheel orientation is inverted
    if(this.getName() === "Lamborghini")
      frontRightWheel.rotation.z = Utils.clamp(frontRightWheel.rotation.z - turnRotation, -0.5, 0.5);
    else
      frontRightWheel.rotation.z = Utils.clamp(frontRightWheel.rotation.z + turnRotation, -0.5, 0.5);

    // If X rotation, Z rotation is affected
    frontLeftWheel.rotation.x  += deltaTime;
    frontRightWheel.rotation.x += deltaTime;
    this.getBackLeftWheel().rotation.x  += deltaTime;
    this.getBackRightWheel().rotation.x += deltaTime;*/

    //const speed = Math.abs(this.vehicle.getCurrentSpeedKmHour());

    const speed = Math.abs(this.getCurrentSpeedKmHour());

    /*console.log("this.getFrontLeftWheel().rotation.x: " + this.getFrontLeftWheel().rotation.x);
    console.log("this.getFrontRightWheel().rotation.x: " + this.getFrontRightWheel().rotation.x);

    this.getFrontLeftWheel().rotation.z  = this.steeringAngle;
    this.getFrontRightWheel().rotation.z = this.steeringAngle;*/


    if (this.steeringAngle != 0) {
      this.getFrontLeftWheel().rotation.x  = -1.57;
      this.getFrontRightWheel().rotation.x = -1.57;

      this.getFrontLeftWheel().rotation.z  = this.steeringAngle;
      this.getFrontRightWheel().rotation.z = this.steeringAngle;
    }
    else {
      this.getFrontLeftWheel().rotation.z  = this.steeringAngle;
      this.getFrontRightWheel().rotation.z = this.steeringAngle;

      this.getFrontLeftWheel().rotation.x  = speed;
      this.getFrontRightWheel().rotation.x = speed;
    }

    this.getBackLeftWheel().rotation.x  = speed;
    this.getBackRightWheel().rotation.x = speed;
  }

  getCurrentSpeedKmHour() {
    return 3.6 * super.getPhysicsBody().getLinearVelocity().length();
  }

  getDirection() {
      return this.direction;
  }

  getOrientation() {
    return this.orientation;
  }

  move(moveX, moveY, moveZ, deltaTime) {
    //if (moveX == 0 && moveY == 0 && moveZ == 0) return;



    /*const speed = Math.abs(this.getCurrentSpeedKmHour()).toFixed(2);
    const turnRotation = this.getTurnSpeed() * moveX * 10000 * speed / this.getMaxSpeed();

    let forceZ = 0;
    // Forward movement along -Z axis
    if (moveZ > 0)        forceZ = 20000;
    else if (moveZ < 0)   forceZ = -30000;

    console.log("Speed: " + speed + ' km/h');
    console.log("turnRotation:");
    console.log(turnRotation);

    const resultantImpulse = new Ammo.btVector3(turnRotation, 0, forceZ);
    let resultantImpulse = new Ammo.btVector3(0, 0, forceZ);

    super.getPhysicsBody().applyCentralForce( resultantImpulse );

    resultantImpulse = new Ammo.btVector3(turnRotation, 0, 0);
    const pos = super.getPosition();
    super.getPhysicsBody().applyForce( resultantImpulse, new Ammo.btVector3(pos.x, pos.y, pos.z - 2) );*/


    console.log("direction:");
    console.log(this.direction);

    console.log("orientation:");
    console.log(this.orientation);

    const ms = super.getPhysicsBody().getMotionState();
    let quaternion = null;
    if (ms) {
        let TRANSFORM_AUX = new Ammo.btTransform();
        ms.getWorldTransform(TRANSFORM_AUX);
        //const p = TRANSFORM_AUX.getOrigin();
        const q = TRANSFORM_AUX.getRotation();

        //console.log( "p.x(): " + p.x() + " p.y(): " + p.y() + " p.z(): " + p.z() );
        console.log( "q.x(): " + q.x() + " q.y(): " + q.y() + " q.z(): " + q.z() + " q.w(): " + q.w() );

        quaternion = new THREE.Quaternion(q.x(), q.y(), q.z(), q.w());
    }

    //this.orientation.applyQuaternion(quaternion);


    if (moveX == 0 && moveY == 0 && moveZ == 0) {
      this.direction.set(0,0,0);
      //const pos = super.getPosition();
      //this.direction.set(pos.x, pos.y, pos.z);
    }
    else
      this.direction.addVectors( this.direction, new THREE.Vector3(moveX, moveY, moveZ) );


    let engineForce = 0;
    // Forward movement along -Z axis (acceleration greater than braking / reverse)
    if (moveZ > 0)        engineForce = 10000;
    else if (moveZ < 0)   engineForce = 15000;

    const airResistanceCoef = 8, //0.8,
          friction          = 10; //1;
    const velocity = super.getPhysicsBody().getLinearVelocity();

    // Init forces for the longitudinal movement
    const tractionForce     = new THREE.Vector3(this.direction.x, this.direction.y, this.direction.z);
    const airResistance     = new THREE.Vector3(velocity.x().toFixed(2), velocity.y().toFixed(2), velocity.z().toFixed(2));
    const rollingResistance = new THREE.Vector3(velocity.x().toFixed(2), velocity.y().toFixed(2), velocity.z().toFixed(2));

    const speed = velocity.length();

    // Compute them
    tractionForce.multiplyScalar(engineForce);
    airResistance.multiplyScalar(-airResistanceCoef * speed);
    rollingResistance.multiplyScalar(-friction);

    /*console.log("tractionForce");
    console.log(tractionForce);
    console.log("airResistance");
    console.log(airResistance);
    console.log("rollingResistance");
    console.log(rollingResistance);*/

    // Compute resultant longitudinal force subtracting resistant forces
    tractionForce.addVectors( tractionForce, airResistance.addVectors(airResistance, rollingResistance) )
                 .applyQuaternion(quaternion);

    /*console.log("tractionForce");
    console.log(tractionForce);*/

    //super.getPhysicsBody().applyCentralForce( new Ammo.btVector3(tractionForce.x, tractionForce.y, tractionForce.z) );
    //super.getPhysicsBody().applyCentralForce( new Ammo.btVector3(0, 0, tractionForce.z) );

    // WITH APPLY QUATERNION ON tractionForce
    //super.getPhysicsBody().applyCentralForce( new Ammo.btVector3(0, 0, -tractionForce.z) );
    super.getPhysicsBody().applyCentralForce( new Ammo.btVector3(-tractionForce.x, tractionForce.y, -tractionForce.z) );

    this.rotateWheels();

    const axis = new THREE.Vector3( 0, 1, 0 );

    //x : 180 = y : Math.PI
    const rad = (this.steeringIncrement / 180) * Math.PI * 43;
    this.orientation.applyAxisAngle( axis, rad * (-moveX) );

    // Curves
    console.log("this.steeringAngle: " + this.steeringAngle);

    if (this.steeringAngle == 0)  return;

    // Low speed
    const l = 7;   // Distance between front and rear axle
    const radius = l / Math.sin(this.steeringAngle);

    const angularVelocity = speed / radius;
    console.log("angularVelocity: " + angularVelocity);

    super.getPhysicsBody().setAngularVelocity( new Ammo.btVector3(0, angularVelocity, 0) );

    // High speed

    console.log("======= END move ========");
  }

}

export {Car}
