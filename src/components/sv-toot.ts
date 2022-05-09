import type { Status } from '@types';
import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import '@shoelace-style/shoelace/dist/components/avatar/avatar.js';
import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@github/time-elements/dist/relative-time-element.js';

export const tagName = 'sv-toot';

function getContent(status: Status, type: 'spoiler' | 'content' = 'content') {
  const content = type === 'spoiler' ? status.spoiler_text : status.content;
  const emojis = status.emojis;
  return emojis.reduce((acc, emoji) => {
    return acc.replace(
      `:${emoji.shortcode}:`,
      `<img class="emoji" src="${emoji.url}" alt="">`
    );
  }, content);
}

@customElement(tagName)
export class SvToot extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
      }

      sl-card {
        width: 100%;
      }

      #header {
        display: flex;
        align-items: center;
      }

      a {
        color: var(--sl-color-primary-800, blue);
        text-decoration: none;
      }

      a:visited {
        color: var(--sl-color-primary-800, blue);
      }

      .header__acct {
        font-style: italic;
      }

      .header__reblog {
        opacity: 0.6;
      }

      .info {
        display: flex;
        flex-direction: column;
      }

      .info relative-time {
        opacity: 0.6;
      }

      sl-avatar {
        margin-right: 0.5rem;
      }

      #reblog-avatar {
        position: relative;
        margin-right: 0.5rem;
      }

      #reblog-reblogger {
        --size: 2rem;
        position: absolute;
        right: -0.5rem;
        bottom: -0.5rem;
      }

      .emoji {
        height: 1rem;
        width: 1rem;
      }
    `,
  ];

  @property({ type: Object })
  status?: Status;

  renderContent() {
    if (!this.status) return nothing;
    const status = this.status.reblog || this.status;
    if (status.sensitive) {
      return html`
        <sl-details>
          <span slot="summary">
            ${unsafeHTML(getContent(status, 'spoiler'))}
          </span>
          ${unsafeHTML(getContent(status))}
        </sl-details>
      `;
    } else {
      return html`${unsafeHTML(getContent(status))}`;
    }
  }

  renderAvatar() {
    if (!this.status) return nothing;
    const reblog = this.status.reblog;
    if (reblog) {
      return html`
        <div id="reblog-avatar">
          <sl-avatar
            id="reblog-author"
            image=${reblog.account.avatar}
          ></sl-avatar>
          <sl-avatar
            id="reblog-reblogger"
            image=${this.status.account.avatar}
          ></sl-avatar>
        </div>
      `;
    } else {
      return html`<sl-avatar image=${this.status.account.avatar}></sl-avatar>`;
    }
  }

  renderHeader() {
    if (!this.status) return nothing;
    const reblog = this.status.reblog;
    const status = reblog || this.status;
    return html`
      <div slot="header" id="header">
        ${this.renderAvatar()}
        <div class="info">
          <a href=${status.account.url} rel="noreferrer">
            <div class="header__account">
              <span class="header__name"> ${status.account.display_name} </span>
              <span class="header__acct">(${status.account.acct})</span>
            </div>
          </a>
          ${reblog
            ? html`
                <span class="header__reblog">
                  Reblogged by
                  <a href=${this.status.account.url}>
                    ${this.status.account.display_name}
                  </a>
                </span>
              `
            : nothing}
          <relative-time datetime=${status.created_at}></relative-time>
        </div>
      </div>
    `;
  }

  override render() {
    return html`
      <sl-card>
        ${this.renderHeader()}
        <div id="content">${this.renderContent()}</div>
      </sl-card>
    `;
  }
}
