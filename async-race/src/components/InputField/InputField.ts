import Button from '../Button/Button';
import Input from '../Input/Input';

interface Props {
  btnText: string;
  isDisabled: boolean;
  btnOnClick: (e: MouseEvent) => void;
}

export default function InputField({ btnText, isDisabled, btnOnClick }: Props) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('input-wrapper');

  const input = Input({
    type: 'text',
    value: '',
    classNames: 'input-text',
    disabled: isDisabled,
  });

  const color = Input({
    type: 'color',
    value: '',
    classNames: 'input-color',
    disabled: isDisabled,
  });

  const btn = Button({
    type: 'button',
    classNames: 'secondary',
    text: btnText,
    disabled: isDisabled,
    onClick: btnOnClick,
  });

  wrapper.append(input, color, btn);

  return wrapper;
}
