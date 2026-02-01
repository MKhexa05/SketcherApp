import { Color, Vector3 } from "three";
import { PropertyDescriptor, Shape } from "./Shape";

export class PolylineShape extends Shape {
  points: Vector3[];
  type: string;
  static count: number = 0;

  constructor(points: Vector3[], color: Color, name?: string) {
    if (name) {
      super(color, name);
    } else {
      super(color, `Polyline ${++PolylineShape.count}`);
    }
    this.points = points;
    this.type = "polyline";
  }
  getEditableProps(): PropertyDescriptor[] {
    const thingsToExpose: PropertyDescriptor[] = this.points.map(
      (point, index) => ({
        key: "points",
        label: `Point${index}`,
        editor: "vector3",
        get: () => ({
          x: point.x,
          y: point.y,
          z: point.z,
        }),
        set: (v: { x: number; y: number; z: number }) => {
          point.set(v.x, v.y, v.z);
        },
      }),
    );

    const colorToExpose: PropertyDescriptor = {
      key: "color",
      label: "Color",
      editor: "color",
      get: () => `#${new Color(this.color).getHexString()}`,
      set: (v: Color) => (this.color = v),
    };

    thingsToExpose.push(colorToExpose);
    return thingsToExpose;
  }
  toJSON() {
    return {
      type: "polyline",
      name: this.name,
      id: this.id,
      points: this.points.map((p) => p.toArray()),
      color: this.color.getHex(),
      visible: this.isVisible,
    };
  }

  static fromJSON(data: any): PolylineShape {
    const points = data.points.map((p: number[]) => new Vector3().fromArray(p));

    const shape = new PolylineShape(points, new Color(data.color), data.name);

    shape.id = data.id;
    shape.isVisible = data.visible;

    return shape;
  }
}
