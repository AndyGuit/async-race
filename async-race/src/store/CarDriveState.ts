export default class CarDriveState {
  driveController: AbortController;

  private timeToFinish: number;

  private carIcon: HTMLElement;

  private isStopped: boolean;

  constructor(timeToFinish: number, carIcon: HTMLElement) {
    this.driveController = new AbortController();
    this.timeToFinish = timeToFinish;
    this.carIcon = carIcon;
    this.isStopped = false;
  }

  animateCarMovement() {
    // starting car position in px
    let startPos = 120;
    // ending position minus car width
    const distance = window.innerWidth - startPos;
    // 60 is frames per second
    const step = distance / this.timeToFinish / 60;

    const moveCar = () => {
      startPos += step;
      this.carIcon.style.left = `${startPos}px`;
      if (startPos < distance && !this.isStopped) requestAnimationFrame(moveCar);
    };

    requestAnimationFrame(moveCar);
  }

  stopCar() {
    this.isStopped = true;
  }
}
