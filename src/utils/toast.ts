import { html, render, TemplateResult } from 'lit';

import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';

export type ToastOptions = {
  icon?: string;
  variant?: 'primary' | 'neutral' | 'success' | 'warning' | 'danger';
  duration?: number;
};

export function toast(
  message: string | TemplateResult,
  {
    icon = 'info-circle',
    variant = 'primary',
    duration = 3000,
  }: ToastOptions = {}
) {
  const alert = Object.assign(document.createElement('sl-alert'), {
    variant,
    closable: true,
    duration: duration,
  });

  const contents = html`
    <sl-icon name=${icon} slot="icon"></sl-icon>
    ${message}
  `;

  render(contents, alert);

  document.body.append(alert);
  return alert.toast();
}
