import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

export const tagName = 'sv-oauth-callback-page';

@customElement(tagName)
export class SvOauthCallback extends LitElement {
  connectedCallback(): void {
    super.connectedCallback();
    const query = new URLSearchParams(location.search);
    window.opener.document.dispatchEvent(
      new CustomEvent('sv:logged-in', { detail: query.get('code') })
    );
    window.close();
  }
  override render() {
    return html`Redirecting`;
  }
}
