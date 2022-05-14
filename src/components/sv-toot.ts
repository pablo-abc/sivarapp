import type { Status } from '@types';
import type { SlMenuItem, SlDialog } from '@shoelace-style/shoelace';
import { LitElement, html, css, nothing, type PropertyValues } from 'lit';
import {
  customElement,
  property,
  state,
  query,
  queryAll,
} from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { Router } from '@vaadin/router';
import link from '@styles/link';
import emoji from '@styles/emoji';
import {
  boostStatus,
  favouriteStatus,
  unboostStatus,
  unfavouriteStatus,
  deleteStatus,
} from '@api/status';
import { toast } from '@utils/toast';
import { renderEmoji } from '@utils/emoji';
import { truncate } from '@utils/truncate';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';

import '@shoelace-style/shoelace/dist/components/avatar/avatar.js';
import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/divider/divider.js';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
import '@github/time-elements/dist/relative-time-element.js';
import '@components/sv-toot-compose';
import '@components/sv-media';

function getContent(status: Status, type: 'spoiler' | 'content' = 'content') {
  const content = type === 'spoiler' ? status.spoiler_text : status.content;
  const emojis = status.emojis;
  return renderEmoji(content, emojis);
}

@customElement('sv-toot')
export class SvToot extends LitElement {
  static styles = [
    link,
    emoji,
    css`
      :host {
        display: block;
      }

      :host([aslink]) > a {
        color: inherit;
        display: block;
      }

      :host([aslink]) > a:hover > sl-card::part(base) {
        background-color: var(--sl-color-neutral-100);
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
        font-size: 0.75rem;
        opacity: 0.6;
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

      .pinned-indicator {
        display: flex;
        align-items: center;
        opacity: 0.6;
        font-size: 0.75rem;
        margin-bottom: 0.5rem;
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

      sl-icon-button[label='options'] {
        font-size: 1.2rem;
      }

      sl-menu-item::part(base) {
        font-size: 0.8rem;
      }

      #toot-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      [slot='preview'] {
        margin-bottom: 2rem;
      }
    `,
  ];

  @property({ type: Object })
  status?: Status;

  @property({ type: Boolean })
  contentOnly = false;

  @property({ type: Boolean, reflect: true })
  asLink = false;

  get #status() {
    return this.status?.reblog || this.status;
  }

  @property({ type: Boolean, reflect: true })
  favourited = false;

  @property({ type: Boolean })
  pinned = false;

  @state()
  syncingFavourited = false;

  @property({ type: Boolean, reflect: true })
  reblogged = false;

  @property({ type: Boolean })
  owned = false;

  @state()
  syncingReblogged = false;

  @state()
  deleting = false;

  @query('#delete-dialog')
  deleteDialog!: SlDialog;

  @state()
  deleted = false;

  @queryAll('.u-url.mention')
  mentions!: HTMLAnchorElement[];

  get concatMentions() {
    if (!this.#status) return '';
    const status = this.#status;
    return Array.from(
      new Set([
        `@${status.account.acct}`,
        ...status.mentions.map((mention) => {
          return `@${mention.acct}`;
        }),
      ])
    ).join(' ');
  }

  get inReplyToId() {
    return this.#status?.id || '';
  }

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
        if (!url) return;
        window.open(url, '_blank', 'noreferrer');
        break;
      }
      case 'open-toot': {
        const id = this.status.id;
        Router.go(`/statuses/${id}`);
        break;
      }
      case 'delete-toot': {
        this.deleteDialog.show();
        break;
      }
    }
  }

  #handleRequestClose(event: Event) {
    const detail = (event as CustomEvent<{ source: string }>).detail;
    if (detail.source === 'overlay' || detail.source === 'keyboard') {
      event.preventDefault();
    }
  }

  async deleteToot() {
    if (this.deleting || !this.#status) return;
    const status = this.#status;
    try {
      this.deleting = true;
      await deleteStatus(status.id);
      toast('Deleted!', {
        variant: 'success',
        icon: 'check-circle',
      });
      this.deleted = true;
      this.deleteDialog.hide();
    } catch {
      toast('There was an error while attempting to delete this toot', {
        variant: 'danger',
        icon: 'x-circle',
      });
    } finally {
      this.deleting = false;
    }
  }

  override updated(changed: PropertyValues<this>) {
    if (changed.has('status') && this.#status) {
      const status = this.#status;
      this.mentions.forEach((mention) => {
        const foundMention = status.mentions.find(
          (m) => mention.href === m.url
        );
        if (!foundMention) return;
        mention.removeAttribute('rel');
        mention.removeAttribute('target');
        mention.href = `/accounts/${foundMention.id}`;
      });
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.favourited = this.status?.favourited || false;
    this.reblogged = this.status?.reblogged || false;
  }

  async toggleFavourite() {
    if (this.syncingFavourited || !this.status) return;
    try {
      this.syncingFavourited = true;
      this.status = this.favourited
        ? await unfavouriteStatus(this.status.id)
        : await favouriteStatus(this.status.id);
      this.favourited = this.status.favourited || false;
      this.reblogged = this.status.reblogged || false;
    } finally {
      this.syncingFavourited = false;
    }
  }

  async toggleReblogged() {
    if (this.syncingReblogged || !this.status) return;
    try {
      this.syncingReblogged = true;
      this.status = this.reblogged
        ? await unboostStatus(this.status.id)
        : await boostStatus(this.status.id);
      this.reblogged = this.status.reblogged || false;
      this.favourited = this.status.favourited || false;
    } finally {
      this.syncingReblogged = false;
    }
  }

  renderContent() {
    if (!this.#status) return nothing;
    const status = this.#status;
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
            image=${reblog.account.avatar_static}
          ></sl-avatar>
          <sl-avatar
            id="reblog-reblogger"
            image=${this.status.account.avatar_static}
          ></sl-avatar>
        </div>
      `;
    } else {
      return html`<sl-avatar
        image=${this.status.account.avatar_static}
      ></sl-avatar>`;
    }
  }

  renderOwnedOptions() {
    if (!this.owned) return nothing;
    return html`
      <sl-divider></sl-divider>
      <sl-menu-item value="delete-toot">
        <sl-icon slot="prefix" name="trash"></sl-icon>
        Delete
      </sl-menu-item>
    `;
  }

  renderOptionsMenu() {
    if (this.asLink) return nothing;
    return html`
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
          ${this.renderOwnedOptions()}
        </sl-menu>
      </sl-dropdown>
    `;
  }

  renderMedia() {
    const media = this.#status?.media_attachments;
    if (!media?.length) return nothing;
    return html`<sv-media .media=${media}></sv-media>`;
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
            ${when(
              this.pinned,
              () => html`
                <span class="pinned-indicator">
                  <sl-icon name="pin-fill"></sl-icon>
                  Pinned
                </span>
              `
            )}
            <a href=${`/accounts/${status.account.id}`} rel="noreferrer">
              <div class="header__account">
                <span class="header__name">
                  ${status.account.display_name
                    ? unsafeHTML(
                        renderEmoji(
                          status.account.display_name,
                          status.account.emojis
                        )
                      )
                    : status.account.username}
                </span>
                <span class="header__acct">
                  ${truncate(status.account.acct)}
                </span>
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
        ${this.renderOptionsMenu()}
      </div>
    `;
  }

  override render() {
    if (this.deleted || !this.status) return nothing;
    if (this.asLink) {
      return html`
        <a href=${`/statuses/${this.status.id}`}>
          <sl-card>
            ${this.renderHeader()}
            <div id="content">${this.renderContent()}</div>
          </sl-card>
        </a>
      `;
    }
    if (this.contentOnly) {
      return html`
        <sl-card>
          <div id="content">${this.renderContent()}</div>
        </sl-card>
      `;
    }
    return html`
      <sl-card>
        ${this.renderHeader()}
        <div id="content">${this.renderContent()}</div>
        ${this.renderMedia()}
        <div id="toot-footer" slot="footer">
          <div>
            <sl-tooltip content="See replies">
              <sl-button
                href=${`/statuses/${this.status?.id}`}
                pill
                size="small"
              >
                <sl-icon label="See replies" name="chat-square-text"></sl-icon>
                ${this.status?.replies_count}
              </sl-button>
            </sl-tooltip>
            <sl-tooltip
              content="Boost"
              ?disabled=${this.status?.visibility === 'direct'}
            >
              <sl-button
                pill
                size="small"
                variant=${this.reblogged ? 'warning' : 'default'}
                @click=${this.toggleReblogged}
                aria-disabled=${this.syncingReblogged}
                ?loading=${this.syncingReblogged}
                ?disabled=${this.status?.visibility === 'direct'}
              >
                <sl-icon label="Boost" name="arrow-repeat"></sl-icon>
                ${this.status?.reblogs_count}
              </sl-button>
            </sl-tooltip>
            <sl-tooltip content="Favourite">
              <sl-button
                pill
                size="small"
                variant=${this.favourited ? 'warning' : 'default'}
                @click=${this.toggleFavourite}
                aria-disabled=${this.syncingFavourited}
                ?loading=${this.syncingFavourited}
              >
                <sl-icon
                  label="Favourites"
                  name=${this.favourited ? 'star-fill' : 'star'}
                ></sl-icon>
                ${this.status?.favourites_count}
              </sl-button>
            </sl-tooltip>
          </div>
          <sv-toot-compose
            status=${this.concatMentions}
            inreplytoid=${this.inReplyToId}
            visibility=${ifDefined(this.#status?.visibility)}
            label="Replying to: ${ifDefined(
              this.#status?.account.display_name || this.#status?.account.acct
            )}"
          >
            Reply
            <sl-card slot="preview">${this.renderContent()}</sl-card>
          </sv-toot-compose>
        </div>
        <sl-dialog
          id="delete-dialog"
          @sl-request-close=${this.#handleRequestClose}
          no-header
        >
          <p><strong>Are you sure you want to delete this toot?</strong></p>
          <p>
            This action is <strong><em>not</em></strong> reversible
          </p>
          <div slot="footer">
            <sl-button @click=${() => this.deleteDialog.hide()}>Keep</sl-button>
            <sl-button
              @click=${this.deleteToot}
              variant="danger"
              ?loading=${this.deleting}
            >
              <sl-icon slot="prefix" name="trash"></sl-icon>
              Delete
            </sl-button>
          </div>
        </sl-dialog>
      </sl-card>
    `;
  }
}
