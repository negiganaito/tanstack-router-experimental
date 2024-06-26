"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const Matches = require("./Matches.cjs");
function useSearch(opts) {
  return Matches.useMatch({
    ...opts,
    select: (match) => {
      return opts.select ? opts.select(match.search) : match.search;
    }
  });
}
exports.useSearch = useSearch;
//# sourceMappingURL=useSearch.cjs.map
