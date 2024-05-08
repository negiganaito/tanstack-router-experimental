import type { AnyRoute } from './route.js';
import type { RouteById, RouteIds } from './routeInfo.js';
import type { RegisteredRouter } from './router.js';
import type { StrictOrFrom } from './utils.js';
export declare function useRouteContext<TRouteTree extends AnyRoute = RegisteredRouter['routeTree'], TFrom extends RouteIds<TRouteTree> = RouteIds<TRouteTree>, TRouteContext = RouteById<TRouteTree, TFrom>['types']['allContext'], TSelected = TRouteContext>(opts: StrictOrFrom<TFrom> & {
    select?: (search: TRouteContext) => TSelected;
}): TSelected;
