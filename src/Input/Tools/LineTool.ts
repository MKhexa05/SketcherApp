import { CreationTool, ToolResult } from "./CreationTool";
import { LineShape } from "../../domain/shapes/LineShape";
import * as THREE from "three";
import { LineRenderer } from "../../domain/Rendering/LineRenderer";
import { SketcherRenderer } from "../../domain/Rendering/Renderer";
import { RayCaster } from "../../RayCaster/RayCaster";
import { Vector3 } from "three";

export class LineTool extends CreationTool<LineShape> {
  previewLine: THREE.Line;
  startPoint: THREE.Vector3;

  drawinX: boolean;
  drawinY: boolean;

  constructor(renderer: SketcherRenderer) {
    super(renderer);

    this.drawinX = false;
    this.drawinY = false;
    this.startPoint = new THREE.Vector3();
    this.previewLine = null as any;
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
      this.isDrawing = false;
      this.drawinX = false;
      this.drawinY = false;
      this.endDraw = false;
      this.renderer.remove(this.previewLine);
      this.previewLine.geometry.dispose();
    }
  }

  //      NOT SURE IF I SHOULD HAVE THIS
  onCancel(): void {}

  onPointerDown(event: PointerEvent): void {
    if (this.isDrawing) return;

    const intersectionPoint: THREE.Vector3 = RayCaster.pointOnPlane(event);
    if (!intersectionPoint) return;

    this.startPoint.copy(intersectionPoint);

    this.previewLine = LineRenderer.getMesh(this.startPoint, this.startPoint);

    this.renderer.add(this.previewLine);
    this.isDrawing = true;
  }

  onPointerMove(event: PointerEvent | MouseEvent): void {
    if (!this.isDrawing || !this.previewLine) return;

    //@ts-ignore
    const intersectionPoint: THREE.Vector3 = RayCaster.pointOnPlane(event);
    if (!intersectionPoint) return;

    const positions = this.previewLine.geometry.attributes.position.array;

    if (this.drawinY) {
      positions[3] = this.startPoint.x;
    } else {
      positions[3] = intersectionPoint.x;
    }
    if (!this.drawinX) {
      positions[4] = intersectionPoint.y;
    } else {
      positions[4] = this.startPoint.y;
    }
    positions[5] = intersectionPoint.z;

    this.previewLine.geometry.attributes.position.needsUpdate = true;
    this.endDraw = true;
  }

  onPointerUp(event: PointerEvent): ToolResult<LineShape> | null {
    if (!this.isDrawing) {
      return null;
    }
    if (!this.endDraw) {
      return null;
    }

    const positions = this.previewLine.geometry.attributes.position.array;

    const endPoint = new Vector3(positions[3], positions[4], positions[5]);
    const start = new Vector3().copy(this.startPoint);

    const line = new LineShape(start, endPoint, new THREE.Color("red"));

    this.previewLine.geometry.attributes.position.needsUpdate = false;
    this.isDrawing = false;
    this.drawinX = false;
    this.drawinY = false;
    this.endDraw = false;
    this.renderer.remove(this.previewLine);
    this.previewLine.geometry.dispose();

    return { completed: true, payload: line };
  }

  onKeyDown(event: KeyboardEvent): void {
    if (!this.isDrawing) return;
    if (event.key === "x") {
      this.drawinX = true;
      this.drawinY = false;
    }
    if (event.key === "y") {
      this.drawinY = true;
      this.drawinX = false;
    }
    if (event.ctrlKey) {
      this.drawinX = false;
      this.drawinY = false;
    }
    if (event.key === "Escape") {
      this.isDrawing = false;
      this.endDraw = false;
      this.previewLine.geometry.attributes.position.needsUpdate = false;
      this.drawinX = false;
      this.renderer.remove(this.previewLine);
    }
  }

  getHelp() {
    return {
      title: "Line Tool",
      hints: [
        "Click to set start point",
        "Click again to finish",
        "Press X → lock X axis",
        "Press Y → lock Y axis",
        "Press Ctrl → Free locked axis",
        "Press Esc → cancel",
      ],
    };
  }
}
