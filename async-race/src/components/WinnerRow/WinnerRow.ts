import './WinnerRow.css';
import { IWinnerRowData } from '../../types/interfaces';
import CarIcon from '../CarIcon/CarIcon';

export default function WinnerRow(winnerData: IWinnerRowData) {
  // prettier-ignore
  const {
    number,
    color,
    name,
    wins,
    time,
  } = winnerData;

  const rowEl = document.createElement('tr');
  rowEl.classList.add('winner-row');

  const dataGrouped = [number, color, name, wins, time];

  const tdElements = dataGrouped.map((data, i) => {
    const el = document.createElement('td');

    // second item in array always will be car color
    if (i === 1) {
      el.append(CarIcon(data.toString()));
    } else {
      el.textContent = data.toString();
    }

    return el;
  });

  rowEl.append(...tdElements);

  return rowEl;
}
