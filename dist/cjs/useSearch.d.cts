import type { AnyRoute, RootSearchSchema } from './route.cjs';
import type { FullSearchSchema, RouteById, RouteIds } from './routeInfo.cjs';
import type { RegisteredRouter } from './router.cjs';
import type { StrictOrFrom } from './utils.cjs';
export declare function useSearch<TRouteTree extends AnyRoute = RegisteredRouter['routeTree'], TFrom extends RouteIds<TRouteTree> = RouteIds<TRouteTree>, TReturnIntersection extends boolean = false, TSearch = TReturnIntersection extends false ? Exclude<RouteById<TRouteTree, TFrom>['types']['fullSearchSchema'], RootSearchSchema> : Partial<Omit<FullSearchSchema<TRouteTree>, keyof RootSearchSchema>>, TSelected = TSearch>(opts: StrictOrFrom<TFrom, TReturnIntersection> & {
    select?: (search: TSearch) => TSelected;
}): TSelected;
