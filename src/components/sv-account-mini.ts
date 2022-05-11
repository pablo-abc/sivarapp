import type { SlDialog, SlMenuItem } from '@shoelace-style/shoelace';
import { LitElement, html, css } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import type { Account } from '@types';
import link from '@styles/link';
import { Router } from '@vaadin/router';
import { StoreController } from '@store/controller';

import '@shoelace-style/shoelace/dist/components/avatar/avatar.js';
import '@shoelace-style/shoelace/dist/components/divider/divider.js';
import '@shoelace-style/shoelace/dist/components/skeleton/skeleton.js';
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import { fetchMe } from '@store/account';

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
        min-width: 15rem;
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
      const currentInstance =
        localStorage.getItem('currentInstance') || 'sivar.cafe';
      return state.account.accounts[currentInstance];
    },
    loading(state) {
      const currentInstance =
        localStorage.getItem('currentInstance') || 'sivar.cafe';
      return (
        !state.account.accounts[currentInstance] &&
        state.account.state === 'loading'
      );
    },
  });

  @state()
  loading = false;

  @state()
  account?: Account;

  @query('sl-dialog')
  dialog!: SlDialog;

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

  async #handleSignout() {
    const token = localStorage.getItem('accessToken');
    const currentInstance =
      localStorage.getItem('currentInstance') || 'sivar.cafe';
    const instance = JSON.parse(localStorage.getItem('instances') || '{}')[
      currentInstance
    ];
    if (token) {
    }
    const formData = new FormData();
    formData.append('token', token || '');
    formData.append('client_id', instance.client_id);
    formData.append('client_secret', instance.client_secret);
    try {
      if (token) {
        await fetch(`https://${currentInstance}/oauth/revoke`, {
          method: 'POST',
          body: formData,
        });
      }
    } finally {
      localStorage.removeItem('accessToken');
      setTimeout(() => {
        Router.go('/');
      }, 200);
    }
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
              <sl-avatar
                slot="prefix"
                image=${this.account!.avatar}
              ></sl-avatar>
              <span id="header">
                <span class="info">
                  <span class="header__account">
                    <span class="header__name"> ${this.account!.acct} </span>
                  </span>
                </span>
              </span>
            `
          )}
        </sl-button>
        <sl-menu @sl-select=${this.#handleSelect}>
          <sl-menu-item value="open-profile">Open profile</sl-menu-item>
          <sl-divider></sl-divider>
          <sl-menu-item value="sign-out">Sign out</sl-menu-item>
        </sl-menu>
      </sl-dropdown>
    `;
  }
}
