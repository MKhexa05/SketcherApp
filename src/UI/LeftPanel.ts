import { ShapeManager } from "../domain/ShapeManager";
import { Shape } from "../domain/shapes/Shape";
import { SelectionManager } from "../Input/SelectionManager";
import * as THREE from "three";

export class ShapesListPanel {
  constructor(
    private container: HTMLElement,
    private shapeManager: ShapeManager,
    private selectionManager: SelectionManager,
    private selectedUUID: string | null = null,
  ) {
    this.selectionManager.onChange((mesh) => {
      this.setSelected(mesh);
    });
  }

  render() {
    this.clear();

    const title = document.createElement("h3");
    title.textContent = "List of Created Objects";
    this.container.appendChild(title);

    const list = document.createElement("ul");
    list.className = "shapes-list";

    const entries = Array.from(this.shapeManager.getAll().values());

    entries.forEach((entry, index) => {
      const { shape, mesh } = entry;
      this.formatShapeName(shape);

      const item = document.createElement("li");
      item.className = "shape-item";
      item.dataset.uuid = mesh.uuid;

      if (mesh.uuid === this.selectedUUID) {
        item.classList.add("selected");
      }

      // label
      const label = document.createElement("span");
      label.className = "shape-label";
      label.textContent = `${shape.name}  `;
      item.onclick = () => this.selectionManager.select(mesh);

      // visibility button
      const eyeBtn = document.createElement("button");
      eyeBtn.className = "shape-btn eye";
      //@ts-ignore
      eyeBtn.innerHTML = mesh.material.visible
        ? `<i class="fa-solid fa-eye"></i>`
        : `<i class="fa-solid fa-eye-slash"></i>`;

      eyeBtn.onclick = (e) => {
        e.stopPropagation();
        this.shapeManager.toggleVisibility(shape);
        this.selectionManager.notify();
        this.render();
      };

      // delete button
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "shape-btn delete";
      deleteBtn.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;

      deleteBtn.onclick = (e) => {
        e.stopPropagation();
        this.shapeManager.deleteShape(shape);
        this.selectionManager.notify();
      };

      item.append(label, eyeBtn, deleteBtn);
      list.appendChild(item);
    });

    this.container.appendChild(list);
  }

  setSelected(mesh: THREE.Object3D | null) {
    this.selectedUUID = mesh?.uuid ?? null;
    this.render();
  }
  clear() {
    this.container.innerHTML = "";
  }

  private formatShapeName(shape: Shape) {
    if (shape.name) {
      return shape.name;
    }
  }
}
