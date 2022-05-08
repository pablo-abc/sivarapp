import { LitElement, html } from 'lit';
import { Router } from '@vaadin/router';
import { customElement, property } from 'lit/decorators.js';

export const tagName = 'sv-signout-button';

@customElement(tagName)
export class SvSignoutButton extends LitElement {
  @property()
  instance = localStorage.getItem('currentInstance') || 'sivar.cafe';

  async handleSignout() {
    const token = localStorage.getItem('accessToken');
    const instance = JSON.parse(localStorage.getItem('instances') || '{}')[
      this.instance
    ];
    if (token) {
    }
    const formData = new FormData();
    formData.append('token', token || '');
    formData.append('client_id', instance.client_id);
    formData.append('client_secret', instance.client_secret);
    try {
      if (token) {
        await fetch(`https://${this.instance}/oauth/revoke`, {
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

  override render() {
    return html`<sl-button @click=${this.handleSignout}>Sign out</sl-button>`;
  }
}
