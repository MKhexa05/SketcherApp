import * as THREE from "three";
import { Object3D } from "three";

export class RayCaster {
  static camera: THREE.OrthographicCamera;

  constructor(camera: THREE.OrthographicCamera) {
    RayCaster.camera = camera;
  }

  static pointOnPlane(event: MouseEvent | PointerEvent) {
    const rayCaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    rayCaster.setFromCamera(mouse, RayCaster.camera);

    const intersectionPoint = new THREE.Vector3();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    rayCaster.ray.intersectPlane(plane, intersectionPoint);

    return intersectionPoint;
  }

  static intersectingObjects(
    event: MouseEvent | PointerEvent,
    objects: Object3D[],
  ) {
    const rayCaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    rayCaster.setFromCamera(mouse, RayCaster.camera);

    const intersectionPoint = new THREE.Vector3();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    if (objects && objects.length > 0) {
      const intersects = rayCaster.intersectObjects(objects);
      return intersects;
    }

    return null;
  }
}
