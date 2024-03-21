import GarageView from '../Garage/GarageView';

export default class MainView {
  private element: HTMLElement;

  private garageView: GarageView;

  private children: Array<HTMLElement>;

  constructor() {
    this.element = document.createElement('main');

    this.children = [];

    this.garageView = new GarageView();

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

    this.children.push(this.garageView.getElement());

    this.element.append(this.garageView.getElement());
  }

  renderWinnersView() {
    this.destroyChildren();

    const div = document.createElement('div');
    div.textContent = 'Winners view';
    this.children.push(div);

    this.element.append(div);
  }
}
