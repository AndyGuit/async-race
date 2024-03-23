import './GarageView.css';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
// prettier-ignore
import {
  createCar,
  getAllCars,
  getCar,
  updateCar,
} from '../../api/CarsApi';
import CarItem from '../../components/CarItem/CarItem';
import { ICarResponseData } from '../../types/interfaces';

export default class GarageView {
  private element: HTMLElement;

  private carsListEl: HTMLUListElement;

  private garageH1El: HTMLHeadingElement;

  private curPageEl: HTMLHeadingElement;

  private createCarEl: HTMLDivElement;

  private updateCarEl: HTMLDivElement;

  private page: number;

  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('garage-wrapper');

    this.page = 1;

    this.garageH1El = document.createElement('h1');
    this.curPageEl = document.createElement('h2');
    this.createCarEl = this.createInputField('create', false, this.createNewCar.bind(this));
    this.updateCarEl = this.createInputField('update', true, this.updateSelectedCar.bind(this));

    this.carsListEl = document.createElement('ul');
    this.addCarListListener();

    this.init();
  }

  renderControls() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('controls');

    const carsControls = this.createCarsControls();

    wrapper.append(this.createCarEl, this.updateCarEl, carsControls);
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

  createInputField(btnText: string, isDisabled: boolean, btnOnClick: (e: MouseEvent) => void) {
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

  async createNewCar(e: MouseEvent) {
    const button = e.target as HTMLButtonElement;
    const colorInput = button.previousElementSibling as HTMLInputElement;
    const nameInput = colorInput?.previousElementSibling as HTMLInputElement;

    if (colorInput && nameInput) {
      await createCar({ color: colorInput.value, name: nameInput.value });

      const { totalCars, cars } = await getAllCars(this.page);

      this.changeHeadingsTextContent(totalCars);

      this.carsListEl.remove();
      this.carsListEl = document.createElement('ul');
      this.renderCarsList(cars);
    }
  }

  async init() {
    const { totalCars, cars } = await getAllCars(this.page);

    this.renderControls();

    this.renderHeadings();
    this.changeHeadingsTextContent(totalCars);
    this.renderCarsList(cars);
  }

  getElement() {
    return this.element;
  }

  changeHeadingsTextContent(numOfCars: number) {
    this.garageH1El.textContent = `Garage (${numOfCars})`;

    this.curPageEl.textContent = `Page #${this.page}`;
  }

  renderHeadings() {
    this.element.append(this.garageH1El, this.curPageEl);
  }

  async selectCar(carId: number) {
    const selectedCar = await getCar(carId);
    const textInput: HTMLInputElement | null = this.updateCarEl.querySelector('.input-text');
    const colorInput: HTMLInputElement | null = this.updateCarEl.querySelector('.input-color');
    const updateBtn = this.updateCarEl.querySelector('button');

    [textInput, colorInput, updateBtn].forEach((el) => el?.removeAttribute('disabled'));

    if (textInput) textInput.value = selectedCar.name;
    if (colorInput) colorInput.value = selectedCar.color;
    if (updateBtn) updateBtn.setAttribute('data-car-id', selectedCar.id.toString());
  }

  async updateSelectedCar(e: MouseEvent) {
    const button = e.target as HTMLButtonElement;
    const colorInput = button.previousElementSibling as HTMLInputElement;
    const nameInput = colorInput?.previousElementSibling as HTMLInputElement;

    const selectedCarId = Number(button.getAttribute('data-car-id'));

    const updatedData = {
      name: nameInput.value,
      color: colorInput.value,
    };

    await updateCar(selectedCarId, updatedData);
    const { cars } = await getAllCars(this.page);

    this.carsListEl.remove();
    this.carsListEl = document.createElement('ul');
    this.renderCarsList(cars);
  }

  addCarListListener() {
    this.carsListEl.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const carItemEl: HTMLLIElement | null = target.closest('.car-item');

      if (!carItemEl) return;
      const carId = Number(carItemEl.getAttribute('data-id'));

      if (target.classList.contains('select')) {
        this.selectCar(carId);
      }
    });
  }

  renderCarsList(cars: ICarResponseData[]) {
    this.carsListEl.classList.add('cars-list');
    const carItems = cars.map((car) => CarItem({ ...car }));

    this.carsListEl.append(...carItems);

    this.element.append(this.carsListEl);
  }
}
