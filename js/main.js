import * as THREE        from "https://unpkg.com/three@0.118.3/build/three.module.js";
import { GLTFLoader }    from "https://unpkg.com/three@0.118.3/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from 'https://unpkg.com/three@0.118.3/examples/jsm/controls/OrbitControls.js';
import {GUI} from 'https://threejsfundamentals.org/threejs/../3rdparty/dat.gui.module.js';

import * as UTILS from "./Utils.js";

"use strict"

/*var scene1 = new THREE.Scene();

var models = [];

// PER SAMUELE: ORA QUESTA FUNZIONE E' INUTILE, GUARDA DOPO COME E' STATA SOSTITUITA
function loadGLTF(url, px, py, pz, dx, dy, dz, rx, ry, rz, num)
{
    var loader = new GLTFLoader();
        loader.load(url, function ( gltf )
        {
            models[num] = gltf.scene;
            const mesh = gltf.scene;
            mesh.castShadow = true;
            mesh.position.set(px,py,pz);
            mesh.scale.set(dx,dy,dz)
            mesh.rotation.set(rx, ry, rz);
            scene1.add(mesh);
            console.log(dumpObject(mesh).join('\n'));


        },
        // called while loading is progressing
        function ( xhr )
        {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error )
        {
            console.log(error);
            console.log( 'An error happened' );

        }
    );

}*/


/*
var cubes = [
    makeInstance(geometryCube, 0x0000FF,  2, 1, 0)
];
*/

window.onload = function main() {
    const canvas = document.getElementById('canvas');

    const renderer = new THREE.WebGLRenderer({canvas});
    renderer.setClearColor(0xBEF4FF);
    renderer.shadowMap.enabled = true;

    // Init scene and camera
    const scene = new THREE.Scene();
    const fov = 75;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 10, 8);
    camera.lookAt(0,4,8);

    // Controls for zooming and moving around the scene
    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 5, 0);
    controls.update();

    // Create an AudioListener and add it to the camera
    const listener = new THREE.AudioListener();
    camera.add(listener);

    // Create the PositionalAudio object (passing in the listener)
    const sound = new THREE.PositionalAudio(listener);

    // GUI controls
    const gui = new GUI();
    const options = {
      Volume: 10,
      Mute: false,
      Settings: function () {
        // TODO
      }
    };

    const audioGUI = gui.addFolder('Audio');
    audioGUI.add(options, 'Volume', 0, 30).onChange(updateVolume);
    audioGUI.add(options, 'Mute', true, false).onChange(updateMute);
    const settingsGUI = gui.addFolder('Settings');
    settingsGUI.add(options, 'Settings');

    function updateVolume(value) {
      sound.setVolume(value);
    }

    function updateMute(value) {
      value ? sound.pause() : sound.play();
    }

    // Create loading manager for models
    const manager = new THREE.LoadingManager();
    manager.onLoad = init;

    const progressBar = document.getElementById('progressbar');
    manager.onProgress = (url, itemsLoaded, itemsTotal) => {
      progressBar.style.width = `${itemsLoaded / itemsTotal * 100 | 0}%`;
    };

    const models = {
      road:               { url: 'src/environment/road/scene.gltf',
                            position: [0, 0, 0],
                            scale:    [0.2, 0.2, 0.2],
                            rotation: [0, 0, 0],
                          },
      building:           { url: 'src/environment/building/scene.gltf',
                            position: [-8, 0, 0],
                            scale:    [2, 2, 2],
                            rotation: [0, 0, 0],
                          },

      //policeCar:          { url: 'src/vehicles/cars/police_car/scene.gltf' },
      /*bmwCar:             { url: 'src/vehicles/cars/bmw_i8/scene.gltf',
                            position: [5, 0, 0],
                            scale:    [1, 1, 1],
                            rotation: [0, 0, 0],
                          },*/
      //lamborghiniCar:     { url: 'src/vehicles/cars/lamborghini_aventador_j/scene.gltf' },
      //teslaCar:           { url: 'src/vehicles/cars/tesla_model_s/scene.gltf' }

      bike:               { url: 'src/vehicles/bikes/bike/scene.gltf',
                            position: [0, 0, 0],
                            scale:    [1, 1, 1],
                            rotation: [0, -Math.PI/2, 0],
                          },
    };

    // Load the models
    const gltfLoader = new GLTFLoader(manager);
    for (const model of Object.values(models)) {
      gltfLoader.load(model.url, function (gltf) {
        model.gltf = gltf;
      }, undefined, function ( error ) {
        console.error( error );
        alert("Error during the loading, try to refresh the page");
      });
    }

    function init() {
      // Hide the loading bar
      const loading = document.getElementById('loading');
      loading.style.display = 'none';

      // Show Play button
      const play = document.getElementById('playBtn');
      play.style.display = 'inherit';

      play.onclick = function() {
        // Create audio context after a user gesture
        const audioCtx = new AudioContext();
        audioCtx.resume();

        // Hide Play button and start the game
        play.style.display = "none";
        start();
      }
    }

    let car, frontLeftWheel, frontRightWheel, backLeftWheel, backRightWheel, door;
    let policeCar, policeFrontLeftWheel, policeFrontRightWheel, policeBackLeftWheel, policeBackRightWheel;

    let bike;

    function start() {
      for (const model of Object.values(models)) {
        const modelScene = model.gltf.scene;
        scene.add(modelScene);
        console.log(UTILS.dumpObject(modelScene).join('\n'));

        switch (model) {
          // Environment
          case models.road:
            loadStaticModel(modelScene, models.road);
            break;
          case models.building:
            loadStaticModel(modelScene, models.building);
            break;

          // Cars
          case models.policeCar:
            loadPoliceCar(modelScene);
            break;
          case models.bmwCar:
            loadBmwCar(modelScene);
            break;
          case models.lamborghiniCar:
            loadLamborghiniCar(modelScene);
            break;
          case models.teslaCar:
            loadTeslaCar(modelScene);
            break;

          // Bikes
          case models.bike:
            loadStaticModel(modelScene, models.bike);
            bike = models.bike.gltf.scene;  // temp
            break;
          default:
            console.log("Error loading a model");
        }
      }
    }


    { // Sunlight
      const color = 0xFFFFFF;
      const intensity = 2;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(0, 3, 0.3);
      scene.add(light);
      light.castShadow = true;
    }

    // Pointlights for police car
    /*let color = 0xFF0000;
    let intensity = 1;
    const roofLightRed = new THREE.PointLight(color, intensity);
    roofLightRed.position.set(-0.1, 2.1, -0.34);
    scene.add(roofLightRed);
    //light.castShadow = true;

    color = 0x0000FF;
    intensity = 1;
    const roofLightBlue = new THREE.PointLight(color, intensity);
    roofLightBlue.position.set(-0.8, 2.1, -0.34);
    scene.add(roofLightBlue);
    //light.castShadow = true;

    let addIntensity = true;
    let deltaIntensity = 0;
    let augment = 0.05;
    let roofLightsThreshold = 2;*/

    /*const helper = new THREE.PointLightHelper(roofLightRed);
    scene.add(helper);

    function updateLight() {
      helper.update();
    }

    const gui = new GUI();
    gui.add(roofLightRed, 'intensity', 0, 2, 0.01);
    gui.add(roofLightRed, 'distance', 0, 40).onChange(updateLight);

    UTILS.makeXYZGUI(gui, roofLightRed.position, 'position');//*/

    /*{ // Fog
      const near = 1;
      const far = 3.5;
      const color = '0x808080';
      scene.fog = new THREE.Fog(color, near, far);
      scene.background = new THREE.Color(color);
    }*/


    // PER SAMUELE: FUNZIONE DI PRIMA INUTILE, ORA HAI VISTO COME E' STATA SOSTITUITA
    //update final numer for models[num]
    /*loadGLTF('src/vehicles/bikes/bike/scene.gltf', 0, 0, 0, 1, 1, 1, 0, -Math.PI/2, 0, 0);
    loadGLTF('src/environment/road/scene.gltf', 0, 0, 0, 0.2, 0.2, 0.2, 0, 0, 0, 1);
    loadGLTF('src/environment/building/scene.gltf', -8, 0, 0, 2, 2, 2, 0, 0, 0, 2);*/


    //Infinite terrain with a texture
    const tex = new THREE.TextureLoader().load("../src/textures/road_texture.jpg")
    tex.anisotropy = 2;
    tex.repeat.set(300, 300)
    tex.wrapT = THREE.RepeatWrapping
    tex.wrapS = THREE.RepeatWrapping
    const geo = new THREE.PlaneBufferGeometry(10000, 10000)
    const mat = new THREE.MeshLambertMaterial({
      map: tex
    })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.set(0, 0, 0)
    mesh.rotation.set(Math.PI / -2, 0, Math.PI/2)
    scene.add(mesh)




    // movement - please calibrate these values
    const xSpeed = 4;
    const ySpeed = 4;

    document.addEventListener("keydown", onDocumentKeyDown, false);
    function onDocumentKeyDown(event) {
        const keyCode = event.which;
        if (keyCode == 87) {
            if(bike)
            bike.position.z -= ySpeed;
        } else if (keyCode == 83) {
            if(bike)
            bike.position.z += ySpeed;
        } else if (keyCode == 65) {
            if(bike)
            bike.position.x -= xSpeed;
        } else if (keyCode == 68) {
            if(bike)
            bike.position.x += xSpeed;
        }
    };



    var cubeWidth  = 1;
    var cubeHeight = 1;
    var cubeDepth  = 1;

    var geometryCube = new THREE.BoxGeometry(cubeWidth, cubeHeight, cubeDepth);

    function makeInstance(geometry, color, x, y, z)
    {
        var material = new THREE.MeshPhongMaterial({ color });

        material.shininess = 100;

        var cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        cube.position.x = x;
        cube.position.y = y;
        cube.position.z = z;

        return cube;
    }


    for (var j = 0; j<10; j++)
    {
        var myNum = Math.random();
        if(myNum < 0.5)
        makeInstance(geometryCube, 0x0000FF,  -2, 1, -(j*20));
        else
        makeInstance(geometryCube, 0x0000FF,  2, 1, -(j*20));

    }







    render();

    function render(time) {
      if (UTILS.resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      time *= 0.001;  // convert to seconds

      if (car) {
        //car.position.y -= 0.01;
        frontLeftWheel.rotation.x  = time;
        frontRightWheel.rotation.x = time;

        backLeftWheel.rotation.x  = time;
        backRightWheel.rotation.x = time;

        //door.rotation.x = time;
      }

      if (policeCar) {
        //policeCar.position.y -= 0.01;
        policeFrontLeftWheel.rotation.x  = time;
        policeFrontRightWheel.rotation.x = time;

        policeBackLeftWheel.rotation.x  = time;
        policeBackRightWheel.rotation.x = time;

        if(deltaIntensity >= roofLightsThreshold) {
          deltaIntensity = 0;
          roofLightsThreshold = 2.5;
          addIntensity = !addIntensity;
        }

        deltaIntensity += augment;
        blink();
      }

      if (bike) {
          var myPos = bike.position;
          var relativeCameraOffset = new THREE.Vector3(0,10,10);
          camera.position.lerp(relativeCameraOffset, 0.1);
          camera.lookAt(myPos);
          camera.position.set(myPos.x, myPos.y + 10, myPos.z + 12);
          bike.position.z -= 1;
      }

      renderer.render( scene, camera );
      requestAnimationFrame( render );
    }


    // Blinks police roof lights
    function blink() {
      if(addIntensity) {
        roofLightRed.intensity  += augment;
        roofLightBlue.intensity += augment;
      }
      else {
        roofLightRed.intensity  -= augment;
        roofLightBlue.intensity -= augment;
      }
    }

    // Apply a sound to a mesh
    function applySound(mesh, filename) {
      // load a sound and set it as the PositionalAudio object's buffer
      const audioLoader = new THREE.AudioLoader();
      audioLoader.load(filename, function( buffer ) {
      	sound.setBuffer( buffer );
        sound.setLoop( true );
      	sound.setRefDistance( 20 );
      	sound.play();
      });

      // finally add the sound to the mesh
      mesh.add( sound );
    }

    function loadStaticModel(modelScene, model) {
      modelScene.position.set(...model.position);
      modelScene.scale.set(...model.scale)
      modelScene.rotation.set(...model.rotation);

      modelScene.traverse(o => {
        if (o.isMesh) {
          o.castShadow = true;
          o.receiveShadow = true;
        }
      });
    }

    function loadPoliceCar(modelScene) {
      policeCar = modelScene.getObjectByName('Car_Rig');

      modelScene.traverse(o => {
        if (o.isMesh) {
          o.castShadow = true;
          o.receiveShadow = true;

          if (o.name === "Roof_light_bar_0")
            applySound(o, 'src/sounds/Police siren.mka');
        }

        // Reference the four wheels
        if (o.isBone && o.name === 'DEF-WheelFtL_Car_Rig')        policeFrontLeftWheel  = o;
        else if (o.isBone && o.name === 'DEF-WheelFtR_Car_Rig')   policeFrontRightWheel = o;
        else if (o.isBone && o.name === 'DEF-WheelBkL_Car_Rig')   policeBackLeftWheel  = o;
        else if (o.isBone && o.name === 'DEF-WheelBkR_Car_Rig')   policeBackRightWheel = o;
      });
    }

    function loadBmwCar(modelScene) {
      car = modelScene.getObjectByName('BMW_i8fbx');

      modelScene.position.set(...models.bmwCar.position);
      modelScene.scale.set(...models.bmwCar.scale)
      modelScene.rotation.set(...models.bmwCar.rotation);

      applySound(car, 'src/sounds/Car acceleration.mka');

      modelScene.traverse(o => {
        if (o.isMesh) {
          o.castShadow = true;
          o.receiveShadow = true;
        }

        // Reference the four wheels
        if (o.name === 'wheel028')        frontLeftWheel  = o;
        else if (o.name === 'wheel020')   frontRightWheel = o;
        else if (o.name === 'wheel012')   backLeftWheel  = o;
        else if (o.name === 'wheel004')   backRightWheel = o;

        // z axis for front wheels when the car goes left and right
        // x axis for forward movement
      });

      // Adjust front wheels orientation before to animate them
      frontLeftWheel.rotation.z  = 0;
      frontRightWheel.rotation.z = 0;

      // compute the box that contains all the stuff from model and below
      const box = new THREE.Box3().setFromObject(scene);

      const boxSize   = box.getSize(new THREE.Vector3()).length();
      const boxCenter = box.getCenter(new THREE.Vector3());

      // set the camera to frame the box
      UTILS.frameArea(boxSize, boxSize, boxCenter, camera);

      // update the Trackball controls to handle the new size
      controls.maxDistance = boxSize * 10;
      controls.target.copy(boxCenter);
      controls.update();
    }

    function loadTeslaCar(modelScene) {
      car = modelScene.getObjectByName('Tesla_Model_Sfbx');

      modelScene.traverse(o => {
        if (o.isMesh) {
          o.castShadow = true;
          o.receiveShadow = true;
        }

        // Reference the four wheels
        if (o.name === 'wheel')           frontLeftWheel  = o;
        else if (o.name === 'wheel001')   frontRightWheel = o;
        else if (o.name === 'wheel003')   backLeftWheel  = o;
        else if (o.name === 'wheel002')   backRightWheel = o;
      });

      // Adjust front wheels orientation before to animate them
      frontLeftWheel.rotation.z  = 0;
      frontRightWheel.rotation.z = 0;

      // compute the box that contains all the stuff from model and below
      const box = new THREE.Box3().setFromObject(scene);

      const boxSize   = box.getSize(new THREE.Vector3()).length();
      const boxCenter = box.getCenter(new THREE.Vector3());

      // set the camera to frame the box
      UTILS.frameArea(boxSize, boxSize, boxCenter, camera);

      // update the Trackball controls to handle the new size
      controls.maxDistance = boxSize * 10;
      controls.target.copy(boxCenter);
      controls.update();
    }

    function loadLamborghiniCar(modelScene) {
      car = modelScene.getObjectByName('Lamborghini_Aventador_Jfbx');

      modelScene.traverse(o => {
        if (o.isMesh) {
          o.castShadow = true;
          o.receiveShadow = true;
        }

        // Reference the four wheels
        if (o.name === 'wheel001')        frontLeftWheel  = o;
        else if (o.name === 'wheel002')   frontRightWheel = o;
        else if (o.name === 'wheel003')   backLeftWheel  = o;
        else if (o.name === 'wheel005')   backRightWheel = o;
      });

      // compute the box that contains all the stuff from model and below
      const box = new THREE.Box3().setFromObject(scene);

      const boxSize   = box.getSize(new THREE.Vector3()).length();
      const boxCenter = box.getCenter(new THREE.Vector3());

      // set the camera to frame the box
      UTILS.frameArea(boxSize, boxSize, boxCenter, camera);

      // update the Trackball controls to handle the new size
      controls.maxDistance = boxSize * 10;
      controls.target.copy(boxCenter);
      controls.update();
    }

}
