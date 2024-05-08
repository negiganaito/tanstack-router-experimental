import type { BlockerFn } from '@tanstack/history';
import type { ReactNode } from './route.cjs';
export declare function useBlocker(blockerFn: BlockerFn, condition?: boolean | any): void;
export declare function Block({ blocker, condition, children }: PromptProps): any;
export type PromptProps = {
    blocker: BlockerFn;
    condition?: boolean | any;
    children?: ReactNode;
};
