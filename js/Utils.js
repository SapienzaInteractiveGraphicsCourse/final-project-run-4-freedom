import * as THREE        from "https://unpkg.com/three@0.118.3/build/three.module.js";

// Prints the tree of the object
export function dumpObject(obj, lines = [], isLast = true, prefix = '') {
  const localPrefix = isLast ? '└─' : '├─';
  lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
  const newPrefix = prefix + (isLast ? '  ' : '│ ');
  const lastNdx = obj.children.length - 1;

  obj.children.forEach((child, ndx) => {
    const isLast = ndx === lastNdx;
    dumpObject(child, lines, isLast, newPrefix);
  });

  return lines;
}

export function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const pixelRatio = window.devicePixelRatio;
  const width  = canvas.clientWidth  * pixelRatio | 0;
  const height = canvas.clientHeight * pixelRatio | 0;
  const needResize = canvas.width !== width || canvas.height !== height;

  if (needResize)
    renderer.setSize(width, height, false);

  return needResize;
}

// Adjusts the camera
export function frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
  const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
  const halfFovY = THREE.MathUtils.degToRad(camera.fov * .5);
  const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);

  // Compute a unit vector that points in the direction the camera is now
  // in the X,Z plane from the center of the box
  const direction = (new THREE.Vector3())
      .subVectors(camera.position, boxCenter)
      .multiply(new THREE.Vector3(1, 0, 1))
      .normalize();

  // Move the camera to a position distance units way from the center
  // in whatever direction the camera was from the center already
  camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));

  // Set camera up and back the box
  camera.position.y += 8;
  camera.position.z += 21; //3;

  //console.log("camera.position.x: " + camera.position.x);
  //console.log("camera.position.y: " + camera.position.y);
  //console.log("camera.position.z: " + camera.position.z);

  // Pick some near and far values for the frustum that will contain the box.
  camera.near = boxSize / 100;
  camera.far  = boxSize * 100;

  camera.updateProjectionMatrix();

  // Point the camera to look at the center of the box
  camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
}

// Make a coordinates GUI
export function makeXYZGUI(gui, vector3, name, onChangeFn) {
  const folder = gui.addFolder(name);
  folder.add(vector3, 'x', -100, 100).onChange(onChangeFn);
  folder.add(vector3, 'y', 0, 100).onChange(onChangeFn);
  folder.add(vector3, 'z', -100, 100).onChange(onChangeFn);
  folder.open();
}
