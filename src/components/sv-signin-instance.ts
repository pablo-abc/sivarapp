import type { SlInput } from '@shoelace-style/shoelace';
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StoreController } from '@store/controller';
import { authorize } from '@store/auth';

import '@felte/element/felte-form';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';

@customElement('sv-signin-instance')
export class SvSigninInstance extends LitElement {
  static styles = css`
    sl-input {
      margin-bottom: 1rem;
    }
  `;

  @property()
  instance = 'sivar.cafe';

  #store = new StoreController(this);

  get instanceName() {
    return this.instance
      ? this.instance
          .replace(/^https?:\/\//, '')
          .replace(/\/+$/, '')
          .toLowerCase()
      : 'sivar.cafe';
  }

  async signin() {
    this.#store.dispatch(authorize(this.instanceName));
  }

  handleInput(event: Event) {
    const target = event.target as SlInput;
    this.instance = target.value;
  }

  override render() {
    return html`
      <felte-form @feltesubmit=${this.signin}>
        <form>
          <sl-input
            label="Instance:"
            help-text="Leave it empty to log in to 'sivar.cafe'"
            placeholder="mastodon.social"
            name="instance"
            @sl-input=${this.handleInput}
          ></sl-input>
          <sl-button
            @click=${(event: Event) => {
              const target = event.currentTarget as HTMLButtonElement;
              target.closest('form')?.requestSubmit();
            }}
            variant="primary"
          >
            Sign in
          </sl-button>
        </form>
      </felte-form>
    `;
  }
}
