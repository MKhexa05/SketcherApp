import { ColorPicker } from "./Editors/ColorPicker";
import { NumberInput } from "./Editors/NumberInput";
import { PropertyEditor } from "./Editors/PropertyEditor";
import { Vector3Editor } from "./Editors/Vectro3Input";

export class EditorRegistry {
  private editors = new Map<string, PropertyEditor>();

  constructor() {
    this.editors.set("number", new NumberInput());
    this.editors.set("vector3", new Vector3Editor());
    this.editors.set("color", new ColorPicker());
  }

  get(editorType: string): PropertyEditor {
    const editor = this.editors.get(editorType);
    if (!editor) throw new Error(`No editor for ${editorType}`);
    return editor;
  }
}
