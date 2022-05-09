import type { SlSwitch, SlSelect } from '@shoelace-style/shoelace';
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import '@shoelace-style/shoelace/dist/components/textarea/textarea.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/details/details.js';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';
import '@shoelace-style/shoelace/dist/components/switch/switch.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';

@customElement('sv-toot-compose')
export class SvTootCompose extends LitElement {
  static styles = css`
    sl-input {
      margin-bottom: 1rem;
    }

    sl-details {
      margin-top: 1rem;
    }

    #options-group > *:not(:last-child) {
      margin-bottom: 2rem;
    }
  `;

  @property({ reflect: true, type: Boolean })
  sensitive = false;

  @property()
  visibility = 'public';

  get visibilityIcon() {
    switch (this.visibility) {
      case 'unlisted':
        return 'unlock';
      case 'private':
        return 'lock';
      case 'direct':
        return 'envelope';
      default:
        return 'globe2';
    }
  }

  toggleSensitivity(event: Event) {
    const target = event.target as SlSwitch;
    this.sensitive = target.checked;
  }

  changeVisibility(event: Event) {
    const target = event.target as SlSelect;
    this.visibility = target.value as string;
  }

  renderVisibility() {
    return html`
      <sl-tooltip content="visibility">
        <sl-icon name=${this.visibilityIcon}></sl-icon>
      </sl-tooltip>
    `;
  }

  override render() {
    return html`
      <div>
        ${when(
          this.sensitive,
          () => html`<sl-input label="Content warning:"></sl-input>`
        )}
        <sl-textarea resize="auto" label="What's on your mind?"></sl-textarea>
        <sl-details>
          <span slot="summary">
            ${this.renderVisibility()}
            <sl-tooltip content="Sensitivity">
              <sl-icon
                name=${this.sensitive
                  ? 'exclamation-triangle-fill'
                  : 'exclamation-triangle'}
              ></sl-icon>
            </sl-tooltip>
          </span>
          <div id="options-group">
            <sl-select
              @sl-change=${this.changeVisibility}
              value=${this.visibility}
              label="Visibility:"
              hoist
            >
              <sl-menu-item value="public">
                <sl-icon name="globe2" slot="prefix"></sl-icon>
                Public
              </sl-menu-item>
              <sl-menu-item value="unlisted">
                <sl-icon name="unlock" slot="prefix"></sl-icon>
                Unlisted
              </sl-menu-item>
              <sl-menu-item value="private">
                <sl-icon name="lock" slot="prefix"></sl-icon>
                Followers only
              </sl-menu-item>
              <sl-menu-item value="direct">
                <sl-icon name="envelope" slot="prefix"></sl-icon>
                Direct
              </sl-menu-item>
            </sl-select>
            <sl-switch @sl-change=${this.toggleSensitivity}>
              Sensitive
            </sl-switch>
          </div>
        </sl-details>
      </div>
    `;
  }
}
