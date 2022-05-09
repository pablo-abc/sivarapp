import { Status } from '@types';
export declare function getTimeline(type?: 'public' | 'home' | 'local', params?: Record<string, any>): Promise<Status[]>;
