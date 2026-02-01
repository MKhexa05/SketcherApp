import { Tool, ToolHelp, ToolResult } from "../Tool";
import { ShapeManager } from "../../domain/ShapeManager";
import { Shape } from "../../domain/shapes/Shape";
import { SelectionManager } from "../SelectionManager";
import { RayCaster } from "../../RayCaster/RayCaster";

export class SelectTool extends Tool {
  selectionManager: SelectionManager;
  shapeManager: ShapeManager;

  constructor(shapeManager: ShapeManager, selectionManager: SelectionManager) {
    super();
    this.shapeManager = shapeManager;
    this.selectionManager = selectionManager;
  }

  onPointerDown(event: PointerEvent | MouseEvent): void {
    const allShapes = Array.from(this.shapeManager.getAll().values())
      .filter((e) => e.shape.isVisible)
      .map((e) => e.mesh);
    if (allShapes.length > 0) {
      const intersects = RayCaster.intersectingObjects(event, allShapes);
      if (intersects && intersects.length > 0) {
        this.selectionManager.select(intersects[intersects.length-1].object);
      } else {
        this.selectionManager.clear();
      }
    }
  }

  onPointerMove(event: PointerEvent | MouseEvent): void {}

  //      NOT SURE IF I SHOULD HAVE THIS
  onActivate(): void {}

  //      NOT SURE IF I SHOULD HAVE THIS
  onDeactivate(): void {}

  //      NOT SURE IF I SHOULD HAVE THIS
  onCancel(): void {}

  onPointerUp(
    event: PointerEvent | MouseEvent,
  ): ToolResult<Shape> | null | undefined {
    return null;
  }
  onKeyDown(event: KeyboardEvent): void {
    if (event.key == "Escape") {
      this.selectionManager.clear();
    }
  }

  getHelp(): ToolHelp | null {
    return {
      title: "Select Tool",
      hints: [
        "Click to select shape",
        "Update properties from the Right panel",
        "Press Esc → deselect",
      ],
    };
  }
}
