import type { Status } from '@types';
import type { SlMenuItem } from '@shoelace-style/shoelace';
import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { Router } from '@vaadin/router';
import link from '@styles/link';

import '@shoelace-style/shoelace/dist/components/avatar/avatar.js';
import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
import '@github/time-elements/dist/relative-time-element.js';

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

@customElement('sv-toot')
export class SvToot extends LitElement {
  static styles = [
    link,
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
        justify-content: space-between;
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

      #user-section {
        display: flex;
        align-items: center;
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

      sl-icon-button[label='options'] {
        font-size: 1.2rem;
      }

      sl-menu-item::part(base) {
        font-size: 0.8rem;
      }
    `,
  ];

  @property({ type: Object })
  status?: Status;

  async selectOption(event: Event) {
    if (!this.status) return;
    const { item } = (event as CustomEvent<{ item: SlMenuItem }>).detail;

    switch (item.value) {
      case 'copy-url': {
        const url = this.status.url || this.status.reblog?.url;
        if (!url) return;
        await navigator.clipboard.writeText(url);
        break;
      }
      case 'open-tab': {
        const url = this.status.url || this.status.reblog?.url;
        console.log(url);
        if (!url) return;
        window.open(url, '_blank', 'noreferrer');
        break;
      }
      case 'open-toot': {
        const id = this.status.id;
        Router.go(`/statuses/${id}`);
        break;
      }
    }
  }

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
        <div id="user-section">
          ${this.renderAvatar()}
          <div class="info">
            <a href=${`/accounts/${status.account.id}`} rel="noreferrer">
              <div class="header__account">
                <span class="header__name">
                  ${status.account.display_name}
                </span>
                <span class="header__acct">(${status.account.acct})</span>
              </div>
            </a>
            ${reblog
              ? html`
                  <span class="header__reblog">
                    Reblogged by
                    <a href=${`/accounts/${this.status.account.id}`}>
                      ${this.status.account.display_name}
                    </a>
                  </span>
                `
              : nothing}
            <relative-time datetime=${status.created_at}></relative-time>
          </div>
        </div>
        <sl-dropdown>
          <sl-tooltip slot="trigger" content="Options">
            <sl-icon-button
              label="options"
              name="three-dots-vertical"
            ></sl-icon-button>
          </sl-tooltip>
          <sl-menu @sl-select=${this.selectOption}>
            <sl-menu-item value="open-toot">Open status</sl-menu-item>
            <sl-menu-item value="copy-url">Copy link URL</sl-menu-item>
            <sl-menu-item value="open-tab">Open in new tab</sl-menu-item>
          </sl-menu>
        </sl-dropdown>
      </div>
    `;
  }

  override render() {
    return html`
      <sl-card>
        ${this.renderHeader()}
        <div id="content">${this.renderContent()}</div>
        <div slot="footer">
          <sl-tooltip content="See replies">
            <sl-button href=${`/statuses/${this.status?.id}`} pill size="small">
              <sl-icon label="See replies" name="chat-square-text"></sl-icon>
              ${this.status?.replies_count}
            </sl-button>
          </sl-tooltip>
          <sl-tooltip content="Favourite">
            <sl-button pill size="small">
              <sl-icon label="Favourites" name="star"></sl-icon>
              ${this.status?.favourites_count}
            </sl-button>
          </sl-tooltip>
          <sl-tooltip content="Boost">
            <sl-button pill size="small">
              <sl-icon label="Boost" name="arrow-repeat"></sl-icon>
              ${this.status?.reblogs_count}
            </sl-button>
          </sl-tooltip>
        </div>
      </sl-card>
    `;
  }
}
