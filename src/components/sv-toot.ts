import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import '@shoelace-style/shoelace/dist/components/avatar/avatar.js';
import '@github/time-elements/dist/relative-time-element.js';

export const tagName = 'sv-toot';

@customElement(tagName)
export class SvToot extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    #header {
      display: flex;
      align-items: center;
      border-bottom: var(--sv-card-border, 1px solid rgba(0, 0, 0, 0.2));
      padding: var(--sv-card-padding, 1rem);
    }

    #content {
      padding: var(--sv-card-padding, 1rem);
    }

    #card {
      border: var(--sv-card-border, 1px solid rgba(0, 0, 0, 0.2));
      border-radius: var(--sv-card-radius, 10px);
    }

    a {
      color: var(--sv-color-link, blue);
      text-decoration: none;
    }

    a:visited {
      color: var(--sv-color-link, blue);
    }

    .header__acct {
      font-style: italic;
    }

    .info {
      display: flex;
      flex-direction: column;
    }

    .info relative-time {
      opacity: 0.6;
    }

    sl-avatar {
      --size: 2rem;
      margin-right: 0.5rem;
    }
  `;

  @property()
  avatar = '';

  @property()
  displayName = '';

  @property()
  accountUrl = '';

  @property()
  acct = '';

  @property({ type: Boolean })
  sensitive = false;

  @property()
  spoilerText = '';

  @property()
  content = '';

  @property()
  createdAt = '';

  renderContent() {
    if (this.sensitive) {
      return html`
        <sl-details summary=${this.spoilerText}>
          ${unsafeHTML(this.content)}
        </sl-details>
      `;
    } else {
      return html`${unsafeHTML(this.content)}`;
    }
  }

  override render() {
    return html`
      <div id="card">
        <div id="header">
          <sl-avatar image=${this.avatar}></sl-avatar>
          <div class="info">
            <a href=${this.accountUrl} rel="noreferrer">
              <div class="header__account">
                <span class="header__name"> ${this.displayName} </span>
                <span class="header__acct">(${this.acct})</span>
              </div>
            </a>
            <relative-time datetime=${this.createdAt}></relative-time>
          </div>
        </div>
        <div id="content">${this.renderContent()}</div>
      </div>
    `;
  }
}
