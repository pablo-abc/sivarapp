import './styles.css';
import { Router } from '@vaadin/router';
import { isAuthenticated } from '@store/store';
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';

import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/themes/dark.css';

// Set the base path to the folder you copied Shoelace's assets to
setBasePath('/');

const app = document.getElementById('app');

const router = new Router(app);

router.setRoutes([
  {
    path: '/',
    async action(_, commands) {
      if (isAuthenticated()) return commands.redirect('/timeline');
      await import('@pages/sv-index-page');
      return commands.component('sv-index-page');
    },
  },
  {
    path: '/timeline',
    async action(_, commands) {
      if (!isAuthenticated()) return commands.redirect('/');
      await import('@layouts/sv-timeline-layout');
      await import('@pages/sv-timeline-page');
      return commands.component('sv-timeline-layout');
    },
    children: [
      { path: '/', component: 'sv-timeline-page' },
      { path: '/:type', component: 'sv-timeline-page' },
    ],
  },
  {
    path: '/accounts/:id',
    async action(_, commands) {
      if (!isAuthenticated()) return commands.redirect('/');
      await import('@layouts/sv-account-layout');
      await import('@pages/sv-account-toots-page');
      return commands.component('sv-account-layout');
    },
    children: [
      { path: '/', component: 'sv-account-toots-page' },
      { path: '/:timeline', component: 'sv-account-toots-page' },
    ],
  },
  {
    path: '/statuses/:id',
    async action(_, commands) {
      if (!isAuthenticated()) return commands.redirect('/');
      await import('@pages/sv-status-page');
      return commands.component('sv-status-page');
    },
  },
  {
    path: '/oauth/callback',
    async action(_, commands) {
      await import('@pages/sv-oauth-callback-page');
      return commands.component('sv-oauth-callback-page');
    },
  },
  {
    path: '/oauth/authorize',
    async action(_, commands) {
      await import('@pages/sv-oauth-authorize-page');
      return commands.component('sv-oauth-authorize-page');
    },
  },
  {
    path: '(.*)',
    async action(_, commands) {
      await import('@pages/sv-not-found');
      return commands.component('sv-not-found');
    },
  },
]);
