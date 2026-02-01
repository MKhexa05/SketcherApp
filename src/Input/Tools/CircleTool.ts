import { SketcherRenderer } from "../../domain/Rendering/Renderer";
import { CircleShape } from "../../domain/shapes/CircleShape";
import { CreationTool, ToolResult } from "./CreationTool";
import * as THREE from "three";
import { CircleRenderer } from "../../domain/Rendering/CircleRenderer";
import { RayCaster } from "../../RayCaster/RayCaster";
import { ToolHelp } from "../Tool";

export class CircleTool extends CreationTool<CircleShape> {
  centerPoint: THREE.Vector3;
  radius: number;

  previewCircle: THREE.Mesh;

  constructor(renderer: SketcherRenderer) {
    super(renderer);
    this.centerPoint = new THREE.Vector3();
    this.radius = 0;

    this.previewCircle = null as any;
  }

  //      NOT SURE IF I SHOULD HAVE THIS
  getPreview(): unknown | null {
    return null;
  }

  //      NOT SURE IF I SHOULD HAVE THIS
  onActivate(): void {}

  //      NOT SURE IF I SHOULD HAVE THIS
  onDeactivate(): void {}

  //      NOT SURE IF I SHOULD HAVE THIS
  onCancel(): void {}

  onPointerDown(event: PointerEvent | MouseEvent): void {
    if (this.isDrawing) return;
    this.isDrawing = true;

    const intersectionPoint = RayCaster.pointOnPlane(event);
    if (!intersectionPoint) return;

    this.centerPoint.copy(intersectionPoint);

    // CIRCLER RENDERER NEEDS TO BE INSERTED HERE
    this.previewCircle = CircleRenderer.getMesh(1);
    this.previewCircle.scale.set(0.0001, 0.0001, 1);

    this.renderer.add(this.previewCircle);
  }

  onPointerMove(event: PointerEvent | MouseEvent): void {
    if (!this.isDrawing || !this.previewCircle) return;

    this.previewCircle.position.copy(this.centerPoint);

    const intersectionPoint = RayCaster.pointOnPlane(event);

    this.radius = this.centerPoint.distanceTo(intersectionPoint);

    this.previewCircle.scale.set(this.radius, this.radius, 1);

    this.endDraw = true;
  }

  onPointerUp(
    event: PointerEvent | MouseEvent,
  ): ToolResult<CircleShape> | null {
    if (!this.endDraw) {
      return null;
    }

    if (!this.isDrawing) {
      return null;
    }

    this.endDraw = false;
    this.isDrawing = false;
    this.renderer.remove(this.previewCircle);
    const center = new THREE.Vector3().copy(this.centerPoint);

    const circle = new CircleShape(center, this.radius, new THREE.Color("red"));

    return { completed: true, payload: circle };
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === "Escape") {
      this.isDrawing = false;
      this.endDraw = false;
      this.renderer.remove(this.previewCircle);
    }
  }

  getHelp(): ToolHelp | null {
    return {
      title: "Circle Tool",
      hints: [
        "Click to set Center point",
        "Move mouse to get desired Radius",
        "Click again to finish",
        "Press Esc → cancel",
      ],
    };
  }
}
