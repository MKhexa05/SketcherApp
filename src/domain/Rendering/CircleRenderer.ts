import * as THREE from "three";
import { CircleShape } from "../shapes/CircleShape";
import { ShapeRenderer } from "./ShapeRenderer";
import { color } from "three/tsl";

export class CircleRenderer extends ShapeRenderer<CircleShape> {
  constructor() {
    super();
  }

  static getMesh(radius: number) {
    return new THREE.Mesh(
      new THREE.CircleGeometry(radius),
      new THREE.MeshBasicMaterial({ color: "red" }),
    );
  }

  makeMesh(shape: CircleShape): THREE.Object3D {
    const circleToRender = new THREE.Mesh(
      new THREE.CircleGeometry(1),
      new THREE.MeshBasicMaterial({ color: shape.color }),
    );
    circleToRender.scale.set(shape.radius, shape.radius, 1);
    circleToRender.position.copy(shape.centerPoint);
    return circleToRender;
  }
  updateMesh(circle: CircleShape, mesh: THREE.Object3D): void {
    mesh.scale.set(circle.radius, circle.radius, 1);
    mesh.position.copy(circle.centerPoint);
    //@ts-ignore
    mesh.material.color = new THREE.Color(circle.color);
    //@ts-ignore
    mesh.material.visible = circle.isVisible;
  }
}
