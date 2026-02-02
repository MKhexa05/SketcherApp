import { Object3D } from "three";
import { SketcherRenderer } from "./Rendering/Renderer";
import { Shape } from "./shapes/Shape";
import { RendererRegistry } from "./Rendering/RendererRegistry";
import { EllipseShape } from "./shapes/EllipseShape";
import { LineShape } from "./shapes/LineShape";
import { CircleShape } from "./shapes/CircleShape";
import { PolylineShape } from "./shapes/PolylineShape";

export class ShapeManager {
  registry: RendererRegistry;
  renderer: SketcherRenderer;

  constructor(renderer: SketcherRenderer, registry: RendererRegistry) {
    this.renderer = renderer;
    this.registry = registry;
  }

  private allShapes = new Map<string, { shape: Shape; mesh: Object3D }>();
  private listeners = new Set<() => void>();

  add(shape: Shape) {
    const shapeRenderer = this.registry.getRenderer(shape);
    const mesh = shapeRenderer.makeMesh(shape);
    this.allShapes.set(mesh.uuid, { shape, mesh });
    this.renderer.add(mesh);
    this.notify();
  }

  deleteShape(shape: Shape) {
    const meshToDelete = this.getMeshByShape(shape);
    if (meshToDelete) {
      this.allShapes.delete(meshToDelete.uuid);
      this.renderer.remove(meshToDelete);
    }
    this.notify();
  }

  remove(mesh: Object3D) {
    const shapeToDelete = this.allShapes.get(mesh.uuid);
    if (!shapeToDelete) {
      // console.log("no shape with this id");
      return;
    }

    this.renderer.remove(shapeToDelete.mesh);
    this.allShapes.delete(mesh.uuid);
    // this.allShapes.filter((s) => s.id != shape.id);
  }

  getAll(): { shape: Shape; mesh: Object3D }[] {
    return this.allShapes.values().toArray();
  }

  getByMesh(mesh: Object3D) {
    const requestedShape = this.allShapes.get(mesh.uuid);
    if (!requestedShape) {
      // console.log("no shape for this mesh");
      return null;
    }
    return requestedShape.shape;
  }

  onChange(listener: () => void) {
    this.listeners.add(listener);

    // optional: return unsubscribe function (VERY useful)
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  private getMeshByShape(shape: Shape) {
    const requestedShapeMesh = this.getAll().find(
      (sm) => sm.shape.id === shape.id,
    );
    if (requestedShapeMesh) {
      return requestedShapeMesh.mesh;
    }
    return null;
  }

  updateMesh(shape: Shape) {
    const shapeRenderer = this.registry.getRenderer(shape);
    const mesh = this.getMeshByShape(shape);
    if (mesh) {
      shapeRenderer.updateMesh(shape, mesh);
    } else {
      // console.log("no mesh for this shape");
    }
    this.notify();
  }

  toggleVisibility(shape: Shape) {
    shape.isVisible = !shape.isVisible;
    this.updateMesh(shape);
  }

  serialize() {
    return Array.from(this.allShapes.values()).map((s) => s.shape.toJSON());
  }

  load(data: any[]) {
    this.clear();

    for (const item of data) {
      const shape = this.factoryFromJSON(item);
      this.add(shape);
    }
  }

  private clear() {
    this.allShapes.clear();
    this.renderer.clearScene();
  }

  private factoryFromJSON(data: any): Shape {
    switch (data.type) {
      case "ellipse":
        return EllipseShape.fromJSON(data);
      case "line":
        return LineShape.fromJSON(data);
      case "circle":
        return CircleShape.fromJSON(data);
      case "polyline":
        return PolylineShape.fromJSON(data);
      default:
        throw new Error("Unknown shape");
    }
  }
}
