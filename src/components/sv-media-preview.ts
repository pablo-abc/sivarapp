import type { SlDialog } from '@shoelace-style/shoelace';
import type { Attachment } from '@types';
import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';

import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';

@customElement('sv-media-preview')
export class SvMediaPreview extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    * {
      box-sizing: border-box;
    }

    button {
      cursor: pointer;
      padding: 0;
      background: transparent;
      border: none;
      width: 100%;
    }

    button img {
      width: 100%;
      object-fit: cover;
      height: 20rem;
    }

    sl-dialog::part(panel) {
      height: auto;
      width: auto;
    }

    sl-dialog::part(body) {
      padding: 0;
      overflow: visible;
    }

    sl-dialog img {
      max-height: 90vh;
      max-width: 90vw;
      object-fit: cover;
    }
  `;

  @property({ type: Object })
  attachment?: Attachment;

  @property({ type: Boolean })
  sensitive = false;

  @state()
  opened = false;

  @query('sl-dialog')
  dialog!: SlDialog;

  openPreview() {
    this.opened = true;
    this.dialog.show();
  }

  closePreview() {
    this.opened = false;
    this.dialog.hide();
  }

  override render() {
    if (!this.attachment || this.attachment.type === 'unknown') return nothing;
    const att = this.attachment;
    if (att.type === 'image') {
      return html`
        <button @click=${this.openPreview}>
          <img src=${att.preview_url} alt=${att.description || ''} />
        </button>
        <sl-dialog no-header>
          <img src=${this.opened ? att.url : ''} alt=${att.description || ''} />
        </sl-dialog>
      `;
    }
    return nothing;
  }
}
