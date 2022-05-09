import './styles.css';
import { Router } from '@vaadin/router';

import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/themes/dark.css';
import '@layouts/sv-timeline-layout';
import '@pages/sv-index-page';
import '@pages/sv-timeline-page';
import '@pages/sv-oauth-callback-page';
import '@pages/sv-not-found';
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';

// Set the base path to the folder you copied Shoelace's assets to
setBasePath('../');

const app = document.getElementById('app');

const router = new Router(app);

router.setRoutes([
  { path: '/', component: 'sv-index-page' },
  {
    path: '/timeline',
    component: 'sv-timeline-layout',
    children: [
      { path: '/', component: 'sv-timeline-page' },
      { path: '/:type', component: 'sv-timeline-page' },
    ],
  },
  { path: '/oauth/callback', component: 'sv-oauth-callback-page' },
  { path: '(.*)', component: 'sv-not-found' },
]);
