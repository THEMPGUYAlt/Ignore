import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/+esm';

const _euler = new THREE.Euler(0, 0, 0, 'YXZ');
const _vector = new THREE.Vector3();
const _MOUSE_SENSITIVITY = 0.002;
const _PI_2 = Math.PI / 2;

class PointerLockControls extends THREE.EventDispatcher {

  constructor(camera, domElement = document.body) {
    super();
    this.camera = camera;
    this.domElement = domElement;
    this.isLocked = false;
    this.enabled = true;
    this.minPolarAngle = 0;
    this.maxPolarAngle = Math.PI;
    this.pointerSpeed = 1.0;

    // bind event handlers
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onPointerlockChange = this._onPointerlockChange.bind(this);
    this._onPointerlockError = this._onPointerlockError.bind(this);

    this.connect(domElement);
  }

  connect(domElement) {
    this.domElement = domElement;
    document.addEventListener('mousemove', this._onMouseMove);
    document.addEventListener('pointerlockchange', this._onPointerlockChange);
    document.addEventListener('pointerlockerror', this._onPointerlockError);
  }

  disconnect() {
    document.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('pointerlockchange', this._onPointerlockChange);
    document.removeEventListener('pointerlockerror', this._onPointerlockError);
  }

  dispose() {
    this.disconnect();
  }

  _onMouseMove(event) {
    if (!this.enabled || !this.isLocked) return;

    _euler.setFromQuaternion(this.camera.quaternion);

    _euler.y -= event.movementX * _MOUSE_SENSITIVITY * this.pointerSpeed;
    _euler.x -= event.movementY * _MOUSE_SENSITIVITY * this.pointerSpeed;

    _euler.x = Math.max(_PI_2 - this.maxPolarAngle, Math.min(_PI_2 - this.minPolarAngle, _euler.x));

    this.camera.quaternion.setFromEuler(_euler);
    this.dispatchEvent({ type: 'change' });
  }

  _onPointerlockChange() {
    if (document.pointerLockElement === this.domElement) {
      this.isLocked = true;
      this.dispatchEvent({ type: 'lock' });
    } else {
      this.isLocked = false;
      this.dispatchEvent({ type: 'unlock' });
    }
  }

  _onPointerlockError() {
    console.error('THREE.PointerLockControls: Unable to use Pointer Lock API');
  }

  lock() {
    this.domElement.requestPointerLock();
  }

  unlock() {
    document.exitPointerLock();
  }

  moveForward(distance) {
    if (!this.enabled) return;
    _vector.setFromMatrixColumn(this.camera.matrix, 0);
    _vector.crossVectors(this.camera.up, _vector);
    this.camera.position.addScaledVector(_vector, distance);
  }

  moveRight(distance) {
    if (!this.enabled) return;
    _vector.setFromMatrixColumn(this.camera.matrix, 0);
    this.camera.position.addScaledVector(_vector, distance);
  }

  getDirection(v = new THREE.Vector3()) {
    return v.set(0, 0, -1).applyQuaternion(this.camera.quaternion);
  }
}

export { PointerLockControls };
