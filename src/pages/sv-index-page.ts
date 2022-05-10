import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import '@components/sv-signin-instance';
import '@components/sv-title';
import '@shoelace-style/shoelace/dist/components/card/card.js';

@customElement('sv-index-page')
export class SvindexPage extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
      }

      #card {
        width: min(97%, 35rem);
        margin: 0 auto;
        display: block;
      }
    `,
  ];

  override render() {
    return html`
      <sv-title></sv-title>
      <sl-card id="card">
        <h2 id="header">Sign in to your instance</h2>
        <div id="content">
          <sv-signin-instance></sv-signin-instance>
        </div>
      </sl-card>
    `;
  }
}
