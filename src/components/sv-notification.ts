import type { Notification } from '@types';
import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import link from '@styles/link';

import '@components/sv-toot';

@customElement('sv-notification')
export class SvNotification extends LitElement {
  static styles = [
    link,
    css`
      :host {
        display: block;
      }

      sl-card {
        width: 100%;
      }

      strong {
        margin: 0.5rem 0;
        display: block;
      }
    `,
  ];

  @property({ type: Object })
  notification?: Notification;

  #renderContent() {
    if (!this.notification) return nothing;
    const acct = html`
      <a href=${`/accounts/${this.notification.account.id}`}>
        @${this.notification.account.acct}
      </a>
    `;
    const notification = this.notification;
    const tootLink = (text: string = 'toot') => html`
      <a href=${`/statuses/${notification.status?.id}`}>${text}</a>
    `;
    switch (this.notification.type) {
      case 'follow': {
        return html`<strong>${acct} has followed you</strong>`;
      }
      case 'follow_request': {
        return html`<strong>${acct} has requested to follow you</strong>`;
      }
      case 'favourite': {
        return html`
          <strong>${acct} has favourited your ${tootLink()}</strong>
          <sv-toot contentonly .status=${this.notification.status}></sv-toot>
        `;
      }
      case 'mention': {
        if (this.notification.status.visibility === 'direct') {
          return html`
            <strong>${acct} sent you a ${tootLink('message')}</strong>
            <sv-toot contentonly .status=${this.notification.status}></sv-toot>
          `;
        }
        return html`
          <strong>${acct} has ${tootLink('mentioned you')}</strong>
          <sv-toot contentonly .status=${this.notification.status}></sv-toot>
        `;
      }
      case 'reblog': {
        return html`
          <strong>${acct} has reblogged your ${tootLink()}</strong>
          <sv-toot contentonly .status=${this.notification.status}></sv-toot>
        `;
      }
      case 'status': {
        return html`
          <strong>${acct} has posted a new ${tootLink()}</strong>
          <sv-toot contentonly .status=${this.notification.status}></sv-toot>
        `;
      }
      case 'poll': {
        return html`
          <strong>A ${tootLink('poll you participated in')} has ended</strong>
          <sv-toot contentonly .status=${this.notification.status}></sv-toot>
        `;
      }
    }
  }

  override render() {
    if (!this.notification) return nothing;
    return html`${this.#renderContent()}`;
  }
}
