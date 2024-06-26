"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const Matches = require("./Matches.cjs");
function useRouteContext(opts) {
  return Matches.useMatch({
    ...opts,
    select: (match) => opts.select ? opts.select(match.context) : match.context
  });
}
exports.useRouteContext = useRouteContext;
//# sourceMappingURL=useRouteContext.cjs.map
