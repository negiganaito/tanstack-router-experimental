import * as React from 'react';
import type { AnyRouter, ParsedLocation } from '.';
import type { HistoryState } from '@tanstack/history';
import type { Trim } from './fileRoute.cjs';
import type { AnyRoute, RootSearchSchema } from './route.cjs';
import type { RouteByPath, RouteByToPath, RoutePaths, RoutePathsAutoComplete, RouteToPath } from './routeInfo.cjs';
import type { RegisteredRouter } from './router.cjs';
import type { Expand, MakeDifferenceOptional, NoInfer, NonNullableUpdater, PickRequired, Updater, WithoutEmpty } from './utils.cjs';
export type CleanPath<T extends string> = T extends `${infer L}//${infer R}` ? CleanPath<`${CleanPath<L>}/${CleanPath<R>}`> : T extends `${infer L}//` ? `${CleanPath<L>}/` : T extends `//${infer L}` ? `/${CleanPath<L>}` : T;
export type Split<TValue, TIncludeTrailingSlash = true> = TValue extends unknown ? string extends TValue ? Array<string> : TValue extends string ? CleanPath<TValue> extends '' ? [] : TIncludeTrailingSlash extends true ? CleanPath<TValue> extends `${infer T}/` ? [...Split<T>, '/'] : CleanPath<TValue> extends `/${infer U}` ? Split<U> : CleanPath<TValue> extends `${infer T}/${infer U}` ? [...Split<T>, ...Split<U>] : [TValue] : CleanPath<TValue> extends `${infer T}/${infer U}` ? [...Split<T>, ...Split<U>] : TValue extends string ? [TValue] : never : never : never;
export type ParsePathParams<T extends string> = keyof {
    [K in Trim<Split<T>[number], '_'> as K extends `$${infer L}` ? L extends '' ? '_splat' : L : never]: K;
};
export type Join<T, TDelimiter extends string = '/'> = T extends [] ? '' : T extends [infer L extends string] ? L : T extends [
    infer L extends string,
    ...infer Tail extends [...Array<string>]
] ? CleanPath<`${L}${TDelimiter}${Join<Tail>}`> : never;
export type Last<T extends Array<any>> = T extends [...infer _, infer L] ? L : never;
export type RemoveTrailingSlashes<T> = T extends `${infer R}/` ? R : T;
export type RemoveLeadingSlashes<T> = T extends `/${infer R}` ? R : T;
export type ResolvePaths<TRouter extends AnyRouter, TSearchPath> = RouteByPath<TRouter['routeTree'], RemoveTrailingSlashes<TSearchPath>> extends never ? RouteToPath<TRouter, TRouter['routeTree']> : RouteToPath<TRouter, RouteByPath<TRouter['routeTree'], RemoveTrailingSlashes<TSearchPath>>>;
export type SearchPaths<TRouter extends AnyRouter, TSearchPath extends string, TPaths = ResolvePaths<TRouter, TSearchPath>> = TPaths extends `${RemoveTrailingSlashes<TSearchPath>}${infer TRest}` ? TRest : never;
export type SearchRelativePathAutoComplete<TRouter extends AnyRouter, TTo extends string, TSearchPath extends string> = `${TTo}/${RemoveLeadingSlashes<SearchPaths<TRouter, TSearchPath>>}`;
export type RelativeToParentPathAutoComplete<TRouter extends AnyRouter, TFrom extends string, TTo extends string, TResolvedPath extends string = RemoveTrailingSlashes<ResolveRelativePath<TFrom, TTo>>> = SearchRelativePathAutoComplete<TRouter, TTo, TResolvedPath> | (TResolvedPath extends '' ? never : `${TTo}/../`);
export type RelativeToCurrentPathAutoComplete<TRouter extends AnyRouter, TFrom extends string, TTo extends string, TRestTo extends string, TResolvedPath extends string = RemoveTrailingSlashes<`${RemoveTrailingSlashes<TFrom>}/${RemoveLeadingSlashes<TRestTo>}`>> = SearchRelativePathAutoComplete<TRouter, TTo, TResolvedPath>;
export type AbsolutePathAutoComplete<TRouter extends AnyRouter, TFrom extends string> = (string extends TFrom ? './' : TFrom extends `/` ? never : SearchPaths<TRouter, TFrom> extends '' ? never : './') | (string extends TFrom ? '../' : TFrom extends `/` ? never : '../') | RouteToPath<TRouter, TRouter['routeTree']> | (TFrom extends '/' ? never : string extends TFrom ? RemoveLeadingSlashes<RouteToPath<TRouter, TRouter['routeTree']>> : RemoveLeadingSlashes<SearchPaths<TRouter, TFrom>>);
export type RelativeToPathAutoComplete<TRouter extends AnyRouter, TFrom extends string, TTo extends string> = TTo extends `..${string}` ? RelativeToParentPathAutoComplete<TRouter, TFrom, RemoveTrailingSlashes<TTo>> : TTo extends `./${infer TRestTTo}` ? RelativeToCurrentPathAutoComplete<TRouter, TFrom, RemoveTrailingSlashes<TTo>, TRestTTo> : AbsolutePathAutoComplete<TRouter, TFrom>;
export type NavigateOptions<TRouter extends AnyRouter = RegisteredRouter, TFrom extends RoutePaths<TRouter['routeTree']> | string = string, TTo extends string = '', TMaskFrom extends RoutePaths<TRouter['routeTree']> | string = TFrom, TMaskTo extends string = ''> = ToOptions<TRouter, TFrom, TTo, TMaskFrom, TMaskTo> & {
    replace?: boolean;
    resetScroll?: boolean;
    /** @deprecated All navigations now use startTransition under the hood */
    startTransition?: boolean;
    viewTransition?: boolean;
};
export type ToOptions<TRouter extends AnyRouter = RegisteredRouter, TFrom extends RoutePaths<TRouter['routeTree']> | string = string, TTo extends string = '', TMaskFrom extends RoutePaths<TRouter['routeTree']> | string = TFrom, TMaskTo extends string = ''> = ToSubOptions<TRouter, TFrom, TTo> & {
    _fromLocation?: ParsedLocation;
    mask?: ToMaskOptions<TRouter, TMaskFrom, TMaskTo>;
};
export type ToMaskOptions<TRouteTree extends AnyRouter = RegisteredRouter, TMaskFrom extends RoutePaths<TRouteTree['routeTree']> | string = string, TMaskTo extends string = ''> = ToSubOptions<TRouteTree, TMaskFrom, TMaskTo> & {
    unmaskOnReload?: boolean;
};
export type ToSubOptions<TRouter extends AnyRouter = RegisteredRouter, TFrom extends RoutePaths<TRouter['routeTree']> | string = string, TTo extends string = ''> = {
    to?: ToPathOption<TRouter, TFrom, TTo> & {};
    hash?: true | Updater<string>;
    state?: true | NonNullableUpdater<HistoryState>;
    from?: RoutePathsAutoComplete<TRouter['routeTree'], TFrom> & {};
} & SearchParamOptions<TRouter, TFrom, TTo> & PathParamOptions<TRouter, TFrom, TTo>;
type ParamsReducer<TFrom, TTo> = TTo | ((current: TFrom) => TTo);
type ParamVariant = 'PATH' | 'SEARCH';
type ExcludeRootSearchSchema<T, TExcluded = Exclude<T, RootSearchSchema>> = [
    TExcluded
] extends [never] ? {} : TExcluded;
export type ResolveRoute<TRouter extends AnyRouter, TFrom, TTo, TPath = string extends TFrom ? TTo : string extends TTo ? TFrom : ResolveRelativePath<TFrom, TTo>> = TPath extends string ? string extends TTo ? RouteByPath<TRouter['routeTree'], TPath> : RouteByToPath<TRouter, TPath> : never;
type PostProcessParams<T, TParamVariant extends ParamVariant> = TParamVariant extends 'SEARCH' ? ExcludeRootSearchSchema<T> : T;
type ResolveFromParams<TRouter extends AnyRouter, TParamVariant extends ParamVariant, TFrom> = PostProcessParams<RouteByPath<TRouter['routeTree'], TFrom>['types'][TParamVariant extends 'PATH' ? 'allParams' : 'fullSearchSchema'], TParamVariant>;
type ResolveToParams<TRouter extends AnyRouter, TParamVariant extends ParamVariant, TFrom, TTo, TRoute extends AnyRoute = ResolveRoute<TRouter, TFrom, TTo>> = PostProcessParams<TRoute['types'][TParamVariant extends 'PATH' ? 'allParams' : 'fullSearchSchemaInput'], TParamVariant>;
type ResolveRelativeToParams<TRouter extends AnyRouter, TParamVariant extends ParamVariant, TFrom, TTo, TToParams = ResolveToParams<TRouter, TParamVariant, TFrom, TTo>> = TParamVariant extends 'SEARCH' ? TToParams : string extends TFrom ? TToParams : MakeDifferenceOptional<ResolveFromParams<TRouter, TParamVariant, TFrom>, TToParams>;
type MakeOptionalParams<TRouter extends AnyRouter, TParamVariant extends ParamVariant, TFrom, TTo> = TParamVariant extends 'SEARCH' ? {
    search?: true | (ParamsReducer<Expand<ResolveFromParams<TRouter, TParamVariant, TFrom>>, Expand<ResolveRelativeToParams<TRouter, TParamVariant, TFrom, TTo>>> & {});
} : {
    params?: true | (ParamsReducer<Expand<ResolveFromParams<TRouter, TParamVariant, TFrom>>, Expand<ResolveRelativeToParams<TRouter, TParamVariant, TFrom, TTo>>> & {});
};
type MakeRequiredParamsReducer<TRouter extends AnyRouter, TParamVariant extends ParamVariant, TFrom, TToParams, TFromParams = ResolveFromParams<TRouter, TParamVariant, TFrom>> = ([TFromParams] extends [WithoutEmpty<PickRequired<TToParams>>] ? true : never) | ParamsReducer<Expand<TFromParams>, TToParams>;
export type MakeRequiredParams<TRouter extends AnyRouter, TParamVariant extends ParamVariant, TFrom, TTo> = TParamVariant extends 'SEARCH' ? {
    search: Expand<MakeRequiredParamsReducer<TRouter, TParamVariant, TFrom, Expand<ResolveRelativeToParams<TRouter, TParamVariant, TFrom, TTo>>>> & {};
} : {
    params: Expand<MakeRequiredParamsReducer<TRouter, TParamVariant, TFrom, Expand<ResolveRelativeToParams<TRouter, TParamVariant, TFrom, TTo>>>> & {};
};
export type IsRequiredParams<TParams> = keyof TParams extends infer K extends keyof TParams ? K extends any ? undefined extends TParams[K] ? never : true : never : never;
export type IsRequired<TRouter extends AnyRouter, TParamVariant extends ParamVariant, TFrom, TTo> = string extends TTo ? string extends TFrom ? never : IsRequiredParams<ResolveRelativeToParams<TRouter, TParamVariant, TFrom, TTo>> : IsRequiredParams<ResolveRelativeToParams<TRouter, TParamVariant, TFrom, TTo>>;
export type ParamOptions<TRouter extends AnyRouter, TFrom, TTo extends string, TParamVariant extends ParamVariant> = IsRequired<TRouter, TParamVariant, TFrom, TTo> extends never ? MakeOptionalParams<TRouter, TParamVariant, TFrom, TTo> : MakeRequiredParams<TRouter, TParamVariant, TFrom, TTo>;
export type SearchParamOptions<TRouter extends AnyRouter, TFrom, TTo extends string> = ParamOptions<TRouter, TFrom, TTo, 'SEARCH'>;
export type PathParamOptions<TRouter extends AnyRouter, TFrom, TTo extends string> = ParamOptions<TRouter, TFrom, TTo, 'PATH'>;
export type ToPathOption<TRouter extends AnyRouter = AnyRouter, TFrom extends RoutePaths<TRouter['routeTree']> | string = string, TTo extends string = string> = CheckPath<TRouter, TTo, never, TFrom, TTo> | RelativeToPathAutoComplete<TRouter, NoInfer<TFrom> extends string ? NoInfer<TFrom> : '', NoInfer<TTo> & string>;
export interface ActiveOptions {
    exact?: boolean;
    includeHash?: boolean;
    includeSearch?: boolean;
}
export type LinkOptions<TRouter extends AnyRouter = RegisteredRouter, TFrom extends RoutePaths<TRouter['routeTree']> | string = string, TTo extends string = '', TMaskFrom extends RoutePaths<TRouter['routeTree']> | string = TFrom, TMaskTo extends string = ''> = NavigateOptions<TRouter, TFrom, TTo, TMaskFrom, TMaskTo> & {
    target?: HTMLAnchorElement['target'];
    activeOptions?: ActiveOptions;
    preload?: false | 'intent';
    preloadDelay?: number;
    disabled?: boolean;
};
export type CheckPath<TRouter extends AnyRouter, TPass, TFail, TFrom, TTo> = ResolveRoute<TRouter, TFrom, TTo> extends never ? TFail : TPass;
export type ResolveRelativePath<TFrom, TTo = '.'> = TFrom extends string ? TTo extends string ? TTo extends '.' ? TFrom : TTo extends `./` ? Join<[TFrom, '/']> : TTo extends `./${infer TRest}` ? ResolveRelativePath<TFrom, TRest> : TTo extends `/${infer TRest}` ? TTo : Split<TTo> extends ['..', ...infer ToRest] ? Split<TFrom> extends [...infer FromRest, infer FromTail] ? ToRest extends ['/'] ? Join<['/', ...FromRest, '/']> : ResolveRelativePath<Join<FromRest>, Join<ToRest>> : never : Split<TTo> extends ['.', ...infer ToRest] ? ToRest extends ['/'] ? Join<[TFrom, '/']> : ResolveRelativePath<TFrom, Join<ToRest>> : CleanPath<Join<['/', ...Split<TFrom>, ...Split<TTo>]>> : never : never;
export declare function useLinkProps<TRouter extends AnyRouter = RegisteredRouter, TFrom extends RoutePaths<TRouter['routeTree']> | string = string, TTo extends string = '', TMaskFrom extends RoutePaths<TRouter['routeTree']> | string = TFrom, TMaskTo extends string = ''>(options: UseLinkPropsOptions<TRouter, TFrom, TTo, TMaskFrom, TMaskTo>): React.AnchorHTMLAttributes<HTMLAnchorElement>;
export type UseLinkPropsOptions<TRouter extends AnyRouter = RegisteredRouter, TFrom extends RoutePaths<TRouter['routeTree']> | string = string, TTo extends string = '', TMaskFrom extends RoutePaths<TRouter['routeTree']> | string = TFrom, TMaskTo extends string = ''> = ActiveLinkOptions<TRouter, TFrom, TTo, TMaskFrom, TMaskTo> & React.AnchorHTMLAttributes<HTMLAnchorElement>;
export type ActiveLinkOptions<TRouter extends AnyRouter = RegisteredRouter, TFrom extends RoutePaths<TRouter['routeTree']> | string = string, TTo extends string = '', TMaskFrom extends RoutePaths<TRouter['routeTree']> | string = TFrom, TMaskTo extends string = ''> = LinkOptions<TRouter, TFrom, TTo, TMaskFrom, TMaskTo> & {
    activeProps?: React.AnchorHTMLAttributes<HTMLAnchorElement> | (() => React.AnchorHTMLAttributes<HTMLAnchorElement>);
    inactiveProps?: React.AnchorHTMLAttributes<HTMLAnchorElement> | (() => React.AnchorHTMLAttributes<HTMLAnchorElement>);
};
export type LinkProps<TRouter extends AnyRouter = RegisteredRouter, TFrom extends RoutePaths<TRouter['routeTree']> | string = string, TTo extends string = string, TMaskFrom extends RoutePaths<TRouter['routeTree']> | string = TFrom, TMaskTo extends string = ''> = ActiveLinkOptions<TRouter, TFrom, TTo, TMaskFrom, TMaskTo> & {
    children?: React.ReactNode | ((state: {
        isActive: boolean;
        isTransitioning: boolean;
    }) => React.ReactNode);
};
type LinkComponentProps<TComp> = React.PropsWithoutRef<TComp extends React.FC<infer TProps> | React.Component<infer TProps> ? TProps : TComp extends keyof JSX.IntrinsicElements ? Omit<React.HTMLProps<TComp>, 'children' | 'preload'> : never> & React.RefAttributes<TComp extends React.FC<{
    ref: infer TRef;
}> | React.Component<{
    ref: infer TRef;
}> ? TRef : TComp extends keyof JSX.IntrinsicElements ? React.ComponentRef<TComp> : never>;
export type LinkComponent<TComp> = <TRouter extends AnyRouter = RegisteredRouter, TFrom extends RoutePaths<TRouter['routeTree']> | string = string, TTo extends string = '', TMaskFrom extends RoutePaths<TRouter['routeTree']> | string = TFrom, TMaskTo extends string = ''>(props: LinkProps<TRouter, TFrom, TTo, TMaskFrom, TMaskTo> & LinkComponentProps<TComp>) => React.ReactElement;
export declare function createLink<const TComp>(Comp: TComp): LinkComponent<TComp>;
export declare const Link: LinkComponent<'a'>;
export {};
