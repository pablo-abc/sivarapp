import { Conversation, Status } from '@types';
import storage from '@utils/storage';
import { fetchJSON } from './fetch';

export async function getTimeline(
  type: 'public' | 'home' | 'local' = 'public',
  params?: Record<string, any>
): Promise<Status[]> {
  const timeline = type === 'home' ? 'home' : 'public';
  const currentInstance = storage.currentInstance;
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

export type ConversationParams = {
  limit?: number;
  max_id?: string;
  since_id?: string;
  min_id?: string;
};

export async function getConversations({
  limit,
  ...params
}: ConversationParams = {}): Promise<Conversation[]> {
  const currentInstance = storage.currentInstance;
  if (!currentInstance)
    throw new Error('Cannot call without being logged in to an instance');
  const url = new URL(`https://${currentInstance}/api/v1/conversations`);
  const searchParams = new URLSearchParams({
    ...params,
    ...(limit != null && { limit: String(limit) }),
  });
  url.search = searchParams.toString();
  return fetchJSON(url.toString(), { authenticated: true });
}
