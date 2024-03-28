import { getCar } from '../../api/CarsApi';
import { getAllWinners } from '../../api/WinnersApi';
import WinnerRow from '../../components/WinnerRow/WinnerRow';
import WinnersTable from '../../components/WinnersTable/WinnersTable';

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
    const tableEl = WinnersTable(this.winnersTBody);

    this.element.append(tableEl);
  }

  async init() {
    const winners = await getAllWinners();
    const cars = await Promise.all(winners.map(({ id }) => getCar(id)));

    const winnersData = winners.map((winner, i) => ({ ...winner, ...cars[i] }));

    this.renderHeadings(winnersData.length);
    this.renderTable();

    this.winnersTBody.append(
      ...winnersData.map((winner, i) => WinnerRow({ ...winner, number: i + 1 })),
    );
  }
}
