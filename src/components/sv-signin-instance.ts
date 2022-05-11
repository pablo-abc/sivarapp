import type { SlInput } from '@shoelace-style/shoelace';
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { toast } from '@utils/toast';
import { StoreController } from '@store/controller';
import { authenticate, authorize } from '@store/auth';

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

  handleSignin(event: Event) {
    const code = (event as CustomEvent<string>).detail;
    const { clientId, clientSecret, redirectUri } = this.#store.state.auth;
    if (!clientId || !clientSecret || !redirectUri) return;
    this.#store.dispatch(
      authenticate({
        code,
        clientId,
        clientSecret,
        redirectUri,
      })
    );
  }

  handleAccessDenied(event: Event) {
    const detail = (event as CustomEvent<string>).detail;
    const message =
      detail === 'access_denied'
        ? html`
            <strong>You denied authorization</strong><br />
            <span>
              You need to be signed in to an instance in order to use this
              application.
            </span>
          `
        : html`<strong>An error occurred</strong>`;
    toast(message, {
      variant: 'danger',
      icon: 'x-circle',
    });
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.handleSignin = this.handleSignin.bind(this);
    this.handleAccessDenied = this.handleAccessDenied.bind(this);
    document.addEventListener('sv:logged-in', this.handleSignin);
    document.addEventListener('sv:auth-error', this.handleAccessDenied);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('sv:logged-in', this.handleSignin);
    document.removeEventListener('sv:auth-error', this.handleAccessDenied);
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
