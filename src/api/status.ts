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

export type CreateStatus = {
  status?: string;
  inReplyToId?: string;
  sensitive?: boolean;
  spoilerText?: string;
  visibility?: string;
  idempotencyKey: string;
};

export async function createStatus({
  status,
  inReplyToId,
  sensitive,
  spoilerText,
  visibility,
  idempotencyKey,
}: CreateStatus) {
  const currentInstance = localStorage.getItem('currentInstance');
  if (!currentInstance)
    throw new Error('Cannot call without being logged in to an instance');
  return fetchJSON(`https://${currentInstance}/api/v1/statuses`, {
    method: 'POST',
    json: {
      status,
      in_reply_to_id: inReplyToId,
      sensitive,
      spoiler_text: spoilerText,
      visibility,
    },
    headers: {
      'Idempotency-Key': idempotencyKey,
    },
    authenticated: true,
  });
}

export function boostStatus(id: string) {
  const currentInstance = localStorage.getItem('currentInstance');
  if (!currentInstance)
    throw new Error('Cannot call without being logged in to an instance');
  return fetchJSON(`https://${currentInstance}/api/v1/statuses/${id}/reblog`, {
    method: 'POST',
    authenticated: true,
  });
}

export function unboostStatus(id: string) {
  const currentInstance = localStorage.getItem('currentInstance');
  if (!currentInstance)
    throw new Error('Cannot call without being logged in to an instance');
  return fetchJSON(
    `https://${currentInstance}/api/v1/statuses/${id}/unreblog`,
    {
      method: 'POST',
      authenticated: true,
    }
  );
}

export function favouriteStatus(id: string) {
  const currentInstance = localStorage.getItem('currentInstance');
  if (!currentInstance)
    throw new Error('Cannot call without being logged in to an instance');
  return fetchJSON(
    `https://${currentInstance}/api/v1/statuses/${id}/favourite`,
    {
      method: 'POST',
      authenticated: true,
    }
  );
}

export function unfavouriteStatus(id: string) {
  const currentInstance = localStorage.getItem('currentInstance');
  if (!currentInstance)
    throw new Error('Cannot call without being logged in to an instance');
  return fetchJSON(
    `https://${currentInstance}/api/v1/statuses/${id}/unfavourite`,
    {
      method: 'POST',
      authenticated: true,
    }
  );
}