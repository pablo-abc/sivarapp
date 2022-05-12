import { getAccountStatuses } from '@api/account';
import type { Status } from '@types';
import type { RootState } from '@store/store';
import { RouterLocation } from '@vaadin/router';
import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { connect } from '@store/connect';

import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/button-group/button-group.js';
import '@components/sv-toot';
import '@components/sv-toot-skeleton';
import '@components/sv-fetch-toot-button';
import storage from '@utils/storage';

@customElement('sv-account-toots-page')
export class SvAccountTootsPage extends connect(LitElement) {
  static styles = css`
    li {
      list-style: none;
      width: 90%;
      margin: 0 auto;
      margin-bottom: 1rem;
    }

    ul {
      padding: 0;
    }

    sl-button-group {
      display: flex;
      justify-content: center;
      position: -webkit-sticky;
      position: sticky;
      top: 1rem;
      z-index: 1;
    }

    sl-button[data-selected]::part(base) {
      color: var(--sl-color-primary-600);
    }

    sv-fetch-toot-button {
      margin-bottom: 2rem;
    }

    #nothing-text {
      text-align: center;
      margin: 2rem;
    }
  `;

  @property()
  timeline = 'toots';

  @property()
  accountId = '';

  @property({ attribute: false })
  location!: RouterLocation;

  @state()
  loading = false;

  @state()
  empty = false;

  @state()
  statuses: Status[] = [];

  @state()
  loggedInId?: string;

  override stateChanged(state: RootState) {
    const currentInstance = storage.currentInstance;
    if (!currentInstance) return;
    this.loggedInId = state.account.accounts[currentInstance]?.id;
  }

  async fetchStatuses() {
    this.timeline = (this.location.params.timeline as string) || 'toots';
    this.accountId = this.location.params.id as string;
    try {
      this.loading = true;
      const newToots = (
        await getAccountStatuses(this.accountId, {
          excludeReplies: this.timeline !== 'with-replies',
          onlyMedia: this.timeline === 'media',
          maxId: this.statuses[this.statuses.length - 1]?.id,
        })
      ).map((toot) => {
        return {
          ...toot,
          reblogged: !!toot.reblog || toot.reblogged,
        };
      });
      if (!newToots || newToots.length === 0) {
        this.empty = true;
        return;
      }
      this.statuses = [...this.statuses, ...newToots];
    } finally {
      this.loading = false;
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.fetchStatuses();
  }

  override render() {
    return html`
      <sl-button-group>
        <sl-button
          href=${`/accounts/${this.accountId}`}
          ?data-selected=${this.timeline === 'toots'}
        >
          Toots
        </sl-button>
        <sl-button
          href=${`/accounts/${this.accountId}/with-replies`}
          ?data-selected=${this.timeline === 'with-replies'}
        >
          Toots And Replies
        </sl-button>
        <sl-button
          href=${`/accounts/${this.accountId}/media`}
          ?data-selected=${this.timeline === 'media'}
        >
          Media
        </sl-button>
      </sl-button-group>
      <ul>
        ${this.statuses.map((toot) => {
          const tootAccountId = toot.reblog
            ? toot.reblog.account.id
            : toot.account.id;
          const owned = tootAccountId === this.loggedInId;
          return html`<li>
            <sv-toot ?owned=${owned} .status=${toot}></sv-toot>
          </li>`;
        })}
      </ul>
      ${when(
        this.empty,
        () =>
          this.statuses.length === 0
            ? html`<p id="nothing-text">There's nothing here :(</p>`
            : nothing,
        () => html`
          <sv-fetch-toot-button
            ?loading=${this.loading}
            @sv:fetch-next=${this.fetchStatuses}
          >
            Fetch more
          </sv-fetch-toot-button>
        `
      )}
    `;
  }
}
