import * as THREE        from "https://unpkg.com/three@0.118.3/build/three.module.js";
import { GLTFLoader }    from "https://unpkg.com/three@0.118.3/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from 'https://unpkg.com/three@0.118.3/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'https://threejsfundamentals.org/threejs/../3rdparty/dat.gui.module.js';
import Stats from 'https://unpkg.com/three@0.118.3/examples/jsm/libs/stats.module.js';

import * as UTILS from "./Utils.js";
import { InputManager } from "./InputManager.js";
import { Game } from "./Game.js";
import { Player } from "./Player.js";
import { Car } from "./Car.js";
import { PoliceCar } from "./PoliceCar.js";

"use strict"

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

    // Create an AudioLoader
    const audioLoader = new THREE.AudioLoader();

    // Create a set of audio objects to handle multiple audio
    const audioObjects = {};

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
      for (audio of audioObjects)
        audio.setVolume(value);
    }

    function updateMute(value) {
      for (audio of audioObjects)
        value ? audio.pause() : audio.play();
    }

    // Create loading manager for models
    const manager = new THREE.LoadingManager();
    manager.onLoad = init;

    const progressBar = document.getElementById('progressbar');
    manager.onProgress = (url, itemsLoaded, itemsTotal) => {
      progressBar.style.width = `${itemsLoaded / itemsTotal * 100 | 0}%`;
    };

    const models = {
      /*road:               { url: 'src/environment/road/scene.gltf',
                            position: [0, 0, 0],
                            scale:    [0.2, 0.2, 0.2],
                            rotation: [0, 0, 0],
                          },*/
      /*building:           { url: 'src/environment/building/scene.gltf',
                            position: [-8, 0, 0],
                            scale:    [2, 2, 2],
                            rotation: [0, 0, 0],
                          },*/

      policeCar:          { url: 'src/vehicles/cars/police_car/scene.gltf',
                            position: [-1.5, 0, 25],
                            scale:    [2.2, 2.2, 2.2],
                            rotation: [0, Math.PI, 0],
                          },
      bmwCar:             { url: 'src/vehicles/cars/bmw_i8/scene.gltf',
                            position: [0, 2.1, 0],
                            scale:    [0.03, 0.03, 0.03],
                            rotation: [0, Math.PI, 0],
                          },
      //lamborghiniCar:     { url: 'src/vehicles/cars/lamborghini_aventador_j/scene.gltf' },
      //teslaCar:           { url: 'src/vehicles/cars/tesla_model_s/scene.gltf' }

      /*bike:               { url: 'src/vehicles/bikes/bike/scene.gltf',
                            position: [0, 0, 0],
                            scale:    [1, 1, 1],
                            rotation: [0, -Math.PI/2, 0],
                          },*/
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

    // Called when all models are loaded
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

    const inputManager = new InputManager();
    const game         = new Game(inputManager, "easy");
    const player       = new Player(game);
    
    
    //Skybox

    var myGeometry = new THREE.CubeGeometry(1000, 1000, 1000);
    var cubeMaterials = 
    [
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("../src/skybox/arid2_ft.jpg"), side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("../src/skybox/arid2_bk.jpg"), side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("../src/skybox/arid2_up.jpg"), side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("../src/skybox/arid2_dn.jpg"), side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("../src/skybox/arid2_rt.jpg"), side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("../src/skybox/arid2_lf.jpg"), side: THREE.DoubleSide}),
    ];

    var myCube = new THREE.Mesh(myGeometry, cubeMaterials);
    
    //change this to see "more" background
    myCube.position.set(0,0,0);
    myCube.rotation.set(0, Math.PI, 0);

    scene.add(myCube); 

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

    { // Ambient light (enable only if nightlight)
      const light = new THREE.AmbientLight( 0x404040, 0.3 ); // color, intensity
      scene.add( light );
    }

    { // Sunlight
      const light = new THREE.DirectionalLight(0xFFFFFF, 0.8);
      light.position.set(0, 3, 0.3);
      scene.add(light);
      light.castShadow = true;
    }

    /*{ // Fog
      const near = 1;
      const far = 3.5;
      const color = '0x808080';
      scene.fog = new THREE.Fog(color, near, far);
      scene.background = new THREE.Color(color);
    }*/



    // Infinite terrain with a texture
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





    /*var cubeWidth  = 1;
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

    }*/


    // Show app stats
    var stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.dom );

    let before = 0, deltaTime = 0;
    animate();

    function animate(time) {
      stats.begin();

      if (UTILS.resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      // Convert current time to seconds
      time *= 0.001;

      // Make sure delta time isn't too big.
      deltaTime = Math.min(time - before, 1/20);
      before = time;

      //console.log("time: " + time + "\n");
      //console.log("before: " + before + "\n");
      //console.log("deltaTime: " + deltaTime + "\n");


      if (car) {
        // TEMP, MUST BE SET WHEN car CHANGES
        if (!player.getModel())
          player.setModel(new Car(car, "bmw", [frontLeftWheel, frontRightWheel, backLeftWheel, backRightWheel]));

        player.update(deltaTime);

        //console.log("car.position.z: " + car.position.z);
        camera.position.z -= player.getModel().getMoveSpeed() * deltaTime * 0.029;


        // compute the box that contains all the stuff from model and below
        /*const box = new THREE.Box3().setFromObject(player.getModel().getModel());

        const boxSize   = box.getSize(new THREE.Vector3()).length();
        const boxCenter = box.getCenter(new THREE.Vector3());

        // set the camera to frame the box
        UTILS.frameArea(boxSize, boxSize, boxCenter, camera);

        // update the Trackball controls to handle the new size
        controls.maxDistance = boxSize * 10;
        controls.target.copy(boxCenter);
        controls.update();*/

        //console.log("camera.position.z: " + camera.position.z);
      }

      if (policeCar) {
        policeCar.update(deltaTime);
        //console.log("policeCar.get3DModel().position.z: " + policeCar.get3DModel().position.z);
      }

      /*if (bike) {
          var myPos = bike.position;
          var relativeCameraOffset = new THREE.Vector3(0,10,10);
          camera.position.lerp(relativeCameraOffset, 0.1);
          camera.lookAt(myPos);
          camera.position.set(myPos.x, myPos.y + 10, myPos.z + 12);
          bike.position.z -= 1;
      }*/

      inputManager.update();

      stats.end();
      requestAnimationFrame( animate );
      renderer.render( scene, camera );
    }

    // Apply a sound to a mesh
    function applySound(mesh, filename, sound) {
      if(!mesh || !filename || !sound)  return;

      // Load a sound and set it as the PositionalAudio object's buffer
      audioLoader.load(filename, function( buffer ) {
      	sound.setBuffer( buffer );
        sound.setLoop( true );
      	sound.setRefDistance( 20 );
      	sound.play();
      });

      // Finally add the sound to the mesh
      mesh.add( sound );
    }




    function updateCameraPosition() {
      const myPos = player.getPosition();
      const relativeCameraOffset = new THREE.Vector3(0, 10, 10);

      camera.position.lerp(relativeCameraOffset, 0.1);
      camera.lookAt(myPos);
      camera.position.set(myPos.x, myPos.y + 10, myPos.z + 12);
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
      //policeCar = modelScene.getObjectByName('Car_Rig');

      modelScene.position.set(...models.policeCar.position);
      modelScene.scale.set(...models.policeCar.scale)
      modelScene.rotation.set(...models.policeCar.rotation);

      /*console.log("policeCar.position.x: " + policeCar.position.x);
      console.log("policeCar.position.y: " + policeCar.position.y);
      console.log("policeCar.position.z: " + policeCar.position.z);*/

      /*console.log("modelScene.position.x: " + modelScene.position.x);
      console.log("modelScene.position.y: " + modelScene.position.y);
      console.log("modelScene.position.z: " + modelScene.position.z);*/

      modelScene.traverse(o => {
        if (o.isMesh) {
          o.castShadow = true;
          o.receiveShadow = true;

          if (o.name === "Roof_light_bar_0") {
            // Create the PositionalAudio object (passing in the listener)
            audioObjects.policeCar = new THREE.PositionalAudio(listener);
            applySound(o, 'src/sounds/Police siren.mka', audioObjects.policeCar);
          }
        }

        // Reference the four wheels
        if (o.isBone && o.name === 'DEF-WheelFtL_Car_Rig')        policeFrontLeftWheel  = o;
        else if (o.isBone && o.name === 'DEF-WheelFtR_Car_Rig')   policeFrontRightWheel = o;
        else if (o.isBone && o.name === 'DEF-WheelBkL_Car_Rig')   policeBackLeftWheel  = o;
        else if (o.isBone && o.name === 'DEF-WheelBkR_Car_Rig')   policeBackRightWheel = o;
      });

      //policeCar = new PoliceCar(policeCar, "policeCar1", [policeFrontLeftWheel, policeFrontRightWheel, policeBackLeftWheel, policeBackRightWheel], scene, gui);
      policeCar = new PoliceCar(modelScene, "policeCar1", [policeFrontLeftWheel, policeFrontRightWheel, policeBackLeftWheel, policeBackRightWheel], scene, gui);
    }

    function loadBmwCar(modelScene) {
      car = modelScene.getObjectByName('BMW_i8fbx');

      modelScene.position.set(...models.bmwCar.position);
      modelScene.scale.set(...models.bmwCar.scale)
      modelScene.rotation.set(...models.bmwCar.rotation);

      // Create the PositionalAudio object (passing in the listener)
      audioObjects.car = new THREE.PositionalAudio(listener);
      applySound(car, 'src/sounds/Car acceleration.mka', audioObjects.car);

      modelScene.traverse(o => {
        if (o.isMesh) {
          o.castShadow = true;
          o.receiveShadow = true;
        }

        // Reference the four wheels
        if (o.name === 'wheel020')        frontLeftWheel  = o;
        else if (o.name === 'wheel028')   frontRightWheel = o;
        else if (o.name === 'wheel012')   backLeftWheel  = o;
        else if (o.name === 'wheel004')   backRightWheel = o;

        // z axis for front wheels when the car goes left and right
        // x axis for forward movement
      });

      // Adjust front wheels orientation before to animate them
      frontLeftWheel.rotation.z  = 0;
      frontRightWheel.rotation.z = 0;

      // compute the box that contains all the stuff from model and below
      const box = new THREE.Box3().setFromObject(modelScene);

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
