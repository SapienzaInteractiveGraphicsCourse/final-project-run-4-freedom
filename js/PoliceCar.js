import * as THREE   from "https://unpkg.com/three@0.118.3/build/three.module.js";
import { Car } from "./Car.js";
import { Utils }    from "./Utils.js";

class PoliceCar extends Car {
  constructor(model3D, carInfo, game, components, scene, gui) {
    super(model3D, carInfo, game, components);

    this.roofLights = components.roofLights;

    // Spotlights for police car rooflights
    /*const createLight = (color, intensity, x, y, z) => {
      const distance = 40;
      const spotLight = new THREE.SpotLight(color, intensity, distance);
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

    /*model3D.add( this.roofLightRed.target );
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
    /*this.addIntensity        = true;
    this.deltaIntensity      = 0;
    this.roofLightsThreshold = 1;

    this.i = 0;
    this.moveRightThreshold    = 20;
    this.moveForwardThreshold  = 20;
    this.moveLeftThreshold     = 40;
    this.moveBackwardThreshold = 40;*/
  }

  /*setRoofLightsIntensity (value) {
    this.roofLightRed.intensity  = value;
    this.roofLightBlue.intensity = value;
  }*/

  blinkRoofLights() {
    if (this.roofLights) {
      for (let i=0; i < this.roofLights.length; i++)
        this.roofLights[i].rotation.z += 0.1;
    }
  }

  // Called in main animate function
  /*update(deltaTime) {
    if(!deltaTime)   return;

    // Debug
    //console.log("model3D.position.z: " + this.model3D.position.z);
    //console.log("this.roofLightRed.position.z: " + this.roofLightRed.position.z);
    //console.log("this.roofLightBlue.position.z: " + this.roofLightBlue.position.z);

    // Blinks police roof lights
    /*const blink = () => {
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
  }*/

}

export {PoliceCar}
