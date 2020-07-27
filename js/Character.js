import { Model } from "./Model.js";

class Character extends Model {
  constructor(model3D, mass, game, name, components) {
    super(model3D, mass, game);
    this.name       = name;
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
    this.moveSpeed  = 100;
    this.turnSpeed  = 4;
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

}

export {Character}
