import storage from '@utils/storage';
import { fetchJSON } from './fetch';

export async function getInstance() {
  const currentInstance = storage.currentInstance;
  if (!currentInstance)
    throw new Error('Cannot call without being logged in to an instance');
  return fetchJSON(`https://${currentInstance}/api/v1/instance`, {
    authenticated: true,
  });
}
