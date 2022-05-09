import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import '@components/sv-title';
import '@components/sv-account-mini';
import { Router } from '@vaadin/router';

@customElement('sv-timeline-layout')
export class SvTimelinePage extends LitElement {
  static styles = css`
    main {
      width: min(97%, 35rem);
    }

    #container {
      display: flex;
      justify-content: center;
    }

    sv-account-mini {
      margin-right: 1rem;
      margin-top: 4.5rem;
    }
  `;

  override connectedCallback(): void {
    super.connectedCallback();
    if (!localStorage.getItem('accessToken')) Router.go('/');
  }

  override render() {
    return html`
      <sv-title></sv-title>
      <div id="container">
        <sv-account-mini></sv-account-mini>
        <main>
          <slot></slot>
        </main>
      </div>
    `;
  }
}
