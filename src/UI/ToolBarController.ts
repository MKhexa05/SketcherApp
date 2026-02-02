import { SkectcherApp } from "../App/SketcherApp";
import { CircleTool } from "../Input/Tools/CircleTool";
import { EllipseTool } from "../Input/Tools/EllipseTool";
import { LineTool } from "../Input/Tools/LineTool";
import { PolylineTool } from "../Input/Tools/PolylineTool";
import { SelectTool } from "../Input/Tools/SelectTool";
import { InfoOverlay } from "./InfoOverlay";

type ToolConfig = {
  buttonId: string;
  create: () => any;
};

export class ToolBarController {
  private activeTool: string | null = null;
  private tools: Record<string, ToolConfig>;
  private info = new InfoOverlay();

  constructor(private app: SkectcherApp) {
    this.initGridToggle();
    this.tools = {
      line: {
        buttonId: "btn-line-tool",
        create: () => new LineTool(app.renderer),
      },
      polyline: {
        buttonId: "btn-poyline-tool",
        create: () => new PolylineTool(app.renderer),
      },
      circle: {
        buttonId: "btn-circle-tool",
        create: () => new CircleTool(app.renderer),
      },
      ellipse: {
        buttonId: "btn-ellipse-tool",
        create: () => new EllipseTool(app.renderer),
      },
      select: {
        buttonId: "btn-select-tool",
        create: () => {
          return new SelectTool(app.shapeManager, app.selectionManager);
        },
      },
    };

    this.bindUI();
  }

  private initGridToggle() {
    const gridBtn = document.getElementById("btn-grid-toggle");
    if (!gridBtn) return;

    let visible = true;

    gridBtn.addEventListener("click", () => {
      visible = !visible;
      this.app.renderer.toggleGrid();
      gridBtn.classList.toggle("active", visible);
    });
  }

  private bindUI() {
    Object.entries(this.tools).forEach(([name, config]) => {
      const btn = document.getElementById(config.buttonId)!;
      btn.onclick = () => this.activateTool(name);
    });
  }

  private activateTool(name: string) {
    if (this.activeTool == name) {
      this.deactivateAll();
      this.activeTool = null;
      return;
    }
    this.deactivateAll();

    const { buttonId, create } = this.tools[name];

    const tool = create();
    document.getElementById(buttonId)!.classList.add("active");
    this.app.toolManager.setTool(tool);

    // displaying help
    const help = tool.getHelp?.();
    if (help) this.info.show(help.title, help.hints);
    else this.info.hide();

    this.activeTool = name;
  }

  private deactivateAll() {
    Object.values(this.tools).forEach(({ buttonId }) => {
      document.getElementById(buttonId)!.classList.remove("active");
    });
    this.info.hide();
  }
}
