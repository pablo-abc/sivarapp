import { getInstance } from '@api/instance';
import { LitElement, html, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export const tagName = 'sv-title';

@customElement(tagName)
export class SvTitle extends LitElement {
  @property()
  heading = '';

  @property()
  instance = localStorage.getItem('currentInstance') || 'sivar.cafe';

  connectedCallback() {
    super.connectedCallback();
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      this.heading = 'Sivares';
      return;
    }
    getInstance().then((instance) => {
      this.heading = instance.title;
    });
  }

  updated(changed: PropertyValues<this>) {
    if (changed.has('heading')) {
      document.title = this.heading;
    }
  }

  override render() {
    return html`<h1>${this.heading}</h1>`;
  }
}
