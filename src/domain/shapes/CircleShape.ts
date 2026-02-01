import { Color, Object3D, Vector3 } from "three";
import { PropertyDescriptor, Shape } from "./Shape";

export class CircleShape extends Shape {
  centerPoint: Vector3;
  radius: number;
  type: string;
  static count: number = 0;

  constructor(
    centerPoint: Vector3,
    radius: number,
    color: Color,
    name?: string,
  ) {
    if (name) {
      super(color, name);
    } else {
      super(color, `Circle ${++CircleShape.count}`);
    }
    this.centerPoint = centerPoint;
    this.radius = radius;
    this.type = "circle";
  }

  getMesh(): Object3D {
    return null;
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

    const radiusToExpose: PropertyDescriptor = {
      key: "radius",
      label: "Radius",
      editor: "number",
      get: () => this.radius,
      set: (v: number) => (this.radius = v),
    };

    const colorToExpose: PropertyDescriptor = {
      key: "color",
      label: "Color",
      editor: "color",
      get: () => `#${new Color(this.color).getHexString()}`,
      set: (v: Color) => (this.color = v),
    };

    return [centerToExpose, radiusToExpose, colorToExpose];
  }

  toJSON() {
    return {
      type: "circle",
      name: this.name,
      id: this.id,
      centerPoint: this.centerPoint.toArray(),
      radius: this.radius,
      color: this.color.getHex(),
      visible: this.isVisible,
    };
  }
  static fromJSON(data: any) {
    const shape = new CircleShape(
      new Vector3().fromArray(data.centerPoint),
      data.radius,
      new Color(data.color),
      data.name,
    );
    shape.id = data.id;
    shape.isVisible = data.visible;

    return shape;
  }
}
