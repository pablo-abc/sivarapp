import { Status } from '@types';
import { fetchJSON } from './fetch';

export async function getTimeline(
  type: 'public' | 'home' | 'local' = 'public',
  params?: Record<string, any>
): Promise<Status[]> {
  const timeline = type === 'home' ? 'home' : 'public';
  const currentInstance = localStorage.getItem('currentInstance');
  if (!currentInstance)
    throw new Error('Cannot call without being logged in to an instance');
  const url = new URL(
    `https://${currentInstance}/api/v1/timelines/${timeline}`
  );
  const searchParams = new URLSearchParams(params);
  if (type === 'local') {
    searchParams.append('local', 'true');
  }
  url.search = searchParams.toString();
  return fetchJSON(url.toString(), { authenticated: true });
}
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
