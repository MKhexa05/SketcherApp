import { CreationTool, ToolResult } from "./CreationTool";
import { LineShape } from "../../domain/shapes/LineShape";
import * as THREE from "three";
import { SketcherRenderer } from "../../domain/Rendering/Renderer";
import { PolylineShape } from "../../domain/shapes/PolylineShape";
import { RayCaster } from "../../RayCaster/RayCaster";
import { PolylineRenderer } from "../../domain/Rendering/PolylineRederer";
import { LineRenderer } from "../../domain/Rendering/LineRenderer";
import { Vector3 } from "three";
import { ToolHelp } from "../Tool";

export class PolylineTool extends CreationTool<PolylineShape> {
  previewLine: THREE.Line;
  previewLines: THREE.Line[];
  point: THREE.Vector3;

  points: THREE.Vector3[];

  drawinX: boolean;
  drawinY: boolean;
  previewInstantiated: boolean;

  constructor(renderer: SketcherRenderer) {
    super(renderer);

    this.drawinX = false;
    this.drawinY = false;
    this.point = new THREE.Vector3();
    this.points = [];
    this.previewLine = null as any;
    this.previewLines = [] as any;
    this.previewInstantiated = false;
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
      this.previewLines.map((line) => this.renderer.remove(line));
      this.previewLines.map((line) => line.geometry.dispose());
      this.previewLines = [];
      this.points = [];
      this.previewInstantiated = false;
    }
  }

  //      NOT SURE IF I SHOULD HAVE THIS
  onCancel(): void {}

  onPointerDown(event: PointerEvent): void {
    if (this.endDraw) return;
    const intersectionPoint: THREE.Vector3 = RayCaster.pointOnPlane(event);
    if (!intersectionPoint) return;

    this.point.copy(intersectionPoint);

    if (this.previewInstantiated) {
      const positions = this.previewLine.geometry.attributes.position.array;
      this.points.push(new Vector3(positions[3], positions[4], positions[5]));
      const positionsVector3 = new Vector3(
        positions[3],
        positions[4],
        positions[5],
      );
      this.previewLine = LineRenderer.getMesh(
        positionsVector3,
        positionsVector3,
      );

      this.drawinX = false;
      this.drawinY = false;
    } else {
      this.points.push(new Vector3(this.point.x, this.point.y, this.point.z));
      this.previewLine = LineRenderer.getMesh(this.point, this.point);
    }

    this.previewLines.push(this.previewLine);

    this.renderer.add(this.previewLine);
    this.isDrawing = true;
  }

  onPointerMove(event: PointerEvent | MouseEvent): void {
    if (!this.isDrawing || !this.previewLine) return;

    const intersectionPoint = RayCaster.pointOnPlane(event);
    if (!intersectionPoint) return;

    const positions = this.previewLine.geometry.attributes.position.array;

    if (this.drawinY) {
      positions[3] = positions[0];
    } else {
      positions[3] = intersectionPoint.x;
    }
    if (this.drawinX) {
      positions[4] = positions[1];
    } else {
      positions[4] = intersectionPoint.y;
    }
    positions[5] = intersectionPoint.z;

    this.previewLine.geometry.attributes.position.needsUpdate = true;
    this.previewInstantiated = true;
  }

  onPointerUp(event: PointerEvent): ToolResult<PolylineShape> | null {
    if (!this.isDrawing) {
      return null;
    }
    if (!this.endDraw) {
      return null;
    }

    const endPoint = RayCaster.pointOnPlane(event);

    this.points.push(endPoint);

    const line = new PolylineShape(this.points, new THREE.Color("red"));

    this.previewLine.geometry.attributes.position.needsUpdate = false;
    this.isDrawing = false;
    this.drawinX = false;
    this.drawinY = false;
    this.endDraw = false;
    this.previewLines.map((line) => this.renderer.remove(line));
    this.previewLines.map((line) => line.geometry.dispose());
    this.previewLines = [];
    this.points = [];
    this.previewInstantiated = false;

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
      this.previewLines.map((line) => this.renderer.remove(line));
      this.points = [];
    }
    if (event.key === "Shift") {
      this.endDraw = true;
    }
  }

  getHelp(): ToolHelp | null {
    return {
      title: "Polyline Tool",
      hints: [
        "Click to set start point",
        "Click to select next point",
        "Press X → lock X axis",
        "Press Y → lock Y axis",
        "Press Ctrl → Free locked axis",
        "Press Shift before the last point to finish",
        "Press Esc → cancel",
      ],
    };
  }
}
