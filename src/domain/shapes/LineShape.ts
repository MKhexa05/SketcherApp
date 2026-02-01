import { Color, Vector3 } from "three";
import { PropertyDescriptor, Shape } from "./Shape";

export class LineShape extends Shape {
  startPoint: Vector3;
  endPoint: Vector3;
  type: string;
  static count: number = 0;

  constructor(
    startPoint: Vector3,
    endPoint: Vector3,
    color: Color,
    name?: string,
  ) {
    if (name) {
      super(color, name);
    } else {
      super(color, `Line ${++LineShape.count}`);
    }
    this.startPoint = startPoint;
    this.endPoint = endPoint;
    this.type = "line";
  }

  getEditableProps(): PropertyDescriptor[] {
    const startPointToExpose: PropertyDescriptor = {
      key: "startPoint",
      label: "Start Point",
      editor: "vector3",
      get: () => ({
        x: this.startPoint.x,
        y: this.startPoint.y,
        z: this.startPoint.z,
      }),
      set: (v: { x: number; y: number; z: number }) => {
        this.startPoint.set(v.x, v.y, v.z);
      },
    };

    const endPointToExpose: PropertyDescriptor = {
      key: "endPoint",
      label: "End Point",
      editor: "vector3",
      get: () => ({
        x: this.endPoint.x,
        y: this.endPoint.y,
        z: this.endPoint.z,
      }),
      set: (v: { x: number; y: number; z: number }) => {
        this.endPoint.set(v.x, v.y, v.z);
      },
    };

    const colorToExpose: PropertyDescriptor = {
      key: "color",
      label: "Color",
      editor: "color",
      get: () => `#${new Color(this.color).getHexString()}`,
      set: (v: Color) => (this.color = v),
    };
    return [startPointToExpose, endPointToExpose, colorToExpose];
  }

  toJSON() {
    return {
      type: "line",
      name: this.name,
      id: this.id,
      startPoint: this.startPoint.toArray(),
      endPoint: this.endPoint.toArray(),
      color: this.color.getHex(),
      visible: this.isVisible,
    };
  }
  static fromJSON(data: any) {
    const shape = new LineShape(
      new Vector3().fromArray(data.startPoint),
      new Vector3().fromArray(data.endPoint),
      new Color(data.color),
      data.name,
    );
    shape.id = data.id;
    shape.isVisible = data.visible;

    return shape;
  }
}
