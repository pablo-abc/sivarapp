import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { StoreController } from '@store/controller';
import { authenticate } from '@store/auth';
import { toast } from '@utils/toast';
import { Router } from '@vaadin/router';

@customElement('sv-oauth-callback-page')
export class SvOauthCallback extends LitElement {
  #store = new StoreController(this);

  handleSignin(code: string) {
    this.#store.dispatch(authenticate(code));
  }

  handleAccessDenied(detail: string) {
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
    Router.go('/');
  }

  connectedCallback(): void {
    super.connectedCallback();
    const query = new URLSearchParams(location.search);
    const error = query.get('error');
    if (error) {
      this.handleAccessDenied(error);
    } else {
      this.handleSignin(query.get('code')!);
    }
  }
  override render() {
    return html`Redirecting`;
  }
}
