type Animation = "fade-in-out";

interface Settings {
  animation: Animation;
}

export class Modalblanc {
  element: HTMLElement;
  settings: Settings;

  constructor(element: HTMLElement) {
    this.element = element;
    this.settings = { animation: "fade-in-out" };
  }

  open() {
    console.info("open modal");
  }
}
