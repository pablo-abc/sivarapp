import type { Notification } from '@types';
import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { markAllAsRead } from '@store/notification';
import { when } from 'lit/directives/when.js';
import { StoreController } from '@store/controller';
import { getNotifications } from '@api/account';

import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@components/sv-notification';
import '@components/sv-title';
import '@components/sv-notification-skeleton';
import '@components/sv-fetch-more-button';

@customElement('sv-notifications-page')
export class SvNotificationsPage extends LitElement {
  static styles = css`
    main {
      width: min(97%, 35rem);
      margin: 0 auto;
    }

    li {
      list-style: none;
      margin-bottom: 1rem;
    }

    ul {
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
    }

    sv-fetch-more-button {
      margin-bottom: 2rem;
    }

    sl-card {
      width: 100%;
    }
  `;

  @state()
  loading = false;

  @state()
  notifications: Notification[] = [];

  @state()
  internalNotifications: Notification[] = [];

  get #notifications() {
    return [...this.notifications, ...this.internalNotifications];
  }

  @state()
  empty = false;

  #store = new StoreController(this, {
    notifications(state) {
      return state.notification.notifications;
    },
    loading(state) {
      return state.notification.state === 'loading';
    },
  });

  async #fetchNextNotifications() {
    try {
      this.loading = true;
      const newNotifications = await getNotifications({
        max_id: this.#notifications[this.#notifications.length - 1].id,
      });
      if (!newNotifications || newNotifications.length === 0) {
        this.empty = true;
        return;
      }
      this.internalNotifications = [
        ...newNotifications,
        ...this.internalNotifications,
      ];
    } finally {
      this.loading = false;
    }
  }

  override updated(changed: PropertyValues<this>) {
    if (changed.has('notifications')) {
      this.#store.dispatch(markAllAsRead());
    }
  }

  override render() {
    return html`
      <sv-title></sv-title>
      <main>
        <h2>Notifications</h2>
        <ul>
          ${this.#notifications.map((notification) => {
            return html`
              <li>
                <sl-card>
                  <sv-notification
                    .notification=${notification}
                  ></sv-notification>
                </sl-card>
              </li>
            `;
          })}
        </ul>
        ${when(
          !this.empty,
          () => html`
            <sv-fetch-more-button
              @sv:fetch-next=${this.#fetchNextNotifications}
              ?loading=${this.loading}
            >
              Fetch more
              <sv-notification-skeleton
                slot="skeleton"
              ></sv-notification-skeleton>
            </sv-fetch-more-button>
          `
        )}
      </main>
    `;
  }
}
