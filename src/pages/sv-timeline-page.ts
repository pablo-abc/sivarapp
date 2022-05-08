import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import '@components/sv-timeline';
import '@components/sv-title';
import '@components/sv-signout-button';

@customElement('sv-timeline-page')
export class SvTimelinePage extends LitElement {
  override render() {
    return html`
      <sv-title></sv-title>
      <sv-signout-button></sv-signout-button>
      <sv-timeline></sv-timeline>
    `;
  }
}
