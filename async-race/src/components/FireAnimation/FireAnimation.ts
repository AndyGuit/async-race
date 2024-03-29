import './FireAnimation.css';

export default function FireAnimation() {
  const element = document.createElement('div');
  element.classList.add('fire-container');

  const red = document.createElement('div');
  red.classList.add('red', 'flame');
  const orange = document.createElement('div');
  orange.classList.add('orange', 'flame');
  const yellow = document.createElement('div');
  yellow.classList.add('yellow', 'flame');
  const white = document.createElement('div');
  white.classList.add('white', 'flame');
  const blue = document.createElement('div');
  blue.classList.add('blue', 'circle');
  const black = document.createElement('div');
  black.classList.add('black', 'circle');

  element.append(red, orange, yellow, white, blue, black);

  return element;
}
