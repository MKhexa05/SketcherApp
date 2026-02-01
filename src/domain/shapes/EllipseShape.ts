import { PropertyDescriptor, Shape } from "./Shape";
import * as THREE from "three";

export class EllipseShape extends Shape {
  centerPoint: THREE.Vector3;
  radiusX: number;
  radiusY: number;
  type: string;
  static count: number = 0;

  constructor(
    centerPoint: THREE.Vector3,
    radiusX: number,
    radiusY: number,
    color: THREE.Color,
    name?: string,
  ) {
    if (name) {
      super(color, name);
    } else {
      super(color, `Ellipse ${++EllipseShape.count}`);
    }
    this.centerPoint = centerPoint;
    this.radiusX = radiusX;
    this.radiusY = radiusY;
    this.type = "ellipse";
  }

  getEditableProps(): PropertyDescriptor[] {
    const centerToExpose: PropertyDescriptor = {
      key: "centerPoint",
      label: "Center Point",
      editor: "vector3",
      get: () => ({
        x: this.centerPoint.x,
        y: this.centerPoint.y,
        z: this.centerPoint.z,
      }),
      set: (v: { x: number; y: number; z: number }) => {
        this.centerPoint.x = v.x;
        this.centerPoint.y = v.y;
        this.centerPoint.z = v.z;
      },
    };

    const radiusXToExpose: PropertyDescriptor = {
      key: "radiusX",
      label: "Radius X",
      editor: "number",
      get: () => this.radiusX,
      set: (v: number) => (this.radiusX = v),
    };

    const radiusYToExpose: PropertyDescriptor = {
      key: "radiusY",
      label: "Radius Y",
      editor: "number",
      get: () => this.radiusY,
      set: (v: number) => (this.radiusY = v),
    };
    const colorToExpose: PropertyDescriptor = {
      key: "color",
      label: "Color",
      editor: "color",
      get: () => `#${new THREE.Color(this.color).getHexString()}`,
      set: (v: THREE.Color) => (this.color = v),
    };

    return [centerToExpose, radiusXToExpose, radiusYToExpose, colorToExpose];
  }

  toJSON() {
    return {
      type: "ellipse",
      name: this.name,
      id: this.id,
      centerPoint: this.centerPoint.toArray(),
      radiusX: this.radiusX,
      radiusY: this.radiusY,
      color: this.color.getHex(),
      visible: this.isVisible,
    };
  }
  static fromJSON(data: any) {
    const shape = new EllipseShape(
      new THREE.Vector3().fromArray(data.centerPoint),
      data.radiusX,
      data.radiusY,
      new THREE.Color(data.color),
      data.name,
    );
    shape.id = data.id;
    shape.isVisible = data.visible;

    return shape;
  }
}
