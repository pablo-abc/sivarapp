import storage from '@utils/storage';

export type FetchOptions = RequestInit & {
  json?: Record<string, any> | Array<any>;
  authenticated?: boolean;
};

export async function fetchJSON(url: string, options: FetchOptions = {}) {
  if (options.json) {
    options.body = JSON.stringify(options.json);
  }
  options.headers = {
    ...options.headers,
    'Content-Type': 'application/json',
  };
  if (options.authenticated) {
    const accessToken = storage.accessToken;
    if (!accessToken)
      throw new Error('Cannot be called without being logged in');
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    };
  }
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`The request failed with status: ${response.status}`);
  }
  return response.json();
}
