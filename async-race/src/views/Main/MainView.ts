import GarageView from '../Garage/GarageView';
import WinnersView from '../Winners/WinnersView';

export default class MainView {
  private element: HTMLElement;

  private garageView: GarageView;

  private winnersView: WinnersView;

  private children: Array<HTMLElement>;

  constructor() {
    this.element = document.createElement('main');

    this.children = [];

    this.garageView = new GarageView();

    this.winnersView = new WinnersView();

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

    this.children.push(this.winnersView.getElement());

    this.element.append(this.winnersView.getElement());
  }
}
