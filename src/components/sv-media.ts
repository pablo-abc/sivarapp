import type { Attachment } from '@types';
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '@components/sv-media-preview';
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

    #media sv-media-preview {
      margin: 0 auto;
      min-width: 90%;
    }

    #media sv-media-preview:last-child {
      min-width: 100%;
    }

    #media sv-media-preview:not(:last-child) {
      margin-right: 1rem;
    }

    #media {
      display: flex;
      overflow-x: auto;
      align-items: center;
    }
  `;

  @property({ type: Array })
  media: Attachment[] = [];

  override render() {
    return html`
      <div id="media">
        ${this.media.map((att) => {
          return html`<sv-media-preview .attachment=${att}></sv-media-preview>`;
        })}
      </div>
    `;
  }
}
