import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '@components/sv-toot-skeleton';
import '@shoelace-style/shoelace/dist/components/button/button.js';

@customElement('sv-fetch-toot-button')
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

  fetchNext() {
    this.dispatchEvent(new Event('sv:fetch-next', { bubbles: true }));
  }

  override render() {
    if (this.loading) {
      return html`<sv-toot-skeleton></sv-toot-skeleton>`;
    }
    return html`<sl-button @click=${this.fetchNext}><slot></slot></sl-button>`;
  }
}
