import type { RootState } from '@store/store';
import type { Status } from '@types';
import { LitElement, html, css, nothing, type PropertyValues } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import { connect } from '@store/connect';
import { store } from '@store/store';
import { fetchTimeline } from '@store/timeline';

import './sv-toot';
import '@components/sv-fetch-more-button';
import '@components/sv-toot-compose';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/button-group/button-group.js';

export const tagName = 'sv-timeline';

@customElement(tagName)
export class SvTimeline extends connect(LitElement) {
  static styles = css`
    :host {
      display: block;
    }

    * {
      box-sizing: border-box;
    }

    sv-toot-skeleton {
      margin-bottom: 1rem;
    }

    ul {
      margin: 0;
      padding: 0;
    }

    li {
      list-style: none;
    }

    li:not(:last-child) {
      margin-bottom: var(--sv-timeline-gap, 1rem);
    }

    sl-button-group {
      display: flex;
      justify-content: center;
      margin: 1rem 0;
      box-shadow: -5px 5px 15px 0px rgba(0, 0, 0, 0.3);
    }

    sv-toot-compose::part(button) {
      box-shadow: 5px 5px 10px 0px rgba(0, 0, 0, 0.3);
    }

    sl-button[data-selected]::part(base) {
      color: var(--sl-color-primary-600);
    }

    #pagination-footer {
      display: flex;
      justify-content: center;
      margin: 1rem 0;
    }

    #actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: -webkit-sticky;
      position: sticky;
      top: 1rem;
      z-index: 1;
    }
  `;

  @state()
  toots: Status[] = [];

  @state()
  empty = false;

  @state()
  loading = false;

  @property({ reflect: true })
  timeline: 'home' | 'public' | 'local' = 'home';

  @state()
  accountId?: string;

  @state()
  instance?: string;

  override stateChanged(state: RootState) {
    const currentInstance = state.auth.instanceName;
    this.instance = currentInstance;
    if (!currentInstance) return;
    this.accountId = state.account.accounts[currentInstance]?.id;
    this.loading = state.timeline.loading;
    this.empty =
      state.timeline.instances[currentInstance]?.[this.timeline]?.empty ??
      false;
    this.toots =
      state.timeline.instances[currentInstance]?.[this.timeline]?.statuses ??
      [];
  }

  override willUpdate(changed: PropertyValues<this>) {
    if (changed.has('instance') && this.instance) {
      const toots =
        store.getState().timeline.instances[this.instance]?.[this.timeline]
          ?.statuses ?? [];
      this.toots = toots;
      if (toots.length === 0) this.fetchNext();
    }
  }

  async fetchNext() {
    store.dispatch(fetchTimeline(this.timeline));
  }

  override render() {
    return html`
      <div id="actions">
        <sv-toot-compose>Write</sv-toot-compose>
        <sl-button-group>
          <sl-button
            href="/timeline/home"
            ?data-selected=${this.timeline === 'home'}
          >
            Home
          </sl-button>
          <sl-button
            href="/timeline/local"
            ?data-selected=${this.timeline === 'local'}
          >
            Local
          </sl-button>
          <sl-button
            href="/timeline/public"
            ?data-selected=${this.timeline === 'public'}
          >
            Public
          </sl-button>
        </sl-button-group>
      </div>
      <ul>
        ${this.toots.map((toot) => {
          const tootAccountId = toot.reblog
            ? toot.reblog.account.id
            : toot.account.id;
          const owned = tootAccountId === this.accountId;
          return html`
            <li>
              <sv-toot ?owned=${owned} .status=${toot}></sv-toot>
            </li>
          `;
        })}
      </ul>
      <div id="pagination-footer">
        ${!this.empty
          ? html`
              <sv-fetch-more-button
                ?loading=${this.loading}
                @sv:fetch-next=${this.fetchNext}
              >
                Fetch more
              </sv-fetch-more-button>
            `
          : nothing}
      </div>
    `;
  }
}
