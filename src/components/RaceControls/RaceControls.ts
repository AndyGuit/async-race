import './RaceControls.css';
import Button from '../Button/Button';

interface Props {
  onStart: () => void;
  onReset: () => void;
  onGenerate: () => void;
}

export default function RaceControls(props: Props) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('cars-controls');
  const raceBtn = Button({
    text: 'race',
    type: 'button',
    classNames: 'primary',
    onClick: props.onStart,
  });
  const resetBtn = Button({
    text: 'reset',
    type: 'button',
    classNames: 'primary',
    onClick: props.onReset,
  });
  const generateBtn = Button({
    text: 'generate cars',
    type: 'button',
    classNames: 'secondary',
    onClick: props.onGenerate,
  });

  wrapper.append(raceBtn, resetBtn, generateBtn);

  return wrapper;
}
