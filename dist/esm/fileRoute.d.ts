/// <reference types="react" />
import type { ParsePathParams } from './link.js';
import type { AnyContext, AnyPathParams, AnyRoute, AnySearchSchema, FileBaseRouteOptions, MergeFromFromParent, ResolveFullPath, ResolveFullSearchSchema, ResolveFullSearchSchemaInput, RootRouteId, Route, RouteConstraints, RouteContext, RouteLoaderFn, SearchSchemaInput, TrimPathLeft, UpdatableRouteOptions } from './route.js';
import type { Assign, IsAny } from './utils.js';
import type { MakeRouteMatch } from './Matches.js';
import type { NoInfer } from '@tanstack/react-store';
import type { RegisteredRouter } from './router.js';
import type { RouteById, RouteIds } from './routeInfo.js';
export interface FileRoutesByPath {
}
type Replace<TValue extends string, TFrom extends string, TTo extends string, TAcc extends string = ''> = TValue extends `${infer Start}${TFrom}${infer Rest}` ? Replace<Rest, TFrom, TTo, `${TAcc}${Start}${TTo}`> : `${TAcc}${TValue}`;
export type TrimLeft<TValue extends string, TStartsWith extends string> = TValue extends `${TStartsWith}${infer U}` ? U : TValue;
export type TrimRight<TValue extends string, TEndsWith extends string> = TValue extends `${infer U}${TEndsWith}` ? U : TValue;
export type Trim<TValue extends string, TFind extends string> = TrimLeft<TrimRight<TValue, TFind>, TFind>;
export type RemoveUnderScores<T extends string> = Replace<Replace<TrimRight<TrimLeft<T, '/_'>, '_'>, '_/', '/'>, '/_', '/'>;
type RemoveRouteGroups<T extends string> = T extends `${infer Before}(${string})${infer After}` ? RemoveRouteGroups<`${Before}${After}`> : T;
type NormalizeSlashes<T extends string> = T extends `${infer Before}//${infer After}` ? NormalizeSlashes<`${Before}/${After}`> : T;
export type ResolveFilePath<TParentRoute extends AnyRoute, TFilePath extends string> = TParentRoute['id'] extends RootRouteId ? TrimPathLeft<TFilePath> : TFilePath extends `${TParentRoute['types']['customId']}${infer TRest}` ? TRest : TFilePath;
export type FileRoutePath<TParentRoute extends AnyRoute, TFilePath extends string, TResolvedFilePath = ResolveFilePath<TParentRoute, TFilePath>> = TResolvedFilePath extends `_${string}` ? '' : TResolvedFilePath extends `/_${string}` ? '' : TResolvedFilePath;
export declare function createFileRoute<TFilePath extends keyof FileRoutesByPath, TParentRoute extends AnyRoute = FileRoutesByPath[TFilePath]['parentRoute'], TId extends RouteConstraints['TId'] = NormalizeSlashes<RemoveRouteGroups<TFilePath>>, TPath extends RouteConstraints['TPath'] = FileRoutePath<TParentRoute, TFilePath>, TFullPath extends RouteConstraints['TFullPath'] = ResolveFullPath<TParentRoute, NormalizeSlashes<RemoveRouteGroups<RemoveUnderScores<TPath>>>>>(path: TFilePath): <TSearchSchemaInput extends AnySearchSchema = {}, TSearchSchema extends AnySearchSchema = {}, TSearchSchemaUsed = TSearchSchemaInput extends SearchSchemaInput ? Omit<TSearchSchemaInput, "__TSearchSchemaInput__"> : TSearchSchema, TFullSearchSchemaInput = Assign<TParentRoute["id"] extends "__root__" ? Omit<TParentRoute["types"]["searchSchemaInput"], "__TRootSearchSchema__"> : TParentRoute["types"]["fullSearchSchemaInput"], TSearchSchemaUsed>, TFullSearchSchema = Assign<TParentRoute["id"] extends "__root__" ? Omit<TParentRoute["types"]["searchSchema"], "__TRootSearchSchema__"> : TParentRoute["types"]["fullSearchSchema"], TSearchSchema>, TParams = Record<TrimLeft<TrimRight<import("./link").Split<TPath, true>[number], "_">, "_"> extends infer T ? T extends TrimLeft<TrimRight<import("./link").Split<TPath, true>[number], "_">, "_"> ? T extends `$${infer L}` ? L extends "" ? "_splat" : L : never : never : never, string>, TAllParams = IsAny<TParentRoute["types"]["allParams"], TParams, TParentRoute["types"]["allParams"] & TParams>, TRouteContextReturn extends RouteContext = RouteContext, TRouteContext = [TRouteContextReturn] extends [never] ? RouteContext : TRouteContextReturn, TAllContext = Assign<IsAny<TParentRoute["types"]["allContext"], {}, TParentRoute["types"]["allContext"]>, TRouteContext>, TRouterContext extends AnyContext = AnyContext, TLoaderDeps extends Record<string, any> = {}, TLoaderDataReturn = unknown, TLoaderData = [TLoaderDataReturn] extends [never] ? undefined : TLoaderDataReturn, TChildren extends unknown = unknown>(options?: (FileBaseRouteOptions<TParentRoute, TPath, TSearchSchemaInput, TSearchSchema, TFullSearchSchema, TParams, TAllParams, TRouteContextReturn, TRouteContext, TRouterContext, TAllContext, TLoaderDeps, TLoaderDataReturn> & {
    caseSensitive?: boolean | undefined;
    wrapInSuspense?: boolean | undefined;
    component?: import("./route").RouteComponent<any> | undefined;
    errorComponent?: false | import("./route").ErrorRouteComponent | null | undefined;
    notFoundComponent?: import("./route").NotFoundRouteComponent | undefined;
    pendingComponent?: import("./route").RouteComponent<any> | undefined;
    pendingMs?: number | undefined;
    pendingMinMs?: number | undefined;
    staleTime?: number | undefined;
    gcTime?: number | undefined;
    preloadStaleTime?: number | undefined;
    preloadGcTime?: number | undefined;
    preSearchFilters?: import("./route").SearchFilter<TFullSearchSchema, TFullSearchSchema>[] | undefined;
    postSearchFilters?: import("./route").SearchFilter<TFullSearchSchema, TFullSearchSchema>[] | undefined;
    onError?: ((err: any) => void) | undefined;
    onEnter?: ((match: import("./Matches").RouteMatch<TId, TAllParams, TFullSearchSchema, TLoaderData, TAllContext, TRouteContext, TLoaderDeps>) => void) | undefined;
    onStay?: ((match: import("./Matches").RouteMatch<TId, TAllParams, TFullSearchSchema, TLoaderData, TAllContext, TRouteContext, TLoaderDeps>) => void) | undefined;
    onLeave?: ((match: import("./Matches").RouteMatch<TId, TAllParams, TFullSearchSchema, TLoaderData, TAllContext, TRouteContext, TLoaderDeps>) => void) | undefined;
    meta?: ((ctx: {
        matches: import("./Matches").RouteMatch<TId, TAllParams, TFullSearchSchema, TLoaderData, TAllContext, TRouteContext, TLoaderDeps>[];
        params: TAllParams;
        loaderData: TLoaderData;
    }) => import("react").DetailedHTMLProps<import("react").MetaHTMLAttributes<HTMLMetaElement>, HTMLMetaElement>[]) | undefined;
    links?: (() => import("react").DetailedHTMLProps<import("react").LinkHTMLAttributes<HTMLLinkElement>, HTMLLinkElement>[]) | undefined;
    scripts?: (() => import("react").DetailedHTMLProps<import("react").ScriptHTMLAttributes<HTMLScriptElement>, HTMLScriptElement>[]) | undefined;
    headers?: ((ctx: {
        loaderData: TLoaderData;
    }) => Record<string, string>) | undefined;
} & {
    staticData?: import("./route").StaticDataRouteOption | undefined;
}) | undefined) => Route<TParentRoute, TPath, TFullPath, TFilePath, TId, TSearchSchemaInput, TSearchSchema, TSearchSchemaUsed, TFullSearchSchemaInput, TFullSearchSchema, TParams, TAllParams, TRouteContextReturn, TRouteContext, TAllContext, TRouterContext, TLoaderDeps, TLoaderDataReturn, TLoaderData, TChildren>;
/**
  @deprecated It's no longer recommended to use the `FileRoute` class directly.
  Instead, use `createFileRoute('/path/to/file')(options)` to create a file route.
*/
export declare class FileRoute<TFilePath extends keyof FileRoutesByPath, TParentRoute extends AnyRoute = FileRoutesByPath[TFilePath]['parentRoute'], TId extends RouteConstraints['TId'] = TFilePath, TPath extends RouteConstraints['TPath'] = FileRoutePath<TParentRoute, TFilePath>, TFullPath extends RouteConstraints['TFullPath'] = ResolveFullPath<TParentRoute, RemoveUnderScores<TPath>>> {
    path: TFilePath;
    silent?: boolean;
    constructor(path: TFilePath, _opts?: {
        silent: boolean;
    });
    createRoute: <TSearchSchemaInput extends AnySearchSchema = {}, TSearchSchema extends AnySearchSchema = {}, TSearchSchemaUsed = TSearchSchemaInput extends SearchSchemaInput ? Omit<TSearchSchemaInput, "__TSearchSchemaInput__"> : TSearchSchema, TFullSearchSchemaInput = ResolveFullSearchSchemaInput<TParentRoute, TSearchSchemaUsed>, TFullSearchSchema = ResolveFullSearchSchema<TParentRoute, TSearchSchema>, TParams = Record<ParsePathParams<TPath>, string>, TAllParams = MergeFromFromParent<TParentRoute["types"]["allParams"], TParams>, TRouteContextReturn extends RouteContext = RouteContext, TRouteContext = [TRouteContextReturn] extends [never] ? RouteContext : TRouteContextReturn, TAllContext = Assign<IsAny<TParentRoute["types"]["allContext"], {}>, TRouteContext>, TRouterContext extends AnyContext = AnyContext, TLoaderDeps extends Record<string, any> = {}, TLoaderDataReturn = unknown, TLoaderData = [TLoaderDataReturn] extends [never] ? undefined : TLoaderDataReturn, TChildren extends unknown = unknown>(options?: (FileBaseRouteOptions<TParentRoute, TPath, TSearchSchemaInput, TSearchSchema, TFullSearchSchema, TParams, TAllParams, TRouteContextReturn, TRouteContext, TRouterContext, TAllContext, TLoaderDeps, TLoaderDataReturn> & {
        caseSensitive?: boolean | undefined;
        wrapInSuspense?: boolean | undefined;
        component?: import("./route").RouteComponent<any> | undefined;
        errorComponent?: false | import("./route").ErrorRouteComponent | null | undefined;
        notFoundComponent?: import("./route").NotFoundRouteComponent | undefined;
        pendingComponent?: import("./route").RouteComponent<any> | undefined;
        pendingMs?: number | undefined;
        pendingMinMs?: number | undefined;
        staleTime?: number | undefined;
        gcTime?: number | undefined;
        preloadStaleTime?: number | undefined;
        preloadGcTime?: number | undefined;
        preSearchFilters?: import("./route").SearchFilter<TFullSearchSchema, TFullSearchSchema>[] | undefined;
        postSearchFilters?: import("./route").SearchFilter<TFullSearchSchema, TFullSearchSchema>[] | undefined;
        onError?: ((err: any) => void) | undefined;
        onEnter?: ((match: import("./Matches").RouteMatch<TId, TAllParams, TFullSearchSchema, TLoaderData, TAllContext, TRouteContext, TLoaderDeps>) => void) | undefined;
        onStay?: ((match: import("./Matches").RouteMatch<TId, TAllParams, TFullSearchSchema, TLoaderData, TAllContext, TRouteContext, TLoaderDeps>) => void) | undefined;
        onLeave?: ((match: import("./Matches").RouteMatch<TId, TAllParams, TFullSearchSchema, TLoaderData, TAllContext, TRouteContext, TLoaderDeps>) => void) | undefined;
        meta?: ((ctx: {
            matches: import("./Matches").RouteMatch<TId, TAllParams, TFullSearchSchema, TLoaderData, TAllContext, TRouteContext, TLoaderDeps>[];
            params: TAllParams;
            loaderData: TLoaderData;
        }) => import("react").DetailedHTMLProps<import("react").MetaHTMLAttributes<HTMLMetaElement>, HTMLMetaElement>[]) | undefined;
        links?: (() => import("react").DetailedHTMLProps<import("react").LinkHTMLAttributes<HTMLLinkElement>, HTMLLinkElement>[]) | undefined;
        scripts?: (() => import("react").DetailedHTMLProps<import("react").ScriptHTMLAttributes<HTMLScriptElement>, HTMLScriptElement>[]) | undefined;
        headers?: ((ctx: {
            loaderData: TLoaderData;
        }) => Record<string, string>) | undefined;
    } & {
        staticData?: import("./route").StaticDataRouteOption | undefined;
    }) | undefined) => Route<TParentRoute, TPath, TFullPath, TFilePath, TId, TSearchSchemaInput, TSearchSchema, TSearchSchemaUsed, TFullSearchSchemaInput, TFullSearchSchema, TParams, TAllParams, TRouteContextReturn, TRouteContext, TAllContext, TRouterContext, TLoaderDeps, TLoaderDataReturn, TLoaderData, TChildren>;
}
/**
  @deprecated It's recommended not to split loaders into separate files.
  Instead, place the loader function in the the main route file, inside the
  `createFileRoute('/path/to/file)(options)` options.
*/
export declare function FileRouteLoader<TFilePath extends keyof FileRoutesByPath, TRoute extends FileRoutesByPath[TFilePath]['preLoaderRoute']>(_path: TFilePath): <TLoaderData>(loaderFn: RouteLoaderFn<TRoute['types']['allParams'], TRoute['types']['loaderDeps'], TRoute['types']['allContext'], TRoute['types']['routeContext'], TLoaderData>) => RouteLoaderFn<TRoute['types']['allParams'], TRoute['types']['loaderDeps'], TRoute['types']['allContext'], TRoute['types']['routeContext'], NoInfer<TLoaderData>>;
export type LazyRouteOptions = Pick<UpdatableRouteOptions<string, AnyPathParams, AnySearchSchema, {}, AnyContext, AnyContext, {}>, 'component' | 'errorComponent' | 'pendingComponent' | 'notFoundComponent'>;
export declare class LazyRoute<TRoute extends AnyRoute> {
    options: {
        id: string;
    } & LazyRouteOptions;
    constructor(opts: {
        id: string;
    } & LazyRouteOptions);
    useMatch: <TRouteMatch = MakeRouteMatch<any, TRoute["types"]["id"]>, TSelected = TRouteMatch>(opts?: {
        select?: ((match: TRouteMatch) => TSelected) | undefined;
    } | undefined) => TSelected;
    useRouteContext: <TSelected = TRoute["types"]["allContext"]>(opts?: {
        select?: ((s: TRoute['types']['allContext']) => TSelected) | undefined;
    } | undefined) => TSelected;
    useSearch: <TSelected = TRoute["types"]["fullSearchSchema"]>(opts?: {
        select?: ((s: TRoute['types']['fullSearchSchema']) => TSelected) | undefined;
    } | undefined) => TSelected;
    useParams: <TSelected = TRoute["types"]["allParams"]>(opts?: {
        select?: ((s: TRoute['types']['allParams']) => TSelected) | undefined;
    } | undefined) => TSelected;
    useLoaderDeps: <TSelected = TRoute["types"]["loaderDeps"]>(opts?: {
        select?: ((s: TRoute['types']['loaderDeps']) => TSelected) | undefined;
    } | undefined) => TSelected;
    useLoaderData: <TSelected = TRoute["types"]["loaderData"]>(opts?: {
        select?: ((s: TRoute['types']['loaderData']) => TSelected) | undefined;
    } | undefined) => TSelected;
    useNavigate: () => import("./useNavigate").UseNavigateResult<string>;
}
export declare function createLazyRoute<TId extends RouteIds<RegisteredRouter['routeTree']>, TRoute extends AnyRoute = RouteById<RegisteredRouter['routeTree'], TId>>(id: TId): (opts: LazyRouteOptions) => LazyRoute<TRoute>;
export declare function createLazyFileRoute<TFilePath extends keyof FileRoutesByPath, TRoute extends FileRoutesByPath[TFilePath]['preLoaderRoute']>(path: TFilePath): (opts: LazyRouteOptions) => LazyRoute<TRoute>;
export {};
