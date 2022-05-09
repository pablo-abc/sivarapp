import { Account } from '@types';
import { fetchJSON } from './fetch';

export function getMe(): Promise<Account> {
  const currentInstance = localStorage.getItem('currentInstance');
  if (!currentInstance)
    throw new Error('Cannot call without being logged in to an instance');
  return fetchJSON(
    `https://${currentInstance}/api/v1/accounts/verify_credentials`,
    { authenticated: true }
  );
}
