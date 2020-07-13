import * as THREE        from "https://unpkg.com/three@0.118.3/build/three.module.js";
import { GLTFLoader }    from "https://unpkg.com/three@0.118.3/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from 'https://unpkg.com/three@0.118.3/examples/jsm/controls/OrbitControls.js';

"use strict"
var scene1 = new THREE.Scene();

var cubeWidth = 1;
var cubeHeight = 1;
var cubeDepth = 1;

var geometryCube = new THREE.BoxGeometry(cubeWidth, cubeHeight, cubeDepth);


var models = [];

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

}





function dumpObject(obj, lines = [], isLast = true, prefix = '') {
    const localPrefix = isLast ? '└─' : '├─';
    lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || 'no-name'} [${obj.type}]`);
    const newPrefix = prefix + (isLast ? '  ' : '│ ');
    const lastNdx = obj.children.length - 1;

    obj.children.forEach((child, ndx) => {
    const isLast = ndx === lastNdx;
    dumpObject(child, lines, isLast, newPrefix);
    });

    return lines;
}




function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width  = canvas.clientWidth  * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize)
    renderer.setSize(width, height, false);
    return needResize;
}




function makeInstance(geometry, color, x, y, z) 
{
    var material = new THREE.MeshPhongMaterial({ color });
    

    material.shininess = 100;

    var cube = new THREE.Mesh(geometry, material);
    scene1.add(cube);

    cube.position.x = x;
    cube.position.y = y;
    cube.position.z = z;

    return cube;
}


/*
var cubes = [
    makeInstance(geometryCube, 0x0000FF,  2, 1, 0)
];
*/

window.onload = function main() {
    const canvas = document.getElementById('canvas');

    const renderer = new THREE.WebGLRenderer({canvas});
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor(0xBEF4FF);
    renderer.shadowMap.enabled = true;

    const fov = 75;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    //var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(0, 10, 8);
    camera.lookAt(0,4,8);

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 5, 0);
    controls.update();


    //update final numer for models[num]
    loadGLTF('src/bike/scene.gltf', 0, 0, 0, 1, 1, 1, 0, -Math.PI/2, 0, 0);
    loadGLTF('src/road/scene.gltf', 0, 0, 0, 0.2, 0.2, 0.2, 0, 0, 0, 1);
    loadGLTF('src/building/scene.gltf', -8, 0, 0, 2, 2, 2, 0, 0, 0, 2);



    const color = 0xFFFFFF;
    const intensity = 2;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(5, 10, 2);
    scene1.add(light);
    scene1.add(light.target);
    light.castShadow = true;



    //Infinite terrain with a texture
    var tex = new THREE.TextureLoader().load("../tex.jpg")
    tex.anisotropy = 2;
    tex.repeat.set(300, 300)
    tex.wrapT = THREE.RepeatWrapping
    tex.wrapS = THREE.RepeatWrapping
    var geo = new THREE.PlaneBufferGeometry(10000, 10000)
    var mat = new THREE.MeshLambertMaterial({
    map: tex
    })
    var mesh = new THREE.Mesh(geo, mat)
    mesh.position.set(0, 0, 0)
    mesh.rotation.set(Math.PI / -2, 0, Math.PI/2)
    scene1.add(mesh)

    
    
    

    

    // movement - please calibrate these values
    var xSpeed = 4;
    var ySpeed = 4;

    document.addEventListener("keydown", onDocumentKeyDown, false);
    function onDocumentKeyDown(event) {
        var keyCode = event.which;
        if (keyCode == 87) {
            if(models[0])
            models[0].position.z -= ySpeed;
        } else if (keyCode == 83) {
            if(models[0])
            models[0].position.z += ySpeed;
        } else if (keyCode == 65) {
            if(models[0])
            models[0].position.x -= xSpeed;
        } else if (keyCode == 68) {
            if(models[0])
            models[0].position.x += xSpeed;
        } 
    };


    for (var j = 0; j<10; j++)
    {
        var myNum = Math.random();
        if(myNum < 0.5)
        makeInstance(geometryCube, 0x0000FF,  -2, 1, -(j*20));
        else
        makeInstance(geometryCube, 0x0000FF,  2, 1, -(j*20));

    }

    

    animate();

    function animate() {
        if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        }

    

        if(models[0])
        {
            var myPos = models[0].position;
            var relativeCameraOffset = new THREE.Vector3(0,10,10);
            camera.position.lerp(relativeCameraOffset, 0.1);
            camera.lookAt(myPos );
            camera.position.set(myPos.x, myPos.y + 10, myPos.z + 12);
            models[0].position.z -= 1;
        }


        
        renderer.render( scene1, camera );
        requestAnimationFrame( animate );
    }

    
}