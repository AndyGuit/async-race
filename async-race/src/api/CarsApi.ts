import {
  IAllCarsResponseData,
  ICarData,
  ICarResponseData,
  ICarEngineResponse,
} from '../types/interfaces';
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

export async function getCar(carId: number): Promise<ICarResponseData> {
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

export async function startCarEngine(carId: number): Promise<ICarEngineResponse> {
  const query = `?id=${carId}&status=started`;
  const res = await fetch(`${API_URL}/engine${query}`, {
    method: 'PATCH',
  });
  const data = await res.json();

  return data;
}

export async function stopCarEngine(carId: number): Promise<ICarEngineResponse> {
  const query = `?id=${carId}&status=stopped`;
  const res = await fetch(`${API_URL}/engine${query}`, {
    method: 'PATCH',
  });
  const data = await res.json();

  return data;
}

export async function driveCar(carId: number): Promise<{ success: boolean }> {
  try {
    const query = `?id=${carId}&status=drive`;
    const res = await fetch(`${API_URL}/engine${query}`, {
      method: 'PATCH',
    });
    const data = await res.json();

    return data;
  } catch (error) {
    return { success: false };
  }
}
