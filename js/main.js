import * as THREE        from "https://unpkg.com/three@0.118.3/build/three.module.js";
import { GLTFLoader }    from "https://unpkg.com/three@0.118.3/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://unpkg.com/three@0.118.3/examples/jsm/controls/OrbitControls.js";
import { GUI }           from "https://unpkg.com/three@0.118.3/examples/jsm/libs/dat.gui.module.js";
import Stats             from "https://unpkg.com/three@0.118.3/examples/jsm/libs/stats.module.js";

import { Utils }        from "./Utils.js";
import { InputManager } from "./InputManager.js";
import { Game }         from "./Game.js";
import { Player }       from "./Player.js";
import { Police }       from "./Police.js";
import { Model }        from "./Model.js";
import { Car }          from "./Car.js";
import { PoliceCar }    from "./PoliceCar.js";
import { Character }    from "./Character.js";

"use strict"

window.onload = function main() {
    let physicsWorld,
        TRANSFORM_AUX,
        cbContactPairResult;

    // Ammojs Initialization
    Ammo().then(function () {
        setupPhysicsWorld();
        setupGraphics();
    });

    function setupPhysicsWorld() {
        let collisionConfiguration = new Ammo.btDefaultCollisionConfiguration(),
            dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration),
            overlappingPairCache   = new Ammo.btDbvtBroadphase(),
            solver                 = new Ammo.btSequentialImpulseConstraintSolver();

        physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
        physicsWorld.setGravity(new Ammo.btVector3(0, -9.82, 0));

        TRANSFORM_AUX = new Ammo.btTransform();
        setupContactPairResultCallback();


        function setupContactPairResultCallback() {
            cbContactPairResult = new Ammo.ConcreteContactResultCallback();
            cbContactPairResult.hasContact = false;

            cbContactPairResult.addSingleResult = function (cp, colObj0Wrap, partId0, index0, colObj1Wrap, partId1, index1) {
                const contactPoint = Ammo.wrapPointer(cp, Ammo.btManifoldPoint);
                const distance = contactPoint.getDistance();

                if (distance > 0) return;

                this.hasContact = true;
            }
        }
    }

    function setupGraphics() {
        const canvas = document.getElementById('canvas');
        const gl = canvas.getContext("webgl2");
        if (!gl) alert("WebGL 2.0 isn't available");

        // Disable antialias if high pixel density screen
        const aa = window.devicePixelRatio > 1 ? false : true;
        // Adjust pixel ratio for retina screen
        const pixelRatio = Math.min(0.7, window.devicePixelRatio);

        const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: aa, powerPreference: "high-performance" });
        renderer.setClearColor(0xBEF4FF);
        renderer.shadowMap.enabled = true;
        renderer.setPixelRatio(pixelRatio);

        // Init scene and camera
        const scene = new THREE.Scene(),
            fov = 75,
            aspect = window.innerWidth / window.innerHeight, //2;  // the canvas default
            near = 1,    // Greater values, best performance
            far = 2000,  // Less values, best performance
            camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.set(0, 10, 8);
        camera.lookAt(0, 5, 0);
        camera.updateProjectionMatrix();

        // DISABLE WHEN GAME IS READY
        // Controls for zooming and moving around the scene
        const controls = new OrbitControls(camera, canvas);
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
            Mute: false
        };

        // Create GUI for audio controls
        const audioGUI = gui.addFolder('Audio');
        audioGUI.add(options, 'Volume', 0, 30).onChange(updateVolume);
        audioGUI.add(options, 'Mute', true, false).onChange(updateMute);

        function updateVolume(value) {
            for (const audio of Object.values(audioObjects))
                audio.setVolume(value);
        }

        function updateMute(value) {
            for (const audio of Object.values(audioObjects))
                value ? audio.pause() : audio.play();
        }

        // Static 3D models
        const staticModelsCity = {
            abandonedBuilding: {
                url: 'src/environment/city/buildings/abandoned_building/scene.gltf',
                //position: [80, 0, -45],
                position: [80, 0, -130],
                scale: [15, 15, 15],
                rotation: [0, 0, 0],
            },

            apartment2: {
                url: 'src/environment/city/buildings/apartment_2/scene.gltf',
                //position: [-50, 0, -60],
                position: [-52, 0, -110],
                scale: [0.05, 0.05, 0.05],
                rotation: [0, Math.PI / 2, 0],
            },

            apartment5: {
                url: 'src/environment/city/buildings/apartment_5/scene.gltf',
                //position: [-250, 1, -40],
                position: [-80, 1, -1250],
                scale: [0.015, 0.015, 0.015],
                rotation: [0, Math.PI / 2, 0],
            },

            building1: {
                url: 'src/environment/city/buildings/building_1/scene.gltf',
                //position: [-45, 11, -10],
                position: [-52, 11, -50],
                scale: [0.05, 0.05, 0.05],
                rotation: [0, 0, 0],
            },

            cottonClub: {
                url: 'src/environment/city/buildings/cotton_club/scene.gltf',
                //position: [-30, 0, -400],
                position: [-40, 0, -520],
                scale: [0.04, 0.04, 0.04],
                rotation: [0, Math.PI / 2, 0],
            },

            officePorsche: {
                url: 'src/environment/city/buildings/office_2/scene.gltf',
                //position: [40, 0, -260],
                position: [30, 0, -700],
                scale: [0.055, 0.055, 0.055],
                rotation: [0, -Math.PI / 1.645, 0],
            },

            boulangerie: {
                url: 'src/environment/city/buildings/boulangerie_de_lopera/scene.gltf',
                //position: [35, -1, 150],
                position: [-40, -1, -350],
                scale: [0.03, 0.03, 0.03],
                rotation: [0, Math.PI / 2, 0],
            },

            laCantine: {
                url: 'src/environment/city/buildings/la_cantine/scene.gltf',
                //position: [35, -1, 180],
                position: [38, -1, -350],
                scale: [0.03, 0.03, 0.03],
                rotation: [0, -Math.PI / 2, 0],
            },

            metzoCoffeeBar: {
                url: 'src/environment/city/buildings/metzo_coffee_bar/scene.gltf',
                //position: [35, -1, 350],
                position: [35, -1, -400],
                scale: [4, 4, 4],
                rotation: [0, -Math.PI / 2, 0],
            },

            pizzeria: {
                url: 'src/environment/city/buildings/pizzeria/scene.gltf',
                //position: [35, 0, 390],
                position: [-45, 0, -400],
                scale: [6, 6, 6],
                rotation: [0, Math.PI / 2, 0],
            },

            starbucks: {
                url: 'src/environment/city/buildings/starbucks_coffee/scene.gltf',
                //position: [35, -1, 210],
                position: [-35, -1, -450],
                scale: [0.03, 0.03, 0.03],
                rotation: [0, Math.PI / 2, 0],
            },

            stadium1: {
                url: 'src/environment/city/buildings/stadium1/scene.gltf',
                //position: [200, -4, -450],
                position: [-130, -4, -1050],
                scale: [0.02, 0.02, 0.02],
                rotation: [0, Math.PI / 3, 0],
            },

            stadium2: {
                url: 'src/environment/city/buildings/stadium2/scene.gltf',
                //position: [90, 1, 600],
                position: [50, 1, -1050],
                scale: [0.7, 0.7, 0.7],
                rotation: [0, -Math.PI / 2, 0],
            },

            // Road elements
            barTable: {
                url: 'src/environment/city/road/bar_table/scene.gltf',
                position: [-29, 2, -410],
                scale: [0.08, 0.08, 0.08],
                rotation: [0, 0, 0],
            },

            bench: {
                url: 'src/environment/city/road/bench/scene.gltf',
                //position: [-29, 1.6, -7],
                position: [-35, 1.6, -170],
                scale: [3.5, 3.5, 3.5],
                rotation: [0, Math.PI / 2, 0],
            },

            dumpster: {
                url: 'src/environment/city/road/dumpster/scene.gltf',
                //position: [45, 1.8, 20],
                position: [38, 1.8, -450],
                scale: [5.3, 5.3, 5.3],
                rotation: [0, 0, 0],
            },

            menuSign: {
                url: 'src/environment/city/road/menu_sign/scene.gltf',
                //position: [31, 2, 5],
                position: [31, 2, -390],
                scale: [0.015, 0.015, 0.015],
                rotation: [0, Math.PI / 2, 0],
            },

            simpleMetalFence: {
                url: 'src/environment/city/road/simple_metal_fence/scene.gltf',
                //position: [-25, 1.3, 5],
                position: [-30, 1.3, -1050],
                scale: [0.25, 0.25, 0.25],
                rotation: [0, 0, 0],
            },

            speedSign30: {
                url: 'src/environment/city/road/speed_sign_30/scene.gltf',
                //position: [25, 0, -12],
                position: [25, 0, -300],
                scale: [0.035, 0.035, 0.035],
                rotation: [0, 0, 0],
            },

            speedSign40: {
                url: 'src/environment/city/road/speed_sign_40/scene.gltf',
                //position: [25, 3.3, -8],
                position: [25, 3.3, -500],
                scale: [4.5, 4.5, 4.5],
                rotation: [0, 0, 0],
            },

            stopSign: {
                url: 'src/environment/city/road/stop_sign/scene.gltf',
                //position: [25, 0, -20],
                position: [25, 0, -15],
                scale: [4.3, 4.3, 4.3],
                rotation: [0, Math.PI, 0],
            },

            trafficLight: {
                url: 'src/environment/city/road/traffic_light/scene.gltf',
                //position: [25, 0, -25],
                position: [25, 0, -1000],
                scale: [0.15, 0.15, 0.15],
                rotation: [0, 0, 0],
            },

            trashCan3: {
                url: 'src/environment/city/road/trash_can_3/scene.gltf',
                //position: [-29, 1.6, -10],
                position: [-35, 1.6, -180],
                scale: [2, 2, 2],
                rotation: [0, 0, 0],
            },

            tree: {
                url: 'src/environment/city/road/tree/scene.gltf',
                //position: [30, 0, -30],
                position: [30, 0, -55],
                scale: [0.03, 0.03, 0.03],
                rotation: [0, 0, 0],
            },

            sidewalks1: {
                url: 'src/environment/city/road/sidewalks/scene.gltf',
                position: [0, 0, 0],
                scale: [1, 1, 1],
                rotation: [0, 0, 0],
            },

            sidewalks2: {
                url: 'src/environment/city/road/sidewalks/scene.gltf',
                position: [0, 0, -630],
                scale: [1, 1, 1],
                rotation: [0, 0, 0],
            }
        };

        const staticModelsCountry = {
            abandonedShop: {
                url: 'src/environment/country - desert/buildings/abandoned_shopmall/scene.gltf',
                //position: [-60, 0, -200],
                position: [-40, 0, -300],
                scale: [0.03, 0.03, 0.03],
                rotation: [0, 0, 0],
            },

            abandonedStores: {
                url: 'src/environment/country - desert/buildings/wasteland_stores/scene.gltf',
                //position: [-50, 0, -170],
                position: [-40, 0, -400],
                scale: [0.1, 0.1, 0.1],
                rotation: [0, Math.PI / 2, 0],
            },

            cinema: {
                url: 'src/environment/country - desert/buildings/cinema/scene.gltf',
                //position: [40, 0, -110],
                position: [40, 0, -400],
                scale: [0.02, 0.02, 0.02],
                rotation: [0, Math.PI / 2, 0],
            },

            motelOld: {
                url: 'src/environment/country - desert/buildings/motel_old/scene.gltf',
                //position: [50, 0.4, -20],
                position: [50, 0.4, -500],
                scale: [1.8, 1.8, 1.8],
                rotation: [0, 0, 0],
            },

            oldWoodenHouse: {
                url: 'src/environment/country - desert/buildings/old_wooden_house/scene.gltf',
                //position: [-50, 0, 120],
                position: [-40, 0, -60],
                scale: [0.2, 0.2, 0.2],
                rotation: [0, Math.PI, 0],
            },

            westernHouse: {
                url: 'src/environment/country - desert/buildings/western_house/scene.gltf',
                //position: [50, 0, 200],
                position: [35, 0, -40],
                scale: [0.03, 0.03, 0.03],
                rotation: [0, -Math.PI / 2, 0],
            },

            // Road elements
            bushGroup: {
                url: 'src/environment/country - desert/road/bush_group/scene.gltf',
                //position: [0, 0, -40],
                position: [-35, 0, -550],
                scale: [0.065, 0.065, 0.065],
                rotation: [0, 0, 0],
            },

            busStop: {
                url: 'src/environment/country - desert/road/bus_stop/scene.gltf',
                //position: [-30, 4, -20],
                position: [-30, 4, -470],
                scale: [10, 10, 10],
                rotation: [0, 0, 0],
            },

            rustyCar2: {
                url: 'src/environment/country - desert/road/old_rusty_car_2/scene.gltf',
                //position: [10, 0, -45],
                position: [-30, 0, -90],
                scale: [0.05, 0.05, 0.05],
                rotation: [0, 0, 0],
            },

            tumbleweed2: {
                url: 'src/environment/country - desert/road/tumbleweed_2/scene.gltf',
                //position: [10, 0.2, 0],
                position: [30, 0.2, -220],
                scale: [1.5, 1.5, 1.5],
                rotation: [0, 0, 0],
            }
        };

        const staticModelsHighway = {
            billboard: {
                url: 'src/environment/highway/road/billboard/scene.gltf',
                position: [65, 0, -90],
                scale: [0.15, 0.15, 0.15],
                rotation: [0, 0, 0]
            },

            highwayFenceSx: {
                url: 'src/environment/highway/road/highway_fence/scene.gltf',
                //position: [-30, 1.6, -10],
                position: [-45, 1.6, 0],
                //scale:    [1.5, 1.5, 1.5],
                scale: [3, 3, 500],
                rotation: [0, 0, 0]
            },

            highwayFenceDx: {
                url: 'src/environment/highway/road/highway_fence/scene.gltf',
                position: [45, 1.6, 0],
                scale: [3, 3, 500],
                rotation: [0, 0, 0]
            },

            highwayFenceSx2: {
                url: 'src/environment/highway/road/highway_fence/scene.gltf',
                //position: [-30, 1.6, -10],
                position: [-45, 1.6, -500],
                //scale:    [1.5, 1.5, 1.5],
                scale: [3, 3, 500],
                rotation: [0, 0, 0]
            },

            highwayFenceDx2: {
                url: 'src/environment/highway/road/highway_fence/scene.gltf',
                position: [45, 1.6, -500],
                scale: [3, 3, 500],
                rotation: [0, 0, 0]
            },

            jerseyGroup: {
                url: 'src/environment/highway/road/jersey_barrier_group/scene.gltf',
                position: [0, 1.8, -250],
                scale: [1, 1, 1],
                rotation: [0, 0, 0],

                modelInfo: {
                    mass: 0, // Kg
                    boxSizeXFactor: 0.6,
                    boxSizeYFactor: 0.5,
                    boxSizeZFactor: 0.5,
                }
            },

            jerseyGroup2: {
                url: 'src/environment/highway/road/jersey_barrier_group/scene.gltf',
                position: [0, 1.8, -1200],
                scale: [1, 1, 1],
                rotation: [0, 0, 0],

                modelInfo: {
                    mass: 0, // Kg
                    boxSizeXFactor: 0.6,
                    boxSizeYFactor: 0.5,
                    boxSizeZFactor: 0.5
                }
            }
        };

        /*const staticModelsForest = {
            lowpolyAbete: {
                url: 'src/environment/forest/low_poly_abete/scene.gltf',
                position: [-20, 0, -80],
                scale: [0.035, 0.035, 0.035],
                rotation: [0, 0, 0],

                modelInfo: {
                    mass: 100000,    // Kg
                    boxSizeXFactor: 0.5,
                    boxSizeYFactor: 0.1,
                    boxSizeZFactor: 0.15,
                },
            },

            lowpolyTree: {
                url: 'src/environment/forest/low_poly_tree/scene.gltf',
                position: [5, 0, -160],
                scale: [6, 6, 6],
                rotation: [0, 0, 0],

                modelInfo: {
                    mass: 100000,    // Kg
                    boxSizeXFactor: 0.5,
                    boxSizeYFactor: 0.05,
                    boxSizeZFactor: 0.65,
                },
            },

            lowpolyTrunkBench: {
                url: 'src/environment/forest/low_poly_trunk_bench/scene.gltf',
                position: [9, 0, -50],
                scale: [0.15, 0.15, 0.15],
                rotation: [0, Math.PI / 2, 0],

                modelInfo: {
                    mass: 100000,    // Kg
                    boxSizeXFactor: 0.7,
                    boxSizeYFactor: 0.05,
                    boxSizeZFactor: 0.65,
                },
            },

            duneBranch: {
                url: 'src/environment/forest/dune_branch/scene.gltf',
                position: [0, 1, -10],
                scale: [7, 7, 7],
                rotation: [0, 0, 0],


                modelInfo: {
                    mass: 100000,    // Kg
                    boxSizeXFactor: 0.7,
                    boxSizeYFactor: 0.05,
                    boxSizeZFactor: 0.65,
                },
            },

            tree: {
                url: 'src/environment/city/road/tree/scene.gltf',
                position: [40, 0, -170],
                scale: [0.02, 0.02, 0.02],
                rotation: [0, Math.PI / 2, 0],

                modelInfo: {
                    mass: 100000,    // Kg
                    boxSizeXFactor: 0.7,
                    boxSizeYFactor: 0.05,
                    boxSizeZFactor: 0.65,
                },
            },

            pineTree: {
                url: 'src/environment/city/road/pine_tree/scene.gltf',
                position: [-40, 0, -100],
                scale: [0.02, 0.02, 0.02],
                rotation: [0, Math.PI / 2, 0],

                modelInfo: {
                    mass: 100000,    // Kg
                    boxSizeXFactor: 0.7,
                    boxSizeYFactor: 0.05,
                    boxSizeZFactor: 0.65,
                },
            }
        };*/

        let dynamicModels = {
            chevroletSheriff: {
                url: 'src/vehicles/police/chevrolet_suburban_sheriff/scene.gltf',
                //position: [-10, 0, 25],
                position: [10, 0.3, 25],
                scale: [2.4, 2.4, 2.4],
                rotation: [0, Math.PI, 0],

                carInfo: {
                    mass: 2634,    // Kg
                    maxSpeed: 450, //174, // Km/h
                    boxSizeXFactor: 0.6,
                    boxSizeYFactor: 0.04,
                    boxSizeZFactor: 0.6,
                    carName: "Chevrolet Suburban Sheriff",
                    engineForce: 40000
                },
                wheelsNames: ["DEF-WheelFtL_Car_Rig", "DEF-WheelFtR_Car_Rig",
                    "DEF-WheelBkL_Car_Rig", "DEF-WheelBkR_Car_Rig"],
                roofLightsNames: ["Cylinder", "Cylinder001", "Cylinder006", "Cylinder007",
                    "Cylinder008", "Cylinder009", "Cylinder010", "Cylinder011"]
            },

            bmwI8: {
                url: 'src/vehicles/cars/bmw_i8/scene.gltf',
                //position: [0, 1.5, 0],
                position: [10, 1.5, 0],
                scale: [0.027, 0.025, 0.027],
                rotation: [0, Math.PI, 0],

                carInfo: {
                    mass: 1920,    // Kg
                    maxSpeed: 450, // Km/h
                    boxSizeXFactor: 0.4,
                    boxSizeYFactor: 0.5,
                    boxSizeZFactor: 0.4,
                    carName: "Bmw i8",
                    engineForce: 40000,
                    leftBalance: -0.01,
                    rightBalance: 0.01
                },
                wheelsNames: ["wheel020", "wheel028", "wheel012", "wheel004"]
            },

            lamborghini: {
                url: 'src/vehicles/cars/lamborghini_aventador_j/scene.gltf',
                //position: [-10, 1.73, 0],
                position: [10, 1.73, 0],
                scale: [0.013, 0.013, 0.013],
                rotation: [0, Math.PI, 0],

                carInfo: {
                    mass: 1625,    // Kg
                    maxSpeed: 450, // Km/h
                    boxSizeXFactor: 0.4,
                    boxSizeYFactor: 0.6,
                    boxSizeZFactor: 0.3,
                    carName: "Lamborghini Aventador S",
                    engineForce: 25000,
                    leftBalance: -0.025,
                    rightBalance: 0
                },
                wheelsNames: ["wheel001", "wheel002", "wheel003", "wheel005"]
            },

            tesla: {
                url: 'src/vehicles/cars/tesla_model_s/scene.gltf',
                position: [10, 0.35, 0],
                scale: [0.026, 0.024, 0.026],
                rotation: [0, Math.PI, 0],

                carInfo: {
                    mass: 2316,    // Kg
                    maxSpeed: 450, // Km/h
                    boxSizeXFactor: 0.5,
                    boxSizeYFactor: 0.5,
                    boxSizeZFactor: 0.4,
                    carName: "Tesla Model S",
                    engineForce: 40000,
                    leftBalance: -0.0075,
                    rightBalance: -0.0075
                },
                wheelsNames: ["wheel", "wheel001", "wheel003", "wheel002"]
            },

            audiR8: {
                url: 'src/vehicles/cars/audi_r8/scene.gltf',
                //position: [20, 0.5, 0],
                position: [10, 0.5, 0],
                scale: [0.026, 0.025, 0.026],
                rotation: [0, 0, 0],

                carInfo: {
                    mass: 1700,    // Kg
                    maxSpeed: 450, // Km/h
                    boxSizeXFactor: 0.5,
                    boxSizeYFactor: 0.4,
                    boxSizeZFactor: 0.4,
                    carName: "Audi R8",
                    engineForce: 26500,
                    leftBalance: -0.0075,
                    rightBalance: -0.0075
                },
                wheelsNames: ["object008", "object031", "object035", "object034"]
            }

        };

        const dynamicModelsCity = {
            dodgeViper: {
                url: 'src/vehicles/cars/srt_viper_gts_2013/scene.gltf',
                position: [10, 1, -20],
                scale: [2.5, 2.5, 2.5],
                rotation: [0, 0, 0],

                carInfo: {
                    mass: 1556,    // Kg
                    maxSpeed: 331, // Km/h
                    boxSizeXFactor: 0.9,
                    boxSizeYFactor: 0.5,
                    boxSizeZFactor: 0.7,
                    carName: "Dodge Viper GTS"
                },
                wheelsNames: ["Circle001", "Circle002", "Circle", "Circle003"]
            },

            nissanGT: {
                url: 'src/vehicles/cars/nissan_gt/scene.gltf',
                position: [-40, 0.2, -20],
                scale: [0.025, 0.025, 0.025],
                rotation: [0, 0, 0],

                carInfo: {
                    mass: 1740,    // Kg
                    maxSpeed: 333, // Km/h
                    boxSizeXFactor: 0.8,
                    boxSizeYFactor: 0.3,
                    boxSizeZFactor: 0.55,
                    carName: "Nissan GT"
                },
                wheelsNames: ["wheel", "wheel001", "wheel003", "wheel002"]
            },

            rangeRover: {
                url: 'src/vehicles/cars/range_rover_evoque/scene.gltf',
                position: [-6, 1.3, -50],
                scale: [5.15, 5.15, 5.15],
                rotation: [0, 0, 0],

                carInfo: {
                    mass: 1787,    // Kg
                    maxSpeed: 201, // Km/h
                    boxSizeXFactor: 0.85,
                    boxSizeYFactor: 0.3,
                    boxSizeZFactor: 0.7,
                    carName: "Range Rover Evoque"
                },
                wheelsNames: ["wheel", "wheel001", "wheel002", "wheel003"]
            }
        };

        const dynamicModelsHighway = {

            lowpolyCar: {
                url: 'src/vehicles/cars/low_poly_car/scene.gltf',
                position: [-10, 0, -50],
                scale: [2.5, 2.5, 2.5],
                rotation: [0, 0, 0],

                carInfo: {
                    mass: 1000,    // Kg
                    maxSpeed: 100, // Km/h
                    boxSizeXFactor: 0.5,
                    boxSizeYFactor: 0.5,
                    boxSizeZFactor: 0.5,
                    carName: "Low Poly Car Yellow"
                },
                wheelsNames: ["FRWheel", "RRWheel", "FLWheel", "RLWheel"]
            },

            lowpolyTaxiOldStyle: {
                url: 'src/vehicles/cars/low_poly_taxi_old_style/scene.gltf',
                position: [14, 0, -150],
                scale: [0.015, 0.015, 0.015],
                rotation: [0, Math.PI, 0],

                carInfo: {
                    mass: 1000,    // Kg
                    maxSpeed: 100, // Km/h
                    boxSizeXFactor: 0.8,
                    boxSizeYFactor: 0.5,
                    boxSizeZFactor: 0.37,
                    carName: "Low Poly Taxi Old Style"
                },
                wheelsNames: ["wheel_1", "wheel_2", "wheel_3", "wheel_4"]
            },

            lowpolySmallCar: {
                url: 'src/vehicles/cars/low_poly_small_car/scene.gltf',
                position: [30, 0, -40],
                scale: [0.7, 0.7, 0.7],
                rotation: [0, Math.PI, 0],

                carInfo: {
                    mass: 800,    // Kg
                    maxSpeed: 90, // Km/h
                    boxSizeXFactor: 1.2,
                    boxSizeYFactor: 0.3,
                    boxSizeZFactor: 0.4,
                    carName: "Low Poly Small Car"
                },
                wheelsNames: ["FR_Wheel", "RR_Wheel", "FL_Wheel", "RL_Wheel"]
            },

            bmwE30: {
                url: 'src/vehicles/cars/bmw_e30/scene.gltf',
                position: [30, 0, 0],
                scale: [2.6, 2.5, 2.6],
                rotation: [0, 0, 0],

                carInfo: {
                    mass: 1080,    // Kg
                    maxSpeed: 197, // Km/h
                    boxSizeXFactor: 0.7,
                    boxSizeYFactor: 0.15,
                    boxSizeZFactor: 0.55,
                    carName: "Bmw E30"
                },
                wheelsNames: ["F_wheelL_5", "F_wheelR_6", "B_wheelL_7", "B_wheelR_8"]
            }
        };

        /*const dynamicModelsForest = {
          nathan:             { url: 'src/characters/nathan/scene.gltf',
                                position: [-4, 1, 0],
                                scale:    [0.025, 0.025, 0.025],
                                rotation: [0, Math.PI, 0],

                                modelInfo: {
                                  mass: 80,     // Kg
                                  maxSpeed: 45, // Km/h
                                  boxSizeXFactor: 0.2, // To be verified
                                  boxSizeYFactor: 0.02,
                                  boxSizeZFactor: 0.5,
                                  characterName: "Nathan"
                                },
                                componentsNames: ["rp_nathan_animated_003_walking_head_07"]
                                // TODO when hierarchical structure is defined
                              }
        };*/

        // Selectable Environments
        const environments = {
            CITY:    0,
            COUNTRY: 1,
            //FOREST:  2,
            HIGHWAY: 3
        };

        // Set this variables according to user choices in the menu
        let chosenEnv = Utils.getCookie("env"),
            environment = environments[chosenEnv];

        let staticModels = {};

        // Create a loading manager for 3D models
        const manager = new THREE.LoadingManager();
        manager.onLoad = init;

        // Load the 3D models
        const gltfLoader = new GLTFLoader(manager);

        switch (environment) {
            case environments.CITY:
                staticModels = staticModelsCity;
                Object.assign(dynamicModels, dynamicModelsCity);
                break;
            case environments.COUNTRY:
                staticModels = staticModelsCountry;
                break;
            case environments.HIGHWAY:
                staticModels = staticModelsHighway;
                Object.assign(dynamicModels, dynamicModelsCity, dynamicModelsHighway);
                break;
            /*case environments.FOREST:
                staticModels  = staticModelsForest;
                dynamicModels = dynamicModelsForest;
                break;*/
        };

        let chosenCar = Utils.getCookie("car"),
            selectedModel = dynamicModels[chosenCar];

        let policeSelModel = dynamicModels.chevroletSheriff;


        if (selectedModel == dynamicModels.bmwI8)
          dynamicModels.chevroletSheriff.carInfo.engineForce = 53000;
        else if (selectedModel == dynamicModels.tesla)
          dynamicModels.chevroletSheriff.carInfo.engineForce = 45000;

        loadModels(staticModels);
        loadModels(dynamicModels);

        let playerModel, policeModel;
        let lanexUp, lanexDown;

        let isPlay = true;
        let isBlur = false;

        // Create a progress bar to show during loading
        const progressBar = document.getElementById('progressbar');
        manager.onProgress = (url, itemsLoaded, itemsTotal) => {
            progressBar.style.width = `${itemsLoaded / itemsTotal * 100 | 0}%`;
        };

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

        const scoreElem = document.getElementById("score");
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

            play.onclick = function () {
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

                // Crosswalks and clouds don't have some parameters (they aren't gltf)
                if (!model.position)
                    continue;

                scene.add(modelScene);
                addStaticModel(model);
            }
        }

        const inputManager = new InputManager();
        const game         = new Game(inputManager, "easy", physicsWorld);
        const player       = new Player(game);
        const police       = new Police(game);
        game.setPlayer(player);
        game.setPolice(police);

        // Start the game
        function start() {
            // Show score & speedometer
            scoreElem.style.display = 'inherit';
            speedometer.style.display = 'inherit';

            //Add dynamic models to the scene
            //for (const model of Object.values(dynamicModelsBase)) {
            for (const model of Object.values(dynamicModels)) {
                const modelScene = model.gltf.scene;
                scene.add(modelScene);
                //console.log(Utils.dumpObject(modelScene).join('\n'));

                switch (model) {
                    // Cars
                    case dynamicModels.chevroletSheriff:
                    case dynamicModels.bmwI8:
                    case dynamicModels.lamborghini:
                    case dynamicModels.tesla:
                    case dynamicModels.audiR8:
                    case dynamicModels.dodgeViper:
                    case dynamicModels.nissanGT:
                    case dynamicModels.rangeRover:

                    case dynamicModels.bmwE30:
                    case dynamicModels.lowpolyCar:
                    case dynamicModels.lowpolyTruck:
                    case dynamicModels.lowpolyTaxiOldStyle:
                    case dynamicModels.lowpolySmallCar:
                        addCarModel(model);
                        break;

                    // Characters
                    /*case dynamicModels.nathan:
                        addCharacter(model);
                        break;*/

                    default:
                        addStaticModel(model);
                }
            }

        }

        { // Ambient light
            const light = new THREE.AmbientLight(0x404040, 0.3); // color, intensity
            scene.add(light);
        }

        // Sunlight
        const sunlight = new THREE.DirectionalLight(0xFFFFFF, 0.5);
        scene.add(sunlight);
        sunlight.castShadow = true;

        const sunlightPositionIncrement = 0.15;

        /*const helper = new THREE.DirectionalLightHelper(sunlight);
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

        let cameraOffset = 21;

        // Infinite terrain with a texture
        if (environment == environments.CITY) {
            // City environment
            let texInfo = {
                repeat: { x: 30, y: 3000 },
                //repeat: { x: 300, y: 4000 }, // For jpg
                size: { x: 1000, y: 100000 },
                position: { x: 0, y: 0, z: 0 },
                rotation: { x: -Math.PI / 2, y: 0, z: 0 }
            };

            setEnvironment("src/textures/street_blank.png", texInfo);

            texInfo = {
                repeat: { x: 2, y: 4000 },
                size: { x: 50, y: 100000 },
                position: { x: 0, y: 0.1, z: 0 },
                rotation: { x: -Math.PI / 2, y: 0, z: 0 }
            };

            setEnvironment("src/textures/street_texture.jpg", texInfo, false);

            lanexUp = [5, 16];
            lanexDown = [-16, -5];

            addRoadCrosswalks();
        }
        else if (environment == environments.COUNTRY) {
            // Country - desert environment
            let texInfo = {
                repeat: { x: 17, y: 1700 },
                size: { x: 1000, y: 100000 },
                position: { x: 0, y: 0, z: 0 },
                rotation: { x: -Math.PI / 2, y: 0, z: 0 }
            };

            setEnvironment("src/textures/desert_texture.jpg", texInfo);

            texInfo = {
                repeat: { x: 1, y: 3000 },
                size: { x: 45, y: 100000 },
                position: { x: 0, y: 0.1, z: 0 },
                rotation: { x: -Math.PI / 2, y: 0, z: 0 }
            };

            setEnvironment("src/textures/road66.jpg", texInfo, false);

            lanexUp = [5];
            lanexDown = [-5];
        }
        else if (environment == environments.HIGHWAY) {
            // Highway environment
            let texInfo = {
                repeat: { x: 30, y: 3000 },
                size: { x: 1000, y: 100000 },
                position: { x: 0, y: 0, z: 0 },
                rotation: { x: -Math.PI / 2, y: 0, z: 0 }
            };

            setEnvironment("src/textures/terrain_texture.jpg", texInfo);

            texInfo = {
                repeat: { x: 3000, y: 3 },
                size: { x: 100000, y: 100 },
                position: { x: 0, y: 0.1, z: 0 },
                rotation: { x: -Math.PI / 2, y: 0, z: Math.PI / 2 }
            };

            setEnvironment("src/textures/highway_texture.jpg", texInfo, false);

            lanexUp = [5, 15, 25, 35];
            lanexDown = [-5, -15, -25, -35];

            cameraOffset = 31;
        }
        /*else {
            // Forest environment
            let texInfo = {
                repeat: { x: 30, y: 3000 },
                size: { x: 1000, y: 100000 },
                position: { x: 0, y: 0, z: 0 },
                rotation: { x: -Math.PI / 2, y: 0, z: 0 }
            };

            setEnvironment("src/textures/terrain_texture.jpg", texInfo);

            texInfo = {
                repeat: { x: 1, y: 10000 },
                size: { x: 30, y: 100000 },
                position: { x: 0, y: 0.1, z: 0 },
                rotation: { x: -Math.PI / 2, y: 0, z: 0 }
            };

            setEnvironment("src/textures/forest.jpg", texInfo, false);
        }*/

        { // Lateral limits
            // Add left limit
            const leftLimit = {
                size: { x: 1, y: 20, z: 100000 },
                position: { x: 30, y: 0, z: 0 }
            };

            if (environment == environments.COUNTRY) leftLimit.position.x = 13;
            else if (environment == environments.HIGHWAY) leftLimit.position.x = 50;
            //else if (environment == environments.FOREST) leftLimit.position.x = 25;

            addLimit(leftLimit);

            // Add right limit
            leftLimit.position.x = -leftLimit.position.x;
            addLimit(leftLimit);

            function addLimit(limitInfo) {
                const mass = 0;

                const transform = new Ammo.btTransform();
                transform.setIdentity();
                transform.setOrigin(new Ammo.btVector3(limitInfo.position.x, limitInfo.position.y, limitInfo.position.z));
                transform.setRotation(new Ammo.btQuaternion(0, 0, 0, 1));

                const motionState = new Ammo.btDefaultMotionState(transform);

                const collisionShape = new Ammo.btBoxShape(new Ammo.btVector3(limitInfo.size.x, limitInfo.size.y, limitInfo.size.z));

                const localInertia = new Ammo.btVector3(limitInfo.position.x, limitInfo.position.y, limitInfo.position.z);
                collisionShape.calculateLocalInertia(mass, localInertia);

                const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, collisionShape, localInertia);
                const body = new Ammo.btRigidBody(rbInfo);
                body.setFriction(2);

                // Add rigid body and set collision masks
                physicsWorld.addRigidBody(body, 1, 1);
            }
        }

        { // Clouds
            const tex = new THREE.TextureLoader().load("src/textures/cloud.png");
            tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
            tex.repeat.set(1, 1);
            tex.wrapT = THREE.RepeatWrapping;
            tex.wrapS = THREE.RepeatWrapping;
            const geo = new THREE.PlaneBufferGeometry(150, 35);
            const mat = new THREE.MeshLambertMaterial({ map: tex, transparent: true });

            for (let i = 0; i < 5; i++) {
                const cloud = new THREE.Mesh(geo, mat);
                cloud.position.set(
                    Math.random() * 1000 - 500,
                    80 + Math.random() * 200,
                    -Math.random() * 800 - 550
                );
                scene.add(cloud);
                staticModels["cloud" + i] = { gltf: { scene: cloud } };
            }
        }

        // Resume game when RESUME is clicked
        document.getElementById("resumeBtn").onclick = function () {
            game.pauseGame();
        }

        // Show app stats
        const stats = new Stats();
        stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(stats.dom);

        let before = 0, deltaTime = 0;
        let score = 0;
        requestAnimationFrame(animate);

        function animate(time) {
            if (isBlur) return;

            stats.begin();

            if (Utils.resizeRendererToDisplaySize(renderer)) {
                const canvas = renderer.domElement;
                camera.aspect = canvas.clientWidth / canvas.clientHeight;
                camera.updateProjectionMatrix();
            }

            // Convert current time to seconds
            time *= 0.001;

            // Make sure delta time isn't too big
            deltaTime = Math.min(time - before, 1 / 60);
            before = time;

            // DEBUG
            /*console.log("time: " + time + "\n");
            console.log("before: " + before + "\n");
            console.log("deltaTime: " + deltaTime + "\n");*/

            // Check if pause input
            if (inputManager.pauseAction())
                game.pauseGame();

            // Check if game is paused to update or not logic and physics
            if (!game.isPaused) {
                updateGameLogic(time);
                updatePhysics();
            }

            inputManager.update();

            // DEBUG
            //console.log("renderer.info.render.calls: " + renderer.info.render.calls);

            stats.end();
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }

        function updateGameLogic(time) {
            let zPosPlayer = 0;

            if (playerModel) {
                game.update(deltaTime);

                // Update speedometer
                const speed = player.getSpeed().toFixed(2);
                speedometer.innerHTML = (speed < 0 ? '(R) ' : '') + Math.abs(speed) + ' Km/h';

                // Update Score
                score += Utils.toMsecond(Math.abs(speed)) * deltaTime;
                game.setScore(score);

                if (score < 1000)
                    scoreElem.innerHTML = "Score: " + score.toFixed(2) + " m";
                else
                    scoreElem.innerHTML = "Score: " + (score / 1000).toFixed(2) + " Km";

                // Update camera
                zPosPlayer = player.getPosition().z;
                camera.position.z = zPosPlayer + cameraOffset;
                camera.lookAt(0, 5, zPosPlayer);
                camera.updateProjectionMatrix();//*/

                translateStaticModels(zPosPlayer);
                translateJersey(zPosPlayer);

                moveCars(zPosPlayer, dynamicModels);

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

            updateDaytime(time, zPosPlayer);
        }

        // Update physics and sync graphics
        function updatePhysics() {
            // Step world
            physicsWorld.stepSimulation(deltaTime);
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
                    model.get3DModel().position.set(p.x(), p.y(), p.z());
                    model.get3DModel().quaternion.set(q.x(), q.y(), q.z(), q.w());
                }
            }

            // Check if police has caught the player
            if (!playerModel || !policeModel) return;

            /*if (playerModel == dynamicModels.nathan) {
              let i,
                  num = dispatcher.getNumManifolds(),
                  manifold;

              for (i = 0; i < num; i++) {
                  manifold = dp.getManifoldByIndexInternal(i);

                  if ( manifold.getBody0() === playerModel.getPhysicsBody() ||
                       manifold.getBody1() === playerModel.getPhysicsBody() ) {
                    gameOver();
                    return;
                  }
              }

            }*/

            physicsWorld.contactPairTest(player.getPhysicsBody(), policeModel.getPhysicsBody(), cbContactPairResult);
            if (cbContactPairResult.hasContact)
              gameOver();
        }

        function gameOver() {
          // Show Game Over text and restart the game
          if (!isBlur)
              window.blur();

          const finalscore = score;

          const gameover = document.getElementById("gameover");
          gameover.style.display = "block";

          const currscore = document.getElementById("score");
          currscore.style.display = "none";

          const fscore = document.getElementById("finalscore");
          fscore.style.display = "inherit";
          fscore.innerHTML = "Final score: " + finalscore.toFixed(2);

          const highscore = document.getElementById("highscore");
          highscore.style.display = "inherit";

          const restart = document.getElementById("returnBtn");
          restart.style.display = "inherit";

          isPlay = false;
          isBlur = true;

          const prevScore = Utils.getCookie("score");

          if (prevScore == "")
              Utils.setCookie("score", 0);

          if (finalscore > prevScore) {
              highscore.innerHTML = "New Highscore!";
              highscore.style.color = "orange";
              Utils.setCookie("score", finalscore.toFixed(2));
          }
          else
              highscore.innerHTML = "Highscore: " + parseFloat(prevScore).toFixed(2);

          //console.log("GAME OVER");
        }

        function updateDaytime(time, zPosPlayer) {
            // Change sunlight position and intensity according to the elapsed time
            // (about 4 seconds of the game corresponds to 1 hour, 96/4 = 24)
            const daytime = time % 96;
            if (daytime < 20) {
                // Prepare sunrise (daytime is between midnight and 5 )
                sunlight.position.set(100, 100, zPosPlayer + 80);
                sunlight.intensity = Utils.clamp(sunlight.intensity - 0.003, 0.5, 2.2);

                if (daytime < 4) renderer.setClearColor(0x2a2a35); // 0 < x < 1
                else if (daytime < 8) renderer.setClearColor(0x1c1c24); // 1 < x < 2
                else if (daytime < 12) renderer.setClearColor(0x1c1c24); // 2 < x < 3
                else if (daytime < 16) renderer.setClearColor(0x2a2a35); // 3 < x < 4
                else renderer.setClearColor(0x44626e); // 4 < x < 5
            }
            else if (daytime < 60) {
                // Growing phase (daytime is between 5 and 15 )
                sunlight.position.x -= sunlightPositionIncrement;
                sunlight.position.y += sunlightPositionIncrement;
                sunlight.position.z = zPosPlayer + 80;
                sunlight.intensity = Utils.clamp(sunlight.intensity + 0.003, 0.5, 2.2);

                if (daytime < 24) renderer.setClearColor(0x598496); // 5 < x < 6
                else if (daytime < 28) renderer.setClearColor(0x70a8c0); // 6 < x < 7
                else if (daytime < 32) renderer.setClearColor(0x87ceeb); // 7 < x < 8
                else if (daytime < 36) renderer.setClearColor(0x9dd6ee); // 8 < x < 9
                else if (daytime < 36) renderer.setClearColor(0xc6e6f5); // 9 < x < 10
                else renderer.setClearColor(0xecf7fc); // 10 < x < 15
            }
            else {
                // Waning phase (daytime is between 15 and midnight )
                sunlight.position.x -= sunlightPositionIncrement;
                sunlight.position.y -= sunlightPositionIncrement;
                sunlight.position.z = zPosPlayer + 80;
                sunlight.intensity = Utils.clamp(sunlight.intensity - 0.003, 0.5, 2.2);

                if (daytime < 72) renderer.setClearColor(0xecf7fc); // 15 < x < 18
                else if (daytime < 76) renderer.setClearColor(0xc6e6f5); // 18 < x < 19
                else if (daytime < 80) renderer.setClearColor(0x9dd6ee); // 19 < x < 20
                else if (daytime < 84) renderer.setClearColor(0x87ceeb); // 20 < x < 21
                else if (daytime < 88) renderer.setClearColor(0x70a8c0); // 21 < x < 22
                else if (daytime < 92) renderer.setClearColor(0x598496); // 22 < x < 23
                else renderer.setClearColor(0x44626e); // 23 < x < 24
            }

            // DEBUG
            /*console.log("time%96: " + time%96 + "\n");
            console.log("(time%96)/4: " + (time%96)/4 + "\n");
            console.log("sunlight.position.x: " + sunlight.position.x + "\n");
            console.log("sunlight.position.y: " + sunlight.position.y + "\n");
            console.log("sunlight.position.z: " + sunlight.position.z + "\n");
            console.log("sunlight.intensity: " + sunlight.intensity + "\n");//*/
        }

        // Translate static models if surpassed by the player
        function translateStaticModels(zPosPlayer) {
            let surpassDistance = 80;
            let respawnDistance = 1400;
            if (environment == environments.COUNTRY || environment == environments.HIGHWAY)
                respawnDistance = 1000;

            for (const model of Object.values(staticModels)) {
                const buildingPosition = model.gltf.scene.position;

                if (model == staticModels.sidewalks1 || model == staticModels.sidewalks2) {
                    surpassDistance = 700;
                    respawnDistance = 1250;
                }

                else if (model == staticModels.highwayFenceSx || model == staticModels.highwayFenceDx
                    || model == staticModels.highwayFenceSx2 || model == staticModels.highwayFenceDx2) {
                    surpassDistance = 100;
                    respawnDistance = 500;
                }

                // Check if player surpassed the static model
                if (zPosPlayer < buildingPosition.z - surpassDistance) {
                    buildingPosition.set(buildingPosition.x, buildingPosition.y, buildingPosition.z - respawnDistance);
                    model.gltf.scene.visible = false;
                }

                // Check if player is near the static model
                if (zPosPlayer - buildingPosition.z < 450)
                    model.gltf.scene.visible = true;
            }
        }

        // Move cars independently (IA) but the player and police car
        function moveCars(zPosPlayer, setOfModels) {
            for (const model of Object.values(setOfModels)) {
              if (model != playerModel) {
                    const carPosition = model.gltf.scene.position,
                        currentCar = model.car;

                        if (model == policeSelModel) {
                          if ( Math.abs(zPosPlayer - carPosition.z) > 60 ) {
                            let ms = policeModel.getPhysicsBody().getMotionState();
                            if (ms) {
                                ms.getWorldTransform(TRANSFORM_AUX);
                                TRANSFORM_AUX.setOrigin(new Ammo.btVector3(
                                    playerModel.getPosition().x,
                                    policeModel.getPosition().y,
                                    zPosPlayer + 20));
                                policeModel.get3DModel().lookAt(
                                  policeModel.getPosition().x,
                                  policeModel.getPosition().y,
                                  policeModel.getPosition().z - 30);
                                const quaternion = policeModel.get3DModel().quaternion;
                                //console.log("quaternion:");
                                //console.log(quaternion);
                                TRANSFORM_AUX.setRotation(new Ammo.btQuaternion(
                                    quaternion.x,
                                    quaternion.y,
                                    quaternion.z,
                                    quaternion.w));
                                ms = new Ammo.btDefaultMotionState(TRANSFORM_AUX);
                                policeModel.getPhysicsBody().setMotionState(ms);
                            }
                          }
                          continue;
                        }

                    if (currentCar) {
                        // Check if currentCar is near to the player and move it
                        if (Math.abs(zPosPlayer > carPosition.z - 200) || model.gltf.scene.visible == false) { // 200
                            model.gltf.scene.visible = true;
                            // Move car forward according to its orientation

                            // Dodge Viper and low poly car have Z axis opposite than the other cars
                            if (model == dynamicModels.dodgeViper || model == dynamicModels.lowpolyCar)
                              currentCar.move(0, 0, 1);
                            else
                              currentCar.move(0, 0, -1);
                        }
                        // Otherwise translate it far away resetting orientation and picking at random the lane
                        else {
                            /*console.log("============ TRANSLATE CAR ============");
                            console.log("car name: " + currentCar.getName());
                            console.log("BEFORE carPosition.z:" + carPosition.z);
                            const orientation = new THREE.Vector3();
                            console.log("BEFORE car orientation:");
                            console.log(currentCar.get3DModel().getWorldDirection(orientation));*/
                            const random = placeCar(model, false, carPosition.z - 600);
                            /*console.log("AFTER carPosition.z:" + carPosition.z);
                            console.log("AFTER car orientation:");
                            console.log(currentCar.get3DModel().getWorldDirection(orientation));*/

                            currentCar.getPhysicsBody().setLinearVelocity(new Ammo.btVector3(0, 0, 0));

                            let ms = currentCar.getPhysicsBody().getMotionState();
                            if (ms) {
                                ms.getWorldTransform(TRANSFORM_AUX);
                                TRANSFORM_AUX.setOrigin(new Ammo.btVector3(
                                    random,
                                    carPosition.y,
                                    carPosition.z));
                                const quaternion = currentCar.get3DModel().quaternion;
                                console.log("quaternion:");
                                console.log(quaternion);
                                TRANSFORM_AUX.setRotation(new Ammo.btQuaternion(
                                    quaternion.x,
                                    quaternion.y,
                                    quaternion.z,
                                    quaternion.w));
                                ms = new Ammo.btDefaultMotionState(TRANSFORM_AUX);
                                currentCar.getPhysicsBody().setMotionState(ms);
                            }

                            model.gltf.scene.visible = false;
                            //console.log("============ END TRANSLATE CAR ============");
                        }
                    }
                }
            }
        }

        function translateJersey(zPosPlayer) {
            for (const model of Object.values(staticModels)) {
                const buildingPosition = model.gltf.scene.position;

                if (model == staticModels.jerseyGroup || model == staticModels.jerseyGroup2) {
                    if(zPosPlayer < buildingPosition.z - 390) {
                        let ms = model.object.getPhysicsBody().getMotionState();
                        if (ms) {
                            ms.getWorldTransform(TRANSFORM_AUX);
                            TRANSFORM_AUX.setOrigin(new Ammo.btVector3(
                                buildingPosition.x,
                                buildingPosition.y,
                                buildingPosition.z - 1000));
                            const quaternion = model.object.get3DModel().quaternion;
                            console.log("quaternion:");
                            console.log(quaternion);
                            TRANSFORM_AUX.setRotation(new Ammo.btQuaternion(
                                quaternion.x,
                                quaternion.y,
                                quaternion.z,
                                quaternion.w));
                            ms = new Ammo.btDefaultMotionState(TRANSFORM_AUX);
                            model.object.getPhysicsBody().setMotionState(ms);
                            model.gltf.scene.visible = false;
                        }
                    }

                    if (zPosPlayer - buildingPosition.z < 450)
                      model.gltf.scene.visible = true;
                }
            }

        }

        // Apply a sound to a mesh
        function applySound(mesh, filename, sound) {
            if (!mesh || !filename || !sound) return;

            // Load a sound and set it as the PositionalAudio object's buffer
            audioLoader.load(filename, function (buffer) {
                sound.setBuffer(buffer);
                sound.setLoop(true);
                sound.setRefDistance(20);
                sound.play();
            });

            // Finally add the sound to the mesh
            mesh.add(sound);
        }

        // Add a static model to the scene
        function addStaticModel(model) {
            if (!model) return;

            let modelScene;
            try {
                modelScene = model.gltf.scene;
            } catch (error) {
                return;
            }

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

            if (model.modelInfo)
                model.object = new Model(modelScene, model.modelInfo, game);

            //scene.add(modelScene);
        }

        // Add a car model to the scene
        function addCarModel(model) {
            if (!model) return;


            const modelScene = model.gltf.scene;
            //console.log(Utils.dumpObject(modelScene).join('\n'));

            let wheels = [],
                roofLights = [];

            modelScene.traverse(o => {
                if (o.isMesh) {
                    o.castShadow = true;
                    o.receiveShadow = true;
                }

                // Check if the 3D car model has references to the wheels
                if (model.wheelsNames && model.wheelsNames.length == 4) {
                    // Reference the four wheels
                    if (o.name === model.wheelsNames[0]) wheels[0] = o;
                    else if (o.name === model.wheelsNames[1]) wheels[1] = o;
                    else if (o.name === model.wheelsNames[2]) wheels[2] = o;
                    else if (o.name === model.wheelsNames[3]) wheels[3] = o;
                }

                // Check if the 3D car model has references to the wheels
                if (model.roofLightsNames) {
                    for (let i = 0; i < model.roofLightsNames.length; i++)
                        if (o.name === model.roofLightsNames[i]) {
                            roofLights.push(o);
                            break;
                        }
                }

            });

            const components = {
                wheels: model.wheelsNames ? wheels : null
            };

            if (model != dynamicModels.bmwE30 && model.wheelsNames && model.wheelsNames.length == 4) {
              // Adjust front wheels orientation before to animate them (steering)
              wheels[0].rotation.z = 0;
              wheels[1].rotation.z = 0;
            }


            //scene.add(modelScene);

            if (model == selectedModel) {
                // Create the PositionalAudio object (passing in the listener)
                audioObjects.car = new THREE.PositionalAudio(listener);
                applySound(modelScene, 'src/sounds/Car acceleration.mka', audioObjects.car);

                // Set the directionalLight target in order to track the player model
                sunlight.target = modelScene;

                // Set fixed initial position for the player model
                modelScene.position.set(...model.position);
                modelScene.scale.set(...model.scale);
                modelScene.lookAt(modelScene.position.x, modelScene.position.y, modelScene.position.z - 30);

                // Create the car, store its reference and set the player model
                playerModel = new Car(modelScene, model.carInfo, game, components);
                player.setModel(playerModel);
            }
            else if (model == policeSelModel) {
                // Create the PositionalAudio object (passing in the listener)
                audioObjects.policeCar = new THREE.PositionalAudio(listener);
                applySound(modelScene, 'src/sounds/Police siren.mka', audioObjects.policeCar);

                components.roofLights = model.roofLightsNames ? roofLights : null;

                // Set fixed initial position for the police model
                modelScene.position.set(...model.position);
                modelScene.scale.set(...model.scale);
                modelScene.lookAt(modelScene.position.x, modelScene.position.y, modelScene.position.z - 30);

                // Create the car, store its reference and set the police model
                policeModel = new PoliceCar(modelScene, model.carInfo, game, components, scene, gui);
                police.setModel(policeModel);
            }
            else {
                // Place car on the lanes randomly
                placeCar(model, true);

                modelScene.scale.set(...model.scale)

                // Create the car and store its reference
                model.car = new Car(modelScene, model.carInfo, game, components);


                //Max speed IA cars
                model.car.maxSpeed = 35;
            }
        }

        function placeCar(model, randomZ, zNew = 0) {
            if (!model) return;

            const modelScene = model.gltf.scene;
            //console.log("********* PLACE CAR *********");
            //console.log("model name: " + model.carInfo.carName);

            // Place car on the lanes randomly
            let randomX = Math.random(),
                zCar = randomZ ? -20 - randomX * 470 - randomX * 170 : zNew;
            //console.log("randomX: " + randomX);
            if (randomX < 0.5) {
                // Car is placed facing the same direction of the player
              //  console.log("same direction");

                let newRandom = Math.random();
                randomX = lanexUp[Math.floor(newRandom * lanexUp.length)];

                modelScene.position.set(randomX, model.position[1], zCar);

                // Dodge Viper and low poly car have Z axis opposite than the other cars
                if (model == dynamicModels.dodgeViper || model == dynamicModels.lowpolyCar)
                  modelScene.lookAt(modelScene.position.x, modelScene.position.y, modelScene.position.z + 30);
                else
                  modelScene.lookAt(modelScene.position.x, modelScene.position.y, modelScene.position.z - 30);
            }
            else {
                // Car is placed facing the opposite direction of the player
                //console.log("opposite direction");

                let newRandom = Math.random();
                randomX = lanexDown[Math.floor(newRandom * lanexDown.length)];

                modelScene.position.set(randomX, model.position[1], zCar);

                // Dodge Viper and low poly car have Z axis opposite than the other cars
                if (model == model.dodgeViper || model == dynamicModels.lowpolyCar)
                  modelScene.lookAt(modelScene.position.x, modelScene.position.y, modelScene.position.z - 30);
                else
                  modelScene.lookAt(modelScene.position.x, modelScene.position.y, modelScene.position.z + 30);
            }

            /*console.log("randomX: " + randomX);
            console.log("randomZ: " + zCar);
            console.log("********* END PLACE CAR *********");*/

            return randomX;
        }

        /*function addTeslaCar(modelScene) {
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
        }*/


        /*function addCharacter(model) {
            if (!model) return;

            const modelScene = model.gltf.scene;
            //console.log(Utils.dumpObject(modelScene).join('\n'));

            modelScene.position.set(...model.position);
            modelScene.scale.set(...model.scale)
            modelScene.rotation.set(...model.rotation);

            let head,
                leftArm = [],
                leftHand = [],
                rightArm = [],
                rightHand = [],

                leftLeg = [],
                leftFoot = [],
                rightLeg = [],
                rightFoot = [];

            modelScene.traverse(o => {
                if (o.isMesh) {
                    o.castShadow = true;
                    o.receiveShadow = true;
                }

                // Reference the components of the character
                if (o.name === 'rp_nathan_animated_003_walking_head_07') head = o;

                if (o.name === 'rp_nathan_animated_003_walking_shoulder_l_023') leftArm[0] = o;
                else if (o.name === 'rp_nathan_animated_003_walking_upperarm_l_024') leftArm[1] = o;
                else if (o.name === 'rp_nathan_animated_003_walking_lowerarm_l_025') leftArm[2] = o;
                else if (o.name === 'rp_nathan_animated_003_walking_hand_l_026') leftHand[0] = o;
                else if (o.name === 'rp_nathan_animated_003_walking_thumb_01_l_027') leftHand[1] = o;
                else if (o.name === 'rp_nathan_animated_003_walking_index_01_l_031') leftHand[2] = o;
                else if (o.name === 'rp_nathan_animated_003_walking_middle_01_l_00') leftHand[3] = o;
                else if (o.name === 'rp_nathan_animated_003_walking_ring_01_l_038') leftHand[4] = o;
                else if (o.name === 'rp_nathan_animated_003_walking_pinky_01_l_042') leftHand[5] = o;

                else if (o.name === 'rp_nathan_animated_003_walking_shoulder_r_048') rightArm[0] = o;
                else if (o.name === 'rp_nathan_animated_003_walking_upperarm_r_049') rightArm[1] = o;
                else if (o.name === 'rp_nathan_animated_003_walking_lowerarm_r_050') rightArm[2] = o;
                else if (o.name === 'rp_nathan_animated_003_walking_hand_r_051') rightHand[0] = o;
                else if (o.name === 'rp_nathan_animated_003_walking_thumb_01_r_052') rightHand[1] = o;
                else if (o.name === 'rp_nathan_animated_003_walking_index_01_r_056') rightHand[2] = o;
                else if (o.name === 'rp_nathan_animated_003_walking_middle_01_r_060') rightHand[3] = o;
                else if (o.name === 'rp_nathan_animated_003_walking_ring_01_r_064') rightHand[4] = o;
                else if (o.name === 'rp_nathan_animated_003_walking_pinky_01_r_068') rightHand[5] = o;

                else if (o.name === 'rp_nathan_animated_003_walking_upperleg_l_074') leftLeg[0] = o;
                else if (o.name === 'rp_nathan_animated_003_walking_lowerleg_l_075') leftLeg[1] = o;
                else if (o.name === 'rp_nathan_animated_003_walking_foot_l_076') leftFoot[0] = o;

                else if (o.name === 'rp_nathan_animated_003_walking_upperleg_r_081') rightLeg[0] = o;
                else if (o.name === 'rp_nathan_animated_003_walking_lowerleg_r_082') rightLeg[1] = o;
                else if (o.name === 'rp_nathan_animated_003_walking_foot_r_083') rightFoot[0] = o;
            });

            const components = {
                head: head,
                leftArm: leftArm,
                leftHand: leftHand,
                rightArm: rightArm,
                rightHand: rightHand,
                leftLeg: leftLeg,
                leftFoot: leftFoot,
                rightLeg: rightLeg,
                rightFoot: rightFoot
            }

            if (selectedModel == model) {
                playerModel = new Character(modelScene, model.modelInfo, game, components);
                player.setModel(playerModel);
            }
            else {
                new Character(modelScene, model.modelInfo, game, components);
            }

            // Create the PositionalAudio object (passing in the listener)
            audioObjects.character = new THREE.PositionalAudio(listener);
            applySound(modelScene, 'src/sounds/Running footsteps.mka', audioObjects.character);

            //updateCamera(modelScene);
        }*/

        // Set current environment (textures and physics)
        function setEnvironment(texFilename, texInfo, physics = true) {
            if (!texFilename || !texInfo) return;

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
                transform.setOrigin(new Ammo.btVector3(texInfo.position.x, texInfo.position.y, texInfo.position.z));
                transform.setRotation(new Ammo.btQuaternion(0, 0, 0, 1));

                const motionState = new Ammo.btDefaultMotionState(transform);

                const collisionShape = new Ammo.btBoxShape(new Ammo.btVector3(texInfo.size.x, 0.01, texInfo.size.y));

                const localInertia = new Ammo.btVector3(texInfo.position.x, texInfo.position.y, texInfo.position.z);
                collisionShape.calculateLocalInertia(mass, localInertia);

                const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, collisionShape, localInertia);
                const body = new Ammo.btRigidBody(rbInfo);
                body.setFriction(2);

                // Add rigid body and set collision masks
                physicsWorld.addRigidBody(body, 1, 1);
            }
        }

        // Add some road crosswalks to the scene
        function addRoadCrosswalks() {
            const tex = new THREE.TextureLoader().load("src/textures/street_crosswalks.png");
            tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
            tex.repeat.set(3, 1);
            tex.wrapT = THREE.RepeatWrapping;
            tex.wrapS = THREE.RepeatWrapping;
            const geo = new THREE.PlaneBufferGeometry(48, 11);
            const mat = new THREE.MeshLambertMaterial({ map: tex });

            for (let i = 0; i < 2; i++) {
                const mesh = new THREE.Mesh(geo, mat);
                mesh.position.set(0, 0.2, -23 - (276 * i)); // 276 = 23 * 12
                mesh.rotation.set(-Math.PI / 2, 0, 0);
                scene.add(mesh);
                staticModels["crosswalks" + i] = { gltf: { scene: mesh } };
            }
        }

        // Must run each time the DOM window resize event fires.
        // Resets the canvas dimensions to match the window
        function resizeCanvas() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

    }

}
