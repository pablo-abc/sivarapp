import type { Status } from '@types';
import type { FelteSuccessEvent } from '@felte/element';
import type { SlSwitch, SlSelect, SlDialog } from '@shoelace-style/shoelace';
import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { createId } from '@utils/id';
import { toast } from '@utils/toast';

import '@felte/element/felte-form';
import '@felte/element/felte-field';
import '@shoelace-style/shoelace/dist/components/textarea/textarea.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/details/details.js';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';
import '@shoelace-style/shoelace/dist/components/switch/switch.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
import { createStatus } from '@api/status';

type FormValues = {
  spoilerText?: string;
  content: string;
  visibility: string;
  sensitive: boolean;
  idempKey: string;
};

@customElement('sv-toot-compose')
export class SvTootCompose extends LitElement {
  static styles = css`
    sl-input {
      margin-bottom: 1rem;
    }

    sl-details {
      margin-top: 1rem;
    }

    [slot='summary'] sl-icon {
      margin-left: 0.5rem;
    }

    #options-group > *:not(:last-child) {
      display: block;
      margin-bottom: 2rem;
    }
  `;

  @property({ reflect: true, type: Boolean })
  sensitive = false;

  @property({ reflect: true, type: Boolean })
  submitting = false;

  @property()
  visibility = 'public';

  @property()
  idempKey = createId();

  @query('felte-form')
  form!: HTMLFelteFormElement;

  @query('sl-dialog')
  dialog!: SlDialog;

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
      <sl-tooltip content="Visibility">
        <sl-icon name=${this.visibilityIcon}></sl-icon>
      </sl-tooltip>
    `;
  }

  async #handleSubmit({
    spoilerText,
    content,
    visibility,
    idempKey,
    sensitive,
  }: FormValues) {
    return createStatus({
      spoilerText,
      status: content,
      visibility,
      idempotencyKey: idempKey,
      sensitive,
    });
  }

  resetForm() {
    this.form.reset();
    this.idempKey = createId();
  }

  submitForm() {
    if (this.submitting) return;
    this.form.submit();
  }

  handleSuccess(event: Event) {
    const newStatus = (event as FelteSuccessEvent).detail.response as Status;
    toast(
      html`
        <strong>Toot sent!</strong><br />
        <span>Your toot was successfully sent</span><br />
        <sl-button href=${`/statuses/${newStatus.id}`} size="small">
          Go to toot
        </sl-button>
      `,
      {
        variant: 'success',
        icon: 'send-check',
      }
    );
    this.closeDialog();
    this.idempKey = createId();
  }

  handleError(event: Event) {
    event.preventDefault();
    toast(
      html`
        <strong>Toot failed!</strong><br />
        There was an error while sending your toot
      `,
      {
        variant: 'danger',
        icon: 'send-x',
      }
    );
  }

  openDialog() {
    this.dialog.show();
  }

  closeDialog() {
    this.dialog.hide();
    this.resetForm();
  }

  handleRequestClose(event: Event) {
    const detail = (event as CustomEvent<{ source: string }>).detail;
    if (detail.source === 'overlay' || detail.source === 'keyboard') {
      event.preventDefault();
    }
  }

  #updateSubmitting() {
    console.log(this.form.isSubmitting);
    this.submitting = this.form.isSubmitting;
  }

  #renderDialogContent() {
    return html`
      <felte-form
        @issubmittingchange=${this.#updateSubmitting}
        @feltesuccess=${this.handleSuccess}
        @felteerror=${this.handleError}
        .configuration=${{
          onSubmit: this.#handleSubmit as any,
          transform(values: any) {
            values.sensitive = values.sensitive === 'true';
            return values;
          },
        }}
      >
        <form>
          <input type="hidden" name="idempKey" value=${this.idempKey} />
          <div>
            ${when(
              this.sensitive,
              () => html`
                <felte-field
                  name="spoilerText"
                  inputevent="sl-input"
                  .value=${''}
                >
                  <sl-input label="Content warning:"></sl-input>
                </felte-field>
              `
            )}
            <felte-field
              name="content"
              inputevent="sl-input"
              valueprop="value"
              .value=${''}
            >
              <sl-textarea
                resize="auto"
                label="What's on your mind?"
              ></sl-textarea>
            </felte-field>
            <sl-details>
              <span slot="summary">
                <span>Options:</span>
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
                <felte-field
                  name="visibility"
                  inputevent="sl-change"
                  .value=${this.visibility}
                >
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
                </felte-field>
                <felte-field
                  name="sensitive"
                  valueprop="checked"
                  inputevent="sl-change"
                  touchonchange
                >
                  <sl-switch @sl-change=${this.toggleSensitivity}>
                    Sensitive
                  </sl-switch>
                </felte-field>
              </div>
            </sl-details>
          </div>
        </form>
      </felte-form>
    `;
  }

  override render() {
    return html`
      <sl-button part="button" @click=${this.openDialog} variant="primary">
        <sl-icon slot="prefix" name="pencil"></sl-icon>
        Write
      </sl-button>
      <sl-dialog
        @sl-request-close=${this.handleRequestClose}
        label="Compose a toot"
      >
        ${this.#renderDialogContent()}
        <div slot="footer">
          <sl-button @click=${this.closeDialog}>Close</sl-button>
          <sl-button
            @click=${this.submitForm}
            variant="primary"
            ?loading=${this.submitting}
          >
            <sl-icon slot="prefix" name="send"></sl-icon>
            Toot!
          </sl-button>
        </div>
      </sl-dialog>
    `;
  }
}
