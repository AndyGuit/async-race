import './WinnersTable.css';

export default function WinnersTable(bodyEl: HTMLTableSectionElement) {
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
  tableEl.append(theadEl, bodyEl);

  return tableEl;
}
