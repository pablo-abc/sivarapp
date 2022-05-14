import {
  getAccountStatuses,
  getAccountFollowers,
  getAccountFollowing,
  getAccountRelationship,
} from '@api/account';
import type { Account, Relationship, Status } from '@types';
import type { RootState } from '@store/store';
import { RouterLocation } from '@vaadin/router';
import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { connect } from '@store/connect';
import storage from '@utils/storage';

import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/button-group/button-group.js';
import '@components/sv-toot';
import '@components/sv-toot-skeleton';
import '@components/sv-fetch-more-button';

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

    #button-groups {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      position: -webkit-sticky;
      position: sticky;
      top: 1rem;
      z-index: 1;
    }

    sl-button[data-selected]::part(base) {
      color: var(--sl-color-primary-600);
    }

    sv-fetch-more-button {
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
  pinnedStatuses: Status[] = [];

  @state()
  accounts: (Account & { relationship: Relationship })[] = [];

  @state()
  loggedInId?: string;

  override stateChanged(state: RootState) {
    const currentInstance = storage.currentInstance;
    if (!currentInstance) return;
    this.loggedInId = state.account.accounts[currentInstance]?.id;
  }

  async fetchAccounts() {
    this.timeline = (this.location.params.timeline as string) || 'toots';
    if (!['followers', 'following'].includes(this.timeline)) return;
    const fetcher =
      this.timeline === 'followers' ? getAccountFollowers : getAccountFollowing;
    this.accountId = this.location.params.id as string;
    try {
      this.loading = true;
      const params: { max_id?: string } = {};
      const maxId = this.accounts[this.accounts.length - 1]?.id;
      if (maxId) params.max_id = maxId;
      const newAccounts = await fetcher(this.accountId, params);
      const isLastPage = newAccounts.find((acc) => acc.id === maxId);
      if (!newAccounts?.length || isLastPage) {
        this.empty = true;
        return;
      }
      const relationships = await getAccountRelationship(
        newAccounts.map((acc) => acc.id)
      );
      this.accounts = [
        ...this.accounts,
        ...newAccounts.map((acc, index) => ({
          ...acc,
          relationship: relationships[index],
        })),
      ];
    } finally {
      this.loading = false;
    }
  }

  #fetchedPinned = false;

  async fetchStatuses() {
    this.timeline = (this.location.params.timeline as string) || 'toots';
    if (['followers', 'following'].includes(this.timeline)) return;
    this.accountId = this.location.params.id as string;
    try {
      this.loading = true;
      if (!this.#fetchedPinned) {
        this.pinnedStatuses = (
          await getAccountStatuses(this.accountId, {
            pinned: true,
          })
        ).map((toot) => {
          return {
            ...toot,
            pinned: true,
            reblogged: !!toot.reblog || toot.reblogged,
          };
        });
      }
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

  #fetchPage() {
    this.fetchStatuses();
    this.fetchAccounts();
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.#fetchPage();
  }

  override render() {
    const shouldRenderAccounts = ['followers', 'following'].includes(
      this.timeline
    );
    const items = shouldRenderAccounts
      ? this.accounts
      : [...this.pinnedStatuses, ...this.statuses];
    return html`
      <div id="button-groups">
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
        <sl-button-group>
          <sl-button
            href=${`/accounts/${this.accountId}/followers`}
            ?data-selected=${this.timeline === 'followers'}
          >
            Followers
          </sl-button>
          <sl-button
            href=${`/accounts/${this.accountId}/following`}
            ?data-selected=${this.timeline === 'following'}
          >
            Following
          </sl-button>
        </sl-button-group>
      </div>
      <ul>
        ${items.map((toot) => {
          if ('display_name' in toot) {
            return html`
              <li>
                <sv-account
                  .account=${toot}
                  .relationship=${toot.relationship}
                  headeronly
                ></sv-account>
              </li>
            `;
          }
          const tootAccountId = toot.reblog
            ? toot.reblog.account.id
            : toot.account.id;
          const owned = tootAccountId === this.loggedInId;
          return html`<li>
            <sv-toot
              ?owned=${owned}
              .status=${toot}
              ?pinned=${toot.pinned}
            ></sv-toot>
          </li>`;
        })}
      </ul>
      ${when(
        this.empty,
        () =>
          items.length === 0
            ? html`<p id="nothing-text">There's nothing here :(</p>`
            : nothing,
        () => html`
          <sv-fetch-more-button
            ?loading=${this.loading}
            @sv:fetch-next=${this.#fetchPage}
          >
            Fetch more
          </sv-fetch-more-button>
        `
      )}
    `;
  }
}
