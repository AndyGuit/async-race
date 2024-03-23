import './WinnersView.css';
import { getAllWinners } from '../../api/WinnersApi';
import WinnerRow from '../../components/WinnerRow/WinnerRow';

export default class WinnersView {
  private element: HTMLElement;

  private winnersTBody: HTMLTableSectionElement;

  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('winners-wrapper');

    this.winnersTBody = document.createElement('tbody');

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

  renderTable() {
    const tableHeadRows = ['Number', 'Car', 'Name', 'Wins', 'Best time (seconds)'];

    const tableEl = document.createElement('table');
    tableEl.classList.add('winners-table');
    const theadEl = document.createElement('thead');
    theadEl.classList.add('winners-thead');
    const trEl = document.createElement('tr');

    const thElements = tableHeadRows.map((text) => {
      const el = document.createElement('th');
      el.setAttribute('scope', 'col');
      el.textContent = text;
      return el;
    });

    trEl.append(...thElements);
    theadEl.append(trEl);
    tableEl.append(theadEl, this.winnersTBody);

    this.element.append(tableEl);
  }

  renderWinners() {
    const winner = WinnerRow({
      color: '#ffffff',
      id: 1,
      name: 'Tesla',
      number: 1,
      time: 100,
      wins: 1,
    });

    this.winnersTBody.append(winner);
  }

  async init() {
    const winners = await getAllWinners();

    this.renderHeadings(winners.length);
    this.renderTable();
    this.renderWinners();
  }
}
