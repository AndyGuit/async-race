class GarageState {
  page: number;

  newCarName: string;

  newCarColor: string;

  updateCarName: string;

  updateCarColor: string;

  constructor() {
    this.page = 1;
    this.newCarName = '';
    this.newCarColor = '#000000';
    this.updateCarName = '';
    this.updateCarColor = '#000000';
  }
}

const garageStore = new GarageState();

export default garageStore;
