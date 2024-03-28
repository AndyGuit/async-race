import Button from '../Button/Button';

interface Props {
  numOfItems: number;
  curPage: number;
  limitPerPage: number;
  handlePrevPage: () => void;
  handleNextPage: () => void;
}

export default function Pagination({
  numOfItems,
  curPage,
  limitPerPage,
  handleNextPage,
  handlePrevPage,
}: Props) {
  const numOfPages = Math.ceil(numOfItems / limitPerPage);
  const element = document.createElement('div');
  const curPageEl = document.createElement('h2');
  curPageEl.textContent = `Page #${curPage}`;

  element.classList.add('pagination');

  const prevBtn = Button({
    classNames: 'secondary',
    text: 'prev',
    type: 'button',
    disabled: curPage === 1,
    onClick: handlePrevPage,
  });
  const nextBtn = Button({
    classNames: 'secondary',
    text: 'next',
    type: 'button',
    disabled: curPage >= numOfPages,
    onClick: handleNextPage,
  });

  element.append(curPageEl, prevBtn, nextBtn);
  return element;
}
