import { getInstance } from '@api/instance';
import type { PropertyValues } from 'lit';
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import link from '@styles/link';

import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
import '@components/sv-account-mini';
import storage from '@utils/storage';

@customElement('sv-title')
export class SvTitle extends LitElement {
  static styles = [
    link,
    css`
      #header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: min(97%, 45rem);
        margin: 0 auto;
      }

      #items-left {
        display: flex;
        align-items: center;
      }

      sl-icon-button {
        font-size: 2rem;
      }

      li {
        list-style-type: none;
        margin-top: 1rem;
      }
    `,
  ];

  @property()
  heading = '';

  @property({ type: Boolean })
  authenticated = !!storage.accessToken;

  @property()
  instance = storage.currentInstance;

  @property()
  homeLink = '/';

  connectedCallback() {
    super.connectedCallback();
    if (!this.authenticated) {
      this.heading = 'Sivarapp';
      this.homeLink = '/';
      return;
    }
    this.homeLink = '/timeline';
    getInstance().then((instance) => {
      this.heading = instance.title;
    });
  }

  updated(changed: PropertyValues<this>) {
    if (changed.has('heading')) {
      document.title = this.heading;
    }
  }

  override render() {
    return html`
      <div id="header">
        <div id="items-left">
          <h1><a href=${this.homeLink}>${this.heading}</a></h1>
        </div>
        ${when(
          this.authenticated,
          () => html`<sv-account-mini></sv-account-mini>`
        )}
      </div>
    `;
  }
}
