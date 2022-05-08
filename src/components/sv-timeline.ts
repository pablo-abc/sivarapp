import { LitElement, html, css, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { getHome } from '@api/timelines';
import { Status } from '@types';

import './sv-toot';

export const tagName = 'sv-timeline';

@customElement(tagName)
export class SvTimeline extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    * {
      box-sizing: border-box;
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
  `;

  @state()
  toots: Status[] = [];

  @state()
  empty = false;

  @state()
  loading = false;

  connectedCallback() {
    super.connectedCallback();
    this.fetchNext();
  }

  async fetchNext() {
    try {
      this.loading = true;
      if (this.toots.length === 0) {
        this.toots = await getHome();
      } else {
        const newToots = await getHome({
          max_id: this.toots[this.toots.length - 1].id,
        });
        if (newToots.length === 0) {
          this.empty = true;
        } else this.toots = [...this.toots, ...newToots];
      }
    } finally {
      this.loading = false;
    }
  }

  override render() {
    return html`
      <ul>
        ${this.toots.map((toot: any) => {
          return html`
            <li>
              <sv-toot
                displayname=${toot.account.display_name}
                avatar=${toot.account.avatar}
                acct=${toot.account.acct}
                accountUrl=${toot.account.url}
                ?sensitive=${toot.sensitive}
                content=${toot.content}
                createdat=${toot.created_at}
                spoilertext=${toot.spoiler_text}
              ></sv-toot>
            </li>
          `;
        })}
      </ul>
      ${!this.empty
        ? this.loading
          ? html`Loading...`
          : html`<button @click=${this.fetchNext} type="button">
              Fetch more
            </button>`
        : nothing}
    `;
  }
}
