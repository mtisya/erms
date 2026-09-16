import { AsyncLocalStorage } from "async_hooks";

export interface RequestContext {
    userId?: string | null;
    ipAddress?: string;
    userAgent?: string;
}

export const requestContext =
    new AsyncLocalStorage<RequestContext>();

export function runWithRequestContext(
    context: RequestContext,
    callback: () => void
): void {
    requestContext.run(context, callback);
}

export function getRequestContext():
    RequestContext | undefined {
    return requestContext.getStore();
}