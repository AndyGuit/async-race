import { IWinnerData, IWinnersParams, IWinnersResponseData } from '../types/interfaces';
import { API_URL, LIMIT_WINNERS_PER_PAGE } from '../utils/globalVariables';

export async function getAllWinners(
  page: number,
  params?: IWinnersParams,
): Promise<IWinnersResponseData> {
  let url = `${API_URL}/winners?_page=${page}&_limit=${LIMIT_WINNERS_PER_PAGE}`;

  if (params) {
    const keys = Object.keys(params) as (keyof IWinnersParams)[];
    keys.forEach((key) => {
      url += `&_${key}=${params[key]}`;
    });
  }

  const res = await fetch(url);
  const totalCount = Number(res.headers.get('X-Total-Count'));

  const data: IWinnerData[] = await res.json();

  return { totalWinners: totalCount, winners: data };
}

export async function getWinner(id: number): Promise<IWinnerData> {
  /* TODO: trycatch */
  const res = await fetch(`${API_URL}/winners/${id}`);
  const data = await res.json();

  return data;
}

export async function createWinner(winnerData: IWinnerData): Promise<IWinnerData> {
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

export async function deleteWinner(id: number): Promise<IWinnerData | null> {
  /* TODO: trycatch */

  const res = await fetch(`${API_URL}/winners/${id}`, {
    method: 'DELETE',
  });

  if (res.ok) {
    const data = await res.json();
    return data;
  }

  return null;
}

export async function updateWinner(winnerData: IWinnerData): Promise<IWinnerData> {
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
