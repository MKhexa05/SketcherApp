// import { PropertyDescriptor } from "./PropertyDescriptor";

import { PropertyDescriptor, Shape } from "../../domain/shapes/Shape";

export interface PropertyEditor<T = any> {
  render(
    descriptor: PropertyDescriptor<T>,
    shape: Shape,
    onChange?: (shape: Shape) => void,
  ): HTMLElement;
}
