import './CarItem.css';

import Button from '../Button/Button';
import CarIcon from '../CarIcon/CarIcon';
import FlagIcon from '../FlagIcon/FlagIcon';
import FireAnimation from '../FireAnimation/FireAnimation';

interface Props {
  name: string;
  color: string;
  id: number;
}

export default function CarItem(props: Props) {
  const element = document.createElement('li');
  element.classList.add('car-item');
  element.setAttribute('data-id', props.id.toString());

  const editButtonsWrapper = document.createElement('div');
  editButtonsWrapper.classList.add('car-item__select');
  const selectBtn = Button({
    text: 'select',
    classNames: ['select', 'secondary'],
    type: 'button',
  });
  const removeBtn = Button({
    text: 'remove',
    classNames: ['remove', 'secondary'],
    type: 'button',
  });
  const carNameEl = document.createElement('span');
  carNameEl.textContent = props.name;

  const controlBtnsWrapper = document.createElement('div');
  const startBtn = Button({
    text: 'start',
    classNames: ['start', 'small-primary'],
    type: 'button',
  });
  const stopBtn = Button({
    text: 'stop',
    classNames: ['stop', 'small-secondary'],
    type: 'button',
    disabled: true,
  });
  const carIcon = CarIcon(props.color);
  carIcon.append(FireAnimation());
  const flagIcon = FlagIcon();

  controlBtnsWrapper.classList.add('car-item__controls');

  controlBtnsWrapper.append(startBtn, stopBtn, carIcon, flagIcon);

  editButtonsWrapper.append(selectBtn, removeBtn, carNameEl);

  element.append(editButtonsWrapper, controlBtnsWrapper);

  return element;
}
