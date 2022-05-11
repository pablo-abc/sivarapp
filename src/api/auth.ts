import { Router } from '@vaadin/router';

export async function authorizeUser(instanceName: string): Promise<{
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}> {
  const registeredInstances = JSON.parse(
    localStorage.getItem('instances') || '{}'
  );
  let instanceData = registeredInstances[instanceName];
  if (!instanceData) {
    const response = await fetch(`https://${instanceName}/api/v1/apps`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_name: 'Sivarapp',
        redirect_uris: 'http://localhost:3000/oauth/callback',
        scopes: 'read write follow push',
        website: 'http://localhost:3000',
      }),
    });
    if (!response.ok) {
      throw new Error('authorize_error');
    }
    instanceData = await response.json();
    localStorage.setItem(
      'instances',
      JSON.stringify({
        ...registeredInstances,
        [instanceName]: instanceData,
      })
    );
  }
  localStorage.setItem('currentInstance', instanceName);
  const encodedUri = encodeURIComponent(`${location.origin}/oauth/callback`);
  window.open(
    `${location.origin}/oauth/authorize?authorize_url=${encodeURIComponent(
      `https://${instanceName}/oauth/authorize?client_id=${instanceData.client_id}&scope=read+write+follow&redirect_uri=${encodedUri}&response_type=code
`
    )}`,
    '_blank',
    'popup=1,width=500,height=700'
  );
  return {
    clientId: instanceData.client_id,
    clientSecret: instanceData.client_secret,
    redirectUri: instanceData.redirect_uri,
  };
}

export async function authenticateUser({
  clientId,
  clientSecret,
  redirectUri,
  code,
}: {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  code: string;
}): Promise<string> {
  const instanceName = localStorage.getItem('currentInstance') || 'sivar.cafe';
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
  localStorage.setItem('accessToken', json.access_token);
  setTimeout(() => {
    Router.go('/timeline');
  }, 200);
  return json.access_token;
}

export async function unauthenticateUser() {
  const token = localStorage.getItem('accessToken');
  const currentInstance =
    localStorage.getItem('currentInstance') || 'sivar.cafe';
  const instance = JSON.parse(localStorage.getItem('instances') || '{}')[
    currentInstance
  ];
  if (token) {
  }
  const formData = new FormData();
  formData.append('token', token || '');
  formData.append('client_id', instance.client_id);
  formData.append('client_secret', instance.client_secret);
  try {
    if (token) {
      await fetch(`https://${currentInstance}/oauth/revoke`, {
        method: 'POST',
        body: formData,
      });
    }
  } finally {
    localStorage.removeItem('accessToken');
    setTimeout(() => {
      Router.go('/');
    }, 200);
  }
}
