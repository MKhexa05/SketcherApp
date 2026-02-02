import * as THREE from "three";
import { EllipseShape } from "../../domain/shapes/EllipseShape";
import { CreationTool } from "./CreationTool";
import { SketcherRenderer } from "../../domain/Rendering/Renderer";
import { EllipseRenderer } from "../../domain/Rendering/EllipseRender";
import { ToolHelp, ToolResult } from "../Tool";
import { RayCaster } from "../../RayCaster/RayCaster";

export class EllipseTool extends CreationTool<EllipseShape> {
  centerPoint: THREE.Vector3;
  radiusX: number;
  radiusY: number;

  previewEllipse: THREE.Mesh;

  constructor(renderer: SketcherRenderer) {
    super(renderer);
    this.centerPoint = new THREE.Vector3();
    this.radiusX = 0;
    this.radiusY = 0;

    this.previewEllipse = null as any;
  }

  //      NOT SURE IF I SHOULD HAVE THIS
  getPreview(): unknown | null {
    return null;
  }

  //      NOT SURE IF I SHOULD HAVE THIS
  onActivate(): void {}

  //      NOT SURE IF I SHOULD HAVE THIS
  onDeactivate(): void {
    if (this.isDrawing) {
      this.endDraw = false;
      this.isDrawing = false;
      this.renderer.remove(this.previewEllipse);
    }
  }

  //      NOT SURE IF I SHOULD HAVE THIS
  onCancel(): void {}

  onPointerDown(event: PointerEvent | MouseEvent): void {
    if (this.isDrawing) return;
    this.isDrawing = true;

    //@ts-ignore
    const intersectionPoint: Vector3 = RayCaster.pointOnPlane(event);
    if (!intersectionPoint) return;

    this.centerPoint.copy(intersectionPoint);

    // CIRCLER RENDERER NEEDS TO BE INSERTED HERE
    this.previewEllipse = EllipseRenderer.getMesh(1);
    this.previewEllipse.scale.set(0.0001, 0.0001, 1);

    this.renderer.add(this.previewEllipse);
  }

  onPointerMove(event: PointerEvent | MouseEvent): void {
    if (!this.isDrawing || !this.previewEllipse) return;

    this.previewEllipse.position.copy(this.centerPoint);

    //@ts-ignore
    const intersectionPoint: Vector3 = RayCaster.pointOnPlane(event);

    this.radiusX = Math.abs(intersectionPoint.x - this.centerPoint.x);
    this.radiusY = Math.abs(intersectionPoint.y - this.centerPoint.y);

    // this.radius = this.centerPoint.distanceTo(intersectionPoint);

    this.previewEllipse.scale.set(this.radiusX, this.radiusY, 1);

    this.endDraw = true;
  }

  onPointerUp(
    event: PointerEvent | MouseEvent,
  ): ToolResult<EllipseShape> | null {
    if (!this.endDraw) {
      return null;
    }

    if (!this.isDrawing) {
      return null;
    }

    this.endDraw = false;
    this.isDrawing = false;
    this.radiusX = this.previewEllipse.scale.x;
    this.radiusY = this.previewEllipse.scale.y;
    this.renderer.remove(this.previewEllipse);

    const center = new THREE.Vector3().copy(this.centerPoint);

    const ellipse = new EllipseShape(
      center,
      this.radiusX,
      this.radiusY,
      new THREE.Color("red"),
    );

    return { completed: true, payload: ellipse };
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === "Escape") {
      this.isDrawing = false;
      this.endDraw = false;
      this.renderer.remove(this.previewEllipse);
    }
  }

  getHelp(): ToolHelp | null {
    return {
      title: "Ellipse Tool",
      hints: [
        "Click to set Center point",
        "Move mouse to get desired Radius",
        "Click again to finish",
        "Press Esc → cancel",
      ],
    };
  }
}
