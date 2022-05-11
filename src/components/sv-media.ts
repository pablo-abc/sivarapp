import type { Attachment } from '@types';
import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';

@customElement('sv-media')
export class SvMedia extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    * {
      box-sizing: border-box;
    }

    #media button {
      margin: 0 auto;
      min-width: 90%;
      cursor: pointer;
      padding: 0;
      background: transparent;
      border: none;
    }

    #media button:last-child {
      min-width: 100%;
    }

    #media button:not(:last-child) {
      margin-right: 1rem;
    }

    #media img {
      max-width: 100%;
      object-fit: cover;
      height: 20rem;
    }

    #media {
      display: flex;
      overflow-x: auto;
    }
  `;

  @property({ type: Array })
  media: Attachment[] = [];

  #renderAttachment(att: Attachment) {
    if (att.type === 'image') {
      return html`
        <button>
          <img src=${att.preview_url} alt=${att.description || ''} />
        </button>
      `;
    }
    return nothing;
  }

  override render() {
    return html`
      <div id="media">
        ${this.media.map((att) => {
          return this.#renderAttachment(att);
        })}
      </div>
    `;
  }
}
