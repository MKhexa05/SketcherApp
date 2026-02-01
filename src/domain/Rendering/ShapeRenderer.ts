import { Object3D } from "three";
import { Shape } from "../shapes/Shape";
export abstract class ShapeRenderer<T extends Shape> {
  abstract makeMesh(shape: T): Object3D;
  abstract updateMesh(Shape: T, mesh: Object3D): void;
}
