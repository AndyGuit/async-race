import { getAllWinners } from '../../api/WinnersApi';

export default class WinnersView {
  private element: HTMLElement;

  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('winners-wrapper');

    this.init();
  }

  getElement() {
    return this.element;
  }

  renderHeadings(numOfWinners: number) {
    const h1 = document.createElement('h1');
    h1.textContent = `Winners (${numOfWinners})`;

    const h2 = document.createElement('h2');
    h2.textContent = `Page #${1}`;

    this.element.append(h1, h2);
  }

  async init() {
    const winners = await getAllWinners();

    console.log('winners: ', winners);
    this.renderHeadings(winners.length);
  }
}
