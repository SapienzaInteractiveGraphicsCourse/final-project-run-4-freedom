import { Model } from "./Model.js";
import { Utils } from "./Utils.js";

import * as THREE from "https://unpkg.com/three@0.118.3/build/three.module.js";

class Character extends Model {
  constructor(model3D, characterInfo, game, components) {
    super(model3D, characterInfo, game);
    this.name       = characterInfo.name;
    this.components = components;
    /*this.head       = components.head;
    this.leftArm    = components.leftArm;
    this.leftHand   = components.leftHand;
    this.rightArm   = components.rightArm;
    this.rightHand  = components.rightHand;
    this.leftLeg    = components.leftLeg;
    this.leftFoot   = components.leftFoot;
    this.rightLeg   = components.rightLeg;
    this.rightFoot  = components.rightFoot;*/
    this.maxSpeed  = Utils.toMsecond( characterInfo.maxSpeed );
    this.maxSpeedReverse = Utils.toMsecond(15);

    this.moveSpeed  = 100;
    this.turnSpeed  = 4;

    this.orientation = new THREE.Vector3();
    model3D.getWorldDirection(this.orientation);

    const velocity = super.getPhysicsBody().getLinearVelocity();
    this.velocityVec = new THREE.Vector3( velocity.x(), velocity.y(), velocity.z() );

    // Dot product to calculate if orientation and velocity vectors are facing the same direction.
    this.dot = this.orientation.dot(this.velocityVec);

    this.tractionForce     = new THREE.Vector3();
    this.airResistance     = new THREE.Vector3();
    this.rollingResistance = new THREE.Vector3();

    this.steeringIncrement = 0.04;
    this.steeringClamp     = 0.5;
    this.steeringAngle     = 0;

    this.axlesDistance = 1;

    // Character running animation
    this.deltaMovement = 0;
    this.movementThreshold = 0.7;
  }

  getName() {
    return this.name;
  }

  getComponents() {
    return this.components;
  }

  getHead() {
    return this.components.head;
  }

  getLeftShoulder() {
    return this.components.leftArm[0];
  }

  getRightShoulder() {
    return this.components.rightArm[0];
  }

  getUpperLeftArm() {
    return this.components.leftArm[1];
  }

  getUpperRightArm() {
    return this.components.rightArm[1];
  }

  getLowerLeftArm() {
    return this.components.leftArm[2];
  }

  getLowerRightArm() {
    return this.components.rightArm[2];
  }

  getLeftHand() {
    return this.components.leftHand[0];
  }

  getRightHand() {
    return this.components.rightHand[0];
  }

  getLeftThumb() {
    return this.components.leftHand[1];
  }

  getRightThumb() {
    return this.components.rightHand[1];
  }

  getLeftIndex() {
    return this.components.leftHand[2];
  }

  getRightIndex() {
    return this.components.rightHand[2];
  }

  getLeftMiddle() {
    return this.components.leftHand[3];
  }

  getRightMiddle() {
    return this.components.rightHand[3];
  }

  getLeftRing() {
    return this.components.leftHand[4];
  }

  getRightRing() {
    return this.components.rightHand[4];
  }

  getLeftPinky() {
    return this.components.leftHand[5];
  }

  getRightPinky() {
    return this.components.rightHand[5];
  }

  getUpperLeftLeg() {
    return this.components.leftLeg[0];
  }

  getUpperRightLeg() {
    return this.components.rightLeg[0];
  }

  getLowerLeftLeg() {
    return this.components.leftLeg[1];
  }

  getLowerRightLeg() {
    return this.components.rightLeg[1];
  }

  getLeftFoot() {
    return this.components.leftFoot[0];
  }

  getRightFoot() {
    return this.components.rightFoot[0];
  }

  getMoveSpeed() {
    return this.moveSpeed;
  }

  getTurnSpeed() {
    return this.turnSpeed;
  }


  // Return current speed in Km/h, negative value if reverse
  getCurrentSpeedKmHour() {
    const speed = Utils.toKmHour( super.getPhysicsBody().getLinearVelocity().length() );
    return this.isForwardMovement() ? speed : -speed;
  }

  getOrientation() {
    return this.orientation;
  }

  getVelocity() {
    return this.velocityVec;
  }

  // Return true if forward movement, false if reverse
  isForwardMovement() {
    return this.dot > 0;
  }

  // Running animation
  run() {
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
      this.getHead().rotation.x += augment;
      this.getUpperLeftArm().rotation.z  += augment;
      this.getUpperRightArm().rotation.z -= augment;

      this.getLowerLeftArm().rotation.z  += augment;
      this.getLowerRightArm().rotation.z -= augment;

      this.getUpperLeftLeg().rotation.z  += augment;
      this.getUpperRightLeg().rotation.z -= augment;

      this.getLowerLeftLeg().rotation.z  += augment;
      this.getLowerRightLeg().rotation.z -= augment;

      this.getLeftFoot().rotation.z  += augment;
      this.getRightFoot().rotation.z -= augment;
    }
    else {
      this.getHead().rotation.x -= augment;
      this.getUpperLeftArm().rotation.z  -= augment;
      this.getUpperRightArm().rotation.z += augment;

      this.getLowerLeftArm().rotation.z  -= augment;
      this.getLowerRightArm().rotation.z += augment;

      this.getUpperLeftLeg().rotation.z  -= augment;
      this.getUpperRightLeg().rotation.z += augment;

      this.getLowerLeftLeg().rotation.z  -= augment;
      this.getLowerRightLeg().rotation.z += augment;

      this.getLeftFoot().rotation.z  -= augment;
      this.getRightFoot().rotation.z += augment;
    }
  }

  move(moveX, moveY, moveZ, deltaTime) {
    console.log("orientation:");
    console.log(this.orientation);

    super.get3DModel().getWorldDirection(this.orientation);

    const airResistanceCoef = 0.8,
          friction          = 1;
    const velocity = super.getPhysicsBody().getLinearVelocity();

    this.velocityVec.set( velocity.x(), velocity.y(), velocity.z() );
    // Remove noise
    /*this.velocityVec.x = Math.abs(this.velocityVec.x) > 0.7 ? this.velocityVec.x : 0;
    this.velocityVec.y = Math.abs(this.velocityVec.y) > 0.7 ? this.velocityVec.y : 0;
    this.velocityVec.z = Math.abs(this.velocityVec.z) > 0.7 ? this.velocityVec.z : 0;*/
    console.log("velocity vector:");
    console.log(this.velocityVec);

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
    /*this.tractionForce.x = Math.abs(this.tractionForce.x) > 0.7 ? this.tractionForce.x : 0;
    this.tractionForce.y = Math.abs(this.tractionForce.y) > 0.7 ? this.tractionForce.y : 0;
    this.tractionForce.z = Math.abs(this.tractionForce.z) > 0.7 ? this.tractionForce.z : 0;*/
    this.airResistance.set(velocity.x().toFixed(2), velocity.y().toFixed(2), velocity.z().toFixed(2));
    this.rollingResistance.set(velocity.x().toFixed(2), velocity.y().toFixed(2), velocity.z().toFixed(2));

    // Compute them
    this.tractionForce.multiplyScalar(engineForce);
    this.airResistance.multiplyScalar(-airResistanceCoef * speed);
    this.rollingResistance.multiplyScalar(-friction);

    console.log("tractionForce");
    console.log(this.tractionForce);
    console.log("airResistance");
    console.log(this.airResistance);
    console.log("rollingResistance");
    console.log(this.rollingResistance);

    const axis = new THREE.Vector3(0, 1, 0);
    const r = this.isForwardMovement() ? Utils.toRadiants(this.steeringAngle * 40) : Utils.toRadiants(-this.steeringAngle * 40);

    // Compute resultant longitudinal force subtracting resistant forces
    this.tractionForce.add(this.airResistance).add(this.rollingResistance).applyAxisAngle(axis, r);//*/

    console.log("tractionForce");
    console.log(this.tractionForce);

    // IN THE GAME THE PLAYER WILL NEVER GO IN REVERSE
    if (this.isForwardMovement()) {
      if (speed < this.maxSpeed)
        super.getPhysicsBody().applyCentralForce(
          new Ammo.btVector3(this.tractionForce.x, this.tractionForce.y, this.tractionForce.z) );
      //else
      //  super.getPhysicsBody().setLinearVelocity( );

    //super.getPhysicsBody().applyCentralForce( new Ammo.btVector3(0, 0, tractionForce.z) );

    // WITH APPLY QUATERNION ON tractionForce
    //super.getPhysicsBody().applyCentralForce( new Ammo.btVector3(0, 0, -tractionForce.z) );
    //super.getPhysicsBody().applyCentralForce( new Ammo.btVector3(-tractionForce.x, tractionForce.y, -tractionForce.z) );
    }

    // IN THE GAME THE PLAYER NEVER WILL GO IN REVERSE
    else if (speed < this.maxSpeedReverse)
        super.getPhysicsBody().applyCentralForce(
          new Ammo.btVector3(this.tractionForce.x, this.tractionForce.y, this.tractionForce.z) );
      /*else
        //super.getPhysicsBody().setLinearVelocity( );
        super.getPhysicsBody().applyCentralForce( new Ammo.btVector3(tractionForce.x, tractionForce.y, tractionForce.z).operator*=(0.9) );*/

    this.run();

    // Curves
    console.log("this.steeringAngle: " + this.steeringAngle);

    if (this.steeringAngle == 0)  return;

    // Low speed turning
    // Reverse the steering angle if reverse movement
    const rad = this.isForwardMovement() ? Utils.toRadiants(this.steeringAngle * 40) : Utils.toRadiants(-this.steeringAngle * 40);

    console.log("rad: " + rad);

    const radius = this.axlesDistance / Math.sin(rad);
    const angularVelocity = speed / radius;

    console.log("angularVelocity: " + angularVelocity);

    super.getPhysicsBody().setAngularVelocity( new Ammo.btVector3(0, angularVelocity, 0) );
  }

}

export {Character}
