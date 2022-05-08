import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import '@components/sv-signin-instance';
import '@components/sv-title';

@customElement('sv-index-page')
export class SvindexPage extends LitElement {
  override render() {
    return html`
      <sv-title></sv-title>
      <sv-signin-instance></sv-signin-instance>
    `;
  }
}
