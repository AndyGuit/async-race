import './GarageView.css';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
// prettier-ignore
import {
  createCar,
  deleteCar,
  driveCar,
  getAllCars,
  getCar,
  startCarEngine,
  stopCarEngine,
  updateCar,
} from '../../api/CarsApi';
import CarItem from '../../components/CarItem/CarItem';
import { ICarResponseData } from '../../types/interfaces';
import { deleteWinner } from '../../api/WinnersApi';
import { generateRandomCarName, generateRandomColor } from '../../utils/helperFunctions';
import { LIMIT_PER_PAGE } from '../../utils/globalVariables';

export default class GarageView {
  private element: HTMLElement;

  private carsListEl: HTMLUListElement;

  private garageH1El: HTMLHeadingElement;

  private curPageEl: HTMLHeadingElement;

  private createCarEl: HTMLDivElement;

  private updateCarEl: HTMLDivElement;

  private paginationEl: HTMLDivElement;

  private driveController: AbortController;

  private page: number;

  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('garage-wrapper');

    this.page = 1;

    this.driveController = new AbortController();

    this.garageH1El = document.createElement('h1');
    this.curPageEl = document.createElement('h2');
    this.paginationEl = document.createElement('div');
    this.createCarEl = this.createInputField('create', false, this.createNewCar.bind(this));
    this.updateCarEl = this.createInputField('update', true, this.updateSelectedCar.bind(this));

    this.carsListEl = document.createElement('ul');

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
    const generateBtn = Button({
      text: 'generate cars',
      type: 'button',
      classNames: 'secondary',
      onClick: this.generateRandomCars.bind(this),
    });

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
      this.paginationEl.remove();
      this.paginationEl = document.createElement('div');
      this.renderPagination(totalCars);
      this.renderCarsList(cars);
    }
  }

  async init() {
    const { totalCars, cars } = await getAllCars(this.page);

    this.renderControls();

    this.renderHeadings();
    this.changeHeadingsTextContent(totalCars);
    this.renderPagination(totalCars);
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

  async generateRandomCars() {
    const carsArr = Array.from({ length: 100 }, () => ({
      name: generateRandomCarName(),
      color: generateRandomColor(),
    }));

    await Promise.all(
      carsArr.map(async (car) => {
        await createCar(car);
      }),
    );

    const { cars, totalCars } = await getAllCars(this.page);

    this.carsListEl.remove();
    this.carsListEl = document.createElement('ul');
    this.paginationEl.remove();
    this.paginationEl = document.createElement('div');
    this.changeHeadingsTextContent(totalCars);
    this.renderPagination(totalCars);
    this.renderCarsList(cars);
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

    [button, colorInput, nameInput].forEach((el) => el.setAttribute('disabled', ''));
    nameInput.value = '';
    colorInput.value = '#000000';

    await updateCar(selectedCarId, updatedData);
    const { cars } = await getAllCars(this.page);

    this.carsListEl.remove();
    this.carsListEl = document.createElement('ul');
    this.renderCarsList(cars);
  }

  async deleteSelectedCar(carId: number) {
    await deleteCar(carId);
    const isWinnerRemoved = await deleteWinner(carId);

    const { cars, totalCars } = await getAllCars(this.page);

    this.carsListEl.remove();
    this.carsListEl = document.createElement('ul');
    this.paginationEl.remove();
    this.paginationEl = document.createElement('div');
    this.renderPagination(totalCars);
    this.changeHeadingsTextContent(totalCars);
    this.renderCarsList(cars);

    if (isWinnerRemoved) {
      // re render winners table
    }
  }

  addCarListListener() {
    this.carsListEl.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const carItemEl: HTMLLIElement | null = target.closest('.car-item');

      if (!carItemEl) return;
      const carId = Number(carItemEl.getAttribute('data-id'));

      if (target.classList.contains('select')) {
        this.selectCar(carId);
        return;
      }

      if (target.classList.contains('remove')) {
        this.deleteSelectedCar(carId);
        return;
      }

      if (target.classList.contains('start')) {
        const stopBtn = target.nextElementSibling;
        if (!stopBtn) return;

        stopBtn.removeAttribute('disabled');
        const carIcon = stopBtn.nextElementSibling as HTMLElement;

        this.startCar(carIcon, carId);

        target.setAttribute('disabled', '');
      }

      if (target.classList.contains('stop')) {
        const startBtn = target.previousElementSibling;
        if (startBtn) startBtn.removeAttribute('disabled');
        target.setAttribute('disabled', '');

        const carIcon = target.nextElementSibling as HTMLElement;
        this.stopCar(carIcon, carId);
      }
    });
  }

  async startCar(carElement: HTMLElement, carId: number) {
    this.driveController = new AbortController();
    const { distance, velocity } = await startCarEngine(carId);
    const animationDuration = Math.round(distance / velocity);

    console.log({ distance, velocity });

    carElement.classList.remove('car-crashed');
    carElement.setAttribute('style', `animation-duration: ${animationDuration}ms`);
    carElement.classList.add('car-animate');

    const { success } = await driveCar(carId, this.driveController.signal);

    console.log('car finished:', success);

    if (!success) carElement.classList.add('car-crashed');
  }

  async stopCar(carElement: HTMLElement, carId: number) {
    this.driveController.abort();
    await stopCarEngine(carId);
    carElement.classList.remove('car-animate');
  }

  breakCar(carElement: HTMLElement) {
    carElement.classList.add('car-crashed');
  }

  async goToNextPage() {
    this.page += 1;
    const { cars, totalCars } = await getAllCars(this.page);
    this.changeHeadingsTextContent(totalCars);

    this.paginationEl.remove();
    this.paginationEl = document.createElement('div');
    this.carsListEl.remove();
    this.carsListEl = document.createElement('ul');

    this.renderPagination(totalCars);
    this.renderCarsList(cars);
  }

  async goToPrevPage() {
    this.page -= 1;
    const { cars, totalCars } = await getAllCars(this.page);
    this.changeHeadingsTextContent(totalCars);

    this.paginationEl.remove();
    this.paginationEl = document.createElement('div');
    this.carsListEl.remove();
    this.carsListEl = document.createElement('ul');

    this.renderPagination(totalCars);
    this.renderCarsList(cars);
  }

  renderPagination(totalCars: number) {
    const numOfPages = Math.ceil(totalCars / LIMIT_PER_PAGE);

    this.paginationEl.classList.add('pagination');

    const prevBtn = Button({
      classNames: 'secondary',
      text: 'prev',
      type: 'button',
      disabled: this.page === 1,
      onClick: this.goToPrevPage.bind(this),
    });
    const nextBtn = Button({
      classNames: 'secondary',
      text: 'next',
      type: 'button',
      disabled: this.page >= numOfPages,
      onClick: this.goToNextPage.bind(this),
    });

    this.paginationEl.append(prevBtn, nextBtn);
    this.element.append(this.paginationEl);
  }

  renderCarsList(cars: ICarResponseData[]) {
    this.carsListEl.classList.add('cars-list');
    this.addCarListListener();
    const carItems = cars.map((car) => CarItem({ ...car }));

    this.carsListEl.append(...carItems);

    this.element.append(this.carsListEl);
  }
}
