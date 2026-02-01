import { SkectcherApp } from "../App/SketcherApp";

export class FileController {
  constructor(private app: SkectcherApp) {
    this.bindUI();
  }

  private bindUI() {
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    const uploadBtn = document.getElementById("btn-upload")!;
    const saveBtn = document.getElementById("btn-save")!;

    uploadBtn.onclick = () => fileInput.click();

    fileInput.onchange = () => {
      const file = fileInput.files?.[0];
      if (file) {
        this.app.loadFromFile(file);
        fileInput.value = ""; // allow re-uploading same file
      }
    };

    saveBtn.onclick = () => {
      this.app.saveToFile();
    };
  }
}
