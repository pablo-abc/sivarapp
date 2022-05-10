import type { SlDialog } from '@shoelace-style/shoelace';
import { LitElement, html, css } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';
import type { Account } from '@types';
import { getMe } from '@api/account';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import '@shoelace-style/shoelace/dist/components/avatar/avatar.js';
import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@components/sv-toot-compose';
import '@components/sv-signout-button';
import '@components/sv-toot-skeleton';

@customElement('sv-account-mini')
export class SvAccountMini extends LitElement {
  static styles = [
    css`
      sv-toot-skeleton {
        width: 20rem;
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

  @query('sl-dialog')
  dialog!: SlDialog;

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

  openDialog() {
    this.dialog.show();
  }

  handleRequestClose(event: Event) {
    const detail = (event as CustomEvent<{ source: string }>).detail;
    if (detail.source === 'overlay' || detail.source === 'keyboard') {
      event.preventDefault();
    }
  }

  override render() {
    if (this.loading || !this.account)
      return html`<sv-toot-skeleton></sv-toot-skeleton>`;
    return html`
      <sl-card>
        <div slot="header">
          <sl-avatar image=${this.account.avatar}></sl-avatar>
          <div class="info">
            <a href=${`/accounts/${this.account.id}`} rel="noreferrer">
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
          <sl-button @click=${this.openDialog} variant="primary">
            <sl-icon slot="prefix" name="pencil"></sl-icon>
            Write
          </sl-button>
        </div>
      </sl-card>
      <sl-dialog
        @sl-request-close=${this.handleRequestClose}
        label="Compose a toot"
      >
        <sv-toot-compose></sv-toot-compose>
        <div slot="footer">
          <sl-button @click=${() => this.dialog.hide()}>Close</sl-button>
          <sl-button variant="primary">
            <sl-icon slot="prefix" name="send"></sl-icon>
            Toot!
          </sl-button>
        </div>
      </sl-dialog>
    `;
  }
}
