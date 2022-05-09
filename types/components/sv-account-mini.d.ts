import type { SlDialog } from '@shoelace-style/shoelace';
import { LitElement } from 'lit';
import type { Account } from '@types';
import '@shoelace-style/shoelace/dist/components/avatar/avatar.js';
import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@components/sv-toot-compose';
import '@components/sv-signout-button';
import '@components/sv-toot-skeleton';
export declare class SvAccountMini extends LitElement {
    static styles: import("lit").CSSResult[];
    loading: boolean;
    account?: Account;
    dialog: SlDialog;
    fetchUser(): Promise<void>;
    connectedCallback(): void;
    openDialog(): void;
    handleRequestClose(event: Event): void;
    render(): import("lit").TemplateResult<1>;
}
