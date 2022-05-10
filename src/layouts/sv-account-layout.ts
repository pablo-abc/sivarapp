import type { Account } from '@types';
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import link from '@styles/link';

import '@shoelace-style/shoelace/dist/components/avatar/avatar.js';
import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/badge/badge.js';
import '@shoelace-style/shoelace/dist/components/divider/divider.js';
import '@components/sv-title';
import '@components/sv-toot-skeleton';
import { RouterLocation } from '@vaadin/router';
import { getAccount } from '@api/account';

function getNote(status: Account) {
  const content = status.note;
  const emojis = status.emojis;
  return emojis.reduce((acc, emoji) => {
    return acc.replace(
      `:${emoji.shortcode}:`,
      `<img class="emoji" src="${emoji.url}" alt="">`
    );
  }, content);
}

@customElement('sv-account-layout')
export class SvAccountLayout extends LitElement {
  static styles = [
    link,
    css`
      .emoji {
        height: 1rem;
        width: 1rem;
      }

      main {
        width: min(97%, 35rem);
        margin: 0 auto;
      }

      [slot='header'] {
        display: flex;
        align-items: center;
      }

      sl-avatar {
        margin-right: 0.5rem;
      }

      sl-card {
        width: 100%;
      }
    `,
  ];

  @property({ type: Object })
  account?: Account;

  @state()
  accountLoading = false;

  @property({ attribute: false })
  location!: RouterLocation;

  async fetchAccount() {
    try {
      this.accountLoading = true;
      this.account = await getAccount(this.location.params.id as string);
    } finally {
      this.accountLoading = false;
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.fetchAccount();
  }

  renderCard() {
    if (this.accountLoading || !this.account)
      return html`<sv-toot-skeleton></sv-toot-skeleton>`;
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
            <sl-badge pill variant="neutral">
              ${this.account.statuses_count} Toots
            </sl-badge>
            <sl-badge pill variant="neutral">
              ${this.account.following_count} Follows
            </sl-badge>
            <sl-badge pill variant="neutral">
              ${this.account.followers_count} Followers
            </sl-badge>
          </div>
        </div>
        <div>${unsafeHTML(getNote(this.account))}</div>
      </sl-card>
      <sl-divider></sl-divider>
      <slot></slot>
    `;
  }

  override render() {
    return html`
      <sv-title></sv-title>
      <main>${this.renderCard()}</main>
    `;
  }
}
