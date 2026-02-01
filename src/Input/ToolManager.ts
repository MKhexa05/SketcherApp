import { Shape } from "../domain/shapes/Shape";
import { ToolResult } from "./Tools/CreationTool";
import { Tool } from "./Tool";

export class ToolManager {
  activeTool: Tool | null = null;

  resetTool() {
    this.activeTool = null;
  }

  setTool(tool: Tool) {
    this.activeTool?.onDeactivate();
    this.activeTool = tool;
    this.activeTool?.onActivate();
  }

  pointerDown(e: PointerEvent | MouseEvent) {
    this.activeTool?.onPointerDown(e);
  }

  pointerMove(e: PointerEvent | MouseEvent) {
    this.activeTool?.onPointerMove(e);
  }

  pointerUp(
    e: PointerEvent | MouseEvent,
  ): ToolResult<Shape> | null | undefined {
    return this.activeTool?.onPointerUp(e);
  }

  keyDown(e: KeyboardEvent) {
    this.activeTool?.onKeyDown(e);
  }
}
