import * as THREE   from "https://unpkg.com/three@0.118.3/build/three.module.js";

class Model {
  constructor(model3D, modelInfo, game) {
    this.model3D = model3D;
    this.game    = game;

    this.mass = modelInfo.mass;

    // Debug
    console.log("model3D.position: ");
    console.log(model3D.position);
    console.log("model3D.quaternion.x: " + model3D.quaternion.x);
    console.log("model3D.quaternion.y: " + model3D.quaternion.y);
    console.log("model3D.quaternion.z: " + model3D.quaternion.z);
    console.log("model3D.quaternion.w: " + model3D.quaternion.w);

    // Store initial quaternion for respawning
    this.initialQuaternion = model3D.quaternion.clone();

    // 3D model bounding box
    const box     = new THREE.Box3().setFromObject(model3D);
    const boxSize = new THREE.Vector3();
    box.getSize(boxSize);
    //console.log("boxSize:");
    //console.log(boxSize);

    // Ammojs Section
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( model3D.position.x, model3D.position.y, model3D.position.z ) );
    transform.setRotation( new Ammo.btQuaternion( model3D.quaternion.x, model3D.quaternion.y, model3D.quaternion.z, model3D.quaternion.w ) );

    let motionState = new Ammo.btDefaultMotionState(transform);

    let collisionShape = new Ammo.btBoxShape(
      new Ammo.btVector3( boxSize.x * modelInfo.boxSizeXFactor, boxSize.y * modelInfo.boxSizeYFactor,
                          boxSize.z * modelInfo.boxSizeZFactor )
    );

    const localInertia = new Ammo.btVector3(0, 0, 0);
    collisionShape.calculateLocalInertia(modelInfo.mass, localInertia);

    const rbInfo = new Ammo.btRigidBodyConstructionInfo(modelInfo.mass, motionState, collisionShape, localInertia);
    this.physicsBody = new Ammo.btRigidBody(rbInfo);
    const DISABLE_DEACTIVATION = 4;
    this.physicsBody.setActivationState(DISABLE_DEACTIVATION);

    // Add rigid body and set collision masks
    game.getPhysicsWorld().addRigidBody(this.physicsBody, 1, 1);
    game.addRigidBody(this);
  }

  get3DModel() {
    return this.model3D;
  }

  getPhysicsBody() {
    return this.physicsBody;
  }

  getMass() {
    return this.mass;
  }

  getPosition() {
    return this.model3D.position;
  }

  getInitialQuaternion() {
    return this.initialQuaternion;
  }

}

export {Model}
