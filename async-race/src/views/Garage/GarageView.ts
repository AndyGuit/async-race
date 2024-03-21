import './GarageView.css';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import { getAllWinners } from '../../api/WinnersApi';

export default class GarageView {
  private element: HTMLElement;

  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('garage-wrapper');

    this.init();

    this.fetchCars();
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

  init() {
    this.renderControls();
  }

  getElement() {
    return this.element;
  }

  async fetchCars() {
    // const updatedCar = await updateCar(5, { name: 'Updated', color: '#000000' });
    // const cars = await getAllCars(1);
    // const car = await getCar(4);
    // createWinner({ id: 2, time: 100, wins: 1 });
    // updateWinner({ id: 2, time: 200, wins: 2 });
    const winners = await getAllWinners();
    // const winner = await getWinner(1);

    // createWinner({ id: 2, time: 500, wins: 4 });

    // createCar({ name: 'car', color: '#ff00ff' });
    // const del = await deleteCar(6);
    // console.log(del);

    // console.log('updated: ', updatedCar);
    // console.log('cars: ', cars);
    // console.log('car: ', car);

    console.log('winners: ', winners);
    // console.log('winner: ', winner);
  }
}
