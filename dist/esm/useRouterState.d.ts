import type { AnyRouter, RegisteredRouter, RouterState } from './router.js';
export declare function useRouterState<TRouter extends AnyRouter = RegisteredRouter, TSelected = RouterState<TRouter['routeTree']>>(opts?: {
    router?: TRouter;
    select: (state: RouterState<RegisteredRouter['routeTree']>) => TSelected;
}): TSelected;
