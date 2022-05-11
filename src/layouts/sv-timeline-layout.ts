import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import '@components/sv-title';

@customElement('sv-timeline-layout')
export class SvTimelineLayout extends LitElement {
  static styles = css`
    main {
      width: min(97%, 35rem);
    }

    #container {
      display: flex;
      justify-content: center;
    }
  `;

  override render() {
    return html`
      <sv-title></sv-title>
      <div id="container">
        <main>
          <slot></slot>
        </main>
      </div>
    `;
  }
}
