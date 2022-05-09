import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/skeleton/skeleton.js';

@customElement('sv-toot-skeleton')
export class SvTootSkeleton extends LitElement {
  static styles = css`
    :host {
      width: 100%;
      display: block;
    }

    sl-card {
      width: 100%;
    }

    #header {
      display: flex;
      align-items: center;
    }

    #header sl-skeleton:first-child {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      margin-right: 0.5rem;
    }

    #header sl-skeleton:last-child {
      width: 50%;
      height: 1rem;
    }

    #content {
      display: flex;
      flex-direction: column;
    }

    #content sl-skeleton:not(:last-child) {
      margin-bottom: 0.5rem;
    }
  `;

  override render() {
    return html`
      <sl-card>
        <div slot="header" id="header">
          <sl-skeleton effect="pulse"></sl-skeleton>
          <sl-skeleton effect="pulse"></sl-skeleton>
        </div>
        <div id="content">
          <sl-skeleton effect="pulse"></sl-skeleton>
          <sl-skeleton effect="pulse"></sl-skeleton>
          <sl-skeleton effect="pulse"></sl-skeleton>
        </div>
      </sl-card>
    `;
  }
}
