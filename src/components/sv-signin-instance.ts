import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { authorize } from '@store/auth';
import { store } from '@store/store';

import '@felte/element/felte-form';
import '@felte/element/felte-field';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/spinner/spinner.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';

@customElement('sv-signin-instance')
export class SvSigninInstance extends LitElement {
  static styles = css`
    sl-input {
      margin-bottom: 1rem;
    }

    .error {
      color: var(--sl-color-danger-600);
    }

    .success {
      color: var(--sl-color-success-600);
    }
  `;

  @query('felte-form')
  felteForm!: HTMLFelteFormElement;

  @property({ type: Boolean, reflect: true })
  validating = false;

  @property({ type: Boolean, reflect: true })
  touched = false;

  @property({ type: Boolean, reflect: true })
  invalid = true;

  @property({ type: Boolean, reflect: true })
  submitting = false;

  #getInstanceName(instance: string) {
    return instance
      ? instance
          .replace(/^https?:\/\//, '')
          .replace(/\/+$/, '')
          .toLowerCase()
      : '';
  }

  async signin(values: { instance: string }) {
    store.dispatch(authorize(values.instance));
  }

  #updateValidating() {
    this.validating = this.felteForm.isValidating;
  }

  #updateTouched() {
    this.touched = this.felteForm.touched.instance;
  }

  #updateInvalid() {
    this.invalid = !this.felteForm.isValid;
  }

  #updateSubmitting() {
    this.submitting = this.felteForm.isSubmitting;
  }

  override firstUpdated(): void {
    this.felteForm.configuration = {
      initialValues: {
        instance: '',
      },
      onSubmit: this.signin,
      transform: (values: any) => {
        return {
          instance: this.#getInstanceName(values.instance),
        };
      },
      debounced: {
        timeout: 1000,
        validate: async (values: any) => {
          if (!values.instance) {
            return {
              instance: 'Must not be empty',
            };
          }
          try {
            const response = await fetch(
              `https://${values.instance}/api/v1/instance`
            );
            if (!response.ok) {
              return {
                instance: 'This is not a valid instance',
              };
            }
            const instance = await response.json();
            if (!instance.uri || instance.uri !== values.instance) {
              return {
                instance: 'This is not a valid instance',
              };
            }
            return {};
          } catch {
            return {
              instance: 'This is not a valid instance',
            };
          }
        },
      },
    };
  }

  #renderSpinner() {
    if (this.validating) return html`<sl-spinner></sl-spinner>`;
    if (!this.touched) return nothing;
    if (this.invalid)
      return html`<sl-icon class="error" name="x-lg"></sl-icon>`;
    return html`<sl-icon class="success" name="check-lg"></sl-icon>`;
  }

  override render() {
    return html`
      <felte-form
        @isvalidatingchange=${this.#updateValidating}
        @touchedchange=${this.#updateTouched}
        @isvalidchange=${this.#updateInvalid}
        @issubmittingchange=${this.#updateSubmitting}
      >
        <form>
          <felte-field name="instance" inputevent="sl-input" .value=${''}>
            <sl-input
              label="Instance:"
              placeholder="mastodon.social"
              type="url"
            >
              <span slot="suffix">${this.#renderSpinner()}</span>
            </sl-input>
          </felte-field>
          <sl-button
            @click=${(event: Event) => {
              const target = event.currentTarget as HTMLButtonElement;
              target.closest('form')?.requestSubmit();
            }}
            variant="primary"
            ?loading=${this.submitting}
          >
            Sign in
          </sl-button>
        </form>
      </felte-form>
    `;
  }
}
