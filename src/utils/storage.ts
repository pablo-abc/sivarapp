import type { Application } from '@types';

export type RegisteredApps = {
  [key: string]: Application | undefined;
};

export type RegisteredAccount = {
  accessToken: string;
  username: string;
};

export type RegisteredAccounts = {
  [key: string]: RegisteredAccount;
};

export default {
  get currentInstance() {
    return localStorage.getItem('currentInstance') || undefined;
  },
  set currentInstance(name: string | undefined) {
    if (name) localStorage.setItem('currentInstance', name);
    else localStorage.removeItem('currentInstance');
  },
  get apps(): RegisteredApps {
    return JSON.parse(localStorage.getItem('apps') || '{}');
  },
  set apps(value: RegisteredApps) {
    localStorage.setItem('apps', JSON.stringify(value));
  },
  get accounts(): RegisteredAccounts {
    return JSON.parse(localStorage.getItem('registeredAccounts') || '{}');
  },
  set accounts(value: RegisteredAccounts) {
    localStorage.setItem('registeredAccounts', JSON.stringify(value));
  },
  get currentApp(): Application | undefined {
    const currentInstance = localStorage.getItem('currentInstance');
    if (!currentInstance) return;
    return JSON.parse(localStorage.getItem('apps') || '{}')[currentInstance];
  },
  get accessToken() {
    return localStorage.getItem('accessToken') || undefined;
  },
  set accessToken(token: string | undefined) {
    if (token) localStorage.setItem('accessToken', token);
    else localStorage.removeItem('accessToken');
  },
};
