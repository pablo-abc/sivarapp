import type { Account, Status } from '@types';
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

export function getAccount(id: string | number): Promise<Account> {
  const currentInstance = localStorage.getItem('currentInstance');
  if (!currentInstance)
    throw new Error('Cannot call without being logged in to an instance');
  return fetchJSON(`https://${currentInstance}/api/v1/accounts/${id}`, {
    authenticated: true,
  });
}

type StatusesOptions = {
  excludeReplies?: boolean;
  onlyMedia?: boolean;
  maxId?: string;
};

export function getAccountStatuses(
  id: string,
  { excludeReplies, onlyMedia, maxId }: StatusesOptions = {
    excludeReplies: true,
    onlyMedia: false,
  }
): Promise<Status[]> {
  const currentInstance = localStorage.getItem('currentInstance');
  if (!currentInstance)
    throw new Error('Cannot call without being logged in to an instance');
  const url = new URL(
    `https://${currentInstance}/api/v1/accounts/${id}/statuses`
  );
  const searchParams = new URLSearchParams();
  if (onlyMedia) {
    searchParams.append('only_media', 'true');
  } else {
    searchParams.append('exclude_replies', String(excludeReplies));
  }
  if (maxId) {
    searchParams.append('max_id', maxId);
  }
  url.search = searchParams.toString();
  return fetchJSON(url.toString(), {
    authenticated: true,
  });
}
