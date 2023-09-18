type Animation = "fade-in-out";

interface Settings {
  animation: Animation;
  isOpen?: boolean;
}

export class Modalblanc {
  element: HTMLElement;
  settings: Settings;

  constructor(element: HTMLElement) {
    this.element = element;
    this.settings = { animation: "fade-in-out" };
  }

  open() {
    if (this.settings.isOpen) return;

    this.build.call(this);
    this.setEvents();
  }

  build() {
    // build modal
    console.info("build modal");
  }

  setEvents() {
    // set events
    console.info("set events modal");
  }
}
