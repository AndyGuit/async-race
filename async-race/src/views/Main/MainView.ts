export default class MainView {
  private element: HTMLElement;

  constructor() {
    this.element = document.createElement('main');
  }

  getElement() {
    return this.element;
  }
}
