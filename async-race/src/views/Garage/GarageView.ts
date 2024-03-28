import './GarageView.css';
import Button from '../../components/Button/Button';
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
import { LIMIT_CARS_PER_PAGE } from '../../utils/globalVariables';
import RaceControls from '../../components/RaceControls/RaceControls';
import InputField from '../../components/InputField/InputField';
import WinnerHeading from '../../components/WinnerHeading/WinnerHeading';

export default class GarageView {
  private element: HTMLElement;

  private carsListEl: HTMLUListElement;

  private garageH1El: HTMLHeadingElement;

  private curPageEl: HTMLHeadingElement;

  private createCarEl: HTMLDivElement;

  private updateCarEl: HTMLDivElement;

  private paginationEl: HTMLDivElement;

  private winnerNameEl: HTMLHeadingElement;

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
    this.createCarEl = InputField({
      btnText: 'create',
      isDisabled: false,
      btnOnClick: this.createNewCar.bind(this),
    });
    this.updateCarEl = InputField({
      btnText: 'update',
      isDisabled: true,
      btnOnClick: this.updateSelectedCar.bind(this),
    });
    this.winnerNameEl = WinnerHeading();

    this.carsListEl = document.createElement('ul');

    this.init();
  }

  renderControls() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('controls');

    const carsControls = RaceControls({
      onStart: this.startRace.bind(this),
      onReset: this.resetRace.bind(this),
      onGenerate: this.generateRandomCars.bind(this),
    });

    wrapper.append(this.createCarEl, this.updateCarEl, carsControls);
    this.element.append(wrapper);
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
        this.startCar(carItemEl, carId);
        return;
      }

      if (target.classList.contains('stop')) {
        this.stopCar(carItemEl, carId);
      }
    });
  }

  async startCar(carItem: HTMLLIElement, carId: number) {
    const startBtn = carItem.querySelector('button.start');
    const stopBtn = carItem.querySelector('button.stop');
    const carIcon = carItem.querySelector('.car-icon');

    startBtn?.setAttribute('disabled', 'true');

    this.driveController = new AbortController();
    const { distance, velocity } = await startCarEngine(carId);

    stopBtn?.removeAttribute('disabled');

    const animationDuration = Math.round(distance / velocity);

    carIcon?.classList.remove('car-crashed');
    carIcon?.setAttribute('style', `animation-duration: ${animationDuration}ms`);
    carIcon?.classList.add('car-animate');

    const { success } = await driveCar(carId, this.driveController.signal);

    if (!success) carIcon?.classList.add('car-crashed');
    return success;
  }

  async stopCar(carItem: HTMLLIElement, carId: number) {
    const startBtn = carItem.querySelector('button.start');
    const stopBtn = carItem.querySelector('button.stop');
    const carIcon = carItem.querySelector('.car-icon');
    stopBtn?.setAttribute('disabled', 'true');

    this.driveController.abort();

    await stopCarEngine(carId);
    carIcon?.classList.remove('car-animate');
    startBtn?.removeAttribute('disabled');
  }

  async resetRace() {
    this.winnerNameEl.classList.remove('visible');
    const { cars } = await getAllCars(this.page);
    const carItems = cars.map(({ id }) => {
      const carItemEl: HTMLLIElement = this.carsListEl.querySelector(`[data-id="${id}"]`)!;
      return {
        id,
        element: carItemEl,
      };
    });

    await Promise.all(
      carItems.map(async (car) => {
        await this.stopCar(car.element, car.id);
      }),
    );
  }

  async startRace() {
    interface CarItem {
      id: number;
      name: string;
      element: HTMLLIElement;
    }
    const { cars } = await getAllCars(this.page);

    const carItems = cars.map(({ id, name }) => {
      const carItemEl: HTMLLIElement = this.carsListEl.querySelector(`[data-id="${id}"]`)!;
      return {
        id,
        name,
        element: carItemEl,
      };
    });

    // prettier-ignore
    const racePromises = carItems.map((car) => (
      new Promise<CarItem | undefined>((res) => {
        this.startCar(car.element, car.id).then((isCarFinished) => {
          if (isCarFinished) {
            res(car);
          }
        });
      })
    ));

    const winner = await Promise.race(racePromises);
    if (winner) this.showRaceWinner(winner.name);
  }

  showRaceWinner(carName: string) {
    this.winnerNameEl.textContent = `${carName} won! #{time}`;
    this.winnerNameEl.classList.add('visible');
    this.element.append(this.winnerNameEl);
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
    const numOfPages = Math.ceil(totalCars / LIMIT_CARS_PER_PAGE);

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
