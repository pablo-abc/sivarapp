import { LitElement } from 'lit';
import './sv-toot';
export declare const tagName = "sv-timeline";
export declare class SvTimeline extends LitElement {
    static styles: import("lit").CSSResult;
    toots: any[];
    empty: boolean;
    loading: boolean;
    connectedCallback(): void;
    fetchNext(): Promise<void>;
    render(): import("lit").TemplateResult<1>;
}
