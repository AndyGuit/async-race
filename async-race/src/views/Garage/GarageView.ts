import './GarageView.css';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import { createCar, deleteCar, getAllCars } from '../../api/CarsApi';
import CarItem from '../../components/CarItem/CarItem';
import { ICarResponseData } from '../../types/interfaces';

export default class GarageView {
  private element: HTMLElement;

  private carsListEl: HTMLUListElement;

  private garageH1El: HTMLHeadingElement;

  private curPageEl: HTMLHeadingElement;

  private page: number;

  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('garage-wrapper');

    this.page = 1;

    this.garageH1El = document.createElement('h1');
    this.curPageEl = document.createElement('h2');

    this.carsListEl = document.createElement('ul');
    this.addCarListListener();

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
      onClick: this.createNewCar.bind(this),
    });

    wrapper.append(input, color, btn);

    return wrapper;
  }

  async createNewCar(e: MouseEvent) {
    const button = e.target as HTMLButtonElement;
    const colorInput = button.previousElementSibling as HTMLInputElement;
    const nameInput = colorInput?.previousElementSibling as HTMLInputElement;

    if (colorInput && nameInput) {
      // console.log({ color: colorInput.value, name: nameInput.value });
      await createCar({ color: colorInput.value, name: nameInput.value });

      const { totalCars, cars } = await getAllCars(this.page);

      this.garageH1El.remove();
      this.garageH1El = document.createElement('h1');
      this.curPageEl.remove();
      this.curPageEl = document.createElement('h2');
      this.renderHeadings(totalCars);

      this.carsListEl.remove();
      this.carsListEl = document.createElement('ul');
      this.renderCarsList(cars);
    }
  }

  async init() {
    const { totalCars, cars } = await getAllCars(this.page);

    this.renderControls();

    this.renderHeadings(totalCars);
    this.renderCarsList(cars);
  }

  getElement() {
    return this.element;
  }

  renderHeadings(numOfCars: number) {
    this.garageH1El.textContent = `Garage (${numOfCars})`;

    this.curPageEl.textContent = `Page #${this.page}`;

    this.element.append(this.garageH1El, this.curPageEl);
  }

  addCarListListener() {
    this.carsListEl.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const carItemEl: HTMLLIElement | null = target.closest('.car-item');

      if (!carItemEl) return;

      console.log(carItemEl);
    });
  }

  renderCarsList(cars: ICarResponseData[]) {
    this.carsListEl.classList.add('cars-list');
    const carItems = cars.map((car) => CarItem({ ...car }));

    this.carsListEl.append(...carItems);

    this.element.append(this.carsListEl);
  }
}
