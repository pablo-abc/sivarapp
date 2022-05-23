import type { Application } from '@types';
import { Router } from '@vaadin/router';
import storage from '@utils/storage';

export async function authorizeUser(
  instanceName: string
): Promise<Application> {
  let instanceData = storage.apps[instanceName];
  if (!instanceData) {
    const response = await fetch(`https://${instanceName}/api/v1/apps`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_name: 'Sivarapp',
        redirect_uris: `${location.origin}/oauth/callback`,
        scopes: 'read write follow push',
        website: 'https://sivar.app',
      }),
    });
    if (!response.ok) {
      throw new Error('authorize_error');
    }
    instanceData = (await response.json()) as Application;
    storage.apps = {
      ...storage.apps,
      [instanceName]: instanceData,
    };
  }
  storage.currentInstance = instanceName;
  const encodedUri = encodeURIComponent(`${location.origin}/oauth/callback`);
  location.href = `https://${instanceName}/oauth/authorize?client_id=${instanceData.client_id}&scope=read+write+follow&redirect_uri=${encodedUri}&response_type=code`;
  return instanceData;
}

export async function authenticateUser(code: string): Promise<string> {
  const instanceData = storage.currentApp;
  const instanceName = storage.currentInstance;
  if (!instanceData || !instanceName) {
    throw new Error('authorization_error');
  }
  const { client_id: clientId, client_secret: clientSecret } = instanceData;

  const redirectUri = `${location.origin}/oauth/callback`;
  const formData = new FormData();
  formData.append('client_id', clientId);
  formData.append('client_secret', clientSecret);
  formData.append('redirect_uri', redirectUri);
  formData.append('scope', 'read write follow push');
  formData.append('code', code);
  formData.append('grant_type', 'authorization_code');
  const response = await fetch(`https://${instanceName}/oauth/token`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('authenticate_error');
  }
  const json = await response.json();
  storage.accessToken = json.access_token;
  setTimeout(() => {
    Router.go('/timeline');
  }, 500);
  return json.access_token;
}

export async function unauthenticateUser() {
  const token = storage.accessToken;
  try {
    if (token) {
      const instance = storage.currentApp;
      const currentInstance = storage.currentInstance;
      if (!instance || !currentInstance) return;
      const formData = new FormData();
      formData.append('token', token || '');
      formData.append('client_id', instance.client_id);
      formData.append('client_secret', instance.client_secret);
      await fetch(`https://${currentInstance}/oauth/revoke`, {
        method: 'POST',
        body: formData,
      });
    }
  } catch {
    return;
  } finally {
    storage.accessToken = undefined;
    setTimeout(() => {
      Router.go('/');
    }, 200);
  }
}
