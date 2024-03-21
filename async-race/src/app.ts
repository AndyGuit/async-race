import HeaderView from './views/Header/HeaderView';

export default class App {
  private element: HTMLElement;

  private header: HeaderView;

  constructor() {
    this.element = document.createElement('div');
    this.element.setAttribute('id', 'app');

    this.header = new HeaderView({ tagName: 'header', classNames: '' });
  }

  init() {
    this.element.textContent = 'This is garage view';
    this.element.append(this.header.getElement());

    console.log(this.header);

    document.body.append(this.element);
  }
}

// const btn = Button({ text: 'to garage', classNames: 'primary', type: 'button' });
// const btn2 = Button({ text: 'create', classNames: 'secondary', type: 'button' });
// const inpt = Input({ classNames: 'input-text', type: 'text', value: '123' });
// const inpt2 = Input({ classNames: 'input-color', type: 'color', value: '#ff0000' });
// const car = CarItem({ carName: 'Tesla', carColor: '#ff0000' });

// const app = document.querySelector<HTMLDivElement>('#app');

// app?.append(...[btn, btn2, inpt, inpt2, car]);
