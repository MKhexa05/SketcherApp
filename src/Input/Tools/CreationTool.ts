// src/input/tools/Tool.ts

import { SketcherRenderer } from "../../domain/Rendering/Renderer";
import { Tool } from "../Tool";

export type ToolResult<T> = {
  completed: boolean;
  payload?: T;
};

export interface PointerInput {
  x: number;
  y: number;
}

export abstract class CreationTool<TShape> extends Tool {
  isDrawing: boolean;
  endDraw: boolean;
  renderer: SketcherRenderer;

  constructor(renderer: SketcherRenderer) {
    super();
    this.isDrawing = false;
    this.endDraw = false;
    this.renderer = renderer;
  }

  // input handling
  // abstract onPointerUp(
  //   event: PointerEvent | MouseEvent,
  // ): ToolResult<TShape> | null;

  // preview (intent, not rendering)
  abstract getPreview(): unknown | null;
}
