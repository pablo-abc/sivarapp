import { getInstance } from '@api/instance';
import type { PropertyValues } from 'lit';
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import link from '@styles/link';
import { connect } from '@store/connect';
import type { RootState } from '@store/store';
import storage from '@utils/storage';

import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
import '@components/sv-account-mini';

@customElement('sv-title')
export class SvTitle extends connect(LitElement) {
  static styles = [
    link,
    css`
      #header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: min(97%, 55rem);
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

  override stateChanged(state: RootState) {
    this.instance = state.auth.instanceName;
  }

  async #fetchInstance() {
    this.homeLink = '/timeline';
    const instance = await getInstance();
    this.heading = instance.title;
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.authenticated) {
      this.heading = 'Sivarapp';
      this.homeLink = '/';
      return;
    }
  }

  willUpdate(changed: PropertyValues<this>) {
    if (changed.has('instance') && this.authenticated) {
      this.#fetchInstance();
    }
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
