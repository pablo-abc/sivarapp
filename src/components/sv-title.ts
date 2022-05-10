import type { SlDrawer } from '@shoelace-style/shoelace';
import { getInstance } from '@api/instance';
import type { PropertyValues } from 'lit';
import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

import '@shoelace-style/shoelace/dist/components/drawer/drawer.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
import '@components/sv-signout-button';

@customElement('sv-title')
export class SvTitle extends LitElement {
  static styles = css`
    #header {
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

    a {
      color: var(--sl-color-primary-800, blue);
      text-decoration: none;
    }

    a:visited {
      color: var(--sl-color-primary-800, blue);
    }
  `;

  @property()
  heading = '';

  @property()
  instance = localStorage.getItem('currentInstance') || 'sivar.cafe';

  @property()
  homeLink = '/';

  @query('sl-drawer')
  drawer!: SlDrawer;

  connectedCallback() {
    super.connectedCallback();
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
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
        <sl-icon-button
          @click=${this.openDrawer}
          name="list"
          label="Open menu"
        ></sl-icon-button>
        <h1><a href=${this.homeLink}>${this.heading}</a></h1>
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
