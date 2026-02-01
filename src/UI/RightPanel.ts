import { EditorRegistry } from "./EditorRegistry";
import { Shape } from "../domain/shapes/Shape";

export class PropertiesPanel {
  constructor(
    private container: HTMLElement,
    private registry: EditorRegistry,
    private onChange: (shape: Shape) => void,
    private onDelete: (shape: Shape) => void,
    private onToggleVisibility: (shape: Shape) => void,
    private notifySelectionManager: () => void,
  ) {}

  show(shape: Shape) {
    this.container.innerHTML = "";

    // header
    const header = document.createElement("div");
    header.className = "properties-header";

    const buttons = document.createElement("div");
    buttons.className = "properties-buttons";

    const title = document.createElement("h3");
    title.textContent = "Properties:";
    const shapeName = document.createElement("h4");
    shapeName.textContent = shape.name;

    header.append(title, shapeName);
    this.container.appendChild(header);

    for (const prop of shape.getEditableProps()) {
      const editor = this.registry.get(prop.editor);
      const el = editor.render(prop, shape, this.onChange);
      this.container.appendChild(el);
    }

    const eyeBtn = document.createElement("button");
    eyeBtn.className = "prop-btn eye";
    eyeBtn.innerHTML = shape.isVisible
      ? `<i class="fa-solid fa-eye"></i>`
      : `<i class="fa-solid fa-eye-slash"></i>`;
    eyeBtn.onclick = () => {
      this.onToggleVisibility(shape);
      this.show(shape);
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "prop-btn delete";
    deleteBtn.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;

    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      this.onDelete(shape);
      this.notifySelectionManager();
    };

    buttons.append(eyeBtn, deleteBtn);

    this.container.appendChild(buttons);
  }

  clear() {
    this.container.innerHTML = `
    <div class="placeholder">
      ⓘ
      <p>Select Your shape</p>
    </div>
  `;
  }
}
