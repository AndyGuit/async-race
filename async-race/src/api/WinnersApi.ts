import { IWinnerData, IWinnersParams } from '../types/interfaces';
import { API_URL } from '../utils/globalVariables';

export async function getAllWinners(params?: IWinnersParams) {
  let url = `${API_URL}/winners`;

  if (params) {
    const keys = Object.keys(params) as (keyof IWinnersParams)[];
    keys.forEach((key, i) => {
      const paramSymbol = i === 0 ? '?' : '&';
      url += `${paramSymbol}_${key}=${params[key]}`;
    });
  }

  const res = await fetch(url);
  const data = res.json();

  return data;
}

export async function getWinner(id: number) {
  /* TODO: trycatch */
  const res = await fetch(`${API_URL}/winners/${id}`);
  const data = await res.json();

  return data;
}

export async function createWinner(winnerData: IWinnerData) {
  /* TODO: trycatch */
  const res = await fetch(`${API_URL}/winners`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(winnerData),
  });

  const data = res.json();

  return data;
}

export async function deleteWinner(id: number) {
  /* TODO: trycatch */
  const res = await fetch(`${API_URL}/winners/${id}`, {
    method: 'DELETE',
  });

  const data = await res.json();

  return data;
}

export async function updateWinner(winnerData: IWinnerData) {
  /* TODO: trycatch */
  const { id, time, wins } = winnerData;
  const res = await fetch(`${API_URL}/winners/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ time, wins }),
  });

  const data = res.json();

  return data;
}
