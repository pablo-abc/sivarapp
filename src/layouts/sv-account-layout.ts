import type { RootState } from '@store/store';
import type { Account, Relationship } from '@types';
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { RouterLocation } from '@vaadin/router';
import { getAccount, getAccountRelationship } from '@api/account';
import { connect } from '@store/connect';
import storage from '@utils/storage';

import '@shoelace-style/shoelace/dist/components/divider/divider.js';
import '@components/sv-title';
import '@components/sv-toot-skeleton';
import '@components/sv-account';

@customElement('sv-account-layout')
export class SvAccountLayout extends connect(LitElement) {
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

  @property({ type: Object })
  relationship?: Relationship;

  @state()
  accountLoading = false;

  @state()
  notFound = false;

  @property({ attribute: false })
  location!: RouterLocation;

  @state()
  currentAccount?: Account;

  get owned() {
    return this.currentAccount && this.currentAccount.id === this.account?.id;
  }

  stateChanged(state: RootState) {
    const currentInstance = storage.currentInstance;
    if (!currentInstance) return;
    this.currentAccount = state.account.accounts[currentInstance];
  }

  async fetchAccount() {
    try {
      this.accountLoading = true;
      this.account = await getAccount(this.location.params.id as string);
      this.relationship = (await getAccountRelationship(this.account.id))?.[0];
    } catch {
      this.notFound = true;
    } finally {
      this.accountLoading = false;
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.fetchAccount();
  }

  renderCard() {
    if (this.notFound) return html`<h1>Not found</h1>`;
    if (this.accountLoading || !this.account)
      return html`<sv-toot-skeleton></sv-toot-skeleton>`;
    return html`
      <sv-account
        .account=${this.account}
        .relationship=${this.relationship}
        ?owned=${this.owned}
      ></sv-account>
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
