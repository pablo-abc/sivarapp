import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { store } from '@store/store';
import { markAsRead } from '@store/notification';

import '@components/sv-title';

@customElement('sv-notifications-page')
export class SvNotificationsPage extends LitElement {
  static styles = css`
    main {
      width: min(97%, 35rem);
      margin: 0 auto;
    }
  `;

  override firstUpdated() {
    store.dispatch(markAsRead());
  }

  override render() {
    return html`
      <sv-title></sv-title>
      <main>
        <h2>WIP: This will be available soon</h2>
      </main>
    `;
  }
}
