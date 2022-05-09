import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import '@components/sv-signin-instance';
import '@components/sv-title';
import '@shoelace-style/shoelace/dist/components/card/card.js';

@customElement('sv-index-page')
export class SvindexPage extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    #card {
      width: min(97%, 35rem);
      margin: 0 auto;
      border: var(--sv-card-border, 1px solid rgba(0, 0, 0, 0.2));
      padding: var(--sv-card-padding, 1rem);
      border-radius: var(--sv-card-radius, 10px);
    }
  `;

  override render() {
    return html`
      <sv-title></sv-title>
      <div id="card" aria-labelledby="card-title">
        <h2 slot="header" id="card-title">Sign in to your instance</h2>
        <sv-signin-instance></sv-signin-instance>
      </div>
    `;
  }
}
