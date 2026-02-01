import { PropertyDescriptor, Shape } from "../../domain/shapes/Shape";
import { PropertyEditor } from "./PropertyEditor";

export class NumberInput implements PropertyEditor<number> {
  render(
    descriptor: PropertyDescriptor,
    shape: Shape,
    onChange?: (shape: Shape) => void,
  ) {
    const container = document.createElement("div");
    container.className = "number-editor";

    const label = document.createElement("label");
    // label.className = "number-editor-label";
    label.textContent = descriptor.label;

    const input = document.createElement("input");
    input.type = "number";
    input.value = descriptor.get().toString();

    input.oninput = () => {
      descriptor.set(Number(input.value));
      onChange?.(shape);
    };

    container.append(label, input);
    return container;
  }
}
