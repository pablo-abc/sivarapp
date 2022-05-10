import type { Status, StatusContext } from '@types';
import { fetchJSON } from './fetch';

export async function getStatus(id: string): Promise<Status> {
  const currentInstance = localStorage.getItem('currentInstance');
  if (!currentInstance)
    throw new Error('Cannot call without being logged in to an instance');
  return fetchJSON(`https://${currentInstance}/api/v1/statuses/${id}`, {
    authenticated: true,
  });
}

export async function getStatusContext(id: string): Promise<StatusContext> {
  const currentInstance = localStorage.getItem('currentInstance');
  if (!currentInstance)
    throw new Error('Cannot call without being logged in to an instance');
  return fetchJSON(`https://${currentInstance}/api/v1/statuses/${id}/context`);
}
