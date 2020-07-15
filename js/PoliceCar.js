import { Car } from "./Car.js";
import * as THREE   from "https://unpkg.com/three@0.118.3/build/three.module.js";
import * as UTILS   from "./Utils.js";

class PoliceCar extends Car {
  constructor(model3D, name, wheels, scene, gui) {
    super(model3D, name, wheels);

    // Pointlights for police car
    const createLight = (color, intensity, x, y, z) => {
      const spotLight = new THREE.SpotLight(color, intensity);
      spotLight.position.set(x, y, z);

      spotLight.castShadow = true;

      spotLight.shadow.mapSize.width = 1024;
      spotLight.shadow.mapSize.height = 1024;

      spotLight.shadow.camera.near = 500;
      spotLight.shadow.camera.far  = 4000;
      spotLight.shadow.camera.fov  = 30;

      scene.add(spotLight);
      return spotLight;
    }

    // SpotLights
    this.roofLightRed  = createLight(0xFF0000, 2, model3D.position.x + 0.2, model3D.position.y + 4.2, model3D.position.z + 1);
    this.roofLightBlue = createLight(0x0000FF, 2, model3D.position.x + 1.6, model3D.position.y + 4.2, model3D.position.z + 1);
    // If daylight set intensity to 38

    scene.add( this.roofLightRed.target );
    scene.add( this.roofLightBlue.target );

    //let helper = new THREE.PointLightHelper(this.roofLightRed);
    /*let helper = new THREE.SpotLightHelper(this.roofLightRed);
    scene.add(helper);

    function updateLight() {
      helper.update();
    }

    gui.add(this.roofLightRed, 'intensity', 0, 100, 0.01);
    gui.add(this.roofLightRed, 'distance', 0, 40).onChange(updateLight);

    UTILS.makeXYZGUI(gui, this.roofLightRed.position, 'positionR');

    //helper = new THREE.PointLightHelper(this.roofLightBlue);
    helper = new THREE.SpotLightHelper(this.roofLightBlue);
    scene.add(helper);

    UTILS.makeXYZGUI(gui, this.roofLightBlue.position, 'positionB');//*/

    this.addIntensity        = true;
    this.deltaIntensity      = 0;
    this.roofLightsThreshold = 1;

    this.scene = scene;
    this.i = 0;
    this.moveRightThreshold    = 20;
    this.moveForwardThreshold  = 20;
    this.moveLeftThreshold     = 40;
    //this.moveBackwardThreshold = 40;
  }

  setRoofLightsIntensity (value) {
    this.roofLightRed.intensity  = value;
    this.roofLightBlue.intensity = value;
  }

  // Called in main render function
  update(deltaTime) {
    if(!deltaTime)   return;

    super.getFrontLeftWheel().rotation.x  = deltaTime;
    super.getFrontRightWheel().rotation.x = deltaTime;

    super.getBackLeftWheel().rotation.x  = deltaTime;
    super.getBackRightWheel().rotation.x = deltaTime;

    super.get3DModel().translateOnAxis(new THREE.Vector3(0, 0, 1), super.getMoveSpeed() * deltaTime * 0.029); //super.getMoveSpeed() * deltaTime);
    this.roofLightRed.translateOnAxis(new THREE.Vector3(0, 0, -1),  super.getMoveSpeed() * deltaTime * 0.029);
    this.roofLightBlue.translateOnAxis(new THREE.Vector3(0, 0, -1), super.getMoveSpeed() * deltaTime * 0.029);

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

      // Rotate spotlights
      console.log("this.i: " + this.i);
      console.log("this.roofLightRed.target.position.x: " + this.roofLightRed.target.position.x);
      console.log("this.roofLightRed.target.position.z: " + this.roofLightRed.target.position.z);

      if(this.i < this.moveRightThreshold) {
        // Adjust lights position when rotate
        /*if(this.moveRightThreshold == this.moveLeftThreshold && this.i < 6) {
          this.roofLightRed.position.z  += 0.1;
          this.roofLightBlue.position.z += 0.1;
        }*/

        this.roofLightRed.target.position.x  += 2;
        this.roofLightBlue.target.position.x += 2;
      }
      else if(this.i < this.moveRightThreshold + this.moveForwardThreshold) {
        this.roofLightRed.target.position.z  += 2;
        this.roofLightBlue.target.position.z += 2;
      }
      else if(this.i < this.moveRightThreshold + this.moveForwardThreshold + this.moveLeftThreshold) {
        // Adjust lights position when rotate
        /*if(this.i < this.moveRightThreshold + this.moveForwardThreshold + 6) {
          this.roofLightRed.position.z  -= 0.1;
          this.roofLightBlue.position.z -= 0.1;
        }*/

        this.roofLightRed.target.position.x  -= 2;
        this.roofLightBlue.target.position.x -= 2;
      }
      else if(this.i < this.moveRightThreshold + this.moveForwardThreshold + this.moveLeftThreshold + this.moveForwardThreshold) {
        this.roofLightRed.target.position.z  -= 2;
        this.roofLightBlue.target.position.z -= 2;
      }
      else {
        this.moveRightThreshold = this.moveLeftThreshold;
        //this.moveForwardThreshold = this.moveBackwardThreshold;
        this.i = -1;
      }

      this.i += 1;
    }

    blink();
  }

}

export {PoliceCar}
