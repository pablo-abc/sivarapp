import type { SlDialog, SlMenuItem } from '@shoelace-style/shoelace';
import { LitElement, html, css } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import type { Account } from '@types';
import link from '@styles/link';
import { Router } from '@vaadin/router';
import { StoreController } from '@store/controller';

import '@shoelace-style/shoelace/dist/components/avatar/avatar.js';
import '@shoelace-style/shoelace/dist/components/badge/badge.js';
import '@shoelace-style/shoelace/dist/components/divider/divider.js';
import '@shoelace-style/shoelace/dist/components/skeleton/skeleton.js';
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@components/sv-account-switch';
import { fetchMe } from '@store/account';
import { unauthenticate } from '@store/auth';
import storage from '@utils/storage';

@customElement('sv-account-mini')
export class SvAccountMini extends LitElement {
  static styles = [
    link,
    css`
      sv-toot-skeleton {
        width: 20rem;
      }

      sl-avatar {
        margin-right: 0.5rem;
        --size: 2rem;
      }

      .info {
        display: flex;
        flex-direction: column;
      }

      #header {
        display: flex;
        align-items: center;
      }

      #skeleton {
        display: flex;
        align-items: center;
        min-width: 8rem;
        padding: 0.5rem 0;
      }

      #skeleton sl-skeleton:first-child {
        display: block;
        height: 2rem;
        min-width: 2rem;
        border-radius: 50%;
        margin-right: 1rem;
      }

      #skeleton sl-skeleton:last-child {
        height: 1rem;
        width: 100%;
      }
    `,
  ];

  #store = new StoreController(this, {
    account(state) {
      const currentInstance = storage.currentInstance;
      if (!currentInstance) return;
      return state.account.accounts[currentInstance];
    },
    loading(state) {
      const currentInstance = storage.currentInstance;
      if (!currentInstance) return;
      return (
        !state.account.accounts[currentInstance] &&
        state.account.state === 'loading'
      );
    },
    unreadNotifications(state) {
      return state.notification.unreadCount;
    },
  });

  @state()
  loading = false;

  @state()
  account?: Account;

  @query('#switch-account-dialog')
  switchAccountDialog!: SlDialog;

  @state()
  unreadNotifications = 0;

  connectedCallback(): void {
    super.connectedCallback();
    this.#store.dispatch(fetchMe());
  }

  #renderSkeleton() {
    return html`
      <span id="skeleton">
        <sl-skeleton></sl-skeleton>
        <sl-skeleton></sl-skeleton>
      </span>
    `;
  }

  #handleSignout() {
    this.#store.dispatch(unauthenticate());
  }

  #handleSelect(event: Event) {
    if (!this.account) return;
    const { item } = (event as CustomEvent<{ item: SlMenuItem }>).detail;

    switch (item.value) {
      case 'open-profile':
        Router.go(`/accounts/${this.account.id}`);
        break;
      case 'sign-out':
        this.#handleSignout();
        break;
      case 'open-notifications':
        Router.go('/notifications');
        break;
      case 'open-direct':
        Router.go('/conversations');
        break;
      case 'change-account':
        this.switchAccountDialog.show();
        break;
    }
  }

  override render() {
    return html`
      <sl-dropdown ?disabled=${this.loading}>
        <sl-button slot="trigger" size="large" outline caret>
          ${when(
            this.loading || !this.account,
            () => this.#renderSkeleton(),
            () => html`
              <sl-avatar slot="prefix" image=${this.account!.avatar_static}>
              </sl-avatar>
              <span id="header">
                <span class="info">
                  <span class="header__account">
                    <span class="header__name"> ${this.account!.acct} </span>
                  </span>
                </span>
              </span>
              ${when(
                this.unreadNotifications,
                () =>
                  html`<sl-badge variant="danger" pill pulse>
                    ${this.unreadNotifications}
                  </sl-badge>`
              )}
            `
          )}
        </sl-button>
        <sl-menu @sl-select=${this.#handleSelect}>
          <sl-menu-item value="open-profile">
            <sl-icon slot="prefix" name="person"></sl-icon>
            Open profile
          </sl-menu-item>
          <sl-menu-item value="open-direct">
            <sl-icon name="envelope" slot="prefix"></sl-icon>
            Direct messages
          </sl-menu-item>
          <sl-menu-item value="open-notifications">
            Notifications
            <sl-badge
              slot="suffix"
              variant=${this.unreadNotifications ? 'danger' : 'neutral'}
              pill
            >
              ${this.unreadNotifications}
            </sl-badge>
          </sl-menu-item>
          <sl-divider></sl-divider>
          <sl-menu-item value="change-account">
            <sl-icon name="shuffle" slot="prefix"></sl-icon>
            Change account
          </sl-menu-item>
          <sl-divider></sl-divider>
          <sl-menu-item value="sign-out">
            <sl-icon name="box-arrow-left" slot="prefix"></sl-icon>
            Sign out
          </sl-menu-item>
        </sl-menu>
      </sl-dropdown>
      <sl-dialog label="Switch account" id="switch-account-dialog">
        <sv-account-switch></sv-account-switch>
      </sl-dialog>
    `;
  }
}
