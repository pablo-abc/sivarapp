import { LitElement } from 'lit';
import '@shoelace-style/shoelace/dist/components/avatar/avatar.js';
import '@github/time-elements/dist/relative-time-element.js';
export declare const tagName = "sv-toot";
export declare class SvToot extends LitElement {
    static styles: import("lit").CSSResult;
    avatar: string;
    displayName: string;
    accountUrl: string;
    acct: string;
    sensitive: boolean;
    spoilerText: string;
    content: string;
    createdAt: string;
    renderContent(): import("lit").TemplateResult<1>;
    render(): import("lit").TemplateResult<1>;
}
