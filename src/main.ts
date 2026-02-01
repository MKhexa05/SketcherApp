import { SkectcherApp } from "./App/SketcherApp";
import { ToolBarController } from "./UI/ToolBarController";
import { FileController } from "./UI/FileController";

/**
 * CANVAS
 */
const canvas = document.querySelector("canvas")!;
const app = new SkectcherApp(canvas);

new ToolBarController(app);
new FileController(app);

// // adding test obj
// const obj = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1, 1),
//   new THREE.MeshBasicMaterial({ color: "red" }),
// );
// obj.position.set(0, 0, 0);
// app.renderer.add(obj);
