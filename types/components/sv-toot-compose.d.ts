import { LitElement } from 'lit';
import '@shoelace-style/shoelace/dist/components/textarea/textarea.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/details/details.js';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';
import '@shoelace-style/shoelace/dist/components/switch/switch.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
export declare class SvTootCompose extends LitElement {
    static styles: import("lit").CSSResult;
    sensitive: boolean;
    visibility: string;
    get visibilityIcon(): "unlock" | "lock" | "envelope" | "globe2";
    toggleSensitivity(event: Event): void;
    changeVisibility(event: Event): void;
    renderVisibility(): import("lit").TemplateResult<1>;
    render(): import("lit").TemplateResult<1>;
}
