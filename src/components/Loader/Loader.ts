import './Loader.css';

export default function Loader() {
  const wrapper = document.createElement('div');
  wrapper.classList.add('loader-wrapper');
  const text = document.createElement('p');
  text.classList.add('loader-text');
  text.textContent = 'Loading...';

  const roller = document.createElement('div');
  roller.classList.add('lds-roller');
  const dots = Array.from({ length: 8 }).map(() => document.createElement('div'));
  roller.append(...dots);
  wrapper.append(text, roller);

  return wrapper;
}
