export interface INavItem {
  text: string;
  callback: () => void;
}

export interface ICarData {
  name: string;
  color: string;
}

export interface ICarResponseData extends ICarData {
  id: number;
}

export interface IAllCarsResponseData {
  totalCars: number;
  cars: Array<ICarResponseData>;
}

export interface IWinnersParams extends ISortParams {
  page?: number;
  limit?: number;
}

export interface ISortParams {
  sort?: 'id' | 'wins' | 'time';
  order?: 'ASC' | 'DESC';
}

export interface IWinnerData {
  id: number;
  wins: number;
  time: number;
}

export interface IWinnersResponseData {
  totalWinners: number;
  winners: Array<IWinnerData>;
}

export interface IWinnerRowData extends IWinnerData, ICarData {
  number: number;
}

export interface ICarEngineResponse {
  velocity: number;
  distance: number;
}

export interface ICarItemElement {
  id: number;
  name: string;
  element: HTMLLIElement;
}
