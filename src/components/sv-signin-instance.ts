import type { SlInput } from '@shoelace-style/shoelace';
import { Router } from '@vaadin/router';
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '@felte/element/felte-form';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import { toast } from '@utils/toast';

export const tagName = 'sv-signin-instance';

@customElement(tagName)
export class SvSigninInstance extends LitElement {
  static styles = css`
    sl-input {
      margin-bottom: 1rem;
    }
  `;

  @property()
  instance = 'sivar.cafe';

  #clientId!: string;

  #clientSecret!: string;

  #redirectUri!: string;

  get instanceName() {
    return this.instance
      ? this.instance
          .replace(/^https?:\/\//, '')
          .replace(/\/+$/, '')
          .toLowerCase()
      : 'sivar.cafe';
  }

  async signin() {
    const instanceName = this.instanceName;
    const registeredInstances = JSON.parse(
      localStorage.getItem('instances') || '{}'
    );
    let instanceData = registeredInstances[instanceName];
    if (!instanceData) {
      const response = await fetch(`https://${instanceName}/api/v1/apps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_name: 'Sivares',
          redirect_uris: 'http://localhost:3000/oauth/callback',
          scopes: 'read write follow push',
          website: 'http://localhost:3000',
        }),
      });
      if (!response.ok) {
        alert('Failed to create app');
        return;
      }
      instanceData = await response.json();
      localStorage.setItem(
        'instances',
        JSON.stringify({
          ...registeredInstances,
          [instanceName]: instanceData,
        })
      );
    }
    this.#clientId = instanceData.client_id;
    this.#clientSecret = instanceData.client_secret;
    this.#redirectUri = instanceData.redirect_uri;
    localStorage.setItem('currentInstance', instanceName);
    const redirectUri = encodeURIComponent(`${location.origin}/oauth/callback`);
    window.open(
      `${location.origin}/oauth/authorize?authorize_url=${encodeURIComponent(
        `https://${instanceName}/oauth/authorize?client_id=${instanceData.client_id}&scope=read+write+follow&redirect_uri=${redirectUri}&response_type=code
`
      )}`,
      '_blank',
      'popup=1,width=500,height=700'
    );
  }

  handleInput(event: Event) {
    const target = event.target as SlInput;
    this.instance = target.value;
  }

  async handleSignin(event: Event) {
    const code = (event as CustomEvent<string>).detail;
    const formData = new FormData();
    formData.append('client_id', this.#clientId);
    formData.append('client_secret', this.#clientSecret);
    formData.append('redirect_uri', this.#redirectUri);
    formData.append('scope', 'read write follow push');
    formData.append('code', code);
    formData.append('grant_type', 'authorization_code');
    const response = await fetch(`https://${this.instanceName}/oauth/token`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      toast('Failed to sign in', {
        variant: 'danger',
        icon: 'x-circle',
      });
      return;
    }
    const json = await response.json();
    localStorage.setItem('accessToken', json.access_token);
    setTimeout(() => {
      Router.go('/timeline');
    }, 200);
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
