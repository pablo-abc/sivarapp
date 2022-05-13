import type { Account } from '@types';
import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { when } from 'lit/directives/when.js';
import { renderEmoji } from '@utils/emoji';
import link from '@styles/link';
import emoji from '@styles/emoji';
import { ifDefined } from 'lit/directives/if-defined.js';

import '@shoelace-style/shoelace/dist/components/avatar/avatar.js';
import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/badge/badge.js';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';

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

  #renderHeader(slotted = false) {
    if (!this.account) return nothing;
    return html`
      <div id="header" slot=${ifDefined(slotted ? 'header' : undefined)}>
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
