import * as React from 'react';
export type NoInfer<T> = [T][T extends any ? 0 : never];
export type IsAny<TValue, TYesResult, TNoResult = TValue> = 1 extends 0 & TValue ? TYesResult : TNoResult;
export type PickAsRequired<TValue, TKey extends keyof TValue> = Omit<TValue, TKey> & Required<Pick<TValue, TKey>>;
export type PickRequired<T> = {
    [K in keyof T as undefined extends T[K] ? never : K]: T[K];
};
export type WithoutEmpty<T> = T extends any ? ({} extends T ? never : T) : never;
export type Expand<T> = T extends object ? T extends infer O ? O extends Function ? O : {
    [K in keyof O]: O[K];
} : never : T;
export type UnionToIntersection<T> = (T extends any ? (k: T) => void : never) extends (k: infer I) => any ? I : never;
export type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;
export type MakeDifferenceOptional<TLeft, TRight> = Omit<TRight, keyof TLeft> & {
    [K in keyof TLeft & keyof TRight]?: TRight[K];
};
export type IsUnion<T, U extends T = T> = (T extends any ? (U extends T ? false : true) : never) extends false ? false : true;
export type Assign<TLeft, TRight> = keyof TLeft extends never ? TRight : keyof TRight extends never ? TLeft : Omit<TLeft, keyof TRight> & TRight;
export type Timeout = ReturnType<typeof setTimeout>;
export type Updater<TPrevious, TResult = TPrevious> = TResult | ((prev?: TPrevious) => TResult);
export type NonNullableUpdater<TPrevious, TResult = TPrevious> = TResult | ((prev: TPrevious) => TResult);
type LastInUnion<T> = UnionToIntersection<T extends unknown ? (x: T) => 0 : never> extends (x: infer L) => 0 ? L : never;
export type UnionToTuple<T, TLast = LastInUnion<T>> = [T] extends [never] ? [] : [...UnionToTuple<Exclude<T, TLast>>, TLast];
export declare function last<T>(arr: Array<T>): T | undefined;
export declare function functionalUpdate<TResult>(updater: Updater<TResult> | NonNullableUpdater<TResult>, previous: TResult): TResult;
export declare function pick<TValue, TKey extends keyof TValue>(parent: TValue, keys: Array<TKey>): Pick<TValue, TKey>;
/**
 * This function returns `prev` if `_next` is deeply equal.
 * If not, it will replace any deeply equal children of `b` with those of `a`.
 * This can be used for structural sharing between immutable JSON values for example.
 * Do not use this with signals
 */
export declare function replaceEqualDeep<T>(prev: any, _next: T): T;
export declare function isPlainObject(o: any): boolean;
export declare function isPlainArray(value: unknown): boolean;
export declare function deepEqual(a: any, b: any, partial?: boolean): boolean;
export declare function useStableCallback<T extends (...args: Array<any>) => any>(fn: T): T;
export declare function shallow<T>(objA: T, objB: T): boolean;
export type StringLiteral<T> = T extends string ? string extends T ? string : T : never;
export type StrictOrFrom<TFrom, TReturnIntersection extends boolean = false> = {
    from: StringLiteral<TFrom> | TFrom;
    strict?: true;
} | {
    from?: never;
    strict: false;
    experimental_returnIntersection?: TReturnIntersection;
};
export declare const useLayoutEffect: typeof React.useLayoutEffect;
/**
 *
 * @deprecated use `jsesc` instead
 */
export declare function escapeJSON(jsonString: string): string;
export declare function removeTrailingSlash(value: string): string;
export declare function exactPathTest(pathName1: string, pathName2: string): boolean;
export type ControlledPromise<T> = Promise<T> & {
    resolve: (value: T) => void;
    reject: (value: any) => void;
    status: 'pending' | 'resolved' | 'rejected';
};
export declare function createControlledPromise<T>(onResolve?: () => void): ControlledPromise<T>;
/**
 * Removes all segments from a given path that start with an underscore ('_').
 *
 * @param {string} routePath - The path from which to remove segments. Defaults to '/'.
 * @returns {string} The path with all underscore-prefixed segments removed.
 * @example
 * removeLayoutSegments('/workspace/_auth/foo') // '/workspace/foo'
 */
export declare function removeLayoutSegments(routePath: string): string;
export {};
