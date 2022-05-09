import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { Account } from '@types';
import { getMe } from '@api/account';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import '@shoelace-style/shoelace/dist/components/avatar/avatar.js';
import '@shoelace-style/shoelace/dist/components/spinner/spinner.js';
import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@components/sv-signout-button';

@customElement('sv-account-mini')
export class SvAccountMini extends LitElement {
  static styles = [
    css`
      sl-spinner {
        font-size: 5rem;
        margin: 1rem auto;
        display: block;
        --track-width: 1rem;
      }

      sl-avatar {
        margin-right: 0.5rem;
      }

      .header__acct {
        font-style: italic;
      }

      .info {
        display: flex;
        flex-direction: column;
      }

      a {
        color: var(--sl-color-primary-800, blue);
        text-decoration: none;
      }

      a:visited {
        color: var(--sl-color-primary-800, blue);
      }

      sl-card {
        max-width: 20rem;
      }

      [slot='header'] {
        display: flex;
        align-items: center;
      }
    `,
  ];

  @state()
  loading = false;

  @state()
  account?: Account;

  async fetchUser() {
    try {
      this.loading = true;
      this.account = await getMe();
    } finally {
      this.loading = false;
    }
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.fetchUser();
  }

  override render() {
    if (this.loading || !this.account) return html`<sl-spinner></sl-spinner>`;
    return html`
      <sl-card>
        <div slot="header">
          <sl-avatar image=${this.account.avatar}></sl-avatar>
          <div class="info">
            <a href=${this.account.url} rel="noreferrer">
              <div class="header__account">
                <span class="header__name"> ${this.account.display_name} </span>
                <span class="header__acct">(${this.account.acct})</span>
              </div>
            </a>
          </div>
        </div>
        <div>${unsafeHTML(this.account.note)}</div>
        <div slot="footer">
          <sv-signout-button></sv-signout-button>
          <sl-button variant="primary">
            <sl-icon slot="prefix" name="pencil"></sl-icon>
            Write
          </sl-button>
        </div>
      </sl-card>
    `;
  }
}
