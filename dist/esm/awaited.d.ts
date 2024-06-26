import * as React from 'react';
import type { DeferredPromise } from './defer.js';
export type AwaitOptions<T> = {
    promise: DeferredPromise<T>;
};
export declare function useAwaited<T>({ promise }: AwaitOptions<T>): [T];
export declare function Await<T>(props: AwaitOptions<T> & {
    fallback?: React.ReactNode;
    children: (result: T) => React.ReactNode;
}): React.JSX.Element;
