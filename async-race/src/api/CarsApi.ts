import { IAllCarsResponseData, ICarData, ICarResponseData } from '../types/interfaces';
import { API_URL, LIMIT_PER_PAGE } from '../utils/globalVariables';

export async function getAllCars(page: number): Promise<IAllCarsResponseData> {
  const query = `_page=${page}&_limit=${LIMIT_PER_PAGE}`;
  const res = await fetch(`${API_URL}/garage?${query}`);

  const totalCount = Number(res.headers.get('X-Total-Count'));

  const data: ICarResponseData[] = await res.json();

  return {
    totalCars: totalCount,
    cars: data,
  };
}

export async function getCar(carId: number) {
  /* TODO: trycatch */
  const res = await fetch(`${API_URL}/garage/${carId}`);
  const data = await res.json();

  return data;
}

export async function createCar(carData: ICarData) {
  const res = await fetch(`${API_URL}/garage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(carData),
  });

  const data = res.json();

  return data;
}

export async function deleteCar(carId: number) {
  /* TODO: trycatch */
  const res = await fetch(`${API_URL}/garage/${carId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = res.json();

  return data;
}

export async function updateCar(carId: number, carData: ICarData) {
  /* TODO: trycatch */
  const res = await fetch(`${API_URL}/garage/${carId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(carData),
  });
  const data = await res.json();

  return data;
}

/*
TODO:
  1) Start / Stop Car's Engine
  2) Switch Car's Engine to Drive Mode
*/
