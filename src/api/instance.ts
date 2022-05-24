import storage from '@utils/storage';
import { fetchJSON } from './fetch';
import type { Instance } from '@types';

export async function getInstance(): Promise<Instance> {
  const currentInstance = storage.currentInstance;
  if (!currentInstance)
    throw new Error('Cannot call without being logged in to an instance');
  return fetchJSON(`https://${currentInstance}/api/v1/instance`, {
    authenticated: true,
  });
}
