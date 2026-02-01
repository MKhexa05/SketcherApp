import { SketcherRenderer } from "../domain/Rendering/Renderer";
import { ShapeManager } from "../domain/ShapeManager";
import { RendererRegistry } from "../domain/Rendering/RendererRegistry";
import { SelectionManager } from "../Input/SelectionManager";
import { ToolManager } from "../Input/ToolManager";
import { LineShape } from "../domain/shapes/LineShape";
import { LineRenderer } from "../domain/Rendering/LineRenderer";
import { CircleShape } from "../domain/shapes/CircleShape";
import { CircleRenderer } from "../domain/Rendering/CircleRenderer";
import { EllipseRenderer } from "../domain/Rendering/EllipseRender";
import { EllipseShape } from "../domain/shapes/EllipseShape";
import { PolylineShape } from "../domain/shapes/PolylineShape";
import { PolylineRenderer } from "../domain/Rendering/PolylineRederer";
import { EditorRegistry } from "../UI/EditorRegistry";
import { PropertiesPanel } from "../UI/RightPanel";
import { ShapesListPanel } from "../UI/LeftPanel";
import { RayCaster } from "../RayCaster/RayCaster";
export class SkectcherApp {
  renderer: SketcherRenderer;
  shapeManager: ShapeManager;
  toolManager: ToolManager;
  selectionManager: SelectionManager;

  constructor(private canvas: HTMLCanvasElement) {
    this.renderer = new SketcherRenderer(canvas);

    this.selectionManager = new SelectionManager();
    this.toolManager = new ToolManager();

    const registry = this.createRendererRegistry();
    this.shapeManager = new ShapeManager(this.renderer, registry);

    this.initRenderer();
    this.initUI();
    this.initEvents();
    this.intitRayCaster();
  }

  intitRayCaster() {
    new RayCaster(this.renderer.camera);
  }

  initRenderer() {
    this.renderer.resize();

    window.addEventListener("resize", () => {
      this.renderer.resize();
    });
  }

  createRendererRegistry(): RendererRegistry {
    const registry = new RendererRegistry();
    registry.register(LineShape, new LineRenderer());
    registry.register(CircleShape, new CircleRenderer());
    registry.register(EllipseShape, new EllipseRenderer());
    registry.register(PolylineShape, new PolylineRenderer());
    return registry;
  }

  private initUI() {
    const leftPanel = document.getElementById("left-panel")!;
    const rightPanel = document.getElementById("right-panel")!;

    const editorRegistry = new EditorRegistry();
    const propertiesPanel = new PropertiesPanel(
      rightPanel,
      editorRegistry,
      (shape) => {
        this.shapeManager.updateMesh(shape);
      },
      (shape) => this.shapeManager.deleteShape(shape),
      (shape) => this.shapeManager.toggleVisibility(shape),
      () => this.selectionManager.notify(),
    );

    const shapesListPanel = new ShapesListPanel(
      leftPanel,
      this.shapeManager,
      this.selectionManager,
    );

    this.shapeManager.onChange(() => shapesListPanel.render());

    this.selectionManager.onChange((mesh) => {
      if (!mesh) {
        propertiesPanel.clear();
        return;
      }

      const shape = this.shapeManager.getByMesh(mesh);
      shape ? propertiesPanel.show(shape) : propertiesPanel.clear();
    });
  }

  private initEvents() {
    this.canvas.addEventListener("click", (e) =>
      this.toolManager.pointerDown(e),
    );

    this.canvas.addEventListener("click", (e) => {
      const result = this.toolManager.pointerUp(e);
      if (result?.payload) {
        this.shapeManager.add(result.payload);
      }
    });

    window.addEventListener("pointermove", (e) =>
      this.toolManager.pointerMove(e),
    );

    window.addEventListener("keydown", (e) => this.toolManager.keyDown(e));
  }

  saveToFile() {
    const data = JSON.stringify(this.shapeManager.serialize(), null, 2);

    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "sketch.json";
    a.click();

    URL.revokeObjectURL(url);
  }
  loadFromFile(file: File) {
    const reader = new FileReader();

    reader.onload = () => {
      const data = JSON.parse(reader.result as string);
      this.shapeManager.load(data);
    };

    reader.readAsText(file);
  }
}
