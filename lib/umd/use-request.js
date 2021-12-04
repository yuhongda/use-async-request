(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["use-request"] = {}));
})(this, (function (exports) { 'use strict';

  const defaultValue = {
    data: null,
    loading: false,
    error: null
  };
  const useRequest = (options) => {
    return defaultValue;
  };

  var index = {
    useRequest
  };

  exports["default"] = index;
  exports.useRequest = useRequest;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
