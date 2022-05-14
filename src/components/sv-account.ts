import type { Account, Relationship } from '@types';
import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { when } from 'lit/directives/when.js';
import { renderEmoji } from '@utils/emoji';
import link from '@styles/link';
import emoji from '@styles/emoji';
import { ifDefined } from 'lit/directives/if-defined.js';
import { followAccount, unfollowAccount } from '@api/account';

import '@shoelace-style/shoelace/dist/components/avatar/avatar.js';
import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/badge/badge.js';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';

@customElement('sv-account')
export class SvAccount extends LitElement {
  static styles = [
    link,
    emoji,
    css`
      :host {
        display: block;
        width: 100%;
      }

      #header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      #header-left {
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

  @property({ type: Boolean })
  headerOnly = false;

  @property({ type: Object })
  relationship?: Relationship;

  @property({ type: Boolean })
  owned = false;

  @state()
  loadingFollow = false;

  async #followAccount() {
    if (!this.account || this.loadingFollow) return;
    try {
      this.loadingFollow = true;
      this.relationship = await followAccount(this.account.id);
    } finally {
      this.loadingFollow = false;
    }
  }

  async #unfollowAccount() {
    if (!this.account || this.loadingFollow) return;
    try {
      this.loadingFollow = true;
      this.relationship = await unfollowAccount(this.account.id);
    } finally {
      this.loadingFollow = false;
    }
  }

  #renderHeader(slotted = false) {
    if (!this.account) return nothing;
    return html`
      <div id="header" slot=${ifDefined(slotted ? 'header' : undefined)}>
        <div id="header-left">
          <sl-avatar image=${this.account.avatar}></sl-avatar>
          <div class="info">
            <a
              href=${this.headerOnly
                ? `/accounts/${this.account.id}`
                : this.account.url}
              rel=${ifDefined(this.headerOnly ? undefined : 'noreferrer')}
            >
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
        ${this.#renderFollowButton()}
      </div>
    `;
  }

  #renderFollowButton() {
    if (this.owned || !this.relationship) return nothing;
    if (this.relationship.following) {
      return html`
        <sl-button
          @click=${this.#unfollowAccount}
          ?loading=${this.loadingFollow}
          variant="primary"
          outline
        >
          <sl-icon slot="prefix" name="person-dash"></sl-icon>
          Unfollow
        </sl-button>
      `;
    }
    if (this.relationship.requested) {
      return html`
        <sl-button
          @click=${this.#unfollowAccount}
          ?loading=${this.loadingFollow}
          variant="primary"
          outline
        >
          Unrequest
        </sl-button>
      `;
    }
    if (this.account?.locked) {
      return html`
        <sl-button
          @click=${this.#followAccount}
          ?loading=${this.loadingFollow}
          variant="primary"
        >
          Request
        </sl-button>
      `;
    }
    return html`
      <sl-button
        @click=${this.#followAccount}
        ?loading=${this.loadingFollow}
        variant="primary"
      >
        <sl-icon slot="prefix" name="person-plus"></sl-icon>
        Follow
      </sl-button>
    `;
  }

  override render() {
    if (!this.account) return nothing;
    if (this.headerOnly) {
      return html` <sl-card>${this.#renderHeader()}</sl-card> `;
    }
    return html`
      <sl-card>
        ${this.#renderHeader(true)}
        <div>
          ${unsafeHTML(renderEmoji(this.account.note, this.account.emojis))}
        </div>
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
    `;
  }
}
