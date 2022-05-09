import type { Status } from '@types';
import { LitElement, nothing } from 'lit';
import '@shoelace-style/shoelace/dist/components/avatar/avatar.js';
import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';
import '@github/time-elements/dist/relative-time-element.js';
export declare const tagName = "sv-toot";
export declare class SvToot extends LitElement {
    static styles: import("lit").CSSResult[];
    status?: Status;
    renderContent(): import("lit").TemplateResult<1> | typeof nothing;
    renderAvatar(): import("lit").TemplateResult<1> | typeof nothing;
    renderHeader(): import("lit").TemplateResult<1> | typeof nothing;
    render(): import("lit").TemplateResult<1>;
}
