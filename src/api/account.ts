import type { Account, Status, Notification, Relationship } from '@types';
import storage from '@utils/storage';
import { fetchJSON } from './fetch';

export function getMe(): Promise<Account> {
  const currentInstance = storage.currentInstance;
  if (!currentInstance)
    throw new Error('Cannot call without being logged in to an instance');
  return fetchJSON(
    `https://${currentInstance}/api/v1/accounts/verify_credentials`,
    { authenticated: true }
  );
}

export function getAccount(id: string | number): Promise<Account> {
  const currentInstance = storage.currentInstance;
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
  pinned?: boolean;
};

export function getAccountStatuses(
  id: string,
  { excludeReplies, onlyMedia, maxId, pinned }: StatusesOptions = {
    excludeReplies: true,
    onlyMedia: false,
    pinned: false,
  }
): Promise<Status[]> {
  const currentInstance = storage.currentInstance;
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
  searchParams.append('pinned', pinned ? 'true' : 'false');
  if (maxId) {
    searchParams.append('max_id', maxId);
  }
  url.search = searchParams.toString();
  return fetchJSON(url.toString(), {
    authenticated: true,
  });
}

export type FollowersParams = {
  max_id?: string;
  since_id?: string;
  limit?: number;
};

export function getAccountFollowers(
  id: string,
  { limit, ...params }: FollowersParams = {}
): Promise<Account[]> {
  const currentInstance = storage.currentInstance;
  if (!currentInstance)
    throw new Error('Cannot call without being logged in to an instance');
  const url = new URL(
    `https://${currentInstance}/api/v1/accounts/${id}/followers`
  );
  const searchParams = new URLSearchParams({
    ...params,
    ...(limit != null && { limit: String(limit) }),
  });
  url.search = searchParams.toString();
  return fetchJSON(url.toString(), {
    authenticated: true,
  });
}

export function getAccountFollowing(
  id: string,
  { limit, ...params }: FollowersParams = {}
): Promise<Account[]> {
  const currentInstance = storage.currentInstance;
  if (!currentInstance)
    throw new Error('Cannot call without being logged in to an instance');
  const url = new URL(
    `https://${currentInstance}/api/v1/accounts/${id}/following`
  );
  const searchParams = new URLSearchParams({
    ...params,
    ...(limit != null && { limit: String(limit) }),
  });
  url.search = searchParams.toString();
  return fetchJSON(url.toString(), {
    authenticated: true,
  });
}

export function getAccountRelationship(idOrIds: string | string[]) {
  const currentInstance = storage.currentInstance;
  if (!currentInstance)
    throw new Error('Cannot call without being logged in to an instance');
  const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
  const search = ids.map((id) => `id[]=${id}`).join('&');
  return fetchJSON(
    `https://${currentInstance}/api/v1/accounts/relationships?${search}`,
    {
      authenticated: true,
    }
  );
}

type FollowParams = {
  reblogs?: string;
  notify?: string;
};

export function followAccount(
  id: string,
  params?: FollowParams
): Promise<Relationship> {
  const currentInstance = storage.currentInstance;
  if (!currentInstance)
    throw new Error('Cannot call without being logged in to an instance');
  const url = new URL(
    `https://${currentInstance}/api/v1/accounts/${id}/follow`
  );
  const searchParams = new URLSearchParams(params);
  url.search = searchParams.toString();

  return fetchJSON(url.toString(), {
    method: 'POST',
    authenticated: true,
  });
}

export function unfollowAccount(id: string): Promise<Relationship> {
  const currentInstance = storage.currentInstance;
  if (!currentInstance)
    throw new Error('Cannot call without being logged in to an instance');
  return fetchJSON(
    `https://${currentInstance}/api/v1/accounts/${id}/unfollow`,
    {
      method: 'POST',
      authenticated: true,
    }
  );
}

export type NotificationsParams = {
  max_id?: string;
  since_id?: string;
  min_id?: string;
  limit?: number;
  exclude_types?:
    | 'follow'
    | 'favourite'
    | 'reblog'
    | 'mention'
    | 'poll'
    | 'follow_request';
  account_id?: string;
};

export function getNotifications({
  limit,
  ...params
}: NotificationsParams = {}): Promise<Notification[]> {
  const currentInstance = storage.currentInstance;
  if (!currentInstance)
    throw new Error('Cannot call without being logged in to an instance');
  const url = new URL(`https://${currentInstance}/api/v1/notifications`);
  const searchParams = new URLSearchParams({
    ...params,
    ...(limit != null && { limit: String(limit) }),
  });
  url.search = searchParams.toString();
  return fetchJSON(url.toString(), { authenticated: true });
}
