export class InfoOverlay {
  private el: HTMLDivElement;

  constructor() {
    this.el = document.createElement("div");
    this.el.className = "info-overlay";
    document.body.appendChild(this.el);
    this.hide();
  }

  show(title: string, hints: string[]) {
    this.el.innerHTML = `
      <strong>${title}</strong>
      <ul type='square'>
     ${hints.map((h) => `<li>${h}</li>`).join("")}
     </ul>
    `;
    this.el.style.display = "block";
  }

  hide() {
    this.el.style.display = "none";
  }
}
