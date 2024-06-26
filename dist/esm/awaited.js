import { jsx } from "react/jsx-runtime";
import * as React from "react";
import { useRouter } from "./useRouter.js";
import { defaultSerializeError } from "./router.js";
import { isDehydratedDeferred } from "./defer.js";
import { isServerSideError, defaultDeserializeError } from "./Matches.js";
function useAwaited({ promise }) {
  var _a, _b;
  const router = useRouter();
  const state = promise.__deferredState;
  if (isDehydratedDeferred(promise) && state.status === "pending") {
    const streamedData = window[`__TSR__DEFERRED__${state.uid}`];
    if (streamedData) {
      Object.assign(state, router.options.transformer.parse(streamedData));
    } else {
      let token = router.registeredDeferredsIds.get(state.uid);
      if (!token) {
        token = {};
        router.registeredDeferredsIds.set(state.uid, token);
        router.registeredDeferreds.set(token, state);
        Object.assign(state, {
          resolve: () => {
            var _a2;
            (_a2 = state.__resolvePromise) == null ? void 0 : _a2.call(state);
          },
          promise: new Promise((r) => {
            state.__resolvePromise = r;
          }),
          __resolvePromise: () => {
          }
        });
      }
    }
  }
  if (state.status === "pending") {
    throw isDehydratedDeferred(promise) ? state.promise : promise;
  }
  if (!isDehydratedDeferred(promise)) {
    router.injectHtml(
      `<script class='tsr_deferred_data'>window.__TSR__DEFERRED__${state.uid} = ${JSON.stringify(router.options.transformer.stringify(state))}
  if (window.__TSR__ROUTER__) {
    let deferred = window.__TSR__ROUTER__.getDeferred('${state.uid}');
    if (deferred) deferred.resolve(window.__TSR__DEFERRED__${state.uid});
  }
  document.querySelectorAll('.tsr_deferred_data').forEach((el) => el.parentElement.removeChild(el));
<\/script>`
    );
  }
  if (state.status === "error") {
    if (typeof document !== "undefined") {
      if (isServerSideError(state.error)) {
        throw (((_a = router.options.errorSerializer) == null ? void 0 : _a.deserialize) ?? defaultDeserializeError)(state.error.data);
      } else {
        console.warn(
          false,
          "Encountered a server-side error that doesn't fit the expected shape"
        );
        throw state.error;
      }
    } else {
      throw {
        data: (((_b = router.options.errorSerializer) == null ? void 0 : _b.serialize) ?? defaultSerializeError)(state.error),
        __isServerError: true
      };
    }
  }
  return [promise.__deferredState.data];
}
function Await(props) {
  const inner = /* @__PURE__ */ jsx(AwaitInner, { ...props });
  if (props.fallback) {
    return /* @__PURE__ */ jsx(React.Suspense, { fallback: props.fallback, children: inner });
  }
  return inner;
}
function AwaitInner(props) {
  const awaited = useAwaited(props);
  return props.children(...awaited);
}
export {
  Await,
  useAwaited
};
//# sourceMappingURL=awaited.js.map
