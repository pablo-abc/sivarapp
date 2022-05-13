import { html } from 'lit';

import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';

export function truncate(text: string, maxLength = 15) {
  if (text.length > 15) {
    return html`
      <sl-tooltip content=${text}>
        <span class="ellipsis">${text.slice(0, maxLength)}</span
        ><span class="invisible">${text.slice(maxLength)}</span>
      </sl-tooltip>
    `;
  }
  return html`${text}`;
}
