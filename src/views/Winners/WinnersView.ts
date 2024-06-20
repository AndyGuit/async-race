import { getCar } from '../../api/CarsApi';
import { getAllWinners } from '../../api/WinnersApi';
import Loader from '../../components/Loader/Loader';
import Overlay from '../../components/Overlay/Overlay';
import Pagination from '../../components/Pagination/Pagination';
import WinnerRow from '../../components/WinnerRow/WinnerRow';
import WinnersTable from '../../components/WinnersTable/WinnersTable';
import { ISortParams, IWinnerRowData } from '../../types/interfaces';
import { LIMIT_WINNERS_PER_PAGE } from '../../utils/globalVariables';

export default class WinnersView {
  private element: HTMLElement;

  private pagination: HTMLElement | null;

  private pageHeading: HTMLHeadingElement;

  private winnersTBody: HTMLTableSectionElement;

  private loaderElement: HTMLDivElement;

  private overlayElement: HTMLDivElement;

  private sortParams: {
    sort?: 'id' | 'wins' | 'time';
    order?: 'ASC' | 'DESC';
  };

  private page: number;

  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('winners-wrapper');

    this.winnersTBody = document.createElement('tbody');

    this.pageHeading = document.createElement('h1');

    this.page = 1;

    this.sortParams = {};

    this.pagination = null;

    this.loaderElement = Loader();
    this.overlayElement = Overlay();

    this.overlayElement.append(this.loaderElement);
    this.overlayElement.classList.add('hidden');

    document.body.append(this.overlayElement);

    this.init();
  }

  getElement() {
    return this.element;
  }

  setHeadingTextContent(numOfWinners: number) {
    this.pageHeading.textContent = `Winners (${numOfWinners})`;
  }

  renderTableElements(winnersData: IWinnerRowData[]) {
    this.winnersTBody.innerHTML = '';

    this.winnersTBody.append(
      ...winnersData.map((winner, i) => WinnerRow({ ...winner, number: i + 1 })),
    );
  }

  async goToNextPage() {
    this.page += 1;
    const { totalWinners, winners } = await getAllWinners(this.page, this.sortParams);
    const cars = await Promise.all(winners.map(({ id }) => getCar(id)));

    const winnersData = winners.map((winner, i) => ({ ...winner, ...cars[i], number: i }));

    this.renderPagination(totalWinners);
    this.renderTableElements(winnersData);
  }

  async goToPrevPage() {
    this.page -= 1;
    const { totalWinners, winners } = await getAllWinners(this.page, this.sortParams);
    const cars = await Promise.all(winners.map(({ id }) => getCar(id)));

    const winnersData = winners.map((winner, i) => ({ ...winner, ...cars[i], number: i }));

    this.renderPagination(totalWinners);
    this.renderTableElements(winnersData);
  }

  async sortWinners(e: MouseEvent) {
    const element = e.target as HTMLTableCellElement;

    if (element.hasAttribute('data-sort')) {
      this.sortParams.order = this.sortParams.order === 'ASC' ? 'DESC' : 'ASC';

      const sortBy = element.getAttribute('data-sort') as ISortParams['sort'];

      if (sortBy === 'time') {
        const winsEl = element.previousElementSibling as HTMLTableCellElement;
        winsEl.className = '';
      } else {
        const timeEl = element.nextElementSibling as HTMLTableCellElement;
        timeEl.className = '';
      }

      element.className = `sort-${this.sortParams.order}`;

      this.sortParams.sort = sortBy;

      const { winners } = await getAllWinners(this.page, this.sortParams);
      const cars = await Promise.all(winners.map(({ id }) => getCar(id)));

      const winnersData = winners.map((winner, i) => ({ ...winner, ...cars[i], number: i }));

      this.renderTableElements(winnersData);
    }
  }

  renderPagination(totalWinners: number) {
    if (this.pagination) {
      this.pagination.remove();

      this.pagination = Pagination({
        numOfItems: totalWinners,
        curPage: this.page,
        limitPerPage: LIMIT_WINNERS_PER_PAGE,
        handleNextPage: this.goToNextPage.bind(this),
        handlePrevPage: this.goToPrevPage.bind(this),
      });

      this.pageHeading.after(this.pagination);
    }
  }

  showLoading() {
    this.overlayElement.classList.remove('hidden');
  }

  hideLoading() {
    this.overlayElement.classList.add('hidden');
  }

  async init() {
    this.showLoading();
    this.element.innerHTML = '';
    const { totalWinners, winners } = await getAllWinners(this.page, this.sortParams);
    const cars = await Promise.all(winners.map(({ id }) => getCar(id)));
    this.hideLoading();

    const winnersData = winners.map((winner, i) => ({ ...winner, ...cars[i], number: i }));

    this.element.append(this.pageHeading);
    this.setHeadingTextContent(totalWinners);

    this.pagination = Pagination({
      numOfItems: totalWinners,
      curPage: this.page,
      limitPerPage: LIMIT_WINNERS_PER_PAGE,
      handleNextPage: this.goToNextPage.bind(this),
      handlePrevPage: this.goToPrevPage.bind(this),
    });

    this.pageHeading.after(this.pagination);

    this.element.append(WinnersTable(this.winnersTBody, this.sortWinners.bind(this)));

    this.renderTableElements(winnersData);
  }
}
