import { LitElement } from 'lit';
export declare const tagName = "sv-signout-button";
export declare class SvSignoutButton extends LitElement {
    instance: string;
    handleSignout(): Promise<void>;
    render(): import("lit").TemplateResult<1>;
}
