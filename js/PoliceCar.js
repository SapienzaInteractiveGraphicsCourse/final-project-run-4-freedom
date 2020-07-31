import { Car } from "./Car.js";
import * as THREE   from "https://unpkg.com/three@0.118.3/build/three.module.js";
import { Utils }    from "./Utils.js";

class PoliceCar extends Car {
  constructor(model3D, carInfo, game, name, wheels, scene, gui) {
    super(model3D, carInfo, game, name, wheels);

    // Pointlights for police car
    const createLight = (color, intensity, x, y, z) => {
      const spotLight = new THREE.SpotLight(color, intensity);
      spotLight.position.set(x, y, z);

      spotLight.penumbra = 0.3;
      spotLight.castShadow = true;

      spotLight.shadow.mapSize.width  = 1024;
      spotLight.shadow.mapSize.height = 1024;

      spotLight.shadow.camera.near = 500;
      spotLight.shadow.camera.far  = 4000;
      spotLight.shadow.camera.fov  = 30;

      model3D.add(spotLight);
      return spotLight;
    }

    // SpotLights (relative position to the 3D model)
    this.roofLightRed  = createLight(0xFF0000, 2, -0.05, 2, -0.5);
    this.roofLightBlue = createLight(0x0000FF, 2, -0.8, 2, -0.5);
    // If daylight set intensity to 38

    /*console.log("model3D.position.x: " + model3D.position.x);
    console.log("model3D.position.y: " + model3D.position.y);
    console.log("model3D.position.z: " + model3D.position.z);
    console.log("this.roofLightRed.position.x: " + this.roofLightRed.position.x);
    console.log("this.roofLightRed.position.y: " + this.roofLightRed.position.y);
    console.log("this.roofLightRed.position.z: " + this.roofLightRed.position.z);
    console.log("this.roofLightBlue.position.x: " + this.roofLightBlue.position.x);
    console.log("this.roofLightBlue.position.y: " + this.roofLightBlue.position.y);
    console.log("this.roofLightBlue.position.z: " + this.roofLightBlue.position.z);*/

    model3D.add( this.roofLightRed.target );
    model3D.add( this.roofLightBlue.target );

    /*let helper = new THREE.SpotLightHelper(this.roofLightRed);
    scene.add(helper);

    function updateLight() {
      helper.update();
    }

    gui.add(this.roofLightRed, 'intensity', 0, 100, 0.01);
    gui.add(this.roofLightRed, 'distance', 0, 40).onChange(updateLight);

    Utils.makeXYZGUI(gui, this.roofLightRed.position, 'positionR');

    helper = new THREE.SpotLightHelper(this.roofLightBlue);
    scene.add(helper);

    Utils.makeXYZGUI(gui, this.roofLightBlue.position, 'positionB');//*/

    // For roof lights blinking
    this.addIntensity        = true;
    this.deltaIntensity      = 0;
    this.roofLightsThreshold = 1;

    this.i = 0;
    this.moveRightThreshold    = 20;
    this.moveForwardThreshold  = 20;
    this.moveLeftThreshold     = 40;
    this.moveBackwardThreshold = 40;
  }

  setRoofLightsIntensity (value) {
    this.roofLightRed.intensity  = value;
    this.roofLightBlue.intensity = value;
  }

  // Called in main animate function
  update(deltaTime) {
    if(!deltaTime)   return;

    super.getFrontLeftWheel().rotation.x  = deltaTime;
    super.getFrontRightWheel().rotation.x = deltaTime;
    super.getBackLeftWheel().rotation.x  = deltaTime;
    super.getBackRightWheel().rotation.x = deltaTime;

    //super.get3DModel().translateOnAxis(new THREE.Vector3(0, 0, 1),  super.getMoveSpeed() * deltaTime * 0.029);

    const updateVehiclePhysics = () => {
      const speed = this.vehicle.getCurrentSpeedKmHour();
      console.log("PoliceCar speed: " + Math.abs(speed).toFixed(1) + ' km/h');

      let breakingForce = 0;
      let engineForce = 0;

      //if (actions.acceleration) {
        if (speed < -1)   breakingForce = this.maxBreakingForce;
        else              engineForce   = this.maxEngineForce;
      //}
      /*if (actions.braking) {
        if (speed > 1)  breakingForce = maxBreakingForce;
        else            engineForce = -maxEngineForce / 2;
      }*/

      const frontLeftWheel  = super.getFrontLeftWheel();
      const frontRightWheel = super.getFrontRightWheel();
      const backLeftWheel  = super.getBackLeftWheel();
      const backRightWheel = super.getBackRightWheel();

      console.log("PoliceCar getPosition(): ");
      console.log(this.getPosition());
      console.log("PoliceCar frontLeftWheel.position.x: " + frontLeftWheel.position.x);
      console.log("PoliceCar frontLeftWheel.position.y: " + frontLeftWheel.position.y);
      console.log("PoliceCar frontLeftWheel.position.z: " + frontLeftWheel.position.z);
      console.log("PoliceCar frontRightWheel.position.x: " + frontRightWheel.position.x);
      console.log("PoliceCar frontRightWheel.position.y: " + frontRightWheel.position.y);
      console.log("PoliceCar frontRightWheel.position.z: " + frontRightWheel.position.z);
      console.log("PoliceCar backLeftWheel.position.x: " + backLeftWheel.position.x);
      console.log("PoliceCar backLeftWheel.position.y: " + backLeftWheel.position.y);
      console.log("PoliceCar backLeftWheel.position.z: " + backLeftWheel.position.z);
      console.log("PoliceCar backRightWheel.position.x: " + backRightWheel.position.x);
      console.log("PoliceCar backRightWheel.position.y: " + backRightWheel.position.y);
      console.log("PoliceCar backRightWheel.position.z: " + backRightWheel.position.z);


      // Apply engine force to rear wheels
      this.vehicle.applyEngineForce(engineForce, this.BACK_LEFT_WHEEL_ID);
      this.vehicle.applyEngineForce(engineForce, this.BACK_RIGHT_WHEEL_ID);

      // Apply brake force to all wheels
      this.vehicle.setBrake(breakingForce / 2, this.FRONT_LEFT_WHEEL_ID);
      this.vehicle.setBrake(breakingForce / 2, this.FRONT_RIGHT_WHEEL_ID);
      this.vehicle.setBrake(breakingForce, this.BACK_LEFT_WHEEL_ID);
      this.vehicle.setBrake(breakingForce, this.BACK_RIGHT_WHEEL_ID);

      // Apply steering to front wheels
      this.vehicle.setSteeringValue(this.vehicleSteering, this.FRONT_LEFT_WHEEL_ID);
      this.vehicle.setSteeringValue(this.vehicleSteering, this.FRONT_RIGHT_WHEEL_ID);

      let tm, p, q, i;
      const n = this.vehicle.getNumWheels();
      for (i = 0; i < n; i++) {
        this.vehicle.updateWheelTransform(i, true);
        tm = this.vehicle.getWheelTransformWS(i);
        p = tm.getOrigin();
        q = tm.getRotation();
        this.wheels[i].position.set(p.x(), p.y(), p.z());
        this.wheels[i].quaternion.set(q.x(), q.y(), q.z(), q.w());
      }

      tm = this.vehicle.getChassisWorldTransform();
      p = tm.getOrigin();
      q = tm.getRotation();
      super.get3DModel().position.set(p.x(), p.y(), p.z());
      super.get3DModel().quaternion.set(q.x(), q.y(), q.z(), q.w());
    }

    updateVehiclePhysics();

    // Debug
    //console.log("model3D.position.z: " + this.model3D.position.z);
    //console.log("this.roofLightRed.position.z: " + this.roofLightRed.position.z);
    //console.log("this.roofLightBlue.position.z: " + this.roofLightBlue.position.z);

    // Blinks police roof lights
    const blink = () => {
      if(this.deltaIntensity >= this.roofLightsThreshold) {
        this.deltaIntensity = 0;
        this.roofLightsThreshold = 2.5;
        this.addIntensity = !this.addIntensity;
      }

      const augment = 0.05;
      this.deltaIntensity += augment;

      if(this.addIntensity) {
        this.roofLightRed.intensity  += augment;
        this.roofLightBlue.intensity += augment;
      }
      else {
        this.roofLightRed.intensity  -= augment;
        this.roofLightBlue.intensity -= augment;
      }

      //console.log("this.roofLightRed.intensity: " + this.roofLightRed.intensity);
      //console.log("this.roofLightBlue.intensity: " + this.roofLightBlue.intensity);

      // Rotate spotlights through a target moving around them
      //console.log("this.i: " + this.i);
      //console.log("this.roofLightRed.target.position.x: " + this.roofLightRed.target.position.x);
      //console.log("this.roofLightRed.target.position.z: " + this.roofLightRed.target.position.z);


      if(this.i < this.moveRightThreshold) {
        // Adjust lights position when rotate
        //if(this.moveRightThreshold == this.moveLeftThreshold && this.i < 6) {
        //  this.roofLightRed.position.z  += 0.1;
        //  this.roofLightBlue.position.z += 0.1;
        //}

        this.roofLightRed.target.position.x  += 2;
        this.roofLightBlue.target.position.x += 2;
      }
      else if(this.i < this.moveRightThreshold + this.moveForwardThreshold) {
        this.roofLightRed.target.position.z  += 2;
        this.roofLightBlue.target.position.z += 2;
      }
      else if(this.i < this.moveRightThreshold + this.moveForwardThreshold + this.moveLeftThreshold) {
        // Adjust lights position when rotate
        //if(this.i < this.moveRightThreshold + this.moveForwardThreshold + 6) {
        //  this.roofLightRed.position.z  -= 0.1;
        //  this.roofLightBlue.position.z -= 0.1;
        //}

        this.roofLightRed.target.position.x  -= 2;
        this.roofLightBlue.target.position.x -= 2;
      }
      else if(this.i < this.moveRightThreshold + this.moveForwardThreshold + this.moveLeftThreshold + this.moveBackwardThreshold) {
        this.roofLightRed.target.position.z  -= 2;
        this.roofLightBlue.target.position.z -= 2;
      }
      else {
        this.moveRightThreshold   = this.moveLeftThreshold;
        this.moveForwardThreshold = this.moveBackwardThreshold;
        this.i = -1;
      }

      this.i += 1;
    }

    blink();
  }

}

export {PoliceCar}
