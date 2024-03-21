import HeaderView from './views/Header/HeaderView';
import MainView from './views/Main/MainView';

export default class App {
  private element: HTMLElement;

  private header: HeaderView;

  private main: MainView;

  constructor() {
    this.element = document.createElement('div');
    this.element.setAttribute('id', 'app');

    this.main = new MainView();

    this.header = new HeaderView([
      {
        text: 'to garage',
        callback: this.main.renderGarageView.bind(this.main),
      },
      {
        text: 'to winners',
        callback: this.main.renderWinnersView.bind(this.main),
      },
    ]);
  }

  init() {
    this.element.append(this.header.getElement(), this.main.getElement());

    document.body.append(this.element);
  }
}
