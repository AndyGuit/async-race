import './GarageView.css';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import { getAllCars } from '../../api/CarsApi';
import CarItem from '../../components/CarItem/CarItem';
import { ICarResponseData } from '../../types/interfaces';

export default class GarageView {
  private element: HTMLElement;

  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('garage-wrapper');

    this.init();
  }

  renderControls() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('controls');

    const createField = this.createInputField('create', false);
    const updateField = this.createInputField('update', true);
    const carsControls = this.createCarsControls();

    wrapper.append(createField, updateField, carsControls);
    this.element.append(wrapper);
  }

  createCarsControls() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('cars-controls');
    const raceBtn = Button({ text: 'race', type: 'button', classNames: 'primary' });
    const resetBtn = Button({ text: 'reset', type: 'button', classNames: 'primary' });
    const generateBtn = Button({ text: 'generate cars', type: 'button', classNames: 'secondary' });

    wrapper.append(raceBtn, resetBtn, generateBtn);

    return wrapper;
  }

  createInputField(btnText: string, isDisabled: boolean) {
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
    });

    wrapper.append(input, color, btn);

    return wrapper;
  }

  async init() {
    const { totalCars, cars } = await getAllCars(1);

    this.renderControls();

    this.renderHeadings(totalCars);
    this.renderCarsList(cars);
  }

  getElement() {
    return this.element;
  }

  renderHeadings(numOfCars: number) {
    const h1 = document.createElement('h1');
    h1.textContent = `Garage (${numOfCars})`;

    const h2 = document.createElement('h2');
    h2.textContent = `Page #${1}`;

    this.element.append(h1, h2);
  }

  renderCarsList(cars: ICarResponseData[]) {
    const ul = document.createElement('ul');
    ul.classList.add('cars-list');

    const carItems = cars.map((car) => CarItem({ carColor: car.color, carName: car.name }));

    ul.append(...carItems);

    this.element.append(ul);
  }
}
