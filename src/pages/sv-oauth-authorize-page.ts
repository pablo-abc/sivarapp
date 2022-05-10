import type { RouterLocation } from '@vaadin/router';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('sv-oauth-authorize-page')
export class SvOauthAuthorizePage extends LitElement {
  @property({ attribute: false })
  location!: RouterLocation;

  get src() {
    const query = new URLSearchParams(this.location.search);
    return query.get('authorize_url') || '';
  }

  override connectedCallback(): void {
    super.connectedCallback();
    window.location.href = this.src;
  }

  override render() {
    return html`Redirecting...`;
  }
}
