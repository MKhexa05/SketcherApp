import { Shape } from "../shapes/Shape";
import { ShapeRenderer } from "./ShapeRenderer";

type ShapeConstructor<T extends Shape = Shape> = new (...args: any[]) => T;

export class RendererRegistry {
  private renderers = new Map<ShapeConstructor, ShapeRenderer<any>>();

  register<T extends Shape>(
    shapeCtor: ShapeConstructor<T>,
    renderer: ShapeRenderer<T>,
  ): void {
    this.renderers.set(shapeCtor, renderer);
  }

  getRenderer<T extends Shape>(shape: T): ShapeRenderer<T> {
    const renderer = this.renderers.get(
      shape.constructor as ShapeConstructor<T>,
    );

    if (!renderer) {
      throw new Error(
        `No renderer registered for shape: ${shape.constructor.name}`,
      );
    }

    return renderer;
  }
}
