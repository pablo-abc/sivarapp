import { Router } from '@vaadin/router';

import '@shoelace-style/shoelace/dist/themes/light.css';
import '@pages/sv-index-page';
import '@pages/sv-timeline-page';
import '@pages/sv-oauth-callback-page';

const app = document.getElementById('app');

const router = new Router(app);

router.setRoutes([
  { path: '/', component: 'sv-index-page' },
  { path: '/timeline', component: 'sv-timeline-page' },
  { path: '/oauth/callback', component: 'sv-oauth-callback-page' },
]);
