import type { SlDialog } from '@shoelace-style/shoelace';
import { LitElement, html, css } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';
import type { RegisteredAccount } from '@utils/storage';
import storage from '@utils/storage';
import { StoreController } from '@store/controller';
import { switchInstance } from '@store/auth';

import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/visually-hidden/visually-hidden.js';
import '@components/sv-signin-instance';

@customElement('sv-account-switch')
export class SvAccountSwitch extends LitElement {
  static styles = css`
    ul {
      padding: 0;
      display: flex;
      flex-direction: column;
    }

    li {
      list-style: none;
    }

    li:not(:last-child) {
      margin-bottom: 1rem;
    }

    sl-button {
      width: 100%;
    }
  `;

  @state()
  accounts: (RegisteredAccount & { instanceName: string })[] = [];

  @state()
  loadingInstance?: string;

  @state()
  showForm = false;

  @query('sl-dialog')
  dialog!: SlDialog;

  #store = new StoreController(this);

  override connectedCallback(): void {
    super.connectedCallback();
    const accounts = storage.accounts;
    const instances = Object.keys(accounts);
    this.accounts = instances.map((instanceName) => ({
      ...accounts[instanceName],
      instanceName,
    }));
  }

  #switchAccount(instance: string) {
    this.loadingInstance = instance;
    this.#store.dispatch(switchInstance(instance));
    setTimeout(() => {
      location.href = '/timeline';
    }, 500);
  }

  #toggleForm() {
    this.showForm = !this.showForm;
  }

  show() {
    this.dialog.show();
  }

  hide() {
    this.dialog.hide();
  }

  #handleClose() {
    setTimeout(() => {
      this.showForm = false;
    }, 500);
  }

  #renderContent() {
    if (this.showForm) return html`<sv-signin-instance></sv-signin-instance>`;
    return html`
      <ul>
        ${this.accounts.map((account) => {
          return html`
            <li>
              <sl-button
                outline
                @click=${() => this.#switchAccount(account.instanceName)}
                ?disabled=${storage.currentInstance === account.instanceName}
                ?loading=${this.loadingInstance === account.instanceName}
              >
                <sl-visually-hidden>Switch to:</sl-visually-hidden>
                ${account.username}@${account.instanceName}
              </sl-button>
            </li>
          `;
        })}
        <li>
          <sl-button @click=${this.#toggleForm}>
            <sl-icon slot="prefix" name="plus-circle"></sl-icon>
            Add account
          </sl-button>
        </li>
      </ul>
    `;
  }

  override render() {
    return html`
      <sl-dialog
        @sl-request-close=${this.#handleClose}
        label="Switch account"
        id="switch-account-dialog"
      >
        ${this.#renderContent()}
      </sl-dialog>
    `;
  }
}
