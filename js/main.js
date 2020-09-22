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
  let physicsWorld,
      TRANSFORM_AUX,
      cbContactPairResult;

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
    setupContactPairResultCallback();


    function setupContactPairResultCallback() {
    	cbContactPairResult = new Ammo.ConcreteContactResultCallback();
    	cbContactPairResult.hasContact = false;

    	cbContactPairResult.addSingleResult = function(cp, colObj0Wrap, partId0, index0, colObj1Wrap, partId1, index1) {
    		const contactPoint = Ammo.wrapPointer(cp, Ammo.btManifoldPoint);
    		const distance = contactPoint.getDistance();

        if(distance > 0) return;

    		this.hasContact = true;
    	}
    }
  }

  function setupGraphics() {
    const canvas = document.getElementById('canvas');
    const gl = canvas.getContext("webgl2");
    if (!gl)  alert("WebGL 2.0 isn't available");

    // Disable antialias if high pixel density screen
    const aa = window.devicePixelRatio > 1 ? false : true;
    // Adjust pixel ratio for retina screen
    const pixelRatio = Math.min(0.7, window.devicePixelRatio);

    const renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: aa, powerPreference: "high-performance" } );
    renderer.setClearColor(0xBEF4FF);
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(pixelRatio);

    // Init scene and camera
    const scene = new THREE.Scene(),
          fov    = 75,
          aspect = window.innerWidth / window.innerHeight, //2;  // the canvas default
          near   = 1, //0.01,     // Greater values, best performance
          far    = 2000, //10000, // Less values, best performance
          camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 10, 8);
    camera.lookAt(0, 5, 0);
    camera.updateProjectionMatrix();

    // DISABLE WHEN GAME IS READY
    // Controls for zooming and moving around the scene
    /*const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 5, 0);
    controls.update();//*/

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
                            //position: [80, 0, -45],
                            position: [80, 0, -130],
                            scale:    [15, 15, 15],
                            rotation: [0, 0, 0],
                          }, // ENABLE
      /*apartment1:         { url: 'src/environment/city/buildings/apartment_1/scene.gltf',
                            position: [70, 15, -150],
                            scale:    [0.05, 0.05, 0.05],
                            rotation: [0, 0, 0],
                          },*/
      /*apartment2:         { url: 'src/environment/city/buildings/apartment_2/scene.gltf',
                            //position: [-50, 0, -60],
                            position: [-52, 0, -110],
                            scale:    [0.05, 0.05, 0.05],
                            rotation: [0, Math.PI/2, 0],
                          },*/ // ENABLE
      /*apartment3:         { url: 'src/environment/city/buildings/apartment_3/scene.gltf',
                            position: [-70, 1, -140],
                            scale:    [0.025, 0.025, 0.025],
                            rotation: [0, Math.PI/2, 0],
                          },
      apartment4:         { url: 'src/environment/city/buildings/apartment_4/scene.gltf',
                            position: [-170, 0.5, -200],
                            scale:    [0.02, 0.02, 0.02],
                            rotation: [0, 0, 0],
                          },*/
      /*apartment5:         { url: 'src/environment/city/buildings/apartment_5/scene.gltf',
                            //position: [-250, 1, -40],
                            position: [-80, 1, -1250],
                            scale:    [0.025, 0.025, 0.025],
                            rotation: [0, Math.PI/2, 0],
                          },*/ // ENABLE
      /*apartment6:         { url: 'src/environment/city/buildings/apartment_6/scene.gltf',
                            position: [-200, 1, 150],
                            scale:    [0.025, 0.025, 0.025],
                            rotation: [0, Math.PI/2, 0],
                          },

      bordeauxBuilding:   { url: 'src/environment/city/buildings/bordeaux_building/scene.gltf',
                            position: [-50, 0, -190],
                            scale:    [13, 13, 13],
                            rotation: [0, 0, 0],
                          },*/
      /*building1:          { url: 'src/environment/city/buildings/building_1/scene.gltf',
                            //position: [-45, 11, -10],
                            position: [-52, 11, -50],
                            scale:    [0.05, 0.05, 0.05],
                            rotation: [0, 0, 0],
                          },*/ // ENABLE
      /*building2:          { url: 'src/environment/city/buildings/building_2/scene.gltf',
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
      setOfBuildings:     { url: 'src/environment/city/buildings/set_of_buildings/scene.gltf',
                            position: [300, 118, 240],
                            scale:    [0.01, 0.01, 0.01],
                            rotation: [0, 0, 0],
                          },*/
      /*cottonClub:         { url: 'src/environment/city/buildings/cotton_club/scene.gltf',
                            //position: [-30, 0, -400],
                            position: [-40, 0, -520],
                            scale:    [0.04, 0.04, 0.04],
                            rotation: [0, Math.PI/2, 0],
                          },*/ // ENABLE
      /*easternEuHouse:     { url: 'src/environment/city/buildings/eastern_european_panel_house/scene.gltf',
                            position: [40, 0, 90],
                            scale:    [0.1, 0.1, 0.1],
                            rotation: [0, -Math.PI/2, 0],
                          },
      gasStation:         { url: 'src/environment/city/buildings/gas_station/scene.gltf',
                            position: [-40, 0, -330],
                            scale:    [0.017, 0.017, 0.017],
                            rotation: [0, 0, 0],
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
      kontra:             { url: 'src/environment/city/buildings/building_kontra/scene.gltf',
                            position: [-40, 0.5, -260],
                            scale:    [5, 5, 5],
                            rotation: [0, Math.PI/2, 0],
                          },
      motel:              { url: 'src/environment/city/buildings/motel/scene.gltf',
                            position: [-50, 0.3, -530],
                            scale:    [1.8, 1.8, 1.8],
                            rotation: [0, 0, 0],
                          },
      office:             { url: 'src/environment/city/buildings/office_1/scene.gltf',
                            position: [250, 1, -800],
                            scale:    [0.002, 0.002, 0.002],
                            rotation: [0, 0, 0],
                          },*/
      /*officePorsche:      { url: 'src/environment/city/buildings/office_2/scene.gltf',
                            //position: [40, 0, -260],
                            position: [30, 0, -700],
                            scale:    [0.035, 0.035, 0.035],
                            rotation: [0, -Math.PI/1.645, 0],
                          },*/ // ENABLE

      /*boulangerie:        { url: 'src/environment/city/buildings/boulangerie_de_lopera/scene.gltf',
                            //position: [35, -1, 150],
                            position: [-35, -1, -350],
                            scale:    [0.03, 0.03, 0.03],
                            rotation: [0, -Math.PI/2, 0],
                          },
      laCantine:          { url: 'src/environment/city/buildings/la_cantine/scene.gltf',
                            //position: [35, -1, 180],
                            position: [35, -1, -350],
                            scale:    [0.03, 0.03, 0.03],
                            rotation: [0, -Math.PI/2, 0],
                          },
      metzoCoffeeBar:     { url: 'src/environment/city/buildings/metzo_coffee_bar/scene.gltf',
                            //position: [35, -1, 350],
                            position: [35, -1, -400],
                            scale:    [4, 4, 4],
                            rotation: [0, -Math.PI/2, 0],
                          },
      pizzeria:           { url: 'src/environment/city/buildings/pizzeria/scene.gltf',
                            //position: [35, 0, 390],
                            position: [-45, 0, -400],
                            scale:    [6, 6, 6],
                            rotation: [0, -Math.PI/2, 0],
                          },
      starbucks:          { url: 'src/environment/city/buildings/starbucks_coffee/scene.gltf',
                            //position: [35, -1, 210],
                            position: [-35, -1, -450],
                            scale:    [0.03, 0.03, 0.03],
                            rotation: [0, -Math.PI/2, 0],
                          },

      stadium1:           { url: 'src/environment/city/buildings/stadium1/scene.gltf',
                            //position: [200, -4, -450],
                            position: [-120, -4, -1050],
                            scale:    [0.035, 0.035, 0.035],
                            rotation: [0, Math.PI/3, 0],
                          },
      stadium2:           { url: 'src/environment/city/buildings/stadium2/scene.gltf',
                            //position: [90, 1, 600],
                            position: [50, 1, -1050],
                            scale:    [0.7, 0.7, 0.7],
                            rotation: [0, -Math.PI/2, 0],
                          },*/ // ENABLE

      /*tower:              { url: 'src/environment/city/buildings/park_tower_chicago/scene.gltf',
                            position: [-90, 1, 300],
                            scale:    [0.01, 0.01, 0.01],
                            rotation: [0, Math.PI/2, 0],
                          },//*/

      // Street elements
      /*barTable:           { url: 'src/environment/city/street/bar_table/scene.gltf',
                            position: [-29, 2, 10],
                            scale:    [0.04, 0.04, 0.04],
                            rotation: [0, 0, 0],
                          },*/ // ENABLE
      /*barChair:           { url: 'src/environment/city/street/bar_chair/scene.gltf',
                            //position: [-30, 2.8, 10],
                            position: [-29, 2, -410],
                            scale:    [0.02, 0.02, 0.02],
                            rotation: [0, 0, 0],
                          },*/
      /*bench:              { url: 'src/environment/city/street/bench/scene.gltf',
                            //position: [-29, 1.6, -7],
                            position: [-35, 1.6, -170],
                            scale:    [2, 2, 2],
                            rotation: [0, Math.PI/2, 0],
                          },*/ // ENABLE
      // BusStop1 may cause RESULT_CODE_MACHINE_LEVEL_INSTALL_EXISTS error
      /*busStop1:           { url: 'src/environment/city/street/bus_stop_1/scene.gltf',
                            position: [30, 0, -7],
                            scale:    [2, 2, 2],
                            rotation: [0, -Math.PI/2, 0],
                          },*/
      /*busStop2:           { url: 'src/environment/city/street/bus_stop_2/scene.gltf',
                            position: [-29, 2.3, -20],
                            scale:    [4, 4, 4],
                            rotation: [0, Math.PI/2, 0],
                          },
      cityFence:          { url: 'src/environment/city/street/city_fence/scene.gltf',
                            position: [-27, 0, -7],
                            scale:    [11, 11, 11],
                            rotation: [0, Math.PI/2, 0],
                          },*/
      /*dumpster:           { url: 'src/environment/city/street/dumpster/scene.gltf',
                            //position: [45, 1.8, 20],
                            position: [35, 1.8, -450],
                            scale:    [2.3, 2.3, 2.3],
                            rotation: [0, 0, 0],
                          },*/ // ENABLE
      /*electricBox:        { url: 'src/environment/city/street/electric_box/scene.gltf',
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
                          },*/
      /*menuSign:           { url: 'src/environment/city/street/menu_sign/scene.gltf',
                            //position: [31, 2, 5],
                            position: [31, 2, -390],
                            scale:    [0.01, 0.01, 0.01],
                            rotation: [0, Math.PI/2, 0],
                          },
      simpleMetalFence:   { url: 'src/environment/city/street/simple_metal_fence/scene.gltf',
                            //position: [-25, 1.3, 5],
                            position: [-25, 1.3, 400],
                            scale:    [0.25, 0.25, 0.25],
                            rotation: [0, 0, 0],
                          },*/ // ENABLE
      /*metalFence:         { url: 'src/environment/city/street/metal_fence/scene.gltf',
                            position: [45, 1, 60],
                            scale:    [0.003, 0.003, 0.003],
                            rotation: [0, 0, 0],
                          },
      neonBillboardASR:   { url: 'src/environment/city/street/neon_billboard_1/scene.gltf',
                            position: [-30, 1, -50],
                            scale:    [0.007, 0.007, 0.007],
                            rotation: [0, 0, 0],
                          },
      neonBillboardRoma:  { url: 'src/environment/city/street/neon_billboard_2/scene.gltf',
                            position: [30, 1, -50],
                            scale:    [0.007, 0.007, 0.007],
                            rotation: [0, 0, 0],
                          },
      roadSign:           { url: 'src/environment/city/street/road_sign/scene.gltf',
                            position: [25, 0, 5],
                            scale:    [0.01, 0.01, 0.01],
                            rotation: [0, -Math.PI/2, 0],
                          },*/
      /*speedSign30:        { url: 'src/environment/city/street/speed_sign_30/scene.gltf',
                            //position: [25, 0, -12],
                            position: [25, 0, -300],
                            scale:    [0.025, 0.025, 0.025],
                            rotation: [0, 0, 0],
                          },
      speedSign40:        { url: 'src/environment/city/street/speed_sign_40/scene.gltf',
                            //position: [25, 3.3, -8],
                            position: [25, 3.3, -500],
                            scale:    [3.5, 3.5, 3.5],
                            rotation: [0, 0, 0],
                          },
      stopSign:           { url: 'src/environment/city/street/stop_sign/scene.gltf',
                            //position: [25, 0, -20],
                            position: [25, 0, -15],
                            scale:    [3.3, 3.3, 3.3],
                            rotation: [0, Math.PI, 0],
                          },
      sidewalkCorner:     { url: 'src/environment/city/street/sidewalk_corner/scene.gltf',
                            position: [26.5, 0, -25.3],
                            scale:    [1, 1, 1],
                            rotation: [0, -Math.PI/2, 0],
                          },
      sidewalkStraight:   { url: 'src/environment/city/street/sidewalk_straight/scene.gltf',
                            position: [26.5, 0, 0],
                            scale:    [1, 1, 1],
                            rotation: [0, 0, 0],
                          },*/ // ENABLE
      /*trafficCone:        { url: 'src/environment/city/street/traffic_cone/scene.gltf',
                            position: [25, 0, -3],
                            scale:    [0.03, 0.03, 0.03],
                            rotation: [0, 0, 0],
                          },*/
      /*trafficLight:       { url: 'src/environment/city/street/traffic_light/scene.gltf',
                            //position: [25, 0, -25],
                            position: [25, 0, -1000],
                            scale:    [0.1, 0.1, 0.1],
                            rotation: [0, 0, 0],
                          },*/ // ENABLE
      /*trashCan1:          { url: 'src/environment/city/street/trash_can_1/scene.gltf',
                            position: [28, 0.5, 0],
                            scale:    [0.025, 0.025, 0.025],
                            rotation: [0, 0, 0],
                          },
      trashCan2:          { url: 'src/environment/city/street/trash_can_2/scene.gltf',
                            position: [-29, 0.8, -3],
                            scale:    [0.3, 0.3, 0.3],
                            rotation: [0, 0, 0],
                          },*/
      /*trashCan3:          { url: 'src/environment/city/street/trash_can_3/scene.gltf',
                            //position: [-29, 1.6, -10],
                            position: [-35, 1.6, -180],
                            scale:    [1, 1, 1],
                            rotation: [0, 0, 0],
                          },
      tree:               { url: 'src/environment/city/street/tree/scene.gltf',
                            //position: [30, 0, -30],
                            position: [30, 0, -55],
                            scale:    [0.03, 0.03, 0.03],
                            rotation: [0, 0, 0],
                          },
      pineTree:           { url: 'src/environment/city/street/pine_tree/scene.gltf',
                            position: [30, 0, 40],
                            scale:    [0.03, 0.03, 0.03],
                            rotation: [0, 0, 0],
                          },*/ // ENABLE
      /*hydrant:            { url: 'src/environment/city/street/yellow_rusted_hydrant/scene.gltf',
                            position: [-26, 1, 10],
                            scale:    [0.8, 0.8, 0.8],
                            rotation: [0, 0, 0],
                          },//*/


      // Country - desert
      /*abandonedGas:       { url: 'src/environment/country - desert/buildings/abandoned_gas_station/scene.gltf',
                            position: [-65, 0.3, 50],
                            scale:    [1, 1, 1],
                            rotation: [0, 0, 0],
                          },*/
      /*abandonedShop:      { url: 'src/environment/country - desert/buildings/abandoned_shopmall/scene.gltf',
                            //position: [-60, 0, -200],
                            position: [-40, 0, -300],
                            scale:    [0.03, 0.03, 0.03],
                            rotation: [0, 0, 0],
                          },
      abandonedStores:    { url: 'src/environment/country - desert/buildings/wasteland_stores/scene.gltf',
                            //position: [-50, 0, -170],
                            position: [-40, 0, -400],
                            scale:    [0.1, 0.1, 0.1],
                            rotation: [0, Math.PI/2, 0],
                          },
      cinema:             { url: 'src/environment/country - desert/buildings/cinema/scene.gltf',
                            //position: [40, 0, -110],
                            position: [40, 0, -400],
                            scale:    [0.02, 0.02, 0.02],
                            rotation: [0, Math.PI/2, 0],
                          },*/ // ENABLE
      /*factory:            { url: 'src/environment/country - desert/buildings/factory/scene.gltf',
                            position: [-80, 0, -110],
                            scale:    [6, 6, 6],
                            rotation: [0, 0, 0],
                          },
      grainSilo:          { url: 'src/environment/country - desert/buildings/grain_silo/scene.gltf',
                            position: [30, 0, 30],
                            scale:    [3, 3, 3],
                            rotation: [0, 0, 0],
                          },
      motelLoneStar:      { url: 'src/environment/country - desert/buildings/motel_lone_star/scene.gltf',
                            position: [-55, 4.5, -10],
                            scale:    [0.0035, 0.0035, 0.0035],
                            rotation: [0, Math.PI/2, 0],
                          },*/
      /*motelOld:           { url: 'src/environment/country - desert/buildings/motel_old/scene.gltf',
                            //position: [50, 0.4, -20],
                            position: [50, 0.4, -500],
                            scale:    [1.5, 1.5, 1.5],
                            rotation: [0, 0, 0],
                          },*/ // ENABLE
      /*oldGarage:          { url: 'src/environment/city/buildings/old_garage/scene.gltf',
                            position: [45, 0, -200],
                            scale:    [0.004, 0.004, 0.004],
                            rotation: [0, 0, 0],
                          },*/
      /*oldWoodenHouse:     { url: 'src/environment/country - desert/buildings/old_wooden_house/scene.gltf',
                            //position: [-50, 0, 120],
                            position: [-40, 0, -60],
                            scale:    [0.2, 0.2, 0.2],
                            rotation: [0, Math.PI, 0],
                          },*/ // ENABLE
      /*postOffice:         { url: 'src/environment/country - desert/buildings/post_office/scene.gltf',
                            position: [-70, 2.2, -260],
                            scale:    [1.3, 1.3, 1.3],
                            rotation: [0, -Math.PI/2, 0],
                          },
      serviceStation:     { url: 'src/environment/country - desert/buildings/service_station/scene.gltf',
                            position: [50, 0, -160],
                            scale:    [0.03, 0.03, 0.03],
                            rotation: [0, Math.PI, 0],
                          },
      theater:            { url: 'src/environment/country - desert/buildings/harlem_apollo_theater/scene.gltf',
                            position: [-25, 0, -50],
                            scale:    [0.02, 0.02, 0.02],
                            rotation: [0, -Math.PI/2, 0],
                          },*/
      /*westernHouse:       { url: 'src/environment/country - desert/buildings/western_house/scene.gltf',
                            //position: [50, 0, 200],
                            position: [35, 0, -40],
                            scale:    [0.03, 0.03, 0.03],
                            rotation: [0, -Math.PI/2, 0],
                          },*/ // ENABLE
      /*westernHouse2:       { url: 'src/environment/country - desert/buildings/western_house_2/scene.gltf',
                            position: [50, 0.3, 60],
                            scale:    [0.25, 0.25, 0.25],
                            rotation: [0, 0, 0],
                          },
      windTurbine:        { url: 'src/environment/country - desert/buildings/vintage_wind_turbine/scene.gltf',
                            position: [30, 0, 50],
                            scale:    [0.03, 0.03, 0.03],
                            rotation: [0, -Math.PI/2, 0],
                          },//*/

      // Road elements
      /*bush:               { url: 'src/environment/country - desert/road/bush/scene.gltf',
                            position: [0, 0, -10],
                            scale:    [4, 4, 4],
                            rotation: [0, 0, 0],
                          },*/
      /*bushPlant:          { url: 'src/environment/country - desert/road/bush_plant/scene.gltf',
                            position: [0, 0, -30],
                            scale:    [0.006, 0.006, 0.006],
                            rotation: [0, 0, 0],
                          },
      bushGroup:          { url: 'src/environment/country - desert/road/bush_group/scene.gltf',
                            //position: [0, 0, -40],
                            position: [-35, 0, -550],
                            scale:    [0.035, 0.035, 0.035],
                            rotation: [0, 0, 0],
                          },
      busStop:            { url: 'src/environment/country - desert/road/bus_stop/scene.gltf',
                            //position: [-30, 4, -20],
                            position: [-30, 4, -470],
                            scale:    [6, 6, 6],
                            rotation: [0, 0, 0],
                          },*/ // ENABLE
      /*desertMesa:         { url: 'src/environment/country - desert/road/desert_mesa/scene.gltf',
                            position: [50, 17, -60],
                            scale:    [50, 50, 50],
                            rotation: [0, 0, 0],
                          },
      desertPlant:        { url: 'src/environment/country - desert/road/desert_plant/scene.gltf',
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
                          },*/
      /*rustyCar2:          { url: 'src/environment/country - desert/road/old_rusty_car_2/scene.gltf',
                            //position: [10, 0, -45],
                            position: [-30, 0, -90],
                            scale:    [0.046, 0.046, 0.046],
                            rotation: [0, 0, 0],
                          },*/ // ENABLE
      /*tumbleweed1:        { url: 'src/environment/country - desert/road/tumbleweed_1/scene.gltf',
                            position: [5, 0.55, 0],
                            scale:    [0.002, 0.002, 0.002],
                            rotation: [0, 0, 0],
                          },*/
      /*tumbleweed2:        { url: 'src/environment/country - desert/road/tumbleweed_2/scene.gltf',
                            //position: [10, 0.2, 0],
                            position: [30, 0.2, -220],
                            scale:    [0.3, 0.3, 0.3],
                            rotation: [0, 0, 0],
                          },*/ // ENABLE
      /*woodPallets:        { url: 'src/environment/country - desert/road/wood_pallets/scene.gltf',
                            position: [10, 0.2, -10],
                            scale:    [0.007, 0.007, 0.007],
                            rotation: [0, 0, 0],
                          }//*/

      // Highway
      /*billboard:          { url: 'src/environment/highway/road/billboard/scene.gltf',
                            position: [30, 1.8, -40],
                            scale:    [0.08, 0.08, 0.08],
                            rotation: [0, 0, 0],
                          },
      highwayFence:       { url: 'src/environment/highway/road/highway_fence/scene.gltf',
                            //position: [-30, 1.6, -10],
                            position: [-45, 1.6, -700],
                            //scale:    [1.5, 1.5, 1.5],
                            scale:    [3, 3, 1000],
                            rotation: [0, 0, 0],
                          },
     highwayFence2:       { url: 'src/environment/highway/road/highway_fence/scene.gltf',
                            position: [45, 1.6, -700],
                            scale:    [3, 3, 1000],
                            rotation: [0, 0, 0],
                          },
      jersey:             { url: 'src/environment/highway/road/jersey_barrier/scene.gltf',
                            //position: [0, 1.8, -10],
                            position: [0, 1.8, -700],
                            //scale:    [1.1, 1.1, 1.1],
                            scale:    [2, 2, 1000],
                            rotation: [0, 0, 0],
                          }//*/

      //FOREST
      /*lowpolyAbete:       { url: 'src/environment/forest/low_poly_abete/scene.gltf',
                            position: [-20, 0, -80],
                            scale:    [0.035, 0.035, 0.035],
                            rotation: [0, 0, 0],
                          },
      lowpolyTree:        { url: 'src/environment/forest/low_poly_tree/scene.gltf',
                            position: [5, 0, -160],
                            scale:    [6, 6, 6],
                            rotation: [0, 0, 0],
                          },
      lowpolyTrunkBench:  { url: 'src/environment/forest/low_poly_trunk_bench/scene.gltf',
                            position: [9, 0, -50],
                            scale:    [0.15, 0.15, 0.15],
                            rotation: [0, Math.PI/2, 0],
                          },
     tree:                { url: 'src/environment/city/street/tree/scene.gltf',
                            position: [40, 0, -170],
                            scale:    [0.02, 0.02, 0.02],
                            rotation: [0, Math.PI/2, 0],
                          },
     pineTree:            { url: 'src/environment/city/street/pine_tree/scene.gltf',
                             position: [-40, 0, -100],
                             scale:    [0.02, 0.02, 0.02],
                             rotation: [0, Math.PI/2, 0],
                          },
    duneBranch:           { url: 'src/environment/forest/dune_branch/scene.gltf',
                            position: [0, 1, -10],
                            scale:    [7, 7, 7],
                            rotation: [0, 0, 0],
                          }//*/

    //NOT USED ANYMORE
    /*jungleTree:             { url: 'src/environment/forest/jungle_tree/scene.gltf',
                                                       position: [0, 0, -70],
                                                       scale:    [0.5, 0.5, 0.5],
                                                       rotation: [0, 0, 0],
                                                     },
    bushPlant:             { url: 'src/environment/country - desert/road/bush_plant/scene.gltf',
                                                       position: [0, 0, -120],
                                                       scale:    [0.005, 0.005, 0.005],
                                                       rotation: [0, Math.PI/2, 0],
                                                     },*/
    };

    const dynamicModels = {
      // Cars
      policeCar:          { url: 'src/vehicles/cars/police_car/scene.gltf',
                            position: [-1.5, 0, 25],
                            scale:    [2.3, 2, 2.3],
                            rotation: [0, Math.PI, 0],

                            carInfo: {
                              mass: 1840,    // Kg
                              maxSpeed: 207, // Km/h
                              boxSizeXFactor: 0.4,
                              boxSizeYFactor: 0.043,
                              boxSizeZFactor: 0.4,
                              carName: "policeCar1"
                            },
                            wheelsNames: []
                          },

      /*bmwI8:              { url: 'src/vehicles/cars/bmw_i8/scene.gltf',
                            position: [0, 1.5, 0],
                            scale:    [0.027, 0.025, 0.027],
                            rotation: [0, Math.PI, 0],

                            carInfo: {
                              mass: 1920,    // Kg
                              maxSpeed: 250, // Km/h
                              boxSizeXFactor: 0.4,
                              boxSizeYFactor: 0.52,
                              boxSizeZFactor: 0.2,
                              carName: "Bmw i8"
                            },
                            wheelsNames: ["wheel020", "wheel028", "wheel012", "wheel004"]
                          },*/
      lamborghini:        { url: 'src/vehicles/cars/lamborghini_aventador_j/scene.gltf',
                            position: [-10, 1.73, 0],
                            scale:    [0.013, 0.013, 0.013],
                            rotation: [0, Math.PI, 0],

                            carInfo: {
                              mass: 1625,    // Kg
                              maxSpeed: 350, // Km/h
                              boxSizeXFactor: 0.4, //0.5,
                              boxSizeYFactor: 0.56,
                              boxSizeZFactor: 0.2,
                              carName: "Lamborghini Aventador S"
                            },
                            wheelsNames: ["wheel001", "wheel002", "wheel003", "wheel005"]
                          },
      /*tesla:              { url: 'src/vehicles/cars/tesla_model_s/scene.gltf',
                            position: [10, 0.35, 0],
                            scale:    [0.026, 0.024, 0.026],
                            rotation: [0, Math.PI, 0],

                            carInfo: {
                              mass: 2316,    // Kg
                              maxSpeed: 261, // Km/h
                              boxSizeXFactor: 0.5,
                              boxSizeYFactor: 0.11,
                              boxSizeZFactor: 0.4,
                              carName: "Tesla Model S"
                            },
                            wheelsNames: ["wheel", "wheel001", "wheel003", "wheel002"]
                          },*/

      /*americanMuscleCar:  { url: 'src/vehicles/cars/american_muscle_car/scene.gltf',
                            position: [20, 2, 0],
                            scale:    [6, 6, 6],
                            rotation: [0, Math.PI/2, 0],

                            carInfo: {
                              mass: 1477,    // Kg
                              maxSpeed: 229, // Km/h
                              boxSizeXFactor: 0.05, // to be fixed maybe with Z
                              boxSizeYFactor: 0.5,
                              carName: "Chevrolet Chevelle SS"
                            },
                            wheelsNames: null // static model (due to its 3D model)
                          },*/
      audiR8:             { url: 'src/vehicles/cars/audi_r8/scene.gltf',
                            position: [20, 0.5, 0],
                            scale:    [0.026, 0.025, 0.026],
                            rotation: [0, 0, 0],

                            carInfo: {
                              mass: 1700,    // Kg
                              maxSpeed: 325, // Km/h
                              boxSizeXFactor: 0.7,
                              boxSizeYFactor: 0.15,
                              boxSizeZFactor: 0.5,
                              carName: "Audi R8"
                            },
                            wheelsNames: ["object008", "object031", "object035", "object034"]
                          },
      /*bmwE30:             { url: 'src/vehicles/cars/bmw_e30/scene.gltf',
                            position: [30, 0, 0],
                            scale:    [2.6, 2.5, 2.6],
                            rotation: [0, 0, 0],

                            carInfo: {
                              mass: 1080,    // Kg
                              maxSpeed: 197, // Km/h
                              boxSizeXFactor: 0.3,
                              boxSizeYFactor: 0.08,
                              carName: "Bmw E30"
                            },
                            wheelsNames: ["F_wheelL_5", "F_wheelR_6", "B_wheelL_7", "B_wheelR_8"]
                          },
      camper1:            { url: 'src/vehicles/cars/camper_volkswagen/scene.gltf',
                            position: [16, 0, 20],
                            scale:    [2.5, 2.5, 2.5],
                            rotation: [0, -Math.PI/2, 0],

                            carInfo: {
                              mass: 1000,    // Kg
                              maxSpeed: 105, // Km/h
                              boxSizeXFactor: 0.08,
                              boxSizeYFactor: 0.08,
                              carName: "Volkswagen T2"
                            },
                            wheelsNames: ["Group225", "Group324", "Group318", "Group330"]
                            // Group261 is driver door
                            // Group231 is passenger door
                            // Group1 & Group15 central doors
                            // Maybe useful as environment element
                          },
      camper2:            { url: 'src/vehicles/cars/camper_fleetwood_bounder/scene.gltf',
                            position: [40, 3.5, 0],
                            scale:    [10.5, 10.5, 10.5],
                            rotation: [0, 0, 0],

                            carInfo: {
                              mass: 8000,     // Kg
                              maxSpeed: 120, // Km/h
                              boxSizeXFactor: 0.35,
                              boxSizeYFactor: 0.5,
                              carName: "Fleetwood Bounder"
                            },
                            wheelsNames: null // static model (due to its 3D model)
                          },
      /*chevroletCruze:     { url: 'src/vehicles/cars/chevrolet_cruze_2011/scene.gltf',
                            position: [0, 2.5, -20],
                            scale:    [0.8, 0.8, 0.8],
                            rotation: [0, 0, 0],

                            carInfo: {
                              mass: 1960,    // Kg
                              maxSpeed: 202, // Km/h
                              boxSizeXFactor: 0.3,
                              boxSizeYFactor: 0.6,
                              carName: "Chevrolet Cruze"
                            },
                            wheelsNames: null // Too many components to be handled for rotating wheels
                          },
      chevroletImpala:    { url: 'src/vehicles/cars/chevrolet_impala_1967/scene.gltf',
                            position: [10, 1, -20],
                            scale:    [0.7, 0.7, 0.7],
                            rotation: [0, 0, 0],

                            carInfo: {
                              mass: 1960,    // Kg
                              maxSpeed: 209, // Km/h
                              boxSizeXFactor: 0.3,
                              boxSizeYFactor: 0.2,
                              carName: "Chevrolet Impala"
                            },
                            wheelsNames: ["Wheel"] // Just one for all
                          },*/
      /*deliveryVan:        { url: 'src/vehicles/cars/generic_delivery_van/scene.gltf',
                            position: [50, 3.5, 0],
                            scale:    [0.08, 0.08, 0.08],
                            rotation: [0, 0, 0],

                            carInfo: {
                              mass: 2880,    // Kg
                              maxSpeed: 185, // Km/h
                              boxSizeXFactor: 0.3,
                              boxSizeYFactor: 0.5,
                              carName: "Delivery Van"
                            },
                            wheelsNames: null // static model (due to its 3D model)
                          },
      derbyCar:           { url: 'src/vehicles/cars/derby_car/scene.gltf',
                            position: [0, 0, -20],
                            scale:    [3, 3, 3],
                            rotation: [0, 0, 0],

                            carInfo: {
                              mass: 1700,    // Kg
                              maxSpeed: 180, // Km/h
                              boxSizeXFactor: 0.3,
                              boxSizeYFactor: 0.2,
                              carName: "Derby car"
                            },
                            wheelsNames: null // static model (due to its 3D model)
                          },
      dodgeViper:         { url: 'src/vehicles/cars/srt_viper_gts_2013/scene.gltf',
                            position: [10, 2, -20],
                            scale:    [2.5, 2.5, 2.5],
                            rotation: [0, 0, 0],

                            carInfo: {
                              mass: 1556,    // Kg
                              maxSpeed: 331, // Km/h
                              boxSizeXFactor: 0.3,
                              boxSizeYFactor: 0.2,
                              carName: "Dodge Viper GTS"
                            },
                            wheelsNames: ["Circle001", "Circle002", "Circle", "Circle003"]
                          },
      ferrari458:         { url: 'src/vehicles/cars/ferrari_458/scene.gltf',
                            position: [20, 0.2, -20],
                            scale:    [0.026, 0.026, 0.026],
                            rotation: [0, 0, 0],

                            carInfo: {
                              mass: 1565,    // Kg
                              maxSpeed: 320, // Km/h
                              boxSizeXFactor: 0.25,
                              boxSizeYFactor: 0.2,
                              carName: "Ferrari 458"
                            },
                            wheelsNames: null // Too many components to be handled for rotating wheels
                          },
      fiat500:            { url: 'src/vehicles/cars/fiat_500/scene.gltf',
                            position: [-28, 2, -40],
                            scale:    [4.5, 4.5, 4.5],
                            rotation: [0, 0, 0],

                            carInfo: {
                              mass: 499,    // Kg
                              maxSpeed: 85, // Km/h
                              boxSizeXFactor: 0.4,
                              boxSizeYFactor: 0.5,
                              carName: "Fiat 500"
                            },
                            wheelsNames: null // static model (due to its 3D model)
                          },
      fordCrownVictoria:  { url: 'src/vehicles/cars/ford_crown_victoria/scene.gltf',
                            position: [30, 0, -20],
                            scale:    [3.8, 3.1, 4],
                            rotation: [0, 0, 0],

                            carInfo: {
                              mass: 1873,    // Kg
                              maxSpeed: 219, // Km/h
                              boxSizeXFactor: 0.3, // To be fixed maybe with Z
                              boxSizeYFactor: 0.2,
                              carName: "Ford Crown Victoria"
                            },
                            wheelsNames: null // static model (due to its 3D model)
                          },
      fordFoxSedan:       { url: 'src/vehicles/cars/ford_fox_sedan/scene.gltf',
                            position: [40, 0, -20],
                            scale:    [0.065, 0.065, 0.065],
                            rotation: [0, Math.PI/2, 0],

                            carInfo: {
                              mass: 1248,    // Kg
                              maxSpeed: 176, // Km/h
                              boxSizeXFactor: 0.3,
                              boxSizeYFactor: 0.2,
                              carName: "Ford Fox Sedan"
                            },
                            wheelsNames: ["wheel_01", "wheel_002", "wheel_003", "wheel_004"]
                          },
      fordRangerRaptor:  { url: 'src/vehicles/cars/ford_ranger_raptor_2019/scene.gltf',
                            position: [50, 2, -20],
                            scale:    [0.07, 0.07, 0.07],
                            rotation: [0, 0, 0],

                            carInfo: {
                              mass: 2500,    // Kg
                              maxSpeed: 169, // Km/h
                              boxSizeXFactor: 0.3,
                              boxSizeYFactor: 0.2,
                              carName: "Ford Ranger Raptor"
                            },
                            wheelsNames: null // static model (due to its 3D model)
                          },
      fordTorino:         { url: 'src/vehicles/cars/ford_torino/scene.gltf',
                            position: [60, 1.8, -20],
                            scale:    [7, 7, 7],
                            rotation: [0, Math.PI/2, 0],

                            carInfo: {
                              mass: 1715,    // Kg
                              maxSpeed: 245, // Km/h
                              boxSizeXFactor: 0.3,
                              boxSizeYFactor: 0.2,
                              carName: "Ford Torino"
                            },
                            wheelsNames: null // static model (due to its 3D model)
                          },
      gmcSierra:          { url: 'src/vehicles/cars/gmc_sierra_work_truck/scene.gltf',
                            position: [-50, 0, 0],
                            scale:    [0.06, 0.06, 0.08],
                            rotation: [0, 0, 0],

                            carInfo: {
                              mass: 2670,    // Kg
                              maxSpeed: 120, // Km/h
                              boxSizeXFactor: 0.2,  // Z to be fixed
                              boxSizeYFactor: 0.05,
                              carName: "GMC Sierra"
                            },
                            wheelsNames: null // static model (due to its 3D model)
                          },
      hyundaiBus:         { url: 'src/vehicles/cars/hyundai_universe/scene.gltf',
                            position: [-60, 0, 0],
                            scale:    [2.5, 2.5, 2.5],
                            rotation: [0, 0, 0],

                            carInfo: {
                              mass: 11975,   // Kg
                              maxSpeed: 150, // Km/h
                              boxSizeXFactor: 0.25,
                              boxSizeYFactor: 0.05,
                              carName: "Hyundai Universe"
                            },
                            wheelsNames: null // static model (due to its 3D model)
                          },
      ladavaz:            { url: 'src/vehicles/cars/ladavaz_2107_1995/scene.gltf',
                            position: [-20, 0, 0],
                            scale:    [0.025, 0.023, 0.025],
                            rotation: [0, Math.PI/2, 0],

                            carInfo: {
                              mass: 1000,    // Kg
                              maxSpeed: 152, // Km/h
                              boxSizeXFactor: 0.25,
                              boxSizeYFactor: 0.05,
                              carName: "Lada-Vaz 2107"
                            },
                            wheelsNames: null // static model (due to its 3D model)
                          },
      lamborghiniDiablo:  { url: 'src/vehicles/cars/lamborghini_diablo_sv_1998/scene.gltf',
                            position: [-30, 1.5, 0],
                            scale:    [0.024, 0.024, 0.024],
                            rotation: [0, 0, 0],

                            carInfo: {
                              mass: 1625,    // Kg
                              maxSpeed: 335, // Km/h
                              boxSizeXFactor: 0.25,
                              boxSizeYFactor: 0.05,
                              carName: "lamborghini Diablo SV"
                            },
                            wheelsNames: ["HLFW", "HRFW", "HRRW", "HLRW"]
                          },
      /*lotus:              { url: 'src/vehicles/cars/lotus_3-eleven/scene.gltf',
                            position: [-40, 0.3, 0],
                            scale:    [2.7, 2.7, 2.7],
                            rotation: [0, 0, 0],

                            carInfo: {
                              mass: 925,   // Kg
                              maxSpeed: 290, // Km/h
                              boxSizeXFactor: 0.6, // To be fixed maybe with Z
                              boxSizeYFactor: 0.2,
                              carName: "Lotus 3-Eleven"
                            },
                            wheelsNames: null // Too many components to be handled for rotating wheels
                          },*/
      /*mercedes:           { url: 'src/vehicles/cars/mercedes_sls/scene.gltf',
                            position: [-40, 1.5, 0],
                            scale:    [7.8, 7, 7.8],
                            rotation: [0, Math.PI/2, 0],

                            carInfo: {
                              mass: 1620,    // Kg
                              maxSpeed: 317, // Km/h
                              boxSizeXFactor: 0.1, // To be fixed maybe with Z
                              boxSizeYFactor: 0.5,
                              carName: "Mercedes SLS"
                            },
                            wheelsNames: ["Wheel_FL", "Wheel_FR", "Wheel_RL", "Wheel_RR"]
                          },
      /*militaryTruck:      { url: 'src/vehicles/cars/military_truck/scene.gltf',
                            position: [-10, 0, -20],
                            scale:    [2, 2, 2],
                            rotation: [0, Math.PI/2, 0],

                            carInfo: {
                              mass: 2034,    // Kg
                              maxSpeed: 185, // Km/h
                              boxSizeXFactor: 0.2, // To be fixed maybe with Z
                              boxSizeYFactor: 0.1,
                              carName: "Military truck"
                            },
                            wheelsNames: ["fronttire_low002", "fronttire_low003"] // First references front wheels, 2nd rear ones
                          },*/
      /*militaryTruck2:     { url: 'src/vehicles/cars/military_truck_12_ton/scene.gltf',
                            position: [-10, 0, -20],
                            scale:    [0.028, 0.028, 0.028],
                            rotation: [0, 0, 0],

                            carInfo: {
                              mass: 5840,   // Kg
                              maxSpeed: 93, // Km/h
                              boxSizeXFactor: 0.3,
                              boxSizeYFactor: 0.2,
                              carName: "M35 2½-ton cargo truck"
                            },
                            wheelsNames: null // static model (due to its 3D model)
                          },
      mustang:            { url: 'src/vehicles/cars/mustang/scene.gltf',
                            position: [-20, 2, -20],
                            scale:    [6, 6, 5.5],
                            rotation: [0, Math.PI/2, 0],

                            carInfo: {
                              mass: 1700,   // Kg
                              maxSpeed: 180, // Km/h
                              boxSizeXFactor: 0.3,
                              boxSizeYFactor: 0.2,
                              carName: "Ford Mustang GT"
                            },
                            wheelsNames: ["Wheel"] // Just one for all
                          },
      nissanDatsun:       { url: 'src/vehicles/cars/nissan_datsun_280zx/scene.gltf',
                            position: [-30, 1.2, -20],
                            scale:    [0.013, 0.013, 0.013],
                            rotation: [0, 0, 0],

                            carInfo: {
                              mass: 1281,    // Kg
                              maxSpeed: 210, // Km/h
                              boxSizeXFactor: 0.3,
                              boxSizeYFactor: 0.2,
                              carName: "Nissan Datsun 280ZX"
                            },
                            wheelsNames: null // Too many components to be handled for rotating wheels
                          },
      nissanGT:           { url: 'src/vehicles/cars/nissan_gt/scene.gltf',
                            position: [-40, 0.3, -20],
                            scale:    [0.025, 0.025, 0.025],
                            rotation: [0, 0, 0],

                            carInfo: {
                              mass: 1740,    // Kg
                              maxSpeed: 333, // Km/h
                              boxSizeXFactor: 0.3,
                              boxSizeYFactor: 0.2,
                              carName: "Nissan GT"
                            },
                            wheelsNames: ["wheel", "wheel001", "wheel003", "wheel002"]
                          },
      nissanSilvia:       { url: 'src/vehicles/cars/nissan_200sx_silvia_s14/scene.gltf',
                            position: [-50, -1.7, -20],
                            scale:    [3.5, 3.5, 3.5],
                            rotation: [0, 0, 0],

                            carInfo: {
                              mass: 1253,    // Kg
                              maxSpeed: 314, // Km/h
                              boxSizeXFactor: 0.3,
                              boxSizeYFactor: 0.2,
                              carName: "Nissan Silvia S14"
                            },
                            wheelsNames: ["Circle_1", "Circle003_7", "Circle002_6", "Circle001_5"]
                          },
      pontiac:            { url: 'src/vehicles/cars/pontiac_ventura/scene.gltf',
                            position: [-60, 0, -20],
                            scale:    [0.06, 0.05, 0.06],
                            rotation: [0, Math.PI/2, 0],

                            carInfo: {
                              mass: 1361,    // Kg
                              maxSpeed: 180, // Km/h
                              boxSizeXFactor: 0.3,
                              boxSizeYFactor: 0.2,
                              carName: "Pontiac Ventura"
                            },
                            wheelsNames: null // static model (due to its 3D model)
                          },
      rangeRover:         { url: 'src/vehicles/cars/range_rover_evoque/scene.gltf',
                            position: [-6, 1.3, -50],
                            scale:    [5.15, 5.15, 5.15],
                            rotation: [0, 0, 0],

                            carInfo: {
                                mass: 1787,    // Kg
                                maxSpeed: 201, // Km/h
                                boxSizeXFactor: 0.3,
                                boxSizeYFactor: 0.43,
                                carName: "Range Rover Evoque"
                              },
                            wheelsNames: ["wheel", "wheel001", "wheel002", "wheel003"]
                          },
      taxi:               { url: 'src/vehicles/cars/taxi/scene.gltf',
                            position: [-70, 0, -20],
                            scale:    [0.022, 0.02, 0.022],
                            rotation: [0, 0, 0],

                            carInfo: {
                              mass: 1800,    // Kg
                              maxSpeed: 180, // Km/h
                              boxSizeXFactor: 0.25,
                              boxSizeYFactor: 0.05,
                              carName: "Taxi"
                            },
                            wheelsNames: null // static model (due to its 3D model)
                          },
      teslaCybertruck:    { url: 'src/vehicles/cars/tesla_cybertruck/scene.gltf',
                            position: [-80, 0, -20],
                            scale:    [2.5, 2.5, 2.8],
                            rotation: [0, 0, 0],

                            carInfo: {
                              mass: 2268,    // Kg
                              maxSpeed: 193, // Km/h
                              boxSizeXFactor: 0.25,
                              boxSizeYFactor: 0.05,
                              carName: "Tesla Cybertruck"
                            },
                            wheelsNames: ["7"] // Just one for all
                          },
      toyota:             { url: 'src/vehicles/cars/toyota_land_cruiser/scene.gltf',
                            position: [-90, 0, -20],
                            scale:    [0.06, 0.05, 0.06],
                            rotation: [0, 0, 0],

                            carInfo: {
                              mass: 2000,    // Kg
                              maxSpeed: 120, // Km/h
                              boxSizeXFactor: 0.25,
                              boxSizeYFactor: 0.05,
                              carName: "Toyota Land Cruiser"
                            },
                            wheelsNames: null // static model (due to its 3D model)
                          },
      truck:              { url: 'src/vehicles/cars/truck/scene.gltf',
                            position: [-100, 1.5, -20],
                            scale:    [3, 3, 3],
                            rotation: [0, 0, 0],

                            carInfo: {
                                mass: 8550,    // Kg
                                maxSpeed: 100, // Km/h
                                boxSizeXFactor: 0.3,
                                boxSizeYFactor: 0.43,
                                carName: "Truck"
                            },
                            wheelsNames: ["Tire_1", "Tire001_0"] // First references front wheels, 2nd rear ones
                          },
      zis101:             { url: 'src/vehicles/cars/zis-101/scene.gltf',
                            position: [0, 0, -40],
                            scale:    [2, 2, 2.6],
                            rotation: [0, 0, 0],

                            carInfo: {
                                mass: 2550,    // Kg
                                maxSpeed: 115, // Km/h
                                boxSizeXFactor: 0.3,
                                boxSizeYFactor: 0.43,
                                carName: "ZIS-101"
                            },
                            wheelsNames: ["wheels_low"] // Just one for all
                          },
      zuk:                { url: 'src/vehicles/cars/zuk/scene.gltf',
                            position: [10, 1.3, -40],
                            scale:    [8, 7, 6],
                            rotation: [0, 0, 0],

                            carInfo: {
                              mass: 1200,    // Kg
                              maxSpeed: 100, // Km/h
                              boxSizeXFactor: 0.3,
                              boxSizeYFactor: 0.2,
                              carName: "Zuk"
                            },
                            wheelsNames: null // static model (due to its 3D model)
                           },//*/

      /*lowpolyBmw:          { url: 'src/vehicles/cars/low_poly_bmw/scene.gltf',
                             position: [0, 0, -10],
                             scale:    [2, 2, 2],
                             rotation: [0, 0, 0]
                           },
      lowpolyCar:          { url: 'src/vehicles/cars/low_poly_car/scene.gltf',
                             position: [-10, 2, -50],
                             scale:    [2.5, 2.5, 2.5],
                             rotation: [0, 0, 0],

                             carInfo: {
                               mass: 1000,    // Kg
                               maxSpeed: 100, // Km/h
                               boxSizeXFactor: 0.5,
                               boxSizeYFactor: 0.5,
                               carName: "Low Poly Car Yellow"
                             },
                             wheelsNames: ["FRWheel", "RRWheel", "FLWheel", "RLWheel"]
                           },
      lowpolyCars:         { url: 'src/vehicles/cars/low_poly_cars/scene.gltf',
                             position: [0, 0, -90],
                             scale:    [0.2, 0.2, 0.2],
                             rotation: [0, 0, 0]
                           },
      lowpolyTruck:        { url: 'src/vehicles/cars/low_poly_trucK/scene.gltf',
                             position: [0, 0, -40],
                             scale:    [50, 50, 50],
                             rotation: [0, Math.PI/2, 0],

                             carInfo: {
                               mass: 500,    // Kg
                               maxSpeed: 100, // Km/h
                               boxSizeXFactor: 0.5,
                               boxSizeYFactor: 0.5,
                               carName: "Low Poly Truck"
                             },
                             wheelsNames: ["mesh_0", "mesh_1", "mesh_2", "mesh_3"]
                           },*/
      /*lowpolyVanHippie:    { url: 'src/vehicles/cars/low_poly_van_hippie/scene.gltf',
                             position: [20, 0, -40],
                             scale:    [0.04, 0.04, 0.04],
                             rotation: [0, 0, 0],

                             carInfo: {
                               mass: 1800,    // Kg
                               maxSpeed: 90, // Km/h
                               boxSizeXFactor: 0.5,
                               boxSizeYFactor: 0.5,
                               carName: "Low Poly Van Hippie"
                             },
                             wheelsNames: ["Wheel", "Wheel_1", "Wheel_2", "Wheel_3"]
                           },
      lowpolyTaxiOldStyle: { url: 'src/vehicles/cars/low_poly_taxi_old_style/scene.gltf',
                             position: [14, 0, -150],
                             scale:    [0.02, 0.02, 0.02],
                             rotation: [0, Math.PI, 0],

                             carInfo: {
                               mass: 1000,    // Kg
                               maxSpeed: 100, // Km/h
                               boxSizeXFactor: 0.5,
                               boxSizeYFactor: 0.5,
                               carName: "Low Poly Taxi Old Style"
                             },
                             wheelsNames: ["wheel_1", "wheel_2", "wheel_3", "wheel_4"]
                           },
      lowpolySmallCar:   { url: 'src/vehicles/cars/low_poly_small_car/scene.gltf',
                             position: [30, 0, -40],
                             scale:    [0.7, 0.7, 0.7],
                             rotation: [0, Math.PI, 0],

                             carInfo: {
                               mass: 800,    // Kg
                               maxSpeed: 90, // Km/h
                               boxSizeXFactor: 0.5,
                               boxSizeYFactor: 0.5,
                               carName: "Low Poly Small Car"
                             },
                             wheelsNames: ["FR_Wheel", "RR_Wheel", "FL_Wheel", "RL_Wheel"]
                           },*/
      /*lowpolyFordAngila:   { url: 'src/vehicles/cars/low_poly_ford_angila/scene.gltf',
                             position: [-14, 0, -50],
                             scale:    [3, 3, 3],
                             rotation: [0, Math.PI, 0]
                           },
      lowpolyRafTaxiVan:   { url: 'src/vehicles/cars/low_poly_raf_taxi_van/scene.gltf',
                             position: [14, 0, -50],
                             scale:    [1.5, 1.5, 1.5],
                             rotation: [0, Math.PI/2, 0],

                             carInfo: {
                              mass: 1000,    // Kg
                              maxSpeed: 100, // Km/h
                              boxSizeXFactor: 0.5,
                              boxSizeYFactor: 0.5,
                              carName: "Low Poly Raf Taxi Van"
                             },
                             wheelsNames: ["pCylinder7_rubber_0", "pCylinder9_rubber_0", "pCylinder2_rubber_0", "pCylinder5_rubber_0"]
                           },
     lowpolyLimousine:     { url: 'src/vehicles/cars/low_poly_limousine/scene.gltf',
                             position: [14, 1, -80],
                             scale:    [1.5, 1.5, 1.5],
                             rotation: [0, Math.PI, 0]
                           },
     lowpolyE7Civilian:    { url: 'src/vehicles/cars/low_poly_e7_civilian/scene.gltf',
                             position: [14, 0, -110],
                             scale:    [0.03, 0.03, 0.03],
                             rotation: [0, Math.PI, 0]
                           },
     lowpolyDodgePolice:   { url: 'src/vehicles/police/low_poly_dodge_police/scene.gltf',
                             position: [14, 3, -50],
                             scale:    [2, 2, 2],
                             rotation: [0, Math.PI, 0]
                           },
     lowpolyOldPoliceCar:  { url: 'src/vehicles/police/low_poly_old_police_car/scene.gltf',
                             position: [-14, 2, -50],
                             scale:    [2, 2, 2],
                             rotation: [0, Math.PI/2, 0]
                           },
     lowpolyPoliceCar:     { url: 'src/vehicles/police/low_poly_police_car/scene.gltf',
                             position: [14, -1, -80],
                             scale:    [3, 3, 3],
                             rotation: [0, Math.PI/2, 0]
                           },
     lowpolyPoliceVan:     { url: 'src/vehicles/police/low_poly_police_van/scene.gltf',
                             position: [-14, 0, -80],
                             scale:    [0.3, 0.3, 0.3],
                             rotation: [0, Math.PI, 0],

                             carInfo: {
                              mass: 1000,    // Kg
                              maxSpeed: 100, // Km/h
                              boxSizeXFactor: 0.5,
                              boxSizeYFactor: 0.5,
                              carName: "Low Poly Police Van"
                            };
                            wheelsNames: ["Empty_1", "Empty001_3", "Empty002_5", "Empty003_7"]
                           },
     lowpolySheriff:       { url: 'src/vehicles/police/low_poly_sheriff/scene.gltf',
                             position: [14, 0, -110],
                             scale:    [3, 3, 3],
                             rotation: [0, Math.PI, 0],

                             carInfo: {
                              mass: 1000,    // Kg
                              maxSpeed: 100, // Km/h
                              boxSizeXFactor: 0.5,
                              boxSizeYFactor: 0.5,
                              carName: "Low Poly Sheriff"
                             };
                             wheelsNames: ["YukonWheelFtL", "YukonWheelFtR", "YukonWheelBkL", "YukonWheelBkR"]
                           },*/

      // Characters
      /*nathan:             { url: 'src/characters/nathan/scene.gltf',
                            position: [-4, 1, 0],
                            scale:    [0.025, 0.025, 0.025],
                            rotation: [0, Math.PI, 0],

                            modelInfo: {
                              mass: 80,     // Kg
                              maxSpeed: 45, // Km/h
                              boxSizeXFactor: 0.2, // To be verified
                              boxSizeYFactor: 0.02,
                              characterName: "Nathan"
                            },
                            componentsNames: ["rp_nathan_animated_003_walking_head_07"]
                            // TODO when hierarchical structure is defined
                          }//,*/
    };

    // Selectable Environments
    const environments = {
      CITY:    0,
      HIGHWAY: 1,
      COUNTRY: 2,
      FOREST:  3
    };

    let playerModel, policeCar;
    let lanexUp, lanexDown;

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

    const scoreElem   = document.getElementById("score");
    const speedometer = document.getElementById("speedometer");

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

        // TEMP skip this model
        if (model == staticModels.sidewalkCorner)
          continue;

        // Create several clones of the sidewalk model
        else if (model == staticModels.sidewalkStraight) {
          const n = 50, nHalf = 25, dist = 25.3;

          for (let i=0; i<n; i+=1) {
            const clone = modelScene.clone();

            let posX = model.position[0], posZ = 0 - (dist * i), rad = model.rotation[1];

            if (i >= nHalf) {
              posX = -posX;
              posZ = dist - (dist * (i - nHalf));
              rad = Math.PI;
            }

            const modelClone = {
              clone:    clone,
              position: [posX, 0, posZ],
              scale:    [1, 1, 1],
              rotation: [0, rad, 0],
            };

            //console.log("posX: " + posX + " posZ: " + posZ + " rad: " + rad);

            scene.add(clone);
            addStaticModel(modelClone);
          }

          continue;
        }

        scene.add(modelScene);
        addStaticModel(model);
      }
    }

    const inputManager = new InputManager();
    const game         = new Game(inputManager, "easy", physicsWorld);
    const player       = new Player(game);

    // Start the game
    function start() {
      // Show score & speedometer
      scoreElem.style.display   = 'inherit';
      speedometer.style.display = 'inherit';

      // Add dynamic models to the scene
      for (const model of Object.values(dynamicModels)) {
        const modelScene = model.gltf.scene;
        scene.add(modelScene);
        //console.log(Utils.dumpObject(modelScene).join('\n'));

        switch (model) {
          // Cars
          case dynamicModels.policeCar:
            //addPoliceCar(modelScene);
            addPoliceCar(model);
            break;

          // Selectable cars
          case dynamicModels.bmwI8:
          case dynamicModels.lamborghini:
          case dynamicModels.tesla:

          // Non-Selectable cars
          //case dynamicModels.americanMuscleCar:
          case dynamicModels.audiR8:
          case dynamicModels.bmwE30:
          case dynamicModels.camper1:
          case dynamicModels.camper2:
          //case dynamicModels.chevroletCruze:
          //case dynamicModels.chevroletImpala:
          case dynamicModels.ferrari458:
          case dynamicModels.fiat500:
          case dynamicModels.fordCrownVictoria:
          case dynamicModels.fordFoxSedan:
          case dynamicModels.fordRangerRaptor:
          case dynamicModels.fordTorino:
          case dynamicModels.deliveryVan:
          case dynamicModels.derbyCar:
          case dynamicModels.dodgeViper:
          case dynamicModels.gmcSierra:
          case dynamicModels.hyundaiBus:
          case dynamicModels.ladavaz:
          case dynamicModels.lamborghiniDiablo:
          //case dynamicModels.lotus:
          case dynamicModels.mercedes:
          //case dynamicModels.militaryTruck:
          case dynamicModels.militaryTruck2:
          case dynamicModels.mustang:
          case dynamicModels.nissanDatsun:
          case dynamicModels.nissanGT:
          case dynamicModels.nissanSilvia:
          case dynamicModels.pontiac:
          case dynamicModels.rangeRover:
          case dynamicModels.taxi:
          case dynamicModels.teslaCybertruck:
          case dynamicModels.toyota:
          case dynamicModels.truck:
          case dynamicModels.zis101:
          case dynamicModels.zuk:
            addCarModel(model);
            break;

          // Characters
          case dynamicModels.nathan:
            addCharacter(model);
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

    // TODO: set this variables according to user choices in the menu
    let environment = environments.CITY;
    //let environment = environments.COUNTRY;
    //let environment = environments.HIGHWAY;
    let selectedModel = dynamicModels.lamborghini;
    //let selectedModel = dynamicModels.nathan;

    // Infinite terrain with a texture
    if (environment == environments.CITY) {
      // City environment
      let texInfo = {
        //repeat: { x: 30, y: 3000 },
        repeat: { x: 300, y: 4000 },
        size:   { x: 1000, y: 100000 },
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: -Math.PI/2, y: 0, z: 0 }
      };

      setEnvironment("../src/textures/street_blank.jpg", texInfo);

      texInfo = {
        repeat: { x: 2, y: 4000 },
        size:   { x: 50, y: 100000 },
        position: { x: 0, y: 0.1, z: 0 },
        rotation: { x: -Math.PI/2, y: 0, z: 0 }
      };

      setEnvironment("../src/textures/street_texture.jpg", texInfo, false);

      lanexUp   = [6, 14];
      lanexDown = [-14, -6];
    }
    else if (environment == environments.COUNTRY) {
      // Country - desert environment
      let texInfo = {
        repeat: { x: 17, y: 170 },
        size:   { x: 1000, y: 10000 },
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: -Math.PI/2, y: 0, z: 0 }
      };

      setEnvironment("../src/textures/desert_texture.jpg", texInfo);

      texInfo = {
        repeat: { x: 1, y: 3000 },
        size:   { x: 45, y: 100000 },
        position: { x: 0, y: 0.1, z: 0 },
        rotation: { x: -Math.PI/2, y: 0, z: 0 }
      };

      setEnvironment("../src/textures/road66.jpg", texInfo, false);

      lanexUp   = [5];
      lanexDown = [-5];
    }
    else if (environment == environments.HIGHWAY) {
      // Highway environment
      let texInfo = {
        repeat: { x: 30, y: 3000 },
        size:   { x: 1000, y: 100000 },
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: -Math.PI/2, y: 0, z: 0 }
      };

      setEnvironment("../src/textures/terrain_texture.jpg", texInfo);

      texInfo = {
        repeat: { x: 3000, y: 3 },
        size:   { x: 100000, y: 100},
        position: { x: 0, y: 0.1, z: 0 },
        rotation: { x: -Math.PI/2, y: 0, z: Math.PI/2 }
      };

      setEnvironment("../src/textures/highway_texture.jpg", texInfo, false);

      lanexUp   = [4, 11, 16];
      lanexDown = [-16, -11, -4];
    }
    else {
      // Walker environment
      let texInfo = {
        repeat: { x: 1, y: 300 },
        size:   { x: 30, y: 3000 },
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: -Math.PI / 2, y: 0, z: 0 }
      };

      setEnvironment("../src/textures/forest.jpg", texInfo);
    }

    function setEnvironment(texFilename, texInfo, physics=true) {
      if (!texFilename || !texInfo)   return;

      const tex = new THREE.TextureLoader().load(texFilename);
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      tex.repeat.set(texInfo.repeat.x, texInfo.repeat.y);
      tex.wrapT = THREE.RepeatWrapping;
      tex.wrapS = THREE.RepeatWrapping;

      const geo = new THREE.PlaneBufferGeometry(texInfo.size.x, texInfo.size.y);
      const mat = new THREE.MeshLambertMaterial({ map: tex });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(texInfo.position.x, texInfo.position.y, texInfo.position.z);
      mesh.rotation.set(texInfo.rotation.x, texInfo.rotation.y, texInfo.rotation.z);
      scene.add(mesh);

      if (physics) {
        // Ammojs Section
        const mass = 0;

        const transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin( new Ammo.btVector3(texInfo.position.x, texInfo.position.y, texInfo.position.z) );
        transform.setRotation( new Ammo.btQuaternion(0, 0, 0, 1) );

        const motionState = new Ammo.btDefaultMotionState(transform);

        const collisionShape = new Ammo.btBoxShape( new Ammo.btVector3(texInfo.size.x, 0.01, texInfo.size.y) );

        const localInertia = new Ammo.btVector3(texInfo.position.x, texInfo.position.y, texInfo.position.z);
        collisionShape.calculateLocalInertia(mass, localInertia);

        const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, collisionShape, localInertia);
        const body = new Ammo.btRigidBody(rbInfo);
        body.setFriction(2);

        // Add rigid body and set collision masks
        physicsWorld.addRigidBody(body, 1, 1);
      }
    }

    // Road crosswalks
    if (environment == environments.CITY) {
      const tex = new THREE.TextureLoader().load("../src/textures/street_crosswalks.png");
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      tex.repeat.set(3, 1);
      tex.wrapT = THREE.RepeatWrapping;
      tex.wrapS = THREE.RepeatWrapping;
      const geo = new THREE.PlaneBufferGeometry(48, 11);
      const mat = new THREE.MeshLambertMaterial({ map: tex });

      for(let i=0; i<2; i++) {
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(0, 0.2, -23 - (276 * i)); // 276 = 23 * 12
        mesh.rotation.set(-Math.PI/2, 0, 0);
        scene.add(mesh);
      }
    }

    /*{ // Lateral limits
      // Add left limit
      const leftLimit = {
        size:     { x: 1, y: 20, z: 10000 },
        position: { x: 30, y: 0, z: 0 }
      };

      if(environment == environments.COUNTRY)       leftLimit.position.x = 20;
      else if(environment == environments.HIGHWAY)  leftLimit.position.x = 50;
      else if(environment == environments.FOREST)   leftLimit.position.x = 25;

      addLimit(leftLimit);

      // Add right limit
      leftLimit.position.x = -leftLimit.position.x;
      addLimit(leftLimit);

      function addLimit(limitInfo){
        const mass = 0;

        const transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin( new Ammo.btVector3(limitInfo.position.x, limitInfo.position.y, limitInfo.position.z) );
        transform.setRotation( new Ammo.btQuaternion(0, 0, 0, 1) );

        const motionState = new Ammo.btDefaultMotionState(transform);

        const collisionShape = new Ammo.btBoxShape( new Ammo.btVector3(limitInfo.size.x, limitInfo.size.y, limitInfo.size.z) );

        const localInertia = new Ammo.btVector3(limitInfo.position.x, limitInfo.position.y, limitInfo.position.z);
        collisionShape.calculateLocalInertia(mass, localInertia);

        const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, collisionShape, localInertia);
        const body = new Ammo.btRigidBody(rbInfo);
        body.setFriction(2);

        // Add rigid body and set collision masks
        physicsWorld.addRigidBody(body, 1, 1);
      }
    }*/

    { // Clouds
      const tex = new THREE.TextureLoader().load("../src/textures/cloud.png");
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      tex.repeat.set(1, 1);
      tex.wrapT = THREE.RepeatWrapping;
      tex.wrapS = THREE.RepeatWrapping;
      const geo = new THREE.PlaneBufferGeometry(150, 35);
      const mat = new THREE.MeshLambertMaterial({ map: tex, transparent: true });

      for(let i=0; i<5; i++) {
        const cloud = new THREE.Mesh(geo, mat);
        cloud.position.set(
          Math.random() * 1000 - 500,
          80 + Math.random() * 200,
          -Math.random() * 800 - 550
        );
        scene.add(cloud);
      }
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


    const syncList = [];
    const materialInteractive = new THREE.MeshPhongMaterial( { color:0x990000 } );

    //createVehicle(new THREE.Vector3(0, 10, -20), new THREE.Quaternion(0, 0, 0, 1));





    // Show app stats
    const stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.dom );

    let before = 0, deltaTime = 0;
    let score = 0;
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


      if (playerModel) {
        player.update(deltaTime);

        // Update speedometer
        const speed = player.getSpeed().toFixed(2);
        speedometer.innerHTML = (speed < 0 ? '(R) ' : '') + Math.abs(speed) + ' Km/h';

        // Update Score
        score += Utils.toMsecond( Math.abs(speed) ) * deltaTime;
        game.setScore(score);

        if (score < 1000)
          scoreElem.innerHTML = "Score: " + score.toFixed(2) + " m";
        else
          scoreElem.innerHTML = "Score: " + (score / 1000).toFixed(2) + " Km";

        // Update camera
        const zPosPlayer = player.getPosition().z;
        camera.position.z = zPosPlayer + 21;
        camera.lookAt(0, 5, zPosPlayer);
        camera.updateProjectionMatrix();//*/

        translateStaticModels(zPosPlayer);
        moveCars(zPosPlayer);

        if (policeCar) {
          policeCar.update(deltaTime);
        }

        //console.log("car.position.z: " + car.position.z);
        //camera.position.z -= player.getModel().getMoveSpeed() * deltaTime * 0.029;

        //updateCamera(player.get3DModel());

        //console.log("camera.position.z: " + camera.position.z);

        // Draw box containing the model (DEBUG)
        //const boxHelper = new THREE.BoxHelper(player.getModel().get3DModel(), 0x00ff00);
        //scene.add(boxHelper);

        // Draw orientation and velocity vectors (DEBUG)
        /*const orientation = player.getOrientation();

        // Normalize the direction vector (convert to vector of length 1)
        orientation.normalize();

        const pos = player.getPosition();
        if (pos) {
          const origin = new THREE.Vector3( pos.x, pos.y + 3, pos.z );
          const length = 1;
          const hex = 0xff0000;

          const arrowHelper = new THREE.ArrowHelper( orientation, origin, length, hex );
          scene.add( arrowHelper );
        }

        const velocity = player.getVelocity();

        // Normalize the direction vector (convert to vector of length 1)
        velocity.normalize();

        if (pos) {
          const origin = new THREE.Vector3( pos.x, pos.y + 6, pos.z );
          const length = 1;
          const hex = 0xffff00;

          const arrowHelper = new THREE.ArrowHelper( velocity, origin, length, hex );
          scene.add( arrowHelper );
        }//*/

      }

      inputManager.update();
      updatePhysics(deltaTime);

      //console.log("renderer.info.render.calls: " + renderer.info.render.calls);

      stats.end();
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }


    // Update physics and sync graphics
    function updatePhysics(deltaTime) {



      // For bullet raycast vehicle
      for (var i = 0; i < syncList.length; i++)
					syncList[i](deltaTime);






      // Step world
      physicsWorld.stepSimulation(deltaTime, 10);
      const rigidBodies = game.getRigidBodies();

      // Update rigid bodies
      for (let i = 0; i < rigidBodies.length; i++) {
          const model = rigidBodies[i];
          const objAmmo = model.physicsBody;
          const ms = objAmmo.getMotionState();
          if (ms) {
              ms.getWorldTransform(TRANSFORM_AUX);
              const p = TRANSFORM_AUX.getOrigin();
              const q = TRANSFORM_AUX.getRotation();
              model.get3DModel().position.set( p.x(), p.y(), p.z() );
              model.get3DModel().quaternion.set( q.x(), q.y(), q.z(), q.w() );
          }
      }

      // Check if police has caught the player
      if (!playerModel || !policeCar) return;

      physicsWorld.contactPairTest(player.getPhysicsBody(), policeCar.getPhysicsBody(), cbContactPairResult);
      if (cbContactPairResult.hasContact) {
        // TODO: game over
        console.log("GAME OVER");
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

    // Translate static models if surpassed by the player
    function translateStaticModels(zPosPlayer) {
      for (const model of Object.values(staticModels)) {
        const buildingPosition = model.gltf.scene.position;

        // Check if player surpassed the static model
        if (zPosPlayer < buildingPosition.z - 80) {
          buildingPosition.set(buildingPosition.x, buildingPosition.y, buildingPosition.z - 1400);
          model.gltf.scene.visible = false;
        }

        // Check if player is near the static model
        if (zPosPlayer - buildingPosition.z < 400)
          model.gltf.scene.visible = true;
      }
    }

    // Move cars independently (IA) but the player car
    function moveCars(zPosPlayer) {
      for (const model of Object.values(dynamicModels)) {
        if (model != playerModel) {
          const carPosition = model.gltf.scene.position,
                currentCar  = model.car;

          /*if (model == dynamicModels.policeCar) {
                            if (player.getPosition().z < -20) {
                                console.log(policeCar.getName());
                                policeCar.move(2, 2, -70, 10);
                                //model.gltf.scene.visible = false;
                            }
          }*/

          /*if(model == dynamicModels.lowpolyPoliceVan) {
              console.log(Utils.dumpObject(model.gltf.scene).join('\n'));
          }*/

          if (currentCar) {
            // Check if currentCar is near to the player and move it
            if ( Math.abs(zPosPlayer > carPosition.z - 200) || model.gltf.scene.visible == false ) {
              model.gltf.scene.visible = true;
              // TODO choose between the two: -1 move in the same way of player car, 1 viceversa
              // To be fixed, temp
              //currentCar.move(0, 0, -1, deltaTime);
              //currentCar.move(0, 0, 1, deltaTime);
              //currentCar.getPhysicsBody().setLinearVelocity( new Ammo.btVector3(0, 0, model.carInfo.maxSpeed) );
              //currentCar.getPhysicsBody().applyCentralForce( new Ammo.btVector3(0, 0, model.carInfo.maxSpeed * 10) );
            }
            // Otherwise translate it far away resetting initial orientation and picking random the lane
            else {
              if (model == dynamicModels.lowpolyVanHippie)
                var random = lanexDown[ Math.floor(Math.random() * lanexDown.length) ];
              else
                var random = lanexUp[ Math.floor(Math.random() * lanexUp.length) ];

              let ms = currentCar.getPhysicsBody().getMotionState();
              if (ms) {
                const transform = new Ammo.btTransform();
                ms.getWorldTransform(transform);
                transform.setOrigin( new Ammo.btVector3(
                  random,
                  carPosition.y,
                  carPosition.z - 500) );
                const quaternion = currentCar.getInitialQuaternion();
                transform.setRotation( new Ammo.btQuaternion(
                  quaternion.x,
                  quaternion.y,
                  quaternion.z,
                  quaternion.w) );
                ms = new Ammo.btDefaultMotionState(transform);
                currentCar.getPhysicsBody().setMotionState(ms);
              }

              model.gltf.scene.visible = false;
            }
          }
        }
      }
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

      let modelScene;
      try {
        modelScene = model.gltf.scene;
      } catch (error) {
        modelScene = model.clone;
      }

      //console.log(Utils.dumpObject(modelScene).join('\n'));

      modelScene.position.set(...model.position);
      modelScene.scale.set(...model.scale)
      modelScene.rotation.set(...model.rotation);

      modelScene.traverse(o => {
        if (o.isMesh) {
          o.castShadow    = true;
          o.receiveShadow = true;
        }
      });

      //scene.add(modelScene);
    }

    // Add a car model to the scene
    function addCarModel(model) {
      if (!model)  return;

      const modelScene = model.gltf.scene;
      //console.log(Utils.dumpObject(modelScene).join('\n'));

      modelScene.position.set(...model.position);
      modelScene.scale.set(...model.scale)
      modelScene.rotation.set(...model.rotation);

      let wheels = [],
          brakes = [];

      modelScene.traverse(o => {
        if (o.isMesh) {
          o.castShadow    = true;
          o.receiveShadow = true;
        }

        // Check if the 3D car model has references to the wheels
        if (model.wheelsNames) {
          // Reference the four wheels
          if (o.name === model.wheelsNames[0])        wheels[0] = o;
          else if (o.name === model.wheelsNames[1])   wheels[1] = o;
          else if (o.name === model.wheelsNames[2])   wheels[2] = o;
          else if (o.name === model.wheelsNames[3])   wheels[3] = o;
        }

      });

      const components = {
        wheels: model.wheelsNames ? wheels : null,
        //brakes: brakes
      };

      if (model.wheelsNames && model.wheelsNames.length == 4) {
        // Adjust front wheels orientation before to animate them (steering)
        wheels[0].rotation.z = 0;
        wheels[1].rotation.z = 0;
      }

      //scene.add(modelScene);

      if (selectedModel == model) {
        // Create the PositionalAudio object (passing in the listener)
        audioObjects.car = new THREE.PositionalAudio(listener);
        applySound(modelScene, 'src/sounds/Car acceleration.mka', audioObjects.car);

        // Create the car, store its reference and set the player model
        playerModel = new Car(modelScene, model.carInfo, game, components);
        player.setModel(playerModel);
      }
      else {
        // Create the car and store its reference
        model.car = new Car(modelScene, model.carInfo, game, components);
      }
    }

    function addPoliceCar(model) {
      if (!model)  return;

      const modelScene = model.gltf.scene;
      //console.log(Utils.dumpObject(modelScene).join('\n'));

      modelScene.position.set(...model.position);
      modelScene.scale.set(...model.scale)
      modelScene.rotation.set(...model.rotation);

      let wheels = [],
          brakes = [];

      modelScene.traverse(o => {
        if (o.isMesh) {
          o.castShadow    = true;
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

      const components = {
        wheels: wheels,
        brakes: brakes
      };

      policeCar = new PoliceCar(modelScene, model.carInfo, game, components, scene, gui);
    }

    function addBmwCar(modelScene) {
      if (!modelScene)  return;

      modelScene.position.set(...dynamicModels.bmwI8.position);
      modelScene.scale.set(...dynamicModels.bmwI8.scale)
      modelScene.rotation.set(...dynamicModels.bmwI8.rotation);

      // Create the PositionalAudio object (passing in the listener)
      audioObjects.car = new THREE.PositionalAudio(listener);
      applySound(modelScene, 'src/sounds/Car acceleration.mka', audioObjects.car);

      let wheels = [],
          brakes = [];

      modelScene.traverse(o => {
        if (o.isMesh) {
          o.castShadow    = true;
          o.receiveShadow = true;
        }

        // Reference the four wheels
        if (o.name === 'wheel020')        wheels[0] = o;
        else if (o.name === 'wheel028')   wheels[1] = o;
        else if (o.name === 'wheel012')   wheels[2] = o;
        else if (o.name === 'wheel004')   wheels[3] = o;

        // Z axis for front wheels when the car turns
        // X axis for front wheels forward movement
      });

      // Adjust front wheels orientation before to animate them
      wheels[0].rotation.z = 0;
      wheels[1].rotation.z = 0;

      //updateCamera(modelScene);

      const carInfo = {
        mass: 1920,    // Kg
        maxSpeed: 250, // Km/h
        boxSizeXFactor: 0.5,
        boxSizeYFactor: 0.52,
        carName: "Bmw i8"
      };

      const components = {
        wheels: wheels,
        brakes: brakes
      };

      selectedModel == cars.BMWI8 ? car = new Car(modelScene, carInfo, game, components) :
                                  new Car(modelScene, carInfo, game, components);
      player.setModel(car);
    }

    function addTeslaCar(modelScene) {
      if (!modelScene)  return;

      modelScene.position.set(...dynamicModels.tesla.position);
      modelScene.scale.set(...dynamicModels.tesla.scale)
      modelScene.rotation.set(...dynamicModels.tesla.rotation);

      // Create the PositionalAudio object (passing in the listener)
      audioObjects.car = new THREE.PositionalAudio(listener);
      applySound(modelScene, 'src/sounds/Car acceleration.mka', audioObjects.car);

      let wheels = [],
          brakes = [];

      modelScene.traverse(o => {
        if (o.isMesh) {
          o.castShadow    = true;
          o.receiveShadow = true;
        }

        // Reference the four wheels
        if (o.name === 'wheel')           wheels[0] = o;
        else if (o.name === 'wheel001')   wheels[1] = o;
        else if (o.name === 'wheel003')   wheels[2] = o;
        else if (o.name === 'wheel002')   wheels[3] = o;
      });

      // Adjust front wheels orientation before to animate them
      wheels[0].rotation.z = 0;
      wheels[1].rotation.z = 0;
      wheels[1].rotation.y = Math.PI;

      //updateCamera(modelScene);

      const carInfo = {
        mass: 2316,    // Kg
        maxSpeed: 261, // Km/h
        boxSizeXFactor: 0.5,
        boxSizeYFactor: 0.11,
        carName: "Tesla Model S"
      };

      const components = {
        wheels: wheels,
        brakes: brakes
      };

      selectedModel == cars.TESLA ? car = new Car(modelScene, carInfo, game, components) :
                                  new Car(modelScene, carInfo, game, components);
      player.setModel(car);
    }

    function addLamborghiniCar(modelScene) {
      if (!modelScene)  return;

      modelScene.position.set(...dynamicModels.lamborghini.position);
      modelScene.scale.set(...dynamicModels.lamborghini.scale)
      modelScene.rotation.set(...dynamicModels.lamborghini.rotation);

      // Create the PositionalAudio object (passing in the listener)
      audioObjects.car = new THREE.PositionalAudio(listener);
      applySound(modelScene, 'src/sounds/Car acceleration.mka', audioObjects.car);

      let wheels = [],
          brakes = [];

      modelScene.traverse(o => {
        if (o.isMesh) {
          o.castShadow    = true;
          o.receiveShadow = true;
        }

        // Reference the four wheels
        if (o.name === 'wheel001')        wheels[0] = o;
        else if (o.name === 'wheel002')   wheels[1] = o;
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
        boxSizeXFactor: 0.5,
        boxSizeYFactor: 0.56,
        carName: "Lamborghini Aventador S"
      };

      const components = {
        wheels: wheels,
        brakes: brakes
      };

      selectedModel == cars.LAMBORGHINI ? car = new Car(modelScene, carInfo, game, components) :
                                        new Car(modelScene, carInfo, game, components);
      player.setModel(car);
    }


    function addCharacter(model) {
      if (!model)  return;

      const modelScene = model.gltf.scene;
      //console.log(Utils.dumpObject(modelScene).join('\n'));

      modelScene.position.set(...model.position);
      modelScene.scale.set(...model.scale)
      modelScene.rotation.set(...model.rotation);

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
          o.castShadow    = true;
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

      if (selectedModel == model) {
        playerModel = new Character(modelScene, model.modelInfo, game, components);
        player.setModel(playerModel);
      }
      else {
        new Character(modelScene, modelInfo, game, components);
      }

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
