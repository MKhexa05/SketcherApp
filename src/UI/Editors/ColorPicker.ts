import { Color } from "three";
import { PropertyDescriptor, Shape } from "../../domain/shapes/Shape";
import { PropertyEditor } from "./PropertyEditor";

export class ColorPicker implements PropertyEditor<Color> {
  render(
    descriptor: PropertyDescriptor,
    shape: Shape,
    onChange?: (shape: Shape) => void,
  ) {
    const container = document.createElement("div");
    container.className = "color-editor";

    const label = document.createElement("label");
    label.textContent = descriptor.label;

    const input = document.createElement("input");
    input.type = "color";
    input.value = descriptor.get();

    input.oninput = () => {
      descriptor.set(input.value);
      onChange?.(shape);
    };

    container.append(label, input);
    return container;
  }
}
