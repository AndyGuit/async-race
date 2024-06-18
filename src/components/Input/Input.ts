import './Input.css';

interface Props {
  type: 'text' | 'color';
  value: string;
  classNames: string | Array<string>;
  onChange?: () => void;
  disabled?: boolean;
}

export default function Input(props: Props) {
  const element = document.createElement('input');

  element.setAttribute('type', props.type);

  element.setAttribute('value', props.value);

  if (Array.isArray(props.classNames)) {
    element.classList.add(props.classNames.join(' '));
  } else {
    element.classList.add(props.classNames);
  }

  if (props.onChange) element.addEventListener('change', props.onChange);

  if (props.disabled) element.disabled = true;

  return element;
}
