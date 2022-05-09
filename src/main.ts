import { Router } from '@vaadin/router';

import '@shoelace-style/shoelace/dist/themes/light.css';
import '@layouts/sv-timeline-layout';
import '@pages/sv-index-page';
import '@pages/sv-timeline-page';
import '@pages/sv-oauth-callback-page';
import '@pages/sv-not-found';

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
