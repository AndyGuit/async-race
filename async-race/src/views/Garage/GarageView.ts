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
import { ICarItemElement, ICarResponseData } from '../../types/interfaces';
// prettier-ignore
import {
  createWinner, deleteWinner, getWinner, updateWinner,
} from '../../api/WinnersApi';
import { generateRandomCarName, generateRandomColor } from '../../utils/helperFunctions';
import { LIMIT_CARS_PER_PAGE } from '../../utils/globalVariables';
import RaceControls from '../../components/RaceControls/RaceControls';
import InputField from '../../components/InputField/InputField';
import WinnerHeading from '../../components/WinnerHeading/WinnerHeading';
import CarDriveState from '../../store/CarDriveState';

export default class GarageView {
  private element: HTMLElement;

  private carsListEl: HTMLUListElement;

  private garageH1El: HTMLHeadingElement;

  private curPageEl: HTMLHeadingElement;

  private createCarEl: HTMLDivElement;

  private updateCarEl: HTMLDivElement;

  private paginationEl: HTMLDivElement;

  private winnerNameEl: HTMLHeadingElement;

  private carsDriveStates: {
    [key: number]: CarDriveState;
  };

  private page: number;

  private winnerTime: number;

  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('garage-wrapper');

    this.page = 1;
    this.winnerTime = 0;

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

    this.carsDriveStates = {};

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
    await deleteWinner(carId);

    const { cars, totalCars } = await getAllCars(this.page);

    this.carsListEl.remove();
    this.carsListEl = document.createElement('ul');
    this.paginationEl.remove();
    this.paginationEl = document.createElement('div');
    this.renderPagination(totalCars);
    this.changeHeadingsTextContent(totalCars);
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
    const carIcon: HTMLElement = carItem.querySelector('.car-icon')!;

    startBtn?.setAttribute('disabled', 'true');

    const { distance, velocity } = await startCarEngine(carId);

    stopBtn?.removeAttribute('disabled');

    const timeToFinish = Math.ceil(distance / velocity) / 1000;
    this.carsDriveStates[carId] = new CarDriveState(timeToFinish, carIcon);
    this.carsDriveStates[carId].animateCarMovement();

    const { success } = await driveCar(carId, this.carsDriveStates[carId].driveController.signal);

    const isStoppedByUser = this.carsDriveStates[carId].driveController.signal.aborted;

    if (!success) {
      this.carsDriveStates[carId].stopCar();

      if (!isStoppedByUser) {
        carIcon?.classList.add('car-crashed');
      }
    }
    if (success && !this.winnerTime) this.winnerTime = Number(timeToFinish.toFixed(2));

    return success;
  }

  async stopCar(carItem: HTMLLIElement, carId: number) {
    const startBtn = carItem.querySelector('button.start');
    const stopBtn = carItem.querySelector('button.stop');
    const carIcon = carItem.querySelector('.car-icon');
    stopBtn?.setAttribute('disabled', 'true');

    this.carsDriveStates[carId].driveController.abort();

    await stopCarEngine(carId);
    carIcon?.removeAttribute('style');
    carIcon?.classList.remove('car-crashed');
    startBtn?.removeAttribute('disabled');
  }

  async resetRace() {
    this.winnerTime = 0;
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
      new Promise<ICarItemElement | undefined>((res) => {
        this.startCar(car.element, car.id).then((isCarFinished) => {
          if (isCarFinished) {
            res(car);
          }
        });
      })
    ));

    const raceWinner = await Promise.race(racePromises);
    if (raceWinner) {
      this.showRaceWinner(raceWinner.name);
      const { wins } = await getWinner(raceWinner.id);
      const { id } = raceWinner;

      if (wins) {
        await updateWinner({ id, wins: wins + 1, time: this.winnerTime });
      } else {
        await createWinner({ id, wins: 1, time: this.winnerTime });
      }
    }
  }

  showRaceWinner(carName: string) {
    this.winnerNameEl.textContent = `${carName} won! (${this.winnerTime}s)`;
    this.winnerNameEl.classList.add('visible');
    this.element.append(this.winnerNameEl);
  }

  async goToNextPage() {
    this.carsDriveStates = {};
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
    this.carsDriveStates = {};
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
