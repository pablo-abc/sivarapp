import { LitElement } from 'lit';
import '@felte/element/felte-form';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
export declare const tagName = "sv-signin-instance";
export declare class SvSigninInstance extends LitElement {
    #private;
    static styles: import("lit").CSSResult;
    instance: string;
    get instanceName(): string;
    signin(): Promise<void>;
    handleInput(event: Event): void;
    handleSignin(event: Event): Promise<void>;
    connectedCallback(): void;
    disconnectedCallback(): void;
    render(): import("lit").TemplateResult<1>;
}
