import { getCar } from '../../api/CarsApi';
import { getAllWinners } from '../../api/WinnersApi';
import Pagination from '../../components/Pagination/Pagination';
import WinnerRow from '../../components/WinnerRow/WinnerRow';
import WinnersTable from '../../components/WinnersTable/WinnersTable';
import { IWinnerRowData } from '../../types/interfaces';
import { LIMIT_WINNERS_PER_PAGE } from '../../utils/globalVariables';

export default class WinnersView {
  private element: HTMLElement;

  private pagination: HTMLElement | null;

  private winnersTBody: HTMLTableSectionElement;

  private page: number;

  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('winners-wrapper');

    this.winnersTBody = document.createElement('tbody');

    this.page = 1;

    this.pagination = null;

    this.init();
  }

  getElement() {
    return this.element;
  }

  renderHeadings(numOfWinners: number) {
    const h1 = document.createElement('h1');
    h1.textContent = `Winners (${numOfWinners})`;

    this.element.append(h1);
  }

  renderTableElements(winnersData: IWinnerRowData[]) {
    this.winnersTBody.innerHTML = '';

    this.winnersTBody.append(
      ...winnersData.map((winner, i) => WinnerRow({ ...winner, number: i + 1 })),
    );
  }

  async init() {
    const { totalWinners, winners } = await getAllWinners(this.page);
    const cars = await Promise.all(winners.map(({ id }) => getCar(id)));

    const winnersData = winners.map((winner, i) => ({ ...winner, ...cars[i], number: i }));

    this.renderHeadings(totalWinners);

    this.pagination = Pagination({
      numOfItems: totalWinners,
      curPage: this.page,
      limitPerPage: LIMIT_WINNERS_PER_PAGE,
      handleNextPage: () => {},
      handlePrevPage: () => {},
    });

    this.element.append(this.pagination);

    this.element.append(WinnersTable(this.winnersTBody));

    this.renderTableElements(winnersData);
  }
}
