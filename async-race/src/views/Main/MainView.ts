export default class MainView {
  private element: HTMLElement;

  private children: Array<HTMLElement>;

  constructor() {
    this.element = document.createElement('main');

    this.children = [];

    this.renderGarageView();
  }

  getElement() {
    return this.element;
  }

  destroyChildren() {
    this.children.forEach((child) => {
      child.remove();
    });
    this.children.length = 0;
  }

  renderGarageView() {
    this.destroyChildren();

    this.element.textContent = 'This is garage view';
  }

  renderWinnersView() {
    this.destroyChildren();

    this.element.textContent = 'This is winners view';
  }
}
