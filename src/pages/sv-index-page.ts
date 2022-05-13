import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import '@components/sv-signin-instance';
import '@components/sv-title';
import '@shoelace-style/shoelace/dist/components/card/card.js';
import link from '@styles/link';

@customElement('sv-index-page')
export class SvindexPage extends LitElement {
  static styles = [
    link,
    css`
      :host {
        display: block;
      }

      main {
        margin: 0 auto;
        display: block;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
      }

      sl-card {
        width: min(97%, 25rem);
      }

      #welcome-card {
        width: min(97%, 25rem);
      }
    `,
  ];

  override render() {
    return html`
      <sv-title></sv-title>
      <main>
        <sl-card id="welcome-card">
          <h2>Welcome!</h2>
          <p>
            This is a web client for
            <a href="https://joinmastodon.org" target="_blank" rel="noreferrer">
              Mastodon
            </a>
            (or any other compatible services).
          </p>
          <p>
            This is a work in progress, currently. So not all features are
            available yet.
          </p>
          <p>
            This project is
            <a
              href="https://github.com/pablo-abc/sivarapp"
              target="_blank"
              rel="noreferrer"
            >
              open source,
            </a>
            developed by
            <a
              href="https://pablo.berganza.dev"
              target="_blank"
              rel="noreferrer"
            >
              Pablo Berganza
            </a>
            and released under the
            <a
              href="https://www.gnu.org/licenses/agpl-3.0.en.html"
              target="_blank"
              rel="noreferrer"
            >
              AGPL-3.0 license.
            </a>
          </p>
        </sl-card>
        <sl-card>
          <h2 id="header">Sign in to your instance</h2>
          <div id="content">
            <sv-signin-instance></sv-signin-instance>
          </div>
        </sl-card>
      </main>
    `;
  }
}
