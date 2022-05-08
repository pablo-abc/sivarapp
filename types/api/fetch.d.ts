export declare type FetchOptions = RequestInit & {
    json?: Record<string, any> | Array<any>;
    authenticated?: boolean;
};
export declare function fetchJSON(url: string, options?: FetchOptions): Promise<any>;
