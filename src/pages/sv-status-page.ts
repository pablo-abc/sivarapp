import type { Status, StatusContext } from '@types';
import type { RouterLocation } from '@vaadin/router';
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { ref } from 'lit/directives/ref.js';

import '@components/sv-title';
import '@components/sv-toot';
import '@components/sv-toot-skeleton';
import '@shoelace-style/shoelace/dist/components/divider/divider.js';
import { getStatus, getStatusContext } from '@api/status';

@customElement('sv-status-page')
export class SvStatusPage extends LitElement {
  static styles = css`
    main {
      display: flex;
      flex-direction: column;
      margin: 0 auto;
      width: min(97%, 35rem);
    }

    ul {
      padding: 0;
      margin: 0 auto;
      width: 90%;
    }

    li {
      list-style: none;
    }

    li:not(:last-child) {
      margin-bottom: 1rem;
    }
  `;

  @state()
  statusLoading = false;

  @state()
  status?: Status;

  @state()
  context: StatusContext = {
    ancestors: [],
    descendants: [],
  };

  @property({ attribute: false })
  location!: RouterLocation;

  async fetchStatus() {
    const id = this.location.params.id as string;
    if (!id) return;
    this.status = await getStatus(id);
  }

  async fetchStatusContext() {
    const id = this.location.params.id as string;
    if (!id) return;
    this.context = await getStatusContext(id);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.fetchStatus();
    this.fetchStatusContext();
  }

  override render() {
    return html`
      <sv-title></sv-title>
      <main>
        ${when(
          this.context.ancestors.length > 0,
          () => html`
            <ul>
              ${this.context.ancestors.map((toot) => {
                return html`<li><sv-toot .status=${toot}></sv-toot></li>`;
              })}
            </ul>
            <sl-divider></sl-divider>
          `
        )}
        ${when(
          this.status,
          () =>
            html`<sv-toot
              ${ref((el) => el && setTimeout(() => el.scrollIntoView()))}
              .status=${this.status}
            ></sv-toot>`,
          () => html`<sv-toot-skeleton></sv-toot-skeleton>`
        )}
        <sl-divider></sl-divider>
        <ul>
          ${this.context.descendants.map((toot) => {
            return html`<li><sv-toot .status=${toot}></sv-toot></li>`;
          })}
        </ul>
      </main>
    `;
  }
}
