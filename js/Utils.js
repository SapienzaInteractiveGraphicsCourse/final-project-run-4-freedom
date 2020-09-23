import * as THREE from "https://unpkg.com/three@0.118.3/build/three.module.js";

class Utils {
  // Prints the tree of the object
  static dumpObject(obj, lines = [], isLast = true, prefix = '') {
    const localPrefix = isLast ? '└─' : '├─';
    lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
    const newPrefix = prefix + (isLast ? '  ' : '│ ');
    const lastNdx = obj.children.length - 1;

    obj.children.forEach((child, ndx) => {
      const isLast = ndx === lastNdx;
      this.dumpObject(child, lines, isLast, newPrefix);
    });

    return lines;
  }

  static getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  static setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue;
  }

  static resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width = canvas.clientWidth * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const needResize = canvas.width !== width || canvas.height !== height;

    if (needResize)
      renderer.setSize(width, height, false);

    return needResize;
  }

  // Adjusts the camera
  static frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
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
    camera.far = boxSize * 100;

    camera.updateProjectionMatrix();

    // Point the camera to look at the center of the box
    camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
  }

  // Makes a coordinates GUI
  static makeXYZGUI(gui, vector3, name, onChangeFn) {
    const folder = gui.addFolder(name);
    folder.add(vector3, 'x', -500, 500).onChange(onChangeFn);
    folder.add(vector3, 'y', 0, 300).onChange(onChangeFn);
    folder.add(vector3, 'z', -500, 500).onChange(onChangeFn);
    folder.open();
  }

  // Constraints num in range [a, b]
  static clamp(num, a, b) {
    return Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
  }

  // Convert a degree angle to radiants (x : 180 = y : Math.PI)
  static toRadiants(ang) {
    return ang / 180 * Math.PI;
  }

  // Convert radiants to a degree angle (x : 180 = y : Math.PI)
  static toDegrees(rad) {
    return rad / Math.PI * 180;
  }

  // Convert m/s speed to Km/h
  static toKmHour(speed) {
    return speed * 3.6;
  }

  // Convert Km/h speed to m/s
  static toMsecond(speed) {
    return speed / 3.6;
  }
}

export { Utils }
