import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { RouterLocation } from '@vaadin/router';

import '@components/sv-timeline';

@customElement('sv-timeline-page')
export class SvTimelinePage extends LitElement {
  @property({ attribute: false })
  location!: RouterLocation;

  override render() {
    return html`
      <sv-timeline
        .timeline=${(this.location.params.type as any) || 'home'}
      ></sv-timeline>
    `;
  }
}
