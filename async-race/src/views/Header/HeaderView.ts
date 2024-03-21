import Button from '../../components/Button/Button';
import { IViewParams } from '../../types/interfaces';

export default class HeaderView {
  private element: HTMLElement;

  private children: Array<HTMLElement>;

  constructor(params: IViewParams, ...children: Array<HTMLElement>) {
    this.element = document.createElement(params.tagName);
    this.children = children;

    this.createNavigation();
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

  createNavigation() {
    const navEl = document.createElement('nav');
    const toGarageBtn = Button({ type: 'button', text: 'to garage', classNames: 'primary' });
    const toWinnersBtn = Button({ type: 'button', text: 'to winners', classNames: 'primary' });
    navEl.append(toGarageBtn, toWinnersBtn);

    this.append(navEl);
  }
}
