import type { AnyRoute } from './route.js';
import type { AllParams, RouteById, RouteIds } from './routeInfo.js';
import type { RegisteredRouter } from './router.js';
import type { Expand } from './utils.js';
import type { StrictOrFrom } from './utils.js';
export declare function useParams<TRouteTree extends AnyRoute = RegisteredRouter['routeTree'], TFrom extends RouteIds<TRouteTree> = RouteIds<TRouteTree>, TReturnIntersection extends boolean = false, TParams = TReturnIntersection extends false ? RouteById<TRouteTree, TFrom>['types']['allParams'] : Expand<Partial<AllParams<TRouteTree>>>, TSelected = TParams>(opts: StrictOrFrom<TFrom, TReturnIntersection> & {
    select?: (params: TParams) => TSelected;
}): TSelected;
