import * as THREE        from "https://unpkg.com/three@0.118.3/build/three.module.js";
import { GLTFLoader }    from "https://unpkg.com/three@0.118.3/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://unpkg.com/three@0.118.3/examples/jsm/controls/OrbitControls.js";
import { GUI } from "https://unpkg.com/three@0.118.3/examples/jsm/libs/dat.gui.module.js";
import Stats   from "https://unpkg.com/three@0.118.3/examples/jsm/libs/stats.module.js";

import { Utils }        from "./Utils.js";
import { InputManager } from "./InputManager.js";
import { Game }         from "./Game.js";
import { Player }       from "./Player.js";
import { Car }          from "./Car.js";
import { PoliceCar }    from "./PoliceCar.js";
import { Character }    from "./Character.js";

"use strict"

window.onload = function main() {
  let physicsWorld;
  let TRANSFORM_AUX;

  // Ammojs Initialization
  Ammo().then( function() {
    setupPhysicsWorld();
    setupGraphics();
  } );

  function setupPhysicsWorld(){
    let collisionConfiguration  = new Ammo.btDefaultCollisionConfiguration(),
        dispatcher              = new Ammo.btCollisionDispatcher(collisionConfiguration),
        overlappingPairCache    = new Ammo.btDbvtBroadphase(),
        solver                  = new Ammo.btSequentialImpulseConstraintSolver();

    physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
    physicsWorld.setGravity( new Ammo.btVector3(0, -9.82, 0) );

    TRANSFORM_AUX = new Ammo.btTransform();
  }

  function setupGraphics() {
    const canvas = document.getElementById('canvas');
    const gl = canvas.getContext("webgl2");
    if (!gl)  alert("WebGL 2.0 isn't available");

    const renderer = new THREE.WebGLRenderer({canvas});
    renderer.setClearColor(0xBEF4FF);
    renderer.shadowMap.enabled = true;

    // Init scene and camera
    const scene = new THREE.Scene(),
          fov    = 75,
          aspect = window.innerWidth / window.innerHeight, //2;  // the canvas default
          near   = 0.1,
          far    = 1000,
          camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 10, 8);
    camera.lookAt(0,4,8);

    // Controls for zooming and moving around the scene
    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 5, 0);
    controls.update();

    // Declare a global AudioListener
    let listener;

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

    // Create GUI for audio controls
    const audioGUI = gui.addFolder('Audio');
    audioGUI.add(options, 'Volume', 0, 30).onChange(updateVolume);
    audioGUI.add(options, 'Mute', true, false).onChange(updateMute);
    const settingsGUI = gui.addFolder('Settings');
    settingsGUI.add(options, 'Settings');

    function updateVolume(value) {
      for (const audio of Object.values(audioObjects))
        audio.setVolume(value);
    }

    function updateMute(value) {
      for (const audio of Object.values(audioObjects))
        value ? audio.pause() : audio.play();
    }

    // Static 3D models
    const staticModels = {
      // Environment
      // City
      /*abandonedBuilding:  { url: 'src/environment/city/buildings/abandoned_building/scene.gltf',
                            position: [80, 0, -45],
                            scale:    [15, 15, 15],
                            rotation: [0, 0, 0],
                          },
      apartment1:         { url: 'src/environment/city/buildings/apartment_1/scene.gltf',
                            position: [70, 15, -150],
                            scale:    [0.05, 0.05, 0.05],
                            rotation: [0, 0, 0],
                          },
      apartment2:         { url: 'src/environment/city/buildings/apartment_2/scene.gltf',
                            position: [-50, 0, -60],
                            scale:    [0.05, 0.05, 0.05],
                            rotation: [0, Math.PI/2, 0],
                          },
      apartment3:         { url: 'src/environment/city/buildings/apartment_3/scene.gltf',
                            position: [-70, 1, -140],
                            scale:    [0.025, 0.025, 0.025],
                            rotation: [0, Math.PI/2, 0],
                          },
      apartment4:         { url: 'src/environment/city/buildings/apartment_4/scene.gltf',
                            position: [-170, 0.5, -200],
                            scale:    [0.02, 0.02, 0.02],
                            rotation: [0, 0, 0],
                          },
      apartment5:         { url: 'src/environment/city/buildings/apartment_5/scene.gltf',
                            position: [-250, 1, -40],
                            scale:    [0.025, 0.025, 0.025],
                            rotation: [0, Math.PI/2, 0],
                          },
      apartment6:         { url: 'src/environment/city/buildings/apartment_6/scene.gltf',
                            position: [-200, 1, 150],
                            scale:    [0.025, 0.025, 0.025],
                            rotation: [0, Math.PI/2, 0],
                          },

      bordeauxBuilding:   { url: 'src/environment/city/buildings/bordeaux_building/scene.gltf',
                            position: [-50, 0, -190],
                            scale:    [13, 13, 13],
                            rotation: [0, 0, 0],
                          },
      building1:          { url: 'src/environment/city/buildings/building_1/scene.gltf',
                            position: [-45, 11, -10],
                            scale:    [0.05, 0.05, 0.05],
                            rotation: [0, 0, 0],
                          },
      building2:          { url: 'src/environment/city/buildings/building_2/scene.gltf',
                            position: [0, 0, 110],
                            scale:    [0.3, 0.3, 0.3],
                            rotation: [0, Math.PI/2, 0],
                          },
      building3:          { url: 'src/environment/city/buildings/building_3/scene.gltf',
                            position: [50, 0, 30],
                            scale:    [0.03, 0.03, 0.03],
                            rotation: [0, -Math.PI/2, 0],
                          },
      building4:          { url: 'src/environment/city/buildings/building_4/scene.gltf',
                            position: [50, 10, 250],
                            scale:    [12, 12, 12],
                            rotation: [0, Math.PI/2, 0],
                          },
      building5:          { url: 'src/environment/city/buildings/building_5/scene.gltf',
                            position: [150, 0, -60],
                            scale:    [0.03, 0.03, 0.03],
                            rotation: [0, -Math.PI/2, 0],
                          },
      building6:          { url: 'src/environment/city/buildings/building_6/scene.gltf',
                            position: [150, 0, 100],
                            scale:    [0.03, 0.03, 0.03],
                            rotation: [0, -Math.PI/2, 0],
                          },
      building7:          { url: 'src/environment/city/buildings/building_kontra/scene.gltf',
                            position: [-40, 0.5, -260],
                            scale:    [5, 5, 5],
                            rotation: [0, Math.PI/2, 0],
                          },

      easternEuHouse:     { url: 'src/environment/city/buildings/eastern_european_panel_house/scene.gltf',
                            position: [40, 0, 90],
                            scale:    [0.1, 0.1, 0.1],
                            rotation: [0, -Math.PI/2, 0],
                          },
      house1:             { url: 'src/environment/city/buildings/house_1/scene.gltf',
                            position: [-60, -1, 160],
                            scale:    [0.01, 0.01, 0.01],
                            rotation: [0, 0, 0],
                          },
      house2:             { url: 'src/environment/city/buildings/house_2/scene.gltf',
                            position: [-30, -1, 145],
                            scale:    [0.03, 0.03, 0.03],
                            rotation: [0, 0, 0],
                          },
      house3:             { url: 'src/environment/city/buildings/house_3/scene.gltf',
                            position: [-60, -1, 210],
                            scale:    [0.035, 0.035, 0.035],
                            rotation: [0, 0, 0],
                          },

      boulangerie:        { url: 'src/environment/city/buildings/boulangerie_de_lopera/scene.gltf',
                            position: [35, -1, 150],
                            scale:    [0.03, 0.03, 0.03],
                            rotation: [0, -Math.PI/2, 0],
                          },
      laCantine:          { url: 'src/environment/city/buildings/la_cantine/scene.gltf',
                            position: [35, -1, 180],
                            scale:    [0.03, 0.03, 0.03],
                            rotation: [0, -Math.PI/2, 0],
                          },
      starbucks:          { url: 'src/environment/city/buildings/starbucks_coffee/scene.gltf',
                            position: [35, -1, 210],
                            scale:    [0.03, 0.03, 0.03],
                            rotation: [0, -Math.PI/2, 0],
                          },

      stadium1:           { url: 'src/environment/city/buildings/stadium1/scene.gltf',
                            position: [200, -4, -450],
                            scale:    [0.035, 0.035, 0.035],
                            rotation: [0, Math.PI/3, 0],
                          },
      stadium2:           { url: 'src/environment/city/buildings/stadium2/scene.gltf',
                            position: [90, 1, 450],
                            scale:    [0.7, 0.7, 0.7],
                            rotation: [0, -Math.PI/2, 0],
                          },

      tower:              { url: 'src/environment/city/buildings/park_tower_chicago/scene.gltf',
                            position: [-90, 1, 300],
                            scale:    [0.01, 0.01, 0.01],
                            rotation: [0, Math.PI/2, 0],
                          },

      // Street elements
      /*road:               { url: 'src/environment/street/road/scene.gltf',
                            position: [0, 0, 0],
                            scale:    [0.2, 0.2, 0.2],
                            rotation: [0, 0, 0],
                          },*/
      /*bench:              { url: 'src/environment/city/street/bench/scene.gltf',
                            position: [-29, 1, -7],
                            scale:    [2, 2, 2],
                            rotation: [0, Math.PI/2, 0],
                          },
      cityFence:          { url: 'src/environment/city/street/city_fence/scene.gltf',
                            position: [-27, 0, -7],
                            scale:    [11, 11, 11],
                            rotation: [0, Math.PI/2, 0],
                          },
      dumpster:           { url: 'src/environment/city/street/dumpster/scene.gltf',
                            position: [45, 1.8, 20],
                            scale:    [2.3, 2.3, 2.3],
                            rotation: [0, 0, 0],
                          },
      electricBox:        { url: 'src/environment/city/street/electric_box/scene.gltf',
                            position: [40, 1.5, 10],
                            scale:    [0.07, 0.07, 0.07],
                            rotation: [0, -Math.PI/2, 0],
                          },
      graffitiWall:       { url: 'src/environment/city/street/graffiti_wall/scene.gltf',
                            position: [48, 8, -30],
                            scale:    [2, 2, 2],
                            rotation: [0, Math.PI/2, 0],
                          },
      lamp:               { url: 'src/environment/city/street/lamp/scene.gltf',
                            position: [28, 0.5, -5],
                            scale:    [0.03, 0.03, 0.03],
                            rotation: [0, 0, 0],
                          },
      menuSign:           { url: 'src/environment/city/street/menu_sign/scene.gltf',
                            position: [31, 2, 5],
                            scale:    [0.01, 0.01, 0.01],
                            rotation: [0, Math.PI/2, 0],
                          },
      simpleMetalFence:   { url: 'src/environment/city/street/simple_metal_fence/scene.gltf',
                            position: [-25, 1.3, 5],
                            scale:    [0.25, 0.25, 0.25],
                            rotation: [0, 0, 0],
                          },
      metalFence:         { url: 'src/environment/city/street/metal_fence/scene.gltf',
                            position: [45, 1, 60],
                            scale:    [0.003, 0.003, 0.003],
                            rotation: [0, 0, 0],
                          },
      roadSign:           { url: 'src/environment/city/street/road_sign/scene.gltf',
                            position: [25, 0, 5],
                            scale:    [0.01, 0.01, 0.01],
                            rotation: [0, -Math.PI/2, 0],
                          },
      speedSign30:        { url: 'src/environment/city/street/speed_sign_30/scene.gltf',
                            position: [25, 0, -12],
                            scale:    [0.025, 0.025, 0.025],
                            rotation: [0, 0, 0],
                          },
      speedSign40:        { url: 'src/environment/city/street/speed_sign_40/scene.gltf',
                            position: [25, 3.3, -8],
                            scale:    [3.5, 3.5, 3.5],
                            rotation: [0, 0, 0],
                          },
      stopSign:           { url: 'src/environment/city/street/stop_sign/scene.gltf',
                            position: [25, 0, -20],
                            scale:    [3.3, 3.3, 3.3],
                            rotation: [0, Math.PI, 0],
                          },
      sidewalk:           { url: 'src/environment/city/street/sidewalk/scene.gltf',
                            position: [26.5, 0, 0],
                            scale:    [1, 1, 1],
                            rotation: [0, -Math.PI/2, 0],
                          },
      trafficCone:        { url: 'src/environment/city/street/traffic_cone/scene.gltf',
                            position: [25, 0, -3],
                            scale:    [0.03, 0.03, 0.03],
                            rotation: [0, 0, 0],
                          },
      trafficLight:       { url: 'src/environment/city/street/traffic_light/scene.gltf',
                            position: [25, 0, -25],
                            scale:    [0.1, 0.1, 0.1],
                            rotation: [0, 0, 0],
                          },
      trashCan1:          { url: 'src/environment/city/street/trash_can_1/scene.gltf',
                            position: [28, 0.5, 0],
                            scale:    [0.025, 0.025, 0.025],
                            rotation: [0, 0, 0],
                          },
      trashCan2:          { url: 'src/environment/city/street/trash_can_2/scene.gltf',
                            position: [-29, 0, -3],
                            scale:    [0.4, 0.4, 0.4],
                            rotation: [0, 0, 0],
                          },
      trashCan3:          { url: 'src/environment/city/street/trash_can_3/scene.gltf',
                            position: [-29, 1, -10],
                            scale:    [1, 1, 1],
                            rotation: [0, 0, 0],
                          },
      tree:               { url: 'src/environment/city/street/tree/scene.gltf',
                            position: [30, 0, -30],
                            scale:    [0.03, 0.03, 0.03],
                            rotation: [0, 0, 0],
                          },
      pineTree:           { url: 'src/environment/city/street/pine_tree/scene.gltf',
                            position: [30, 0, 40],
                            scale:    [0.03, 0.03, 0.03],
                            rotation: [0, 0, 0],
                          },
      hydrant:            { url: 'src/environment/city/street/yellow_rusted_hydrant/scene.gltf',
                            position: [-26, 1, 10],
                            scale:    [0.8, 0.8, 0.8],
                            rotation: [0, 0, 0],
                          },


      // Country - desert
      /*factory:            { url: 'src/environment/country - desert/buildings/factory/scene.gltf',
                            position: [-70, 0, -110],
                            scale:    [5, 5, 5],
                            rotation: [0, 0, 0],
                          },
      grainSilo:          { url: 'src/environment/country - desert/buildings/grain_silo/scene.gltf',
                            position: [0, 0, -30],
                            scale:    [3, 3, 3],
                            rotation: [0, 0, 0],
                          },
      stores:            { url: 'src/environment/country - desert/buildings/wasteland_stores/scene.gltf',
                            position: [-50, 0, -170],
                            scale:    [0.1, 0.1, 0.1],
                            rotation: [0, Math.PI/2, 0],
                          },
      westernHouse:       { url: 'src/environment/buildings/country - desert/western_house/scene.gltf',
                            position: [100, 0, -150],
                            scale:    [0.05, 0.05, 0.05],
                            rotation: [0, 0, 0],
                          },
      windTurbine:        { url: 'src/environment/country - desert/buildings/vintage_wind_turbine/scene.gltf',
                            position: [0, 0, -50],
                            scale:    [0.03, 0.03, 0.03],
                            rotation: [0, -Math.PI/2, 0],
                          },

      // Road elements
      bush:               { url: 'src/environment/country - desert/road/bush/scene.gltf',
                            position: [0, 0, -10],
                            scale:    [4, 4, 4],
                            rotation: [0, 0, 0],
                          },
      bushPlant:          { url: 'src/environment/country - desert/road/bush_plant/scene.gltf',
                            position: [0, 0, -30],
                            scale:    [0.006, 0.006, 0.006],
                            rotation: [0, 0, 0],
                          },
      bushGroup:          { url: 'src/environment/country - desert/road/bush_group/scene.gltf',
                            position: [0, 0, -40],
                            scale:    [0.035, 0.035, 0.035],
                            rotation: [0, 0, 0],
                          },
      desertPlant:          { url: 'src/environment/country - desert/road/desert_plant/scene.gltf',
                            position: [0, 0, -20],
                            scale:    [0.4, 0.4, 0.4],
                            rotation: [0, 0, 0],
                          },
      desertRock:         { url: 'src/environment/country - desert/road/desert_rock/scene.gltf',
                            position: [0, 1.8, -15],
                            scale:    [2.5, 2.5, 2.5],
                            rotation: [0, 0, 0],
                          },
      poleElectric:       { url: 'src/environment/country - desert/road/pole_electric/scene.gltf',
                            position: [0, 10, -25],
                            scale:    [10, 10, 10],
                            rotation: [0, 0, 0],
                          },
      rustyCar1:          { url: 'src/environment/country - desert/road/old_rusty_car/scene.gltf',
                            position: [20, 0.2, -45],
                            scale:    [0.017, 0.017, 0.017],
                            rotation: [0, 0, 0],
                          },
      rustyCar2:          { url: 'src/environment/country - desert/road/old_rusty_car_2/scene.gltf',
                            position: [10, 0, -45],
                            scale:    [0.046, 0.046, 0.046],
                            rotation: [0, 0, 0],
                          },*/
    };

    const dynamicModels = {
      // Cars
      policeCar:          { url: 'src/vehicles/cars/police_car/scene.gltf',
                            position: [-1.5, 0, 25],
                            scale:    [2.2, 2.2, 2.2],
                            rotation: [0, Math.PI, 0],
                          },

      /*bmwCar:             { url: 'src/vehicles/cars/bmw_i8/scene.gltf',
                            position: [0, 2.1, 0],
                            scale:    [0.03, 0.03, 0.03],
                            rotation: [0, Math.PI, 0],
                          },//*/
      lamborghiniCar:     { url: 'src/vehicles/cars/lamborghini_aventador_j/scene.gltf',
                            position: [0, 1.73, 0],
                            scale:    [0.013, 0.013, 0.013],
                            rotation: [0, Math.PI, 0],
                          },//*/
      /*teslaCar:           { url: 'src/vehicles/cars/tesla_model_s/scene.gltf',
                            position: [0, 0.35, 0],
                            scale:    [0.023, 0.023, 0.023],
                            rotation: [0, Math.PI, 0],
                          },*/

      camper:             { url: 'src/vehicles/cars/camper_hippie/scene.gltf',
                            position: [16, 0, 20],
                            scale:    [3.5, 3.5, 3.5],
                            rotation: [0, -Math.PI/2, 0],
                          },
      fiat500:            { url: 'src/vehicles/cars/fiat_500/scene.gltf',
                            position: [-18, 2.3, -40],
                            scale:    [5, 5, 5],
                            rotation: [0, 0, 0],
                          },
      rangeRover:         { url: 'src/vehicles/cars/range_rover_evoque/scene.gltf',
                            position: [-6, 1.9, -50],
                            scale:    [6, 6, 6],
                            rotation: [0, 0, 0],
                          },


      // Characters
      /*nathan:             { url: 'src/characters/nathan/scene.gltf',
                            position: [-4, 0, 0],
                            scale:    [0.025, 0.025, 0.025],
                            rotation: [0, Math.PI, 0],
                          },*/

      // Bikes
      /*bike:               { url: 'src/vehicles/bikes/bike/scene.gltf',
                            position: [0, 0, 0],
                            scale:    [1, 1, 1],
                            rotation: [0, -Math.PI/2, 0],
                          },*/
    };

    let car, policeCar, character, bike;

    // Create a loading manager for 3D models
    const manager = new THREE.LoadingManager();
    manager.onLoad = init;

    // Create a progress bar to show during loading
    const progressBar = document.getElementById('progressbar');
    manager.onProgress = (url, itemsLoaded, itemsTotal) => {
      progressBar.style.width = `${itemsLoaded / itemsTotal * 100 | 0}%`;
    };

    // Load the 3D models
    const gltfLoader = new GLTFLoader(manager);
    loadModels(staticModels);
    loadModels(dynamicModels);

    function loadModels(models) {
      for (const model of Object.values(models)) {
        gltfLoader.load(model.url, function (gltf) {
          model.gltf = gltf;
        },
        undefined,
        function (error) {
          console.error(error);
          alert("Error during the loading of the game!\nTry to refresh the page");
        });
      }
    }

    // Called when all models are loaded
    function init() {
      // Hide the loading bar
      const loading = document.getElementById('loading');
      loading.style.display = 'none';

      // Show canvas (initially hidden to show loading)
      canvas.style.display = 'inherit';

      // Add listener on window resize
      window.addEventListener('resize', resizeCanvas, false);
      // Adapt canvas size to current window
      resizeCanvas();

      // Add static models to the scene
      addStaticModels();

      // Show Play button
      const play = document.getElementById('playBtn');
      play.style.display = 'inherit';

      play.onclick = function() {
        // Create audio context after a user gesture
        const audioCtx = new AudioContext();

        // Create an AudioListener and add it to the camera
        listener = new THREE.AudioListener();
        camera.add(listener);

        // Hide Play button and start the game
        play.style.display = "none";
        start();
      }
    }

    // Add static models to the scene before starting the game
    function addStaticModels() {
      for (const model of Object.values(staticModels)) {
        const modelScene = model.gltf.scene;
        scene.add(modelScene);
        addStaticModel(model);
      }
    }

    const inputManager = new InputManager();
    const game         = new Game(inputManager, "easy", physicsWorld);
    const player       = new Player(game);

    // Start the game
    function start() {
      // Add dynamic models to the scene
      for (const model of Object.values(dynamicModels)) {
        const modelScene = model.gltf.scene;
        scene.add(modelScene);
        //console.log(Utils.dumpObject(modelScene).join('\n'));

        switch (model) {
          // Cars
          case dynamicModels.policeCar:
            addPoliceCar(modelScene);
            break;
          case dynamicModels.bmwCar:
            addBmwCar(modelScene);
            break;
          case dynamicModels.lamborghiniCar:
            addLamborghiniCar(modelScene);
            break;
          case dynamicModels.teslaCar:
            addTeslaCar(modelScene);
            break;

          // Characters
          case dynamicModels.nathan:
            addNathanCharacter(modelScene);
            break;

          // Bikes
          case dynamicModels.bike:
            addStaticModel(model);
            bike = modelScene;  // temp
            break;
          default:
            addStaticModel(model);
            //alert("Error during starting the game!\nTry to refresh the page");
        }
      }
    }

    { // Ambient light
      const light = new THREE.AmbientLight(0x404040, 0.3); // color, intensity
      scene.add(light);
    }

    // Sunlight
    const sunlight = new THREE.DirectionalLight(0xFFFFFF, 1); //0.3);
    //sunlight.position.set(100, 10, 0.3); // Sunrise
    sunlight.position.set(0, 30, 0.3); // TEMP
    scene.add(sunlight);
    sunlight.castShadow = true;

    const sunlightPositionIncrement = 0.15;

    const helper = new THREE.DirectionalLightHelper(sunlight);
    scene.add(helper);

    gui.add(sunlight, 'intensity', 0, 100, 0.01);

    Utils.makeXYZGUI(gui, sunlight.position, 'Sun position');//*/


    /*{ // Fog
      const near = 1;
      const far = 3.5;
      const color = '0x808080';
      scene.fog = new THREE.Fog(color, near, far);
      scene.background = new THREE.Color(color);
    }*/



    { // Infinite terrain with a texture
      const pos = { x: 0, y: 0, z: 0 };

      const tex = new THREE.TextureLoader().load("../src/textures/street_texture.jpg");
      // road_texture.jpg
      //tex.anisotropy = 2;
      //tex.repeat.set(300, 300);

      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      tex.repeat.set(400, 400);
      tex.wrapT = THREE.RepeatWrapping;
      tex.wrapS = THREE.RepeatWrapping;
      const geo = new THREE.PlaneBufferGeometry(10000, 10000);
      const mat = new THREE.MeshLambertMaterial({ map: tex });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(pos.x, pos.y, pos.z);
      mesh.rotation.set(Math.PI / -2, 0, 0);
      //mesh.rotation.set(Math.PI / -2, 0, Math.PI/2); // road_texture.jpg
      scene.add(mesh);

      // Ammojs Section
      const mass = 0;

      const transform = new Ammo.btTransform();
      transform.setIdentity();
      transform.setOrigin( new Ammo.btVector3(pos.x, pos.y, pos.z) );
      transform.setRotation( new Ammo.btQuaternion(0, 0, 0, 1) );

      const motionState = new Ammo.btDefaultMotionState(transform);

      const collisionShape = new Ammo.btBoxShape( new Ammo.btVector3(10000, 0.01, 10000) );

      const localInertia = new Ammo.btVector3(0, 0, 0);
      collisionShape.calculateLocalInertia(mass, localInertia);

      const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, collisionShape, localInertia);
      const body = new Ammo.btRigidBody(rbInfo);
      body.setFriction(2);

      // Add rigid body and set collision masks
      physicsWorld.addRigidBody(body, 1, 1);
    }


    // Skybox
    /*var myGeometry = new THREE.CubeGeometry(1000, 1000, 1000);
    var cubeMaterials = [
        new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("../src/skybox/arid2_ft.jpg"), side: THREE.DoubleSide }),
        new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("../src/skybox/arid2_bk.jpg"), side: THREE.DoubleSide }),
        new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("../src/skybox/arid2_up.jpg"), side: THREE.DoubleSide }),
        new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("../src/skybox/arid2_dn.jpg"), side: THREE.DoubleSide }),
        new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("../src/skybox/arid2_rt.jpg"), side: THREE.DoubleSide }),
        new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("../src/skybox/arid2_lf.jpg"), side: THREE.DoubleSide })
    ];

    var myCube = new THREE.Mesh(myGeometry, cubeMaterials);

    //change this to see "more" background
    myCube.position.set(0,0,0);
    myCube.rotation.set(0, Math.PI, 0);

    scene.add(myCube);*/




    // Create obstacles
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




    const syncList = [];
    const materialInteractive = new THREE.MeshPhongMaterial( { color:0x990000 } );

    //createVehicle(new THREE.Vector3(0, 10, -20), new THREE.Quaternion(0, 0, 0, 1));



    const score = document.getElementById("score");
    const speedometer = document.getElementById("speedometer");

    // Show app stats
    var stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.dom );

    let before = 0, deltaTime = 0;
    requestAnimationFrame(animate);

    function animate(time) {
      stats.begin();

      if (Utils.resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      // Convert current time to seconds
      time *= 0.001;

      // Make sure delta time isn't too big
      deltaTime = Math.min(time - before, 1/20);
      before = time;

      // Debug
      /*console.log("time: " + time + "\n");
      console.log("before: " + before + "\n");
      console.log("deltaTime: " + deltaTime + "\n");*/

      // Change sunlight position and intensity according to the elapsed time
      // (about 4 seconds of the game corresponds to 1 hour, 96/4 = 24)
      /*if (time % 96 < 20) {
        // Prepare sunrise (daytime is between midnight and 5 )
        sunlight.position.set(100, 10, 0.3);
        sunlight.intensity = Utils.clamp(sunlight.intensity - 0.007, 0, 1.7);
      }
      else if (time % 96 < 60) {
        // Growing phase (daytime is between 5 and 15 )
        sunlight.position.x -= sunlightPositionIncrement;
        sunlight.position.y += sunlightPositionIncrement;
        sunlight.intensity = Utils.clamp(sunlight.intensity + 0.007, 0, 1.7);
      }
      else {
        // Waning phase (daytime is between 15 and midnight )
        sunlight.position.x -= sunlightPositionIncrement;
        sunlight.position.y -= sunlightPositionIncrement;
        sunlight.intensity = Utils.clamp(sunlight.intensity - 0.005, 0, 1.7);
      }*/


      //console.log("time%96: " + time%96 + "\n");
      //console.log("(time%96)/4: " + (time%96)/4 + "\n");
      //console.log("sunlight.position.x: " + sunlight.position.x + "\n");
      //console.log("sunlight.position.y: " + sunlight.position.y + "\n");
      //console.log("sunlight.position.z: " + sunlight.position.z + "\n");
      //console.log("sunlight.intensity: " + sunlight.intensity + "\n");


      if (car) {
        player.update(deltaTime);

        const speed = player.getSpeed().toFixed(2);
        speedometer.innerHTML = (speed < 0 ? '(R) ' : '') + Math.abs(speed) + ' Km/h';

        score.innerHTML = "Score: " + game.getScore();

        //console.log("car.position.z: " + car.position.z);
        //camera.position.z -= player.getModel().getMoveSpeed() * deltaTime * 0.029;


        // compute the box that contains all the stuff from model and below
        //const box = new THREE.Box3().setFromObject(player.getModel().get3DModel());
        /*const box = new THREE.Box3().setFromObject(player.getModel().getFrontLeftWheel());

        const boxSize   = box.getSize(new THREE.Vector3()).length();
        const boxCenter = box.getCenter(new THREE.Vector3());

        // set the camera to frame the box
        Utils.frameArea(boxSize, boxSize, boxCenter, camera);

        // update the Trackball controls to handle the new size
        controls.maxDistance = boxSize * 10;
        controls.target.copy(boxCenter);
        controls.update();//*/

        //console.log("camera.position.z: " + camera.position.z);

        // Draw box containing the model
        //const boxHelper = new THREE.BoxHelper(player.getModel().get3DModel(), 0x00ff00);
        //scene.add(boxHelper);


        const dir = player.getDirection();

        // Normalize the direction vector (convert to vector of length 1)
        dir.normalize();

        const pos = player.getPosition();
        if (pos) {
          const origin = new THREE.Vector3( pos.x, pos.y, pos.z );
          const length = 1;
          const hex = 0xffff00;

          const arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
          scene.add( arrowHelper );
        }

        const orientation = player.getOrientation();

        // Normalize the direction vector (convert to vector of length 1)
        orientation.normalize();

        if (pos) {
          const origin = new THREE.Vector3( pos.x, pos.y + 3, pos.z );
          const length = 1;
          const hex = 0xff0000;

          const arrowHelper = new THREE.ArrowHelper( orientation, origin, length, hex );
          scene.add( arrowHelper );
        }

      }

      if (policeCar) {
        policeCar.update(deltaTime);
      }

      /*if (bike) {
          var myPos = bike.position;
          var relativeCameraOffset = new THREE.Vector3(0,10,10);
          camera.position.lerp(relativeCameraOffset, 0.1);
          camera.lookAt(myPos);
          camera.position.set(myPos.x, myPos.y + 10, myPos.z + 12);
          bike.position.z -= 1;
      }*/

      /*if (character) {
        player.update(deltaTime);
      }*/

      inputManager.update();
      updatePhysics(deltaTime);

      //console.log("renderer.info.render.calls: " + renderer.info.render.calls);

      stats.end();
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }


    // Update physics and sync graphics
    function updatePhysics(deltaTime) {




      for (var i = 0; i < syncList.length; i++)
					syncList[i](deltaTime);






      // Step world
      physicsWorld.stepSimulation(deltaTime, 10);
      const rigidBodies = game.getRigidBodies();

      // Update rigid bodies
      for (let i = 0; i < rigidBodies.length; i++) {
          let model = rigidBodies[i];
          let objAmmo = model.physicsBody;
          let ms = objAmmo.getMotionState();
          if (ms) {
              ms.getWorldTransform(TRANSFORM_AUX);
              let p = TRANSFORM_AUX.getOrigin();
              let q = TRANSFORM_AUX.getRotation();
              model.get3DModel().position.set( p.x(), p.y(), p.z() );
              model.get3DModel().quaternion.set( q.x(), q.y(), q.z(), q.w() );
          }
      }

    }








    // To be verified
    function updateCameraPosition() {
      const myPos = player.getPosition();
      const relativeCameraOffset = new THREE.Vector3(0, 10, 10);

      camera.position.lerp(relativeCameraOffset, 0.1);
      camera.lookAt(myPos);
      camera.position.set(myPos.x, myPos.y + 10, myPos.z + 12);
    }




    // Create a box that contains the model (player model) and update
    // the camera to frame it
    function updateCamera(modelScene) {
      // compute the box that contains all the stuff from model and below
      const box = new THREE.Box3().setFromObject(modelScene);

      const boxSize   = box.getSize(new THREE.Vector3()).length();
      const boxCenter = box.getCenter(new THREE.Vector3());

      // set the camera to frame the box
      Utils.frameArea(boxSize, boxSize, boxCenter, camera);

      // update the Trackball controls to handle the new size
      controls.maxDistance = boxSize * 10;
      controls.target.copy(boxCenter);
      controls.update();
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

    // Add a static model to the scene
    function addStaticModel(model) {
      if(!model)  return;

      const modelScene = model.gltf.scene;
      //console.log(Utils.dumpObject(modelScene).join('\n'));

      modelScene.position.set(...model.position);
      modelScene.scale.set(...model.scale)
      modelScene.rotation.set(...model.rotation);

      modelScene.traverse(o => {
        if (o.isMesh) {
          o.castShadow = true;
          o.receiveShadow = true;
        }
      });

      //scene.add(modelScene);
    }

    // Add a car model to the scene
    /*function AddCarModel(model, wheelsNames, isUserCar, carName, audioFile) {
      if(!model || !wheelsNames || !carName || !audioFile)  return;

      const modelScene = model.gltf.scene;
      //console.log(Utils.dumpObject(modelScene).join('\n'));

      modelScene.position.set(...model.position);
      modelScene.scale.set(...model.scale)
      modelScene.rotation.set(...model.rotation);

      let wheels = [];

      modelScene.traverse(o => {
        if (o.isMesh) {
          o.castShadow = true;
          o.receiveShadow = true;
        }

        // Reference the four wheels
        if (o.name === wheelsNames[0])        wheels[0] = o;
        else if (o.name === wheelsNames[1])   wheels[1] = o;
        else if (o.name === wheelsNames[2])   wheels[2] = o;
        else if (o.name === wheelsNames[3])   wheels[3] = o;
      });

      scene.add(modelScene);

      if(isUserCar) {
        // Create the Car object
        car = new Car(modelScene, 800, game, carName, wheels);

        // Create the PositionalAudio object (passing in the listener)
        audioObjects.car = new THREE.PositionalAudio(listener);
        applySound(o, audioFile, audioObjects.car);

      }
      else {
        // Create the PoliceCar object
        policeCar = new PoliceCar(modelScene, 800, game, carName, wheels, scene, gui);

        // Create the PositionalAudio object (passing in the listener)
        audioObjects.policeCar = new THREE.PositionalAudio(listener);
        applySound(o, audioFile, audioObjects.policeCar);
      }
    }*/

    function addPoliceCar(modelScene) {
      modelScene.position.set(...dynamicModels.policeCar.position);
      modelScene.scale.set(...dynamicModels.policeCar.scale)
      modelScene.rotation.set(...dynamicModels.policeCar.rotation);

      /*console.log("policeCar.position.x: " + policeCar.position.x);
      console.log("policeCar.position.y: " + policeCar.position.y);
      console.log("policeCar.position.z: " + policeCar.position.z);*/

      /*console.log("modelScene.position.x: " + modelScene.position.x);
      console.log("modelScene.position.y: " + modelScene.position.y);
      console.log("modelScene.position.z: " + modelScene.position.z);*/

      let wheels = [];

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
        if (o.isBone && o.name === 'DEF-WheelFtL_Car_Rig')        wheels[0] = o;
        else if (o.isBone && o.name === 'DEF-WheelFtR_Car_Rig')   wheels[1] = o;
        else if (o.isBone && o.name === 'DEF-WheelBkL_Car_Rig')   wheels[2] = o;
        else if (o.isBone && o.name === 'DEF-WheelBkR_Car_Rig')   wheels[3] = o;
      });

      const carInfo = {
        mass: 1840,    // Kg
        maxSpeed: 207, // Km/h
        boxSizeYFactor: 0.043
      };

      policeCar = new PoliceCar(modelScene, carInfo, game, "policeCar1", wheels, scene, gui);
    }

    function addBmwCar(modelScene) {
      modelScene.position.set(...dynamicModels.bmwCar.position);
      modelScene.scale.set(...dynamicModels.bmwCar.scale)
      modelScene.rotation.set(...dynamicModels.bmwCar.rotation);

      // Create the PositionalAudio object (passing in the listener)
      audioObjects.car = new THREE.PositionalAudio(listener);
      applySound(car, 'src/sounds/Car acceleration.mka', audioObjects.car);

      let wheels = [];

      modelScene.traverse(o => {
        if (o.isMesh) {
          o.castShadow = true;
          o.receiveShadow = true;
        }

        // Reference the four wheels
        if (o.name === 'wheel020')        wheels[0] = o;
        else if (o.name === 'wheel028')   wheels[1] = o;
        else if (o.name === 'wheel012')   wheels[2] = o;
        else if (o.name === 'wheel004')   wheels[3] = o;

        // z axis for front wheels when the car goes left and right
        // x axis for forward movement
      });

      // Adjust front wheels orientation before to animate them
      wheels[0].rotation.z = 0;
      wheels[1].rotation.z = 0;

      //updateCamera(modelScene);

      const carInfo = {
        mass: 1920,    // Kg
        maxSpeed: 250, // Km/h
        boxSizeYFactor: 0.52
      };

      car = new Car(modelScene, carInfo, game, "Bmw i8", wheels);
      player.setModel(car);
    }

    function addTeslaCar(modelScene) {
      modelScene.position.set(...dynamicModels.teslaCar.position);
      modelScene.scale.set(...dynamicModels.teslaCar.scale)
      modelScene.rotation.set(...dynamicModels.teslaCar.rotation);

      // Create the PositionalAudio object (passing in the listener)
      audioObjects.car = new THREE.PositionalAudio(listener);
      applySound(car, 'src/sounds/Car acceleration.mka', audioObjects.car);

      let wheels = [];

      modelScene.traverse(o => {
        if (o.isMesh) {
          o.castShadow = true;
          o.receiveShadow = true;
        }

        // Reference the four wheels
        if (o.name === 'wheel')           wheels[0]  = o;
        else if (o.name === 'wheel001')   wheels[1] = o;
        else if (o.name === 'wheel003')   wheels[2]  = o;
        else if (o.name === 'wheel002')   wheels[3] = o;
      });

      // Adjust front wheels orientation before to animate them
      wheels[0].rotation.z = 0;
      wheels[1].rotation.z = 0;

      //updateCamera(modelScene);

      const carInfo = {
        mass: 2316,    // Kg
        maxSpeed: 261, // Km/h
        boxSizeYFactor: 0.2
      };

      car = new Car(modelScene, carInfo, game, "Tesla Model S", wheels);
      player.setModel(car);
    }

    function addLamborghiniCar(modelScene) {
      modelScene.position.set(...dynamicModels.lamborghiniCar.position);
      modelScene.scale.set(...dynamicModels.lamborghiniCar.scale)
      modelScene.rotation.set(...dynamicModels.lamborghiniCar.rotation);

      // Create the PositionalAudio object (passing in the listener)
      audioObjects.car = new THREE.PositionalAudio(listener);
      applySound(car, 'src/sounds/Car acceleration.mka', audioObjects.car);

      let wheels = [],
          brakes = [];

      modelScene.traverse(o => {
        if (o.isMesh) {
          o.castShadow = true;
          o.receiveShadow = true;
        }

        // Reference the four wheels
        if (o.name === 'wheel001') {
          wheels[0] = o;
          //(o.parent).add(frontAxle);
          //frontAxle.add(o);
        }
        else if (o.name === 'wheel002') {
          wheels[1] = o;
          //frontAxle.add(o);
        }
        else if (o.name === 'wheel003')   wheels[2] = o;
        else if (o.name === 'wheel005')   wheels[3] = o;

        // Reference the four brakes associated with wheels
        else if (o.name === 'wheel007')   brakes[0] = o;
        else if (o.name === 'wheel006')   brakes[1] = o;
        else if (o.name === 'wheel000')   brakes[2] = o;
        else if (o.name === 'wheel004')   brakes[3] = o;
      });

      // Adjust front right wheel orientation before to animate it
      wheels[1].rotation.y = Math.PI;
      wheels[1].rotation.z = 0;

      //updateCamera(modelScene);

      const carInfo = {
        mass: 1625,    // Kg
        maxSpeed: 350, // Km/h
        boxSizeYFactor: 0.56
      };

      const components = {
        wheels: wheels,
        brakes: brakes
      };

      car = new Car(modelScene, carInfo, game, "Lamborghini Aventador S", components); //wheels);
      player.setModel(car);
    }


    function addNathanCharacter(modelScene) {
      modelScene.position.set(...dynamicModels.nathan.position);
      modelScene.scale.set(...dynamicModels.nathan.scale)
      modelScene.rotation.set(...dynamicModels.nathan.rotation);

      let head,
          leftArm  = [],
          leftHand = [],
          rightArm  = [],
          rightHand = [],

          leftLeg  = [],
          leftFoot = [],
          rightLeg  = [],
          rightFoot = [];

      modelScene.traverse(o => {
        if (o.isMesh) {
          o.castShadow = true;
          o.receiveShadow = true;
        }

        // Reference the components of the character
        if (o.name === 'rp_nathan_animated_003_walking_head_07')               head = o;

        if (o.name === 'rp_nathan_animated_003_walking_shoulder_l_023')        leftArm[0] = o;
        else if (o.name === 'rp_nathan_animated_003_walking_upperarm_l_024')   leftArm[1] = o;
        else if (o.name === 'rp_nathan_animated_003_walking_lowerarm_l_025')   leftArm[2] = o;
        else if (o.name === 'rp_nathan_animated_003_walking_hand_l_026')       leftHand[0]  = o;
        else if (o.name === 'rp_nathan_animated_003_walking_thumb_01_l_027')   leftHand[1]  = o;
        else if (o.name === 'rp_nathan_animated_003_walking_index_01_l_031')   leftHand[2]  = o;
        else if (o.name === 'rp_nathan_animated_003_walking_middle_01_l_00')   leftHand[3]  = o;
        else if (o.name === 'rp_nathan_animated_003_walking_ring_01_l_038')    leftHand[4]  = o;
        else if (o.name === 'rp_nathan_animated_003_walking_pinky_01_l_042')   leftHand[5]  = o;

        else if (o.name === 'rp_nathan_animated_003_walking_shoulder_r_048')   rightArm[0] = o;
        else if (o.name === 'rp_nathan_animated_003_walking_upperarm_r_049')   rightArm[1] = o;
        else if (o.name === 'rp_nathan_animated_003_walking_lowerarm_r_050')   rightArm[2] = o;
        else if (o.name === 'rp_nathan_animated_003_walking_hand_r_051')       rightHand[0] = o;
        else if (o.name === 'rp_nathan_animated_003_walking_thumb_01_r_052')   rightHand[1] = o;
        else if (o.name === 'rp_nathan_animated_003_walking_index_01_r_056')   rightHand[2] = o;
        else if (o.name === 'rp_nathan_animated_003_walking_middle_01_r_060')  rightHand[3] = o;
        else if (o.name === 'rp_nathan_animated_003_walking_ring_01_r_064')    rightHand[4] = o;
        else if (o.name === 'rp_nathan_animated_003_walking_pinky_01_r_068')   rightHand[5] = o;

        else if (o.name === 'rp_nathan_animated_003_walking_upperleg_l_074')   leftLeg[0] = o;
        else if (o.name === 'rp_nathan_animated_003_walking_lowerleg_l_075')   leftLeg[1] = o;
        else if (o.name === 'rp_nathan_animated_003_walking_foot_l_076')       leftFoot[0] = o;

        else if (o.name === 'rp_nathan_animated_003_walking_upperleg_r_081')   rightLeg[0] = o;
        else if (o.name === 'rp_nathan_animated_003_walking_lowerleg_r_082')   rightLeg[1] = o;
        else if (o.name === 'rp_nathan_animated_003_walking_foot_r_083')       rightFoot[0] = o;
      });

      const components = {
        head:      head,
        leftArm:   leftArm,
        leftHand:  leftHand,
        rightArm:  rightArm,
        rightHand: rightHand,
        leftLeg:   leftLeg,
        leftFoot:  leftFoot,
        rightLeg:  rightLeg,
        rightFoot: rightFoot
      }

      const modelInfo = {
        mass: 80,
        boxSizeYFactor: 0.5
      };

      character = new Character(modelScene, modelInfo, game, "Nathan", components);
      player.setModel(character);

      // Create the PositionalAudio object (passing in the listener)
      audioObjects.character = new THREE.PositionalAudio(listener);
      applySound(modelScene, 'src/sounds/Running footsteps.mka', audioObjects.character);

      //updateCamera(modelScene);
    }

    // Must run each time the DOM window resize event fires.
    // Resets the canvas dimensions to match the window
    function resizeCanvas() {
        camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }











    function createWheelMesh(radius, width) {
      var t = new THREE.CylinderGeometry(radius, radius, width, 24, 1);
      t.rotateZ(Math.PI / 2);
      var mesh = new THREE.Mesh(t, materialInteractive);
      mesh.add(new THREE.Mesh(new THREE.BoxGeometry(width * 1.5, radius * 1.75, radius*.25, 1, 1, 1), materialInteractive));
      scene.add(mesh);
      return mesh;
    }

    function createChassisMesh(w, l, h) {
      var shape = new THREE.BoxGeometry(w, l, h, 1, 1, 1);
      var mesh = new THREE.Mesh(shape, materialInteractive);
      scene.add(mesh);
      return mesh;
    }

    function createVehicle(pos, quat) {

      // Vehicle contants

      var chassisWidth = 1.8;
      var chassisHeight = .6;
      var chassisLength = 4;
      var massVehicle = 800;

      var wheelAxisPositionBack = -1;
      var wheelRadiusBack = .4;
      var wheelWidthBack = .3;
      var wheelHalfTrackBack = 1;
      var wheelAxisHeightBack = .3;

      var wheelAxisFrontPosition = 1.7;
      var wheelHalfTrackFront = 1;
      var wheelAxisHeightFront = .3;
      var wheelRadiusFront = .35;
      var wheelWidthFront = .2;

      var friction = 1000;
      var suspensionStiffness = 20.0;
      var suspensionDamping = 2.3;
      var suspensionCompression = 4.4;
      var suspensionRestLength = 0.6;
      var rollInfluence = 0.2;

      var steeringIncrement = .04;
      var steeringClamp = .5;
      var maxEngineForce = 2000;
      var maxBreakingForce = 100;

      // Chassis
      var geometry = new Ammo.btBoxShape(new Ammo.btVector3(chassisWidth * .5, chassisHeight * .5, chassisLength * .5));
      var transform = new Ammo.btTransform();
      transform.setIdentity();
      transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
      transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
      var motionState = new Ammo.btDefaultMotionState(transform);
      var localInertia = new Ammo.btVector3(0, 0, 0);
      geometry.calculateLocalInertia(massVehicle, localInertia);
      var body = new Ammo.btRigidBody(new Ammo.btRigidBodyConstructionInfo(massVehicle, motionState, geometry, localInertia));
      const DISABLE_DEACTIVATION = 4;
      body.setActivationState(DISABLE_DEACTIVATION);
      physicsWorld.addRigidBody(body);
      var chassisMesh = createChassisMesh(chassisWidth, chassisHeight, chassisLength);

      //const boxHelper = new THREE.BoxHelper(chassisMesh, 0x00ff00);
      //scene.add(boxHelper);

      // Raycast Vehicle
      var engineForce = 0;
      var vehicleSteering = 0;
      var breakingForce = 0;
      var tuning = new Ammo.btVehicleTuning();
      var rayCaster = new Ammo.btDefaultVehicleRaycaster(physicsWorld);
      var vehicle = new Ammo.btRaycastVehicle(tuning, body, rayCaster);
      vehicle.setCoordinateSystem(0, 1, 2);
      physicsWorld.addAction(vehicle);

      // Wheels
      var FRONT_LEFT = 0;
      var FRONT_RIGHT = 1;
      var BACK_LEFT = 2;
      var BACK_RIGHT = 3;
      var wheelMeshes = [];
      var wheelDirectionCS0 = new Ammo.btVector3(0, -1, 0);
      var wheelAxleCS = new Ammo.btVector3(-1, 0, 0);

      function addWheel(isFront, pos, radius, width, index) {

        var wheelInfo = vehicle.addWheel(
          pos,
          wheelDirectionCS0,
          wheelAxleCS,
          suspensionRestLength,
          radius,
          tuning,
          isFront);

          wheelInfo.set_m_suspensionStiffness(suspensionStiffness);
          wheelInfo.set_m_wheelsDampingRelaxation(suspensionDamping);
          wheelInfo.set_m_wheelsDampingCompression(suspensionCompression);
          wheelInfo.set_m_frictionSlip(friction);
          wheelInfo.set_m_rollInfluence(rollInfluence);

          wheelMeshes[index] = createWheelMesh(radius, width);
        }

        addWheel(true, new Ammo.btVector3(wheelHalfTrackFront, wheelAxisHeightFront, wheelAxisFrontPosition), wheelRadiusFront, wheelWidthFront, FRONT_LEFT);
        addWheel(true, new Ammo.btVector3(-wheelHalfTrackFront, wheelAxisHeightFront, wheelAxisFrontPosition), wheelRadiusFront, wheelWidthFront, FRONT_RIGHT);
        addWheel(false, new Ammo.btVector3(-wheelHalfTrackBack, wheelAxisHeightBack, wheelAxisPositionBack), wheelRadiusBack, wheelWidthBack, BACK_LEFT);
        addWheel(false, new Ammo.btVector3(wheelHalfTrackBack, wheelAxisHeightBack, wheelAxisPositionBack), wheelRadiusBack, wheelWidthBack, BACK_RIGHT);

        // Sync keybord actions and physics and graphics
				function sync(dt) {

					var speed = vehicle.getCurrentSpeedKmHour();

					breakingForce = 0;
					engineForce = 0;

					if (inputManager.forwardAction()) {
						if (speed < -1)
							breakingForce = maxBreakingForce;
						else engineForce = maxEngineForce;
					}
					if (inputManager.backAction()) {
						if (speed > 1)
							breakingForce = maxBreakingForce;
						else engineForce = -maxEngineForce / 2;
					}
					if (inputManager.leftAction()) {
						if (vehicleSteering < steeringClamp)
							vehicleSteering += steeringIncrement;
					}
					else {
						if (inputManager.rightAction()) {
							if (vehicleSteering > -steeringClamp)
								vehicleSteering -= steeringIncrement;
						}
						else {
							if (vehicleSteering < -steeringIncrement)
								vehicleSteering += steeringIncrement;
							else {
								if (vehicleSteering > steeringIncrement)
									vehicleSteering -= steeringIncrement;
								else {
									vehicleSteering = 0;
								}
							}
						}
					}

          console.log("engineForce: " + engineForce);
          console.log("breakingForce: " + breakingForce);

          console.log("chassisMesh.position: ");
          console.log(chassisMesh.position);

					vehicle.applyEngineForce(engineForce, BACK_LEFT);
					vehicle.applyEngineForce(engineForce, BACK_RIGHT);

          vehicle.setBrake(breakingForce / 2, FRONT_LEFT);
          vehicle.setBrake(breakingForce / 2, FRONT_RIGHT);
          vehicle.setBrake(breakingForce, BACK_LEFT);
          vehicle.setBrake(breakingForce, BACK_RIGHT);

          vehicle.setSteeringValue(vehicleSteering, FRONT_LEFT);
          vehicle.setSteeringValue(vehicleSteering, FRONT_RIGHT);

          var tm, p, q, i;
          var n = vehicle.getNumWheels();
          for (i = 0; i < n; i++) {
            vehicle.updateWheelTransform(i, true);
            tm = vehicle.getWheelTransformWS(i);
            p = tm.getOrigin();
            q = tm.getRotation();
            wheelMeshes[i].position.set(p.x(), p.y(), p.z());
            wheelMeshes[i].quaternion.set(q.x(), q.y(), q.z(), q.w());
          }

          tm = vehicle.getChassisWorldTransform();
          p = tm.getOrigin();
          q = tm.getRotation();
          chassisMesh.position.set(p.x(), p.y(), p.z());
          chassisMesh.quaternion.set(q.x(), q.y(), q.z(), q.w());
        }

        syncList.push(sync);
      }

  }

}
