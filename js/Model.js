class Model {
  constructor(model3D) {
    this.model3D = model3D;
  }

  get3DModel() {
    return this.model3D;
  }

  getPosition() {
    return this.model3D.position;
  }

}

export {Model}
