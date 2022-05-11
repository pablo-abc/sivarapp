import type { SlDrawer } from '@shoelace-style/shoelace';
import { getInstance } from '@api/instance';
import type { PropertyValues } from 'lit';
import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import link from '@styles/link';

import '@shoelace-style/shoelace/dist/components/drawer/drawer.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
import '@components/sv-signout-button';
import '@components/sv-account-mini';

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
  authenticated = !!localStorage.getItem('accessToken');

  @property()
  instance = localStorage.getItem('currentInstance') || 'sivar.cafe';

  @property()
  homeLink = '/';

  @query('sl-drawer')
  drawer!: SlDrawer;

  connectedCallback() {
    super.connectedCallback();
    if (!this.authenticated) {
      this.heading = 'Sivares';
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

  openDrawer() {
    this.drawer.show();
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
      <sl-drawer>
        <ul>
          <li>
            <a href="/profile">Profile</a>
          </li>
          <li>
            <a href="/preferences">Preferences</a>
          </li>
          <li>
            <sv-signout-button></sv-signout-button>
          </li>
        </ul>
      </sl-drawer>
    `;
  }
}
