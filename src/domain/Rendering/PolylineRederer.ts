import * as THREE from "three";
import { ShapeRenderer } from "./ShapeRenderer";
import { PolylineShape } from "../shapes/PolylineShape";

export class PolylineRenderer extends ShapeRenderer<PolylineShape> {
  constructor() {
    super();
  }

  makeMesh(polyline: PolylineShape): THREE.Object3D {
    const lineToRender = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(polyline.points),
      new THREE.LineBasicMaterial({ color: polyline.color }),
    );
    return lineToRender;
  }

  updateMesh(polyline: PolylineShape, mesh: THREE.Line): void {
    mesh.geometry.attributes.position.needsUpdate = true;
    const positions = mesh.geometry.attributes.position.array;
    polyline.points.forEach((p, i) => {
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.z;
    });
    //@ts-ignore
    mesh.material.visible = polyline.isVisible;
    //@ts-ignore
    mesh.material.color = new THREE.Color(polyline.color);
    mesh.geometry.attributes.position.needsUpdate = false;
  }

  static getMesh(points: THREE.Vector3[]) {
    return new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(points),
      new THREE.LineBasicMaterial({ color: "red" }),
    );
  }
}
