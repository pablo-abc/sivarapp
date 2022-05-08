import { Status } from '@types';
import { fetchJSON } from './fetch';

export async function getPublic(): Promise<Status[]> {
  const currentInstance = localStorage.getItem('currentInstance');
  if (!currentInstance)
    throw new Error('Cannot call without being logged in to an instance');
  return fetchJSON(`https://${currentInstance}/api/v1/timelines/public`);
}

export async function getHome(params?: Record<string, any>): Promise<Status[]> {
  const currentInstance = localStorage.getItem('currentInstance');
  if (!currentInstance)
    throw new Error('Cannot call without being logged in to an instance');
  const url = new URL(`https://${currentInstance}/api/v1/timelines/home`);
  const searchParams = new URLSearchParams(params);
  url.search = searchParams.toString();
  return fetchJSON(url.toString(), { authenticated: true });
}
