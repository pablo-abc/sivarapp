import { fetchJSON } from './fetch';

export async function getInstance() {
  const currentInstance = localStorage.getItem('currentInstance');
  if (!currentInstance)
    throw new Error('Cannot call without being logged in to an instance');
  return fetchJSON(`https://${currentInstance}/api/v1/instance`, {
    authenticated: true,
  });
}
