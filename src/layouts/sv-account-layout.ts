import type { Account } from '@types';
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import link from '@styles/link';
import { RouterLocation } from '@vaadin/router';
import { getAccount } from '@api/account';
import { when } from 'lit/directives/when.js';
import emoji from '@styles/emoji';
import { renderEmoji } from '@utils/emoji';

import '@shoelace-style/shoelace/dist/components/avatar/avatar.js';
import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/badge/badge.js';
import '@shoelace-style/shoelace/dist/components/divider/divider.js';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';
import '@components/sv-title';
import '@components/sv-toot-skeleton';

function getNote(status: Account) {
  const content = status.note;
  const emojis = status.emojis;
  return renderEmoji(content, emojis);
}

@customElement('sv-account-layout')
export class SvAccountLayout extends LitElement {
  static styles = [
    link,
    emoji,
    css`
      main {
        width: min(97%, 35rem);
        margin: 0 auto;
      }

      [slot='header'] {
        display: flex;
        align-items: center;
        line-height: 1.5rem;
      }

      sl-avatar {
        margin-right: 0.5rem;
      }

      sl-card {
        width: 100%;
      }

      .field {
        padding: 0.5rem 0;
      }

      @media only screen and (min-width: 768px) {
        .field {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .field dd {
          margin: 0;
        }
      }

      #fields {
        width: 90%;
        margin: 0 auto;
        margin-top: 2rem;
      }

      #fields sl-icon {
        color: var(--sl-color-lime-600);
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
                <span class="header__name">
                  ${unsafeHTML(
                    renderEmoji(this.account.display_name, this.account.emojis)
                  )}
                </span>
                <br />
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
        ${when(
          this.account.fields?.length,
          () => html`
            <dl id="fields">
              ${this.account!.fields!.map((field) => {
                return html`
                  <div class="field">
                    <dt>
                      <strong>${field.name}</strong>
                      ${when(
                        field.verified_at,
                        () => html`
                          <sl-tooltip content="Verified!">
                            <sl-icon name="check-circle-fill"></sl-icon>
                          </sl-tooltip>
                        `
                      )}
                    </dt>
                    <dd>${unsafeHTML(field.value)}</dd>
                  </div>
                `;
              })}
            </dl>
          `
        )}
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
