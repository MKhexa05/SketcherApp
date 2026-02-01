import { Shape } from "../domain/shapes/Shape";

export type ToolResult<T> = {
  completed: boolean;
  payload?: T;
};

export interface ToolHelp {
  title: string;
  hints: string[];
}

export abstract class Tool {
  // lifecycle
  abstract onActivate(): void;
  abstract onDeactivate(): void;
  abstract onCancel(): void;

  // input handling
  abstract onPointerUp(
    event: PointerEvent | MouseEvent,
  ): ToolResult<Shape> | null | undefined;
  abstract onPointerDown(event: PointerEvent | MouseEvent): void;
  abstract onPointerMove(event: PointerEvent | MouseEvent): void;
  abstract onKeyDown(event: KeyboardEvent): void;
  getHelp(): ToolHelp | null {
    return null;
  }
}
