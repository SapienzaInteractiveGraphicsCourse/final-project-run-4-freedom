import * as THREE   from "https://unpkg.com/three@0.118.3/build/three.module.js";

class Model {
  constructor(model3D, mass, game) {
    this.model3D = model3D;
    this.game    = game;

    // Debug
    console.log("model3D.quaternion.x: " + model3D.quaternion.x);
    console.log("model3D.quaternion.y: " + model3D.quaternion.y);
    console.log("model3D.quaternion.z: " + model3D.quaternion.z);
    console.log("model3D.quaternion.w: " + model3D.quaternion.w);

    // 3D model bounding box
    const box     = new THREE.Box3().setFromObject(model3D);
    const boxSize = new THREE.Vector3();
    box.getSize(boxSize);
    console.log("boxSize:");
    console.log(boxSize);

    // Ammojs Section
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( model3D.position.x, model3D.position.y, model3D.position.z ) );
    transform.setRotation( new Ammo.btQuaternion( model3D.quaternion.x, model3D.quaternion.y, model3D.quaternion.z, model3D.quaternion.w ) );

    let motionState = new Ammo.btDefaultMotionState( transform );

    let collisionShape = new Ammo.btBoxShape( new Ammo.btVector3(boxSize.x * 0.3, boxSize.y * 0.04, boxSize.z * 0.3) );
    //let colShape = new Ammo.btBoxShape( new Ammo.btVector3(1, 1, 1) );

    let localInertia = new Ammo.btVector3(0, 0, 0);
    collisionShape.calculateLocalInertia(mass, localInertia);

    let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, collisionShape, localInertia);
    let body = new Ammo.btRigidBody(rbInfo);

    game.getPhysicsWorld().addRigidBody(body);
    this.physicsBody = body;
    game.addRigidBody(this);
  }

  get3DModel() {
    return this.model3D;
  }

  getPhysicsBody() {
    return this.physicsBody;
  }

  getPosition() {
    return this.model3D.position;
  }

}

export {Model}
