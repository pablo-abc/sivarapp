import type { SlDialog } from '@shoelace-style/shoelace';
import type { Attachment } from '@types';
import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';

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

    video {
      width: 100%;
    }

    #video-container {
      width: 100%;
      position: relative;
    }

    [name='play-circle'] {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      height: 100%;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      transition: background-color 0.1s;
      cursor: pointer;
      color: white;
    }

    [name='pause-circle'] {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      height: 100%;
      width: 100%;
      cursor: pointer;
      opacity: 0;
      background-color: rgba(0, 0, 0, 0.3);
      transition: opacity 0.1s;
      color: white;
    }

    [name='play-circle']::part(base),
    [name='pause-circle']::part(base) {
      height: 5rem;
      width: 5rem;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    [name='play-circle']:hover {
      background-color: rgba(0, 0, 0, 0.3);
    }

    [name='pause-circle']:hover {
      opacity: 1;
    }
  `;

  @property({ type: Object })
  attachment?: Attachment;

  @property({ type: Boolean })
  sensitive = false;

  @state()
  opened = false;

  @state()
  playing = false;

  @query('sl-dialog')
  dialog!: SlDialog;

  @query('video')
  video?: HTMLVideoElement;

  openPreview() {
    this.opened = true;
    this.dialog.show();
  }

  closePreview() {
    this.opened = false;
    this.dialog.hide();
  }

  playVideo() {
    if (!this.video) return;
    this.video.play();
    this.playing = true;
  }

  pauseVideo() {
    if (!this.video) return;
    this.video.pause();
    this.playing = false;
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
    if (att.type === 'gifv') {
      return html`
        <div id="video-container">
          <video muted loop>
            <source src=${att.url} type="video/mp4" />
          </video>
          ${when(
            !this.playing,
            () => html`
              <sl-icon
                @click=${this.playVideo}
                name="play-circle"
                label="play"
              ></sl-icon>
            `,
            () => html`
              <sl-icon
                @click=${this.pauseVideo}
                name="pause-circle"
                label="pause"
              ></sl-icon>
            `
          )}
        </div>
      `;
    }
    return nothing;
  }
}
