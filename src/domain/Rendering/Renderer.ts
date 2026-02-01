import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export class SketcherRenderer {
  canvas: HTMLCanvasElement;
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  renderer: THREE.WebGLRenderer;
  plane: THREE.Plane;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.scene = this.makeScene();
    this.camera = this.getCamera();
    this.camera.position.z = 3;
    this.scene.add(this.camera);

    // CHANGE CONTROLS PLACE
    const controls = new OrbitControls(this.camera, canvas);
    controls.enableRotate = false;
    controls.enablePan = false;
    controls.minZoom = 0.2;
    controls.maxZoom = 10;

    this.plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    this.renderer = this.makeRenderer();
    this.renderLoop();
  }

  private getCamera() {
    const frustumHeight = 10;
    const aspect = window.innerWidth / window.innerHeight;

    const frustumWidth = frustumHeight * aspect;
    return new THREE.OrthographicCamera(
      -frustumWidth / 2,
      frustumWidth / 2,
      frustumHeight / 2,
      -frustumHeight / 2,
      0.1,
      100,
    );
  }

  private makeScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#f7f7f7");
    const grid = new THREE.GridHelper(200, 200, "#cbd5e1", "#e5e7eb");
    grid.rotation.x = Math.PI / 2;
    scene.add(grid);

    return scene;
  }

  private makeRenderer() {
    const renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    return renderer;
  }

  private renderLoop() {
    const tick = () => {
      this.renderer.render(this.scene, this.camera);

      requestAnimationFrame(tick);
    };
    tick();
  }

  add(shape: THREE.Object3D) {
    this.scene.add(shape);
  }
  remove(shape: THREE.Object3D) {
    this.scene.remove(shape);
  }

  resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.renderer.setSize(width, height);

    const aspect = width / height;

    const frustumHeight = 10;
    // Orthographic
    this.camera.left = (-frustumHeight * aspect) / 2;
    this.camera.right = (frustumHeight * aspect) / 2;
    this.camera.top = frustumHeight / 2;
    this.camera.bottom = -frustumHeight / 2;
    this.camera.updateProjectionMatrix();
  }
}
