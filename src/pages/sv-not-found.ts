import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('sv-not-found')
export class SvNotFound extends LitElement {
  override render() {
    return html`<h1>Not Found</h1>`;
  }
}
