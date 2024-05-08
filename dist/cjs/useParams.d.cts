import type { AnyRoute } from './route.cjs';
import type { AllParams, RouteById, RouteIds } from './routeInfo.cjs';
import type { RegisteredRouter } from './router.cjs';
import type { Expand } from './utils.cjs';
import type { StrictOrFrom } from './utils.cjs';
export declare function useParams<TRouteTree extends AnyRoute = RegisteredRouter['routeTree'], TFrom extends RouteIds<TRouteTree> = RouteIds<TRouteTree>, TReturnIntersection extends boolean = false, TParams = TReturnIntersection extends false ? RouteById<TRouteTree, TFrom>['types']['allParams'] : Expand<Partial<AllParams<TRouteTree>>>, TSelected = TParams>(opts: StrictOrFrom<TFrom, TReturnIntersection> & {
    select?: (params: TParams) => TSelected;
}): TSelected;
