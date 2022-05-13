import type { SlButton } from '@shoelace-style/shoelace';
import { LitElement, html, css, type PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { debounce } from '@utils/debounce';

import '@components/sv-toot-skeleton';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';

@customElement('sv-fetch-more-button')
export class SvFetchTootButton extends LitElement {
  static styles = css`
    :host {
      display: flex;
      justify-content: center;
      width: 100%;
    }
  `;

  @property({ type: Boolean })
  loading = false;

  @query('sl-button')
  button!: SlButton;

  fetchNext() {
    this.dispatchEvent(new Event('sv:fetch-next', { bubbles: true }));
  }

  #observer?: IntersectionObserver;

  override connectedCallback(): void {
    super.connectedCallback();
    this.fetchNext = debounce(this.fetchNext.bind(this));
    this.#observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.fetchNext();
        }
      },
      {
        root: null,
        threshold: 0.5,
      }
    );
  }

  override updated(changed: PropertyValues<this>) {
    if (changed.has('loading')) {
      if (this.button) {
        this.#observer?.observe(this.button);
      } else {
        this.#observer?.disconnect();
      }
    }
  }

  override render() {
    if (this.loading) {
      return html`
        <slot name="skeleton">
          <sv-toot-skeleton></sv-toot-skeleton>
        </slot>
      `;
    }
    return html`<sl-button @click=${this.fetchNext}><slot></slot></sl-button>`;
  }
}
