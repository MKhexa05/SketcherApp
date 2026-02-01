import * as THREE from "three";
import { LineShape } from "../shapes/LineShape";
import { ShapeRenderer } from "./ShapeRenderer";

export class LineRenderer extends ShapeRenderer<LineShape> {
  constructor() {
    super();
  }

  makeMesh(line: LineShape): THREE.Object3D {
    const lineToRender = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        line.startPoint,
        line.endPoint,
      ]),
      new THREE.LineBasicMaterial({ color: line.color }),
    );

    return lineToRender;
  }

  updateMesh(line: LineShape, mesh: THREE.Object3D): void {
    //@ts-ignore
    mesh.geometry.attributes.position.needsUpdate = true;
    //@ts-ignore
    const positions = mesh.geometry.attributes.position.array;
    positions[0] = line.startPoint.x;
    positions[1] = line.startPoint.y;
    positions[2] = line.startPoint.z;
    positions[3] = line.endPoint.x;
    positions[4] = line.endPoint.y;
    positions[5] = line.endPoint.z;

    //@ts-ignore
    mesh.material.visible = line.isVisible;
    //@ts-ignore
    mesh.material.color = new THREE.Color(line.color);
    //@ts-ignore
    mesh.geometry.attributes.position.needsUpdate = false;
  }

  static getMesh(startPoint: THREE.Vector3, endPoint: THREE.Vector3) {
    return new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([startPoint, endPoint]),
      new THREE.LineBasicMaterial({ color: "red" }),
    );
  }
}
