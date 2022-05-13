import type { Account } from '@types';
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { RouterLocation } from '@vaadin/router';
import { getAccount } from '@api/account';

import '@shoelace-style/shoelace/dist/components/divider/divider.js';
import '@components/sv-title';
import '@components/sv-toot-skeleton';
import '@components/sv-account';

@customElement('sv-account-layout')
export class SvAccountLayout extends LitElement {
  static styles = [
    css`
      main {
        width: min(97%, 35rem);
        margin: 0 auto;
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
      <sv-account .account=${this.account}></sv-account>
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
