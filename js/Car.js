import { Model } from "./Model.js";

class Car extends Model {
  constructor(model3D, name, wheels) {
    super(model3D);
    this.name      = name;
    this.wheels    = wheels;
    this.moveSpeed = 1000;
    this.turnSpeed = 4;
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
