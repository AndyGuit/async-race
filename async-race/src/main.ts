import Button from './components/Button/Button';
import './style.css';

const btn = Button({ text: 'A', classNames: 'small-primary', type: 'button' });
const btn2 = Button({ text: 'B', classNames: 'small-secondary', type: 'button' });

const app = document.querySelector<HTMLDivElement>('#app');

app?.append(btn);
app?.append(btn2);
