import { Model } from "./Model.js";

class Car extends Model {
  constructor(model, name, wheels) {
    super(model);
    this.name = name;
    this.wheels = wheels;
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

}

export {Car}
