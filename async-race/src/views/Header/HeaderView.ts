import './Header.css';
import Button from '../../components/Button/Button';
import { INavItem } from '../../types/interfaces';

export default class HeaderView {
  private element: HTMLElement;

  private children: Array<HTMLElement>;

  constructor(navigation: INavItem[]) {
    this.element = document.createElement('header');
    this.children = [];

    this.element.classList.add('header');

    this.createNavigation(navigation);
  }

  getElement() {
    return this.element;
  }

  append(child: HTMLElement) {
    this.children.push(child);
    this.element.append(child);
  }

  appendChildren(children: Array<HTMLElement>) {
    children.forEach((child) => {
      this.element.append(child);
    });
  }

  destroyChildren() {
    this.children.forEach((child) => {
      child.remove();
    });
    this.children.length = 0;
  }

  destroy() {
    this.destroyChildren();
    this.element.remove();
  }

  setAttribute(attribute: string, value: string) {
    this.element.setAttribute(attribute, value);
  }

  getAttribute(attribute: string) {
    return this.element.getAttribute(attribute);
  }

  createNavigation(navigation: INavItem[]) {
    const navEl = document.createElement('nav');
    navEl.classList.add('navigation');

    const controls = navigation.map((nav) => {
      const { text, callback } = nav;

      return Button({
        type: 'button',
        text,
        classNames: 'primary',
        onClick: callback,
      });
    });

    navEl.append(...controls);

    this.append(navEl);
  }
}
