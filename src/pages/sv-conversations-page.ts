import type { Conversation } from '@types';
import { LitElement, html, css, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { getConversations } from '@api/timelines';

import '@components/sv-title';
import '@components/sv-toot';

@customElement('sv-conversations-page')
export class SvConversationsPage extends LitElement {
  static styles = css`
    main {
      width: min(97%, 35rem);
      margin: 0 auto;
    }

    ul {
      padding: 0;
    }

    li {
      list-style: none;
    }
  `;

  @state()
  conversations: Conversation[] = [];

  @state()
  empty = false;

  @state()
  loading = false;

  async fetchConversations() {
    try {
      this.loading = true;
      const maxId = this.conversations[this.conversations.length - 1]?.id;
      const params = maxId ? { max_id: maxId } : undefined;
      const newConversations = await getConversations(params);
      if (!newConversations?.length) {
        this.empty = true;
        return;
      }
      this.conversations = [...this.conversations, ...newConversations];
    } finally {
      this.loading = false;
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.fetchConversations();
  }

  override render() {
    return html`
      <sv-title></sv-title>
      <main>
        <h2>Conversations</h2>
        <ul>
          ${this.conversations.map((conversation) => {
            if (!conversation.last_status) return nothing;
            return html`
              <li>
                <sv-toot .status=${conversation.last_status} aslink></sv-toot>
              </li>
            `;
          })}
        </ul>
      </main>
    `;
  }
}
