import * as THREE from "three";
import { ShapeRenderer } from "./ShapeRenderer";
import { EllipseShape } from "../shapes/EllipseShape";

export class EllipseRenderer extends ShapeRenderer<EllipseShape> {
  constructor() {
    super();
  }

  static getMesh(radius: number) {
    return new THREE.Mesh(
      new THREE.CircleGeometry(radius),
      new THREE.MeshBasicMaterial({ color: "red" }),
    );
  }

  makeMesh(ellipse: EllipseShape): THREE.Object3D {
    const ellipseToRender = new THREE.Mesh(
      new THREE.CircleGeometry(1),
      new THREE.MeshBasicMaterial({ color: ellipse.color }),
    );
    ellipseToRender.scale.set(ellipse.radiusX, ellipse.radiusY, 1);
    ellipseToRender.position.copy(ellipse.centerPoint);
    return ellipseToRender;
  }
  updateMesh(ellipse: EllipseShape, mesh: THREE.Mesh): void {
    //@ts-ignore
    mesh.material.color = new THREE.Color(ellipse.color);
    //@ts-ignore
    mesh.material.visible = ellipse.isVisible;
    mesh.position.copy(ellipse.centerPoint);
    mesh.scale.set(ellipse.radiusX, ellipse.radiusY, 1);
  }
}
