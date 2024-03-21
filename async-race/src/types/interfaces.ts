export interface INavItem {
  text: string;
  callback: () => void;
}

export interface ICarData {
  name: string;
  color: string;
}

export interface IWinnersParams {
  page?: number;
  limit?: number;
  sort?: 'id' | 'wins' | 'time';
  order?: 'ASC' | 'DESC';
}

export interface IWinnerData {
  id: number;
  wins: number;
  time: number;
}
