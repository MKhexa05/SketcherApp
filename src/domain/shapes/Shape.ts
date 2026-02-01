import { Color, Object3D } from "three";

export type EditorType = "number" | "vector3" | "color";

export interface PropertyDescriptor<T = any> {
  key: string; // unique id
  label: string; // UI label
  editor: EditorType; // which editor to use
  get(): T; // read value
  set(value: T): void;
}

export abstract class Shape {
  public id: number;
  public color: Color;
  public isVisible: boolean;
  public name: string | null;
  abstract type: string;

  constructor(color: Color, name?: string) {
    this.id = Math.random() * 10;
    this.color = color;
    this.isVisible = true;
    if (name) {
      this.name = name;
    } else {
      this.name = null;
    }
  }
  abstract getMesh(): Object3D;
  abstract getEditableProps(): PropertyDescriptor[];
  setName(): void {}
  abstract toJSON(): any;
  static fromJSON(_data: any): Shape {
    throw new Error("implement in subclasses");
  }
}
