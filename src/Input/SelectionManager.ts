import { Object3D } from "three";

export class SelectionManager {
  private selectedShape: Object3D | null = null;
  private listeners = new Set<(s: Object3D | null) => void>();

  select(selectedShape: Object3D) {
    this.clear();
    this.selectedShape = selectedShape;
    this.notify();
  }

  get() {
    return this.selectedShape;
  }

  clear() {
    if (this.selectedShape) {
      this.selectedShape = null;
    }
    this.notify();
  }

  notify() {
    this.listeners.forEach((l) => l(this.selectedShape));
  }

  onChange(cb: (s: Object3D | null) => void) {
    this.listeners.add(cb);
  }
}
