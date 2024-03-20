import './CarItem.css';

import Button from '../Button/Button';
import CarIcon from '../CarIcon/CarIcon';
import FlagIcon from '../FlagIcon/FlagIcon';

interface Props {
  carName: string;
  carColor: string;
}

export default function CarItem(props: Props) {
  const element = document.createElement('li');
  element.classList.add('car-item');

  const editButtonsWrapper = document.createElement('div');
  editButtonsWrapper.classList.add('car-item__select');
  const selectBtn = Button({ text: 'select', classNames: 'secondary', type: 'button' });
  const removeBtn = Button({ text: 'remove', classNames: 'secondary', type: 'button' });
  const carNameEl = document.createElement('span');
  carNameEl.textContent = props.carName;

  const controlBtnsWrapper = document.createElement('div');
  const startBtn = Button({ text: 'start', classNames: 'small-primary', type: 'button' });
  const stopBtn = Button({
    text: 'stop',
    classNames: 'small-secondary',
    type: 'button',
    disabled: true,
  });
  const carIcon = CarIcon(props.carColor);
  const flagIcon = FlagIcon();

  controlBtnsWrapper.classList.add('car-item__controls');

  controlBtnsWrapper.append(startBtn, stopBtn, carIcon, flagIcon);

  editButtonsWrapper.append(selectBtn, removeBtn, carNameEl);

  element.append(editButtonsWrapper, controlBtnsWrapper);

  return element;
}
