import type { UseNavigateResult } from './useNavigate.cjs';
import type * as React from 'react';
import type { MakeRouteMatch, RouteMatch } from './Matches.cjs';
import type { NavigateOptions, ParsePathParams, ToSubOptions } from './link.cjs';
import type { ParsedLocation } from './location.cjs';
import type { RouteById, RouteIds, RoutePaths } from './routeInfo.cjs';
import type { AnyRouter, RegisteredRouter, Router } from './router.cjs';
import type { Assign, Expand, IsAny, NoInfer, PickRequired, UnionToIntersection } from './utils.cjs';
import type { BuildLocationFn, NavigateFn } from './RouterProvider.cjs';
import type { NotFoundError } from './not-found.cjs';
import type { LazyRoute } from './fileRoute.cjs';
export declare const rootRouteId: "__root__";
export type RootRouteId = typeof rootRouteId;
export type AnyPathParams = {};
export type SearchSchemaInput = {
    __TSearchSchemaInput__: 'TSearchSchemaInput';
};
export type AnySearchSchema = {};
export type AnyContext = {};
export interface RouteContext {
}
export type PreloadableObj = {
    preload?: () => Promise<void>;
};
export type RoutePathOptions<TCustomId, TPath> = {
    path: TPath;
} | {
    id: TCustomId;
};
export interface StaticDataRouteOption {
}
export type RoutePathOptionsIntersection<TCustomId, TPath> = UnionToIntersection<RoutePathOptions<TCustomId, TPath>>;
export type RouteOptions<TParentRoute extends AnyRoute = AnyRoute, TCustomId extends string = string, TPath extends string = string, TSearchSchemaInput extends Record<string, any> = {}, TSearchSchema extends Record<string, any> = {}, TSearchSchemaUsed = {}, TFullSearchSchemaInput = TSearchSchemaUsed, TFullSearchSchema = TSearchSchema, TParams = AnyPathParams, TAllParams = TParams, TRouteContextReturn extends RouteContext = RouteContext, TRouteContext = RouteContext, TRouterContext extends RouteConstraints['TRouterContext'] = AnyContext, TAllContext = AnyContext, TLoaderDeps extends Record<string, any> = {}, TLoaderDataReturn = unknown, TLoaderData = [TLoaderDataReturn] extends [never] ? undefined : TLoaderDataReturn> = BaseRouteOptions<TParentRoute, TCustomId, TPath, TSearchSchemaInput, TSearchSchema, TSearchSchemaUsed, TFullSearchSchemaInput, TFullSearchSchema, TParams, TAllParams, TRouteContextReturn, TRouteContext, TRouterContext, TAllContext, TLoaderDeps, TLoaderDataReturn> & UpdatableRouteOptions<NoInfer<TCustomId>, NoInfer<TAllParams>, NoInfer<TFullSearchSchema>, NoInfer<TLoaderData>, NoInfer<TAllContext>, NoInfer<TRouteContext>, NoInfer<TLoaderDeps>>;
export type ParamsFallback<TPath extends string, TParams> = unknown extends TParams ? Record<ParsePathParams<TPath>, string> : TParams;
export type FileBaseRouteOptions<TParentRoute extends AnyRoute = AnyRoute, TPath extends string = string, TSearchSchemaInput extends Record<string, any> = {}, TSearchSchema extends Record<string, any> = {}, TFullSearchSchema = TSearchSchema, TParams = {}, TAllParams = ParamsFallback<TPath, TParams>, TRouteContextReturn extends RouteContext = RouteContext, TRouteContext = RouteContext, TRouterContext extends RouteConstraints['TRouterContext'] = AnyContext, TAllContext = AnyContext, TLoaderDeps extends Record<string, any> = {}, TLoaderDataReturn = unknown> = {
    validateSearch?: SearchSchemaValidator<TSearchSchemaInput, TSearchSchema>;
    shouldReload?: boolean | ((match: LoaderFnContext<TAllParams, TFullSearchSchema, TAllContext, TRouteContext>) => any);
    beforeLoad?: BeforeLoadFn<TFullSearchSchema, TParentRoute, TAllParams, TRouteContextReturn, TRouterContext>;
    loaderDeps?: (opts: {
        search: TFullSearchSchema;
    }) => TLoaderDeps;
    loader?: RouteLoaderFn<TAllParams, NoInfer<TLoaderDeps>, NoInfer<TAllContext>, NoInfer<TRouteContext>, TLoaderDataReturn>;
} & ({
    parseParams?: (rawParams: IsAny<TPath, any, Record<ParsePathParams<TPath>, string>>) => TParams extends Record<ParsePathParams<TPath>, any> ? TParams : 'parseParams must return an object';
    stringifyParams?: (params: NoInfer<ParamsFallback<TPath, TParams>>) => Record<ParsePathParams<TPath>, string>;
} | {
    stringifyParams?: never;
    parseParams?: never;
});
export type BaseRouteOptions<TParentRoute extends AnyRoute = AnyRoute, TCustomId extends string = string, TPath extends string = string, TSearchSchemaInput extends Record<string, any> = {}, TSearchSchema extends Record<string, any> = {}, TSearchSchemaUsed = {}, TFullSearchSchemaInput = TSearchSchemaUsed, TFullSearchSchema = TSearchSchema, TParams = {}, TAllParams = ParamsFallback<TPath, TParams>, TRouteContextReturn extends RouteContext = RouteContext, TRouteContext = RouteContext, TRouterContext extends RouteConstraints['TRouterContext'] = AnyContext, TAllContext = AnyContext, TLoaderDeps extends Record<string, any> = {}, TLoaderDataReturn = unknown> = RoutePathOptions<TCustomId, TPath> & FileBaseRouteOptions<TParentRoute, TPath, TSearchSchemaInput, TSearchSchema, TFullSearchSchema, TParams, TAllParams, TRouteContextReturn, TRouteContext, TRouterContext, TAllContext, TLoaderDeps, TLoaderDataReturn> & {
    getParentRoute: () => TParentRoute;
};
type BeforeLoadFn<in out TFullSearchSchema, in out TParentRoute extends AnyRoute, in out TAllParams, TRouteContextReturn extends RouteContext, in out TRouterContext extends RouteConstraints['TRouterContext'] = AnyContext, in out TContext = IsAny<TParentRoute['types']['allContext'], TRouterContext>> = (opts: {
    search: TFullSearchSchema;
    abortController: AbortController;
    preload: boolean;
    params: TAllParams;
    context: TContext;
    location: ParsedLocation;
    navigate: NavigateFn;
    buildLocation: BuildLocationFn<TParentRoute>;
    cause: 'preload' | 'enter' | 'stay';
}) => Promise<TRouteContextReturn> | TRouteContextReturn | void;
export type UpdatableRouteOptions<TRouteId, TAllParams, TFullSearchSchema, TLoaderData, TAllContext, TRouteContext, TLoaderDeps, TRouteMatch = RouteMatch<TRouteId, TAllParams, TFullSearchSchema, TLoaderData, TAllContext, TRouteContext, TLoaderDeps>> = {
    caseSensitive?: boolean;
    wrapInSuspense?: boolean;
    component?: RouteComponent;
    errorComponent?: false | null | ErrorRouteComponent;
    notFoundComponent?: NotFoundRouteComponent;
    pendingComponent?: RouteComponent;
    pendingMs?: number;
    pendingMinMs?: number;
    staleTime?: number;
    gcTime?: number;
    preloadStaleTime?: number;
    preloadGcTime?: number;
    preSearchFilters?: Array<SearchFilter<TFullSearchSchema>>;
    postSearchFilters?: Array<SearchFilter<TFullSearchSchema>>;
    onError?: (err: any) => void;
    onEnter?: (match: TRouteMatch) => void;
    onStay?: (match: TRouteMatch) => void;
    onLeave?: (match: TRouteMatch) => void;
    meta?: (ctx: {
        matches: Array<TRouteMatch>;
        params: TAllParams;
        loaderData: TLoaderData;
    }) => Array<JSX.IntrinsicElements['meta']>;
    links?: () => Array<JSX.IntrinsicElements['link']>;
    scripts?: () => Array<JSX.IntrinsicElements['script']>;
    headers?: (ctx: {
        loaderData: TLoaderData;
    }) => Record<string, string>;
} & UpdatableStaticRouteOption;
export type UpdatableStaticRouteOption = {} extends PickRequired<StaticDataRouteOption> ? {
    staticData?: StaticDataRouteOption;
} : {
    staticData: StaticDataRouteOption;
};
export type MetaDescriptor = {
    charSet: 'utf-8';
} | {
    title: string;
} | {
    name: string;
    content: string;
} | {
    property: string;
    content: string;
} | {
    httpEquiv: string;
    content: string;
} | {
    'script:ld+json': LdJsonObject;
} | {
    tagName: 'meta' | 'link';
    [name: string]: string;
} | Record<string, unknown>;
type LdJsonObject = {
    [Key in string]: LdJsonValue;
} & {
    [Key in string]?: LdJsonValue | undefined;
};
type LdJsonArray = Array<LdJsonValue> | ReadonlyArray<LdJsonValue>;
type LdJsonPrimitive = string | number | boolean | null;
type LdJsonValue = LdJsonPrimitive | LdJsonObject | LdJsonArray;
export type RouteLinkEntry = {};
export type ParseParamsOption<TPath extends string, TParams> = ParseParamsFn<TPath, TParams>;
export type ParseParamsFn<TPath extends string, TParams> = (rawParams: IsAny<TPath, any, Record<ParsePathParams<TPath>, string>>) => TParams extends Record<ParsePathParams<TPath>, any> ? TParams : 'parseParams must return an object';
export type ParseParamsObj<TPath extends string, TParams> = {
    parse?: ParseParamsFn<TPath, TParams>;
};
export type SearchSchemaValidator<TInput, TReturn> = SearchSchemaValidatorObj<TInput, TReturn> | SearchSchemaValidatorFn<TInput, TReturn>;
export type SearchSchemaValidatorObj<TInput, TReturn> = {
    parse?: SearchSchemaValidatorFn<TInput, TReturn>;
};
export type SearchSchemaValidatorFn<TInput, TReturn> = (searchObj: TInput) => TReturn;
export type RouteLoaderFn<in out TAllParams = {}, in out TLoaderDeps extends Record<string, any> = {}, in out TAllContext = AnyContext, in out TRouteContext = AnyContext, TLoaderData = unknown> = (match: LoaderFnContext<TAllParams, TLoaderDeps, TAllContext, TRouteContext>) => Promise<TLoaderData> | TLoaderData;
export interface LoaderFnContext<in out TAllParams = {}, in out TLoaderDeps = {}, in out TAllContext = AnyContext, in out TRouteContext = AnyContext> {
    abortController: AbortController;
    preload: boolean;
    params: TAllParams;
    deps: TLoaderDeps;
    context: Assign<TAllContext, TRouteContext>;
    location: ParsedLocation;
    /**
     * @deprecated Use `throw redirect({ to: '/somewhere' })` instead
     **/
    navigate: (opts: NavigateOptions<AnyRouter>) => Promise<void>;
    parentMatchPromise?: Promise<void>;
    cause: 'preload' | 'enter' | 'stay';
    route: Route;
}
export type SearchFilter<TInput, TResult = TInput> = (prev: TInput) => TResult;
export type ResolveId<TParentRoute, TCustomId extends string, TPath extends string> = TParentRoute extends {
    id: infer TParentId extends string;
} ? RoutePrefix<TParentId, string extends TCustomId ? TPath : TCustomId> : RootRouteId;
export type InferFullSearchSchema<TRoute> = TRoute extends {
    types: {
        fullSearchSchema: infer TFullSearchSchema;
    };
} ? TFullSearchSchema : {};
export type InferFullSearchSchemaInput<TRoute> = TRoute extends {
    types: {
        fullSearchSchemaInput: infer TFullSearchSchemaInput;
    };
} ? TFullSearchSchemaInput : {};
export type ResolveFullSearchSchema<TParentRoute extends AnyRoute, TSearchSchema> = Assign<TParentRoute['id'] extends RootRouteId ? Omit<TParentRoute['types']['searchSchema'], keyof RootSearchSchema> : TParentRoute['types']['fullSearchSchema'], TSearchSchema>;
export type ResolveFullSearchSchemaInput<TParentRoute extends AnyRoute, TSearchSchemaUsed> = Assign<TParentRoute['id'] extends RootRouteId ? Omit<TParentRoute['types']['searchSchemaInput'], keyof RootSearchSchema> : TParentRoute['types']['fullSearchSchemaInput'], TSearchSchemaUsed>;
export interface AnyRoute extends Route<any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any> {
}
export type MergeFromFromParent<T, U> = IsAny<T, U, T & U>;
export type ResolveAllParams<TParentRoute extends AnyRoute, TParams> = Record<never, string> extends TParentRoute['types']['allParams'] ? TParams : UnionToIntersection<TParentRoute['types']['allParams'] & TParams> & {};
export type RouteConstraints = {
    TParentRoute: AnyRoute;
    TPath: string;
    TFullPath: string;
    TCustomId: string;
    TId: string;
    TSearchSchema: AnySearchSchema;
    TFullSearchSchema: AnySearchSchema;
    TParams: Record<string, any>;
    TAllParams: Record<string, any>;
    TParentContext: AnyContext;
    TRouteContext: RouteContext;
    TAllContext: AnyContext;
    TRouterContext: AnyContext;
    TChildren: unknown;
    TRouteTree: AnyRoute;
};
export declare function getRouteApi<TId extends RouteIds<RegisteredRouter['routeTree']>, TRoute extends AnyRoute = RouteById<RegisteredRouter['routeTree'], TId>, TFullSearchSchema = TRoute['types']['fullSearchSchema'], TAllParams = TRoute['types']['allParams'], TAllContext = TRoute['types']['allContext'], TLoaderDeps = TRoute['types']['loaderDeps'], TLoaderData = TRoute['types']['loaderData']>(id: TId): RouteApi<TId, TRoute, TFullSearchSchema, TAllParams, TAllContext, TLoaderDeps, TLoaderData>;
export declare class RouteApi<TId extends RouteIds<RegisteredRouter['routeTree']>, TRoute extends AnyRoute = RouteById<RegisteredRouter['routeTree'], TId>, TFullSearchSchema = TRoute['types']['fullSearchSchema'], TAllParams = TRoute['types']['allParams'], TAllContext = TRoute['types']['allContext'], TLoaderDeps = TRoute['types']['loaderDeps'], TLoaderData = TRoute['types']['loaderData']> {
    id: TId;
    /**
     * @deprecated Use the `getRouteApi` function instead.
     */
    constructor({ id }: {
        id: TId;
    });
    useMatch: <TRouteTree extends AnyRoute = any, TRouteMatch = MakeRouteMatch<TRouteTree, TId>, TSelected = TRouteMatch>(opts?: {
        select?: ((match: TRouteMatch) => TSelected) | undefined;
    } | undefined) => TSelected;
    useRouteContext: <TSelected = Expand<TAllContext>>(opts?: {
        select?: ((s: Expand<TAllContext>) => TSelected) | undefined;
    } | undefined) => TSelected;
    useSearch: <TSelected = Expand<TFullSearchSchema>>(opts?: {
        select?: ((s: Expand<TFullSearchSchema>) => TSelected) | undefined;
    } | undefined) => TSelected;
    useParams: <TSelected = Expand<TAllParams>>(opts?: {
        select?: ((s: Expand<TAllParams>) => TSelected) | undefined;
    } | undefined) => TSelected;
    useLoaderDeps: <TSelected = TLoaderDeps>(opts?: {
        select?: ((s: TLoaderDeps) => TSelected) | undefined;
    } | undefined) => TSelected;
    useLoaderData: <TSelected = TLoaderData>(opts?: {
        select?: ((s: TLoaderData) => TSelected) | undefined;
    } | undefined) => TSelected;
    useNavigate: () => UseNavigateResult<string>;
    notFound: (opts?: NotFoundError) => NotFoundError;
}
export declare class Route<in out TParentRoute extends RouteConstraints['TParentRoute'] = AnyRoute, in out TPath extends RouteConstraints['TPath'] = '/', in out TFullPath extends RouteConstraints['TFullPath'] = ResolveFullPath<TParentRoute, TPath>, in out TCustomId extends RouteConstraints['TCustomId'] = string, in out TId extends RouteConstraints['TId'] = ResolveId<TParentRoute, TCustomId, TPath>, in out TSearchSchemaInput extends RouteConstraints['TSearchSchema'] = {}, in out TSearchSchema extends RouteConstraints['TSearchSchema'] = {}, in out TSearchSchemaUsed = TSearchSchemaInput extends SearchSchemaInput ? Omit<TSearchSchemaInput, keyof SearchSchemaInput> : TSearchSchema, in out TFullSearchSchemaInput = ResolveFullSearchSchemaInput<TParentRoute, TSearchSchemaUsed>, in out TFullSearchSchema = ResolveFullSearchSchema<TParentRoute, TSearchSchema>, in out TParams = Record<ParsePathParams<TPath>, string>, in out TAllParams = ResolveAllParams<TParentRoute, TParams>, TRouteContextReturn extends RouteConstraints['TRouteContext'] = RouteContext, in out TRouteContext = [TRouteContextReturn] extends [never] ? RouteContext : TRouteContextReturn, in out TAllContext = Assign<IsAny<TParentRoute['types']['allContext'], {}>, TRouteContext>, in out TRouterContext extends RouteConstraints['TRouterContext'] = AnyContext, in out TLoaderDeps extends Record<string, any> = {}, TLoaderDataReturn = unknown, in out TLoaderData = [TLoaderDataReturn] extends [never] ? undefined : TLoaderDataReturn, in out TChildren extends RouteConstraints['TChildren'] = unknown> {
    isRoot: TParentRoute extends Route<any> ? true : false;
    options: RouteOptions<TParentRoute, TCustomId, TPath, TSearchSchemaInput, TSearchSchema, TSearchSchemaUsed, TFullSearchSchemaInput, TFullSearchSchema, TParams, TAllParams, TRouteContextReturn, TRouteContext, TRouterContext, TAllContext, TLoaderDeps, TLoaderDataReturn, TLoaderData>;
    parentRoute: TParentRoute;
    id: TId;
    path: TPath;
    fullPath: TFullPath;
    to: TrimPathRight<TFullPath>;
    children?: TChildren;
    originalIndex?: number;
    router?: AnyRouter;
    rank: number;
    lazyFn?: () => Promise<LazyRoute<any>>;
    /**
     * @deprecated Use the `createRoute` function instead.
     */
    constructor(options?: RouteOptions<TParentRoute, TCustomId, TPath, TSearchSchemaInput, TSearchSchema, TSearchSchemaUsed, TFullSearchSchemaInput, TFullSearchSchema, TParams, TAllParams, TRouteContextReturn, TRouteContext, TRouterContext, TAllContext, TLoaderDeps, TLoaderDataReturn, TLoaderData>);
    types: {
        parentRoute: TParentRoute;
        path: TPath;
        to: TrimPathRight<TFullPath>;
        fullPath: TFullPath;
        customId: TCustomId;
        id: TId;
        searchSchema: TSearchSchema;
        searchSchemaInput: TSearchSchemaInput;
        searchSchemaUsed: TSearchSchemaUsed;
        fullSearchSchema: TFullSearchSchema;
        fullSearchSchemaInput: TFullSearchSchemaInput;
        params: TParams;
        allParams: TAllParams;
        routeContext: TRouteContext;
        allContext: TAllContext;
        children: TChildren;
        routerContext: TRouterContext;
        loaderData: TLoaderData;
        loaderDeps: TLoaderDeps;
    };
    init: (opts: {
        originalIndex: number;
    }) => void;
    addChildren: <const TNewChildren extends readonly AnyRoute[]>(children: TNewChildren) => Route<TParentRoute, TPath, TFullPath, TCustomId, TId, TSearchSchemaInput, TSearchSchema, TSearchSchemaUsed, TFullSearchSchemaInput, TFullSearchSchema, TParams, TAllParams, TRouteContextReturn, TRouteContext, TAllContext, TRouterContext, TLoaderDeps, TLoaderDataReturn, TLoaderData, TNewChildren>;
    updateLoader: <TNewLoaderData = unknown>(options: {
        loader: RouteLoaderFn<TAllParams, TLoaderDeps, TAllContext, TRouteContext, TNewLoaderData>;
    }) => Route<TParentRoute, TPath, TFullPath, TCustomId, TId, TSearchSchemaInput, TSearchSchema, TSearchSchemaUsed, TFullSearchSchemaInput, TFullSearchSchema, TParams, TAllParams, TRouteContextReturn, TRouteContext, TAllContext, TRouterContext, TLoaderDeps, TNewLoaderData, TChildren, unknown>;
    update: (options: UpdatableRouteOptions<TCustomId, TAllParams, TFullSearchSchema, TLoaderData, TAllContext, TRouteContext, TLoaderDeps>) => this;
    lazy: (lazyFn: () => Promise<LazyRoute<any>>) => this;
    useMatch: <TRouteTree extends AnyRoute = any, TRouteMatch = MakeRouteMatch<TRouteTree, TId>, TSelected = TRouteMatch>(opts?: {
        select?: ((match: TRouteMatch) => TSelected) | undefined;
    } | undefined) => TSelected;
    useRouteContext: <TSelected = Expand<TAllContext>>(opts?: {
        select?: ((search: Expand<TAllContext>) => TSelected) | undefined;
    } | undefined) => TSelected;
    useSearch: <TSelected = Expand<TFullSearchSchema>>(opts?: {
        select?: ((search: Expand<TFullSearchSchema>) => TSelected) | undefined;
    } | undefined) => TSelected;
    useParams: <TSelected = Expand<TAllParams>>(opts?: {
        select?: ((search: Expand<TAllParams>) => TSelected) | undefined;
    } | undefined) => TSelected;
    useLoaderDeps: <TSelected = TLoaderDeps>(opts?: {
        select?: ((s: TLoaderDeps) => TSelected) | undefined;
    } | undefined) => TSelected;
    useLoaderData: <TSelected = TLoaderData>(opts?: {
        select?: ((search: TLoaderData) => TSelected) | undefined;
    } | undefined) => TSelected;
    useNavigate: () => UseNavigateResult<string>;
}
export declare function createRoute<TParentRoute extends RouteConstraints['TParentRoute'] = AnyRoute, TPath extends RouteConstraints['TPath'] = '/', TFullPath extends RouteConstraints['TFullPath'] = ResolveFullPath<TParentRoute, TPath>, TCustomId extends RouteConstraints['TCustomId'] = string, TId extends RouteConstraints['TId'] = ResolveId<TParentRoute, TCustomId, TPath>, TSearchSchemaInput extends RouteConstraints['TSearchSchema'] = {}, TSearchSchema extends RouteConstraints['TSearchSchema'] = {}, TSearchSchemaUsed = TSearchSchemaInput extends SearchSchemaInput ? Omit<TSearchSchemaInput, keyof SearchSchemaInput> : TSearchSchema, TFullSearchSchemaInput = ResolveFullSearchSchemaInput<TParentRoute, TSearchSchemaUsed>, TFullSearchSchema = ResolveFullSearchSchema<TParentRoute, TSearchSchema>, TParams = Record<ParsePathParams<TPath>, string>, TAllParams = ResolveAllParams<TParentRoute, TParams>, TRouteContextReturn extends RouteConstraints['TRouteContext'] = RouteContext, TRouteContext = [TRouteContextReturn] extends [never] ? RouteContext : TRouteContextReturn, TAllContext = Assign<IsAny<TParentRoute['types']['allContext'], {}>, TRouteContext>, TRouterContext extends RouteConstraints['TRouterContext'] = AnyContext, TLoaderDeps extends Record<string, any> = {}, TLoaderDataReturn = unknown, TLoaderData = [TLoaderDataReturn] extends [never] ? undefined : TLoaderDataReturn, TChildren extends RouteConstraints['TChildren'] = unknown>(options: RouteOptions<TParentRoute, TCustomId, TPath, TSearchSchemaInput, TSearchSchema, TSearchSchemaUsed, TFullSearchSchemaInput, TFullSearchSchema, TParams, TAllParams, TRouteContextReturn, TRouteContext, TRouterContext, TAllContext, TLoaderDeps, TLoaderDataReturn, TLoaderData>): Route<TParentRoute, TPath, TFullPath, TCustomId, TId, TSearchSchemaInput, TSearchSchema, TSearchSchemaUsed, TFullSearchSchemaInput, TFullSearchSchema, TParams, TAllParams, TRouteContextReturn, TRouteContext, TAllContext, TRouterContext, TLoaderDeps, TLoaderDataReturn, TLoaderData, TChildren>;
export type AnyRootRoute = RootRoute<any, any, any, any, any, any, any, any>;
export type RootRouteOptions<TSearchSchemaInput extends Record<string, any> = RootSearchSchema, TSearchSchema extends Record<string, any> = RootSearchSchema, TSearchSchemaUsed extends Record<string, any> = RootSearchSchema, TRouteContextReturn extends RouteContext = RouteContext, TRouteContext extends RouteContext = [TRouteContextReturn] extends [never] ? RouteContext : TRouteContextReturn, TRouterContext extends {} = {}, TLoaderDeps extends Record<string, any> = {}, TLoaderDataReturn = unknown, TLoaderData = [TLoaderDataReturn] extends [never] ? undefined : TLoaderDataReturn> = Omit<RouteOptions<any, // TParentRoute
RootRouteId, // TCustomId
'', // TPath
TSearchSchemaInput, // TSearchSchemaInput
TSearchSchema, // TSearchSchema
TSearchSchemaUsed, TSearchSchemaUsed, //TFullSearchSchemaInput
TSearchSchema, // TFullSearchSchema
{}, // TParams
{}, // TAllParams
TRouteContextReturn, // TRouteContextReturn
TRouteContext, // TRouteContext
TRouterContext, Assign<TRouterContext, TRouteContext>, // TAllContext
TLoaderDeps, TLoaderDataReturn, // TLoaderDataReturn,
TLoaderData>, 'path' | 'id' | 'getParentRoute' | 'caseSensitive' | 'parseParams' | 'stringifyParams'> & {
    /**
     * @description When using SSR and the <StartServer> component, this component, if supplied will wrap
     * the entire application during SSR and provide a <div id='root'> node for client-side hydration.
     * The shellComponent is non-reactive and will not be re-rendered on the client.
     * When used, it's common to render <html>, <head>, and <body> tags here.
     *
     * If your shell needs to be reactive, consider rendering your <html>, <head>, and <body> tags your
     * root route's component, but be VERY cautious as attempting to hydrate/render over the entire
     * document can and likely will lead to hydration mismatches.
     *
     * NOTE: Version 19 of React will allow using native <html>, <head>, and <body> tags in
     * your components, which will automatically be hoisted and kept in sync with both server
     * and client-side rendering. When 19 is released, this prop will be deprecated.
     */
    shellComponent?: (props: {
        children: React.ReactNode;
    }) => JSX.Element;
    /**
     * @description It's suggested to first use the `meta` option in the root route and sub routes to
     * add meta tags. However, it may not be possible to add all types of meta tags using the `meta` option, like
     * "base", for example, or you may want to read from router state/context to conditionally add meta tags in a
     * component context.
     **/
    metaComponent?: (props: {
        children: React.ReactNode;
    }) => JSX.Element;
};
export declare function createRootRouteWithContext<TRouterContext extends {}>(): <TSearchSchemaInput extends Record<string, any> = RootSearchSchema, TSearchSchema extends Record<string, any> = RootSearchSchema, TSearchSchemaUsed extends Record<string, any> = RootSearchSchema, TRouteContextReturn extends RouteContext = RouteContext, TRouteContext extends RouteContext = [TRouteContextReturn] extends [never] ? RouteContext : TRouteContextReturn, TLoaderDeps extends Record<string, any> = {}, TLoaderDataReturn = unknown, TLoaderData = [TLoaderDataReturn] extends [never] ? undefined : TLoaderDataReturn>(options?: RootRouteOptions<TSearchSchemaInput, TSearchSchema, TSearchSchemaUsed, TRouteContextReturn, TRouteContext, TRouterContext, TLoaderDeps, TLoaderDataReturn, TLoaderData> | undefined) => RootRoute<TSearchSchemaInput, TSearchSchema, TSearchSchemaUsed, TRouteContextReturn, TRouteContext, TRouterContext, TLoaderDeps, TLoaderData, [TLoaderData] extends [never] ? undefined : TLoaderData>;
/**
 * @deprecated Use the `createRootRouteWithContext` function instead.
 */
export declare const rootRouteWithContext: typeof createRootRouteWithContext;
export type RootSearchSchema = {
    __TRootSearchSchema__: '__TRootSearchSchema__';
};
export declare class RootRoute<in out TSearchSchemaInput extends Record<string, any> = RootSearchSchema, in out TSearchSchema extends Record<string, any> = RootSearchSchema, in out TSearchSchemaUsed extends Record<string, any> = RootSearchSchema, TRouteContextReturn extends RouteContext = RouteContext, in out TRouteContext extends RouteContext = [TRouteContextReturn] extends [
    never
] ? RouteContext : TRouteContextReturn, in out TRouterContext extends {} = {}, TLoaderDeps extends Record<string, any> = {}, TLoaderDataReturn = unknown, in out TLoaderData = [TLoaderDataReturn] extends [never] ? undefined : TLoaderDataReturn> extends Route<any, // TParentRoute
'/', // TPath
'/', // TFullPath
string, // TCustomId
RootRouteId, // TId
TSearchSchemaInput, // TSearchSchemaInput
TSearchSchema, // TSearchSchema
TSearchSchemaUsed, TSearchSchemaUsed, // TFullSearchSchemaInput
TSearchSchema, // TFullSearchSchema
{}, // TParams
{}, // TAllParams
TRouteContextReturn, // TRouteContextReturn
TRouteContext, // TRouteContext
Assign<TRouterContext, TRouteContext>, // TAllContext
TRouterContext, // TRouterContext
TLoaderDeps, TLoaderDataReturn, TLoaderData, any> {
    /**
     * @deprecated `RootRoute` is now an internal implementation detail. Use `createRootRoute()` instead.
     */
    constructor(options?: RootRouteOptions<TSearchSchemaInput, TSearchSchema, TSearchSchemaUsed, TRouteContextReturn, TRouteContext, TRouterContext, TLoaderDeps, TLoaderDataReturn, TLoaderData>);
}
export declare function createRootRoute<TSearchSchemaInput extends Record<string, any> = RootSearchSchema, TSearchSchema extends Record<string, any> = RootSearchSchema, TSearchSchemaUsed extends Record<string, any> = RootSearchSchema, TRouteContextReturn extends RouteContext = RouteContext, TRouteContext extends RouteContext = [TRouteContextReturn] extends [never] ? RouteContext : TRouteContextReturn, TRouterContext extends {} = {}, TLoaderDeps extends Record<string, any> = {}, TLoaderDataReturn = unknown, TLoaderData = [TLoaderDataReturn] extends [never] ? undefined : TLoaderDataReturn>(options?: Omit<RouteOptions<any, // TParentRoute
RootRouteId, // TCustomId
'', // TPath
TSearchSchemaInput, // TSearchSchemaInput
TSearchSchema, // TSearchSchema
TSearchSchemaUsed, TSearchSchemaUsed, // TFullSearchSchemaInput
TSearchSchema, // TFullSearchSchema
{}, // TParams
{}, // TAllParams
TRouteContextReturn, // TRouteContextReturn
TRouteContext, // TRouteContext
TRouterContext, Assign<TRouterContext, TRouteContext>, // TAllContext
TLoaderDeps, TLoaderDataReturn, TLoaderData>, 'path' | 'id' | 'getParentRoute' | 'caseSensitive' | 'parseParams' | 'stringifyParams'>): RootRoute<TSearchSchemaInput, TSearchSchema, TSearchSchemaUsed, TRouteContextReturn, TRouteContext, TRouterContext, TLoaderDeps, TLoaderDataReturn, TLoaderData>;
export type ResolveFullPath<TParentRoute extends AnyRoute, TPath extends string, TPrefixed = RoutePrefix<TParentRoute['fullPath'], TPath>> = TPrefixed extends RootRouteId ? '/' : TPrefixed;
type RoutePrefix<TPrefix extends string, TPath extends string> = string extends TPath ? RootRouteId : TPath extends string ? TPrefix extends RootRouteId ? TPath extends '/' ? '/' : `/${TrimPath<TPath>}` : `${TPrefix}/${TPath}` extends '/' ? '/' : `/${TrimPathLeft<`${TrimPathRight<TPrefix>}/${TrimPath<TPath>}`>}` : never;
export type TrimPath<T extends string> = '' extends T ? '' : TrimPathRight<TrimPathLeft<T>>;
export type TrimPathLeft<T extends string> = T extends `${RootRouteId}/${infer U}` ? TrimPathLeft<U> : T extends `/${infer U}` ? TrimPathLeft<U> : T;
export type TrimPathRight<T extends string> = T extends '/' ? '/' : T extends `${infer U}/` ? TrimPathRight<U> : T;
export type RouteMask<TRouteTree extends AnyRoute> = {
    routeTree: TRouteTree;
    from: RoutePaths<TRouteTree>;
    to?: any;
    params?: any;
    search?: any;
    hash?: any;
    state?: any;
    unmaskOnReload?: boolean;
};
export declare function createRouteMask<TRouteTree extends AnyRoute, TFrom extends RoutePaths<TRouteTree>, TTo extends string>(opts: {
    routeTree: TRouteTree;
} & ToSubOptions<Router<TRouteTree, 'never'>, TFrom, TTo>): RouteMask<TRouteTree>;
/**
 * @deprecated Use `ErrorComponentProps` instead.
 */
export type ErrorRouteProps = {
    error: unknown;
    info?: {
        componentStack: string;
    };
    reset: () => void;
};
export type ErrorComponentProps = {
    error: unknown;
    info?: {
        componentStack: string;
    };
    reset: () => void;
};
export type NotFoundRouteProps = {
    data: unknown;
};
export type ReactNode = any;
export type SyncRouteComponent<TProps> = ((props: TProps) => ReactNode) | React.LazyExoticComponent<(props: TProps) => ReactNode>;
export type AsyncRouteComponent<TProps> = SyncRouteComponent<TProps> & {
    preload?: () => Promise<void>;
};
export type RouteComponent<TProps = any> = SyncRouteComponent<TProps> & AsyncRouteComponent<TProps>;
export type ErrorRouteComponent = RouteComponent<ErrorComponentProps>;
export type NotFoundRouteComponent = SyncRouteComponent<NotFoundRouteProps>;
export declare class NotFoundRoute<TParentRoute extends AnyRootRoute, TSearchSchemaInput extends Record<string, any> = {}, TSearchSchema extends RouteConstraints['TSearchSchema'] = {}, TSearchSchemaUsed extends RouteConstraints['TSearchSchema'] = {}, TFullSearchSchemaInput extends RouteConstraints['TFullSearchSchema'] = ResolveFullSearchSchemaInput<TParentRoute, TSearchSchemaUsed>, TFullSearchSchema = ResolveFullSearchSchema<TParentRoute, TSearchSchema>, TRouteContextReturn extends RouteConstraints['TRouteContext'] = AnyContext, TRouteContext extends RouteConstraints['TRouteContext'] = RouteContext, TAllContext = Assign<IsAny<TParentRoute['types']['allContext'], {}>, TRouteContext>, TRouterContext extends RouteConstraints['TRouterContext'] = AnyContext, TLoaderDeps extends Record<string, any> = {}, TLoaderDataReturn = unknown, TLoaderData = [TLoaderDataReturn] extends [never] ? undefined : TLoaderDataReturn, TChildren extends RouteConstraints['TChildren'] = unknown> extends Route<TParentRoute, '/404', '/404', '404', '404', TSearchSchemaInput, TSearchSchema, TSearchSchemaUsed, TFullSearchSchemaInput, TFullSearchSchema, {}, {}, TRouteContextReturn, TRouteContext, TAllContext, TRouterContext, TLoaderDeps, TLoaderDataReturn, TLoaderData, TChildren> {
    constructor(options: Omit<RouteOptions<TParentRoute, string, string, TSearchSchemaInput, TSearchSchema, TSearchSchemaUsed, TFullSearchSchemaInput, TFullSearchSchema, {}, {}, TRouteContextReturn, TRouteContext, TRouterContext, TAllContext, TLoaderDeps, TLoaderDataReturn, TLoaderData>, 'caseSensitive' | 'parseParams' | 'stringifyParams' | 'path' | 'id'>);
}
export {};
