import { Vector3 } from "three";
import { PropertyEditor } from "./PropertyEditor";
import { PropertyDescriptor, Shape } from "../../domain/shapes/Shape";

export class Vector3Editor implements PropertyEditor<Vector3> {
  render(
    descriptor: PropertyDescriptor,
    shape: Shape,
    onChange?: (shape: Shape) => void,
  ) {
    const v = descriptor.get();

    const container = document.createElement("div");
    container.className = "vector3-editor";

    const label = document.createElement("div");
    label.className = "vector3-label";
    label.textContent = descriptor.label;

    const inputsRow = document.createElement("div");
    inputsRow.className = "vector3-inputs";

    const makeInput = (axis: "x" | "y" | "z") => {
      const wrapper = document.createElement("div");
      wrapper.className = "vector3-axis";

      const axisLabel = document.createElement("span");
      axisLabel.textContent = axis;

      const input = document.createElement("input");
      input.type = "number";
      input.value = v[axis].toString();

      input.oninput = () => {
        v[axis] = Number(input.value);
        descriptor.set(v);
        onChange?.(shape);
      };

      wrapper.append(axisLabel, input);
      return wrapper;
    };

    inputsRow.append(makeInput("x"), makeInput("y"), makeInput("z"));

    container.append(label, inputsRow);
    return container;
  }
}
