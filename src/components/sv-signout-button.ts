import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { StoreController } from '@store/controller';
import { unauthenticate } from '@store/auth';

@customElement('sv-signout-button')
export class SvSignoutButton extends LitElement {
  #store = new StoreController(this);

  handleSignout() {
    this.#store.dispatch(unauthenticate());
  }

  override render() {
    return html`<sl-button @click=${this.handleSignout}>Sign out</sl-button>`;
  }
}
