import { LitElement, html, css, nothing } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import { getTimeline } from '@api/timelines';
import { Status } from '@types';

import './sv-toot';
import '@shoelace-style/shoelace/dist/components/spinner/spinner.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/button-group/button-group.js';

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

    sl-button-group {
      display: flex;
      justify-content: center;
      margin: 1rem;
    }

    sl-spinner {
      font-size: 5rem;
      margin: 1rem auto;
      display: block;
      --track-width: 1rem;
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

  connectedCallback() {
    super.connectedCallback();
    this.fetchNext();
  }

  async fetchNext() {
    try {
      this.loading = true;
      if (this.toots.length === 0) {
        this.toots = await getTimeline(this.timeline);
      } else {
        const newToots = await getTimeline(this.timeline, {
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
      <sl-button-group>
        <sl-button href="/timeline/home" ?disabled=${this.timeline === 'home'}>
          Home
        </sl-button>
        <sl-button
          href="/timeline/local"
          ?disabled=${this.timeline === 'local'}
        >
          Local
        </sl-button>
        <sl-button
          href="/timeline/public"
          ?disabled=${this.timeline === 'public'}
        >
          Public
        </sl-button>
      </sl-button-group>
      <ul>
        ${this.toots.map((toot) => {
          return html`
            <li>
              <sv-toot .status=${toot}></sv-toot>
            </li>
          `;
        })}
      </ul>
      ${!this.empty
        ? this.loading
          ? html`<sl-spinner></sl-spinner>`
          : html`<button @click=${this.fetchNext} type="button">
              Fetch more
            </button>`
        : nothing}
    `;
  }
}
