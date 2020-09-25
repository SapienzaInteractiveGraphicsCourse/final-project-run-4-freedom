import { Model } from "./Model.js";
import { Utils } from "./Utils.js";

import * as THREE from "https://unpkg.com/three@0.118.3/build/three.module.js";

class Car extends Model {
  constructor(model3D, carInfo, game, components) {
    super(model3D, carInfo, game);
    this.name      = carInfo.carName;
    this.wheels    = components.wheels;
    this.maxSpeed  = Utils.toMsecond( carInfo.maxSpeed );
    this.maxSpeedReverse = Utils.toMsecond(45); // 45 Km/h converted to m/s

    //this.moveSpeed = 1000;
    //this.turnSpeed = 4;

    this.orientation = new THREE.Vector3();
    model3D.getWorldDirection(this.orientation);

    const velocity = super.getPhysicsBody().getLinearVelocity();
    this.velocityVec = new THREE.Vector3( velocity.x(), velocity.y(), velocity.z() );

    // Dot product to calculate if orientation and velocity vectors are facing the same direction
    this.dot = this.orientation.dot(this.velocityVec);

    // Forces
    this.tractionForce     = new THREE.Vector3();
    this.airResistance     = new THREE.Vector3();
    this.rollingResistance = new THREE.Vector3();

    // Steering
    this.steeringIncrement = 0.04;
    this.steeringClamp     = 0.5;
    this.steeringAngle     = 0;

    // Distance between front and rear axle
    this.axlesDistance = 5;

    //this.carHeading = Math.PI/2;

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
    return this.wheels ? this.wheels[0] : null;
  }

  getFrontRightWheel() {
    return this.wheels ? this.wheels[1] : null;
  }

  getBackLeftWheel() {
    return this.wheels ? this.wheels[2] : null;
  }

  getBackRightWheel() {
    return this.wheels ? this.wheels[3] : null;
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

  rotateWheels() {
    if (!this.getWheels()) return;

    const speed = Math.abs(this.getCurrentSpeedKmHour());

    // If Z rotation (steering), also X rotation (rolling) is affected so use only X axis
    this.getFrontLeftWheel().rotation.x  += speed;
    this.getFrontRightWheel().rotation.x += speed;

    this.getBackLeftWheel().rotation.x  += speed;
    this.getBackRightWheel().rotation.x += speed;
  }

  // Return current speed in Km/h, negative value if reverse
  getCurrentSpeedKmHour() {
    const speed = Utils.toKmHour( super.getPhysicsBody().getLinearVelocity().length() );
    return this.isForwardMovement() ? speed : -speed;
  }

  // Return car orientation
  getOrientation() {
    return this.orientation;
  }

  getVelocity() {
    return this.velocityVec;
  }

  // Return true if forward movement, false if reverse.
  // Dot product to calculate if orientation and velocity vectors are facing the same direction.
  // - Positive if |a| > 0, |b| > 0 and -90° < theta < 90°
  // - Zero if |a| > 0, |b| > 0 or theta = 90° => a and b are orthogonal
  // - Negative if |a| > 0, |b| > 0 and theta > 90°
  isForwardMovement() {
    return this.dot > 0;
  }

  move(moveX, moveY, moveZ, deltaTime=0) {

    const removeNoise = (v) => {
      v.x = Math.abs(v.x) > 0.7 ? v.x : 0;
      v.y = Math.abs(v.y) > 0.7 ? v.y : 0;
      v.z = Math.abs(v.z) > 0.7 ? v.z : 0;
    }

    // PROVA
    /*let ms = this.getPhysicsBody().getMotionState();
    if (ms) {
      const transform = new Ammo.btTransform();
      ms.getWorldTransform(transform);

      let relativeForce = new Ammo.btVector3(0,0, 25000);

      const relativeTransform = new Ammo.btTransform();
      relativeTransform.setOrigin(relativeForce);

      relativeForce = (transform.op_mul(relativeTransform)).getOrigin();
      this.getPhysicsBody().applyForce(relativeForce, transform.getOrigin());
    }*/
    // FINE PROVA

    // PROVA 2
    /*console.log("orientation:");
    console.log(this.orientation);

    super.get3DModel().getWorldDirection(this.orientation);

    const velocity = super.getPhysicsBody().getLinearVelocity();

    const engineForce = 25000,   // Force
    //const engineForce = 1000,  // Impulse
          speed = velocity.length().toFixed(2);

    // Init forces for the longitudinal movement
    this.tractionForce.copy(this.orientation);
    // Remove noise
    removeNoise(this.tractionForce);

    // Compute them
    this.tractionForce.multiplyScalar(engineForce);

    console.log("tractionForce");
    console.log(this.tractionForce);

    console.log(-0.0075);

    if (speed < this.maxSpeed)
      super.getPhysicsBody().applyForce(
        new Ammo.btVector3(this.tractionForce.x, this.tractionForce.y, this.tractionForce.z),
        new Ammo.btVector3(-0.0075, 0, 0) );
        //new Ammo.btVector3(-0.005, 0, 0) );
        //new Ammo.btVector3(-0.01, 0, 0) );*/
    // FINE PROVA 2


    // ORIGINALE
    console.log("orientation:");
    console.log(this.orientation);

    super.get3DModel().getWorldDirection(this.orientation);

    const airResistanceCoef = 0.8,
          friction          = 1;
    const velocity = super.getPhysicsBody().getLinearVelocity();

    this.velocityVec.set( velocity.x(), velocity.y(), velocity.z() );
    // Remove noise
    //removeNoise(this.velocityVec);
    //console.log("velocity vector:");
    //console.log(this.velocityVec);

    // Dot product to calculate if orientation and velocity vectors are facing the same direction.
    // - Positive if |a| > 0, |b| > 0 and -90° < theta < 90°
    // - Zero if |a| > 0, |b| > 0 or theta = 90° => a and b are orthogonal
    // - Negative if |a| > 0, |b| > 0 and theta > 90°
    this.dot = this.orientation.dot(this.velocityVec);

    let engineForce = 0,
        speed = velocity.length().toFixed(2);

    // Forward movement along -Z axis (acceleration greater than braking / reverse)
    if (moveZ > 0) {
      // Braking / Reverse
      engineForce = -20000;
      // Check if braking or reverse
      speed = this.isForwardMovement() ? Math.min(speed, this.maxSpeed) : Math.min(speed, this.maxSpeedReverse);
    }
    else if (moveZ < 0) {
      // Acceleration
      engineForce = 25000;
      speed = Math.min(speed, this.maxSpeed);
    }

    // Init forces for the longitudinal movement
    this.tractionForce.copy(this.orientation);
    // Remove noise
    //removeNoise(this.tractionForce);
    this.airResistance.set(velocity.x().toFixed(2), velocity.y().toFixed(2), velocity.z().toFixed(2));
    this.rollingResistance.set(velocity.x().toFixed(2), velocity.y().toFixed(2), velocity.z().toFixed(2));

    // Compute them
    this.tractionForce.multiplyScalar(engineForce);
    this.airResistance.multiplyScalar(-airResistanceCoef * speed);
    this.rollingResistance.multiplyScalar(-friction);

    // Compute longitudinal or horizontal friction force
    /*if (this.steeringAngle == 0) {
      this.rollingResistance.set(velocity.x().toFixed(2), velocity.y().toFixed(2), velocity.z().toFixed(2));
      this.rollingResistance.multiplyScalar(-friction);

      // Compute resultant longitudinal force subtracting resistant forces
      //this.tractionForce.add(this.airResistance).add(this.rollingResistance);
    }
    else {
      /*rollingResistance = this.orientation.clone();
      const axis = new THREE.Vector3(0, 1, 0);
      const ang = moveX > 0 ? -90 : 90;
      rollingResistance.applyAxisAngle(axis, ang);*/

      //rollingResistance = super.getPosition().clone();

      /*console.log("this.steeringAngle: " + this.steeringAngle);

      //this.rollingResistance.set(moveX * 200 * speed, 0, 0);
      this.rollingResistance.set(moveX * 700 * speed, 0, 0);

      //this.tractionForce.add(this.airResistance).add(this.rollingResistance);


      // Reverse the steering angle if reverse movement
      /*const rad = this.isForwardMovement() ? Utils.toRadiants(this.steeringAngle * 40) :
                                             Utils.toRadiants(-this.steeringAngle * 40);

      // PROVA
      //let rad = this.steeringAngle > 0 ? Math.PI/7 : -Math.PI/7;
      //rad = this.isForwardMovement() ? rad : -rad;
      console.log("rad: " + rad);

      const radius = this.axlesDistance / Math.sin(rad);

      const angularVelocity = speed / radius;

      // PROVA
      //let angularVelocity = this.steeringAngle > 0 ? 0.35 : -0.35;
      //angularVelocity = this.isForwardMovement() ? angularVelocity : -angularVelocity;
      console.log("angularVelocity: " + angularVelocity);

      super.getPhysicsBody().setAngularVelocity( new Ammo.btVector3(0, angularVelocity, 0) );*/

      // Calculate center of the turning
      //rollingResistance.x = moveX > 0 ? rollingResistance.x + radius : rollingResistance.x - radius;
      // Forward movement along -Z axis, so center of the curve requires a sum and not a sub
      //rollingResistance.z += this.axlesDistance / 2;

      //rollingResistance = new THREE.Vector3( moveX > 0 ? radius : -radius, 0, this.axlesDistance / 2 );
      //rollingResistance = new THREE.Vector3( this.isForwardMovement() ? -radius : radius, 0, this.axlesDistance / 2 );

      //rollingResistance.multiplyScalar( super.getMass() * (speed * speed) / radius );
      /*rollingResistance.multiplyScalar( super.getMass() * 9.82 * friction );
      //rollingResistance.multiplyScalar( speed != 0 ? 400 : 0 );

      // Compute resultant longitudinal force subtracting resistant forces
      //moveX > 0 ? tractionForce.add(airResistance).sub(rollingResistance) :
      //            tractionForce.add(airResistance).add(rollingResistance);

      tractionForce.add(airResistance);

      super.getPhysicsBody().applyCentralForce(
        new Ammo.btVector3(rollingResistance.x, rollingResistance.y, rollingResistance.z) );

      const r = this.orientation.clone();
      r.z += this.axlesDistance / 2;
      rollingResistance.cross(r);
      super.getPhysicsBody().applyTorque(
        new Ammo.btVector3(rollingResistance.x, rollingResistance.y, rollingResistance.z) );*/
    //}


    /*console.log("INITIAL tractionForce");
    console.log(this.tractionForce);
    console.log("airResistance");
    console.log(this.airResistance);
    console.log("rollingResistance");
    console.log(this.rollingResistance);//*/

    // Compute resultant longitudinal force subtracting resistant forces
    this.tractionForce.add(this.airResistance).add(this.rollingResistance);

    /*const axis = new THREE.Vector3(0, 1, 0);
    const r = this.isForwardMovement() ? Utils.toRadiants(this.steeringAngle * 40) : Utils.toRadiants(-this.steeringAngle * 40);

    // Compute resultant longitudinal force subtracting resistant forces
    this.tractionForce.add(this.airResistance).add(this.rollingResistance).applyAxisAngle(axis, r);//*/

    //console.log("INTERMEDIATE tractionForce");
    //console.log(this.tractionForce);

    // Boost the steering force
    this.tractionForce.x = (engineForce-5000) * moveX;

    //console.log("FINAL tractionForce");
    //console.log(this.tractionForce);

    // IN THE GAME THE PLAYER WILL NEVER GO IN REVERSE
    if (this.isForwardMovement()) {
      if (speed < this.maxSpeed)
        super.getPhysicsBody().applyForce(
          new Ammo.btVector3(this.tractionForce.x, this.tractionForce.y, this.tractionForce.z),
          new Ammo.btVector3(-0.0075, 0, 0) );
        /*super.getPhysicsBody().applyCentralForce(
          new Ammo.btVector3(this.tractionForce.x, this.tractionForce.y, this.tractionForce.z) );*/

    // WITH APPLY QUATERNION ON tractionForce
    //super.getPhysicsBody().applyCentralForce( new Ammo.btVector3(0, 0, -tractionForce.z) );
    //super.getPhysicsBody().applyCentralForce( new Ammo.btVector3(-tractionForce.x, tractionForce.y, -tractionForce.z) );
    }

    // IN THE GAME THE PLAYER WILL NEVER GO IN REVERSE
    else if (speed < this.maxSpeedReverse)
      super.getPhysicsBody().applyForce(
        new Ammo.btVector3(this.tractionForce.x, this.tractionForce.y, this.tractionForce.z),
        new Ammo.btVector3(-0.0075, 0, 0) );
        /*super.getPhysicsBody().applyCentralForce(
          new Ammo.btVector3(this.tractionForce.x, this.tractionForce.y, this.tractionForce.z) );*/

    this.rotateWheels();

    // Curves
    //console.log("this.steeringAngle: " + this.steeringAngle);

    if (this.steeringAngle == 0)  return;

    // Low speed turning
    // Reverse the steering angle if reverse movement
    const rad = this.isForwardMovement() ? Utils.toRadiants(this.steeringAngle * 40) : Utils.toRadiants(-this.steeringAngle * 40);
    //console.log("rad: " + rad);

    // Ok for parking mode (DEBUG)
    //const radius = this.axlesDistance / Math.sin(rad);

    const radius = 130 / Math.sin(rad);
    const angularVelocity = speed / radius;
    //console.log("angularVelocity: " + angularVelocity);

    super.getPhysicsBody().setAngularVelocity( new Ammo.btVector3(0, angularVelocity, 0) );

    // High speed turning
    /*if (this.getCurrentSpeedKmHour() > 40) {
      const corneringStiffness = 1.3;
      const sideslipAngle = this.orientation.angleTo(this.velocityVec);

      const lateralVelocity = this.velocityVec.multiplyScalar( Math.sin(sideslipAngle) );

      const slipAngle = Math.atan( (lateralVelocity.length() + angularVelocity * this.axlesDistance / 2) / speed )
                        - this.steeringAngle * (this.isForwardMovement() ? 1 : -1 );

      const lateralForce = lateralVelocity.multiplyScalar( Math.sin(slipAngle) )
                                          .multiplyScalar(corneringStiffness * sideslipAngle);

      console.log("lateralForce:");
      console.log(lateralForce);
      super.getPhysicsBody().applyCentralForce( new Ammo.btVector3(lateralForce.x, lateralForce.y, lateralForce.z) );
    }*/









    /*const velocity = super.getPhysicsBody().getLinearVelocity();
    this.velocityVec.set( velocity.x(), velocity.y(), velocity.z() );
    console.log("velocity vector:");
    console.log(this.velocityVec);

    // Dot product to calculate if orientation and velocity vectors are facing the same direction.
    // - Positive if |a| > 0, |b| > 0 and -90° < theta < 90°
    // - Zero if |a| > 0, |b| > 0 or theta = 90° => a and b are orthogonal
    // - Negative if |a| > 0, |b| > 0 and theta > 90°
    this.dot = this.orientation.dot(this.velocityVec);

    let engineForce = 0,
        speed = velocity.length();*/


    /*console.log("orientation:");
    console.log(this.orientation);

    super.get3DModel().getWorldDirection(this.orientation);

    let engineForce = 0,
        speed = 0;
    // Forward movement along -Z axis (acceleration greater than braking / reverse)
    if (moveZ > 0) {
      // Braking / Reverse
      engineForce = 10;
      // Check if braking or reverse
      //speed = this.isForwardMovement() ? Math.min(speed, this.maxSpeed) : Math.min(speed, this.maxSpeedReverse);
      speed = -10;
    }
    else if (moveZ < 0) {
      // Acceleration
      engineForce = 15;
      //speed = Math.min(speed, this.maxSpeed);
      speed = 15;
    }

    const carLocation  = super.getPosition(),
          carDirection = new THREE.Vector3( Math.cos(this.carHeading), 0, Math.sin(this.carHeading) );

    const frontWheel = new THREE.Vector3(),
          backWheel  = new THREE.Vector3();

    const axlesDistanceVec = this.orientation.clone().multiplyScalar(this.axlesDistance / 2);
    //const axlesDistanceVec = carDirection.clone().multiplyScalar(this.axlesDistance / 2);
    frontWheel.addVectors( carLocation, axlesDistanceVec );
    backWheel.subVectors( carLocation, axlesDistanceVec );

    console.log("frontWheel:");
    console.log(frontWheel);
    console.log("backWheel:");
    console.log(backWheel);


    const backWheelOrientation = this.orientation.clone();
    backWheel.add( backWheelOrientation.multiplyScalar(speed * deltaTime) );
    frontWheel.add( this.orientation.addScalar(Math.PI/6).multiplyScalar(speed * deltaTime) );
    /*const backWheelOrientation = carDirection.clone();
    backWheel.sub( backWheelOrientation.multiplyScalar(speed * deltaTime) );
    frontWheel.sub( carDirection.addScalar(Math.PI/6).multiplyScalar(speed * deltaTime) );*/

    /*carLocation.addVectors(frontWheel, backWheel).multiplyScalar(0.5);
    super.getPosition().copy(carLocation);
    //super.get3DModel().rotation.y += this.steeringAngle;

    console.log("getPosition(): ");
    console.log(super.getPosition());

    let ms = super.getPhysicsBody().getMotionState();
    if (ms) {
        const transform = new Ammo.btTransform();
        ms.getWorldTransform(transform);
        transform.setOrigin( new Ammo.btVector3(
          super.get3DModel().position.x,
          super.get3DModel().position.y,
          super.get3DModel().position.z ) );
        transform.setRotation( new Ammo.btQuaternion(
          super.get3DModel().quaternion.x,
          super.get3DModel().quaternion.y,
          super.get3DModel().quaternion.z,
          super.get3DModel().quaternion.w ) );

        ms = new Ammo.btDefaultMotionState(transform);
        super.getPhysicsBody().setMotionState(ms);
    }

    this.carHeading = Math.atan2( frontWheel.z - backWheel.z , frontWheel.x - backWheel.x );*/

    console.log("======= END move ========");
  }

}

export {Car}
