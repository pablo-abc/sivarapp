import { LitElement } from 'lit';
import { Status } from '@types';
import './sv-toot';
import './sv-toot-skeleton';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/button-group/button-group.js';
export declare const tagName = "sv-timeline";
export declare class SvTimeline extends LitElement {
    static styles: import("lit").CSSResult;
    toots: Status[];
    empty: boolean;
    loading: boolean;
    timeline: 'home' | 'public' | 'local';
    connectedCallback(): void;
    fetchNext(): Promise<void>;
    render(): import("lit").TemplateResult<1>;
}
