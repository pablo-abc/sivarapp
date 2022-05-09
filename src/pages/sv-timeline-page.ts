import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { RouterLocation } from '@vaadin/router';

import '@components/sv-timeline';

@customElement('sv-timeline-page')
export class SvTimelinePage extends LitElement {
  static styles = css`
    sv-timeline {
      width: min(97%, 35rem);
      margin: 0 auto;
    }
  `;

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
