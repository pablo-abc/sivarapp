import { LitElement, PropertyValues } from 'lit';
export declare const tagName = "sv-title";
export declare class SvTitle extends LitElement {
    heading: string;
    instance: string;
    connectedCallback(): void;
    updated(changed: PropertyValues<this>): void;
    render(): import("lit").TemplateResult<1>;
}
