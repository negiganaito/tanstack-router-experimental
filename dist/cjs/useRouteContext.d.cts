import type { AnyRoute } from './route.cjs';
import type { RouteById, RouteIds } from './routeInfo.cjs';
import type { RegisteredRouter } from './router.cjs';
import type { StrictOrFrom } from './utils.cjs';
export declare function useRouteContext<TRouteTree extends AnyRoute = RegisteredRouter['routeTree'], TFrom extends RouteIds<TRouteTree> = RouteIds<TRouteTree>, TRouteContext = RouteById<TRouteTree, TFrom>['types']['allContext'], TSelected = TRouteContext>(opts: StrictOrFrom<TFrom> & {
    select?: (search: TRouteContext) => TSelected;
}): TSelected;
