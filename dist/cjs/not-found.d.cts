import * as React from 'react';
import type { RegisteredRouter } from './router.cjs';
import type { RouteIds } from './routeInfo.cjs';
export type NotFoundError = {
    /**
      @deprecated
      Use `routeId: rootRouteId` instead
    */
    global?: boolean;
    /**
      @private
      Do not use this. It's used internally to indicate a path matching error
    */
    _global?: boolean;
    data?: any;
    throw?: boolean;
    routeId?: RouteIds<RegisteredRouter['routeTree']>;
    headers?: HeadersInit;
};
export declare function notFound(options?: NotFoundError): NotFoundError;
export declare function isNotFound(obj: any): obj is NotFoundError;
export declare function CatchNotFound(props: {
    fallback?: (error: NotFoundError) => React.ReactElement;
    onCatch?: (error: any) => void;
    children: React.ReactNode;
}): React.JSX.Element;
export declare function DefaultGlobalNotFound(): React.JSX.Element;
