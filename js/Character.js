import { Model } from "./Model.js";

class Character extends Model {
  constructor(model3D, name, components) {
    super(model3D);
    this.name       = name;
    this.components = components;
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
    return this.components[0];
  }

  getUpperLeftArm() {
    return this.components[1];
  }

  getUpperRightArm() {
    return this.components[2];
  }

  getLowerLeftArm() {
    return this.components[3];
  }

  getLowerRightArm() {
    return this.components[4];
  }

  getUpperLeftLeg() {
    return this.components[5];
  }

  getUpperRightLeg() {
    return this.components[6];
  }

  getLowerLeftLeg() {
    return this.components[7];
  }

  getLowerRightLeg() {
    return this.components[8];
  }

  getMoveSpeed() {
    return this.moveSpeed;
  }

  getTurnSpeed() {
    return this.turnSpeed;
  }

}

export {Character}
