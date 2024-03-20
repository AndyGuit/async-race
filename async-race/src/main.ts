import Button from './components/Button/Button';
import Input from './components/Input/Input';
import './style.css';

const btn = Button({ text: 'to garage', classNames: 'primary', type: 'button' });
const btn2 = Button({ text: 'create', classNames: 'secondary', type: 'button' });
const inpt = Input({ classNames: 'input-text', type: 'text', value: '123' });
const inpt2 = Input({ classNames: 'input-color', type: 'color', value: '#ff0000' });

const app = document.querySelector<HTMLDivElement>('#app');

app?.append(...[btn, btn2, inpt, inpt2]);
