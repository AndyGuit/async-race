import './WinnersTable.css';

export default function WinnersTable(
  bodyEl: HTMLTableSectionElement,
  handleSort: (e: MouseEvent) => void,
) {
  const tableHeadRows = ['Number', 'Car', 'Name', 'Wins', 'Best time (seconds)'];

  const tableEl = document.createElement('table');
  tableEl.classList.add('winners-table');
  const theadEl = document.createElement('thead');
  theadEl.classList.add('winners-thead');
  const trEl = document.createElement('tr');

  theadEl.addEventListener('click', handleSort);

  const thElements = tableHeadRows.map((text) => {
    const el = document.createElement('th');

    if (text.includes('Wins')) {
      el.setAttribute('data-sort', 'wins');
    }

    if (text.includes('Best time')) {
      el.setAttribute('data-sort', 'time');
    }

    el.setAttribute('scope', 'col');
    el.textContent = text;
    return el;
  });

  trEl.append(...thElements);
  theadEl.append(trEl);
  tableEl.append(theadEl, bodyEl);

  return tableEl;
}
