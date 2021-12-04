'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
const defaultResult = {
  data: null,
  loading: false,
  error: null
};
const defaultTransformFunction = (res) => res == null ? void 0 : res.data;
const useRequest = (options) => {
  const { defaultData, requestFunction, payload, transformFunction, axiosCancelTokenSource } = options;
  const [result, dispatch] = react.useReducer((result2, action) => {
    switch (action.type) {
      case "FETCH" /* FETCH */:
        return __spreadProps(__spreadValues({}, result2), { loading: true, error: null });
      case "SUCCESS" /* SUCCESS */:
        return __spreadProps(__spreadValues({}, result2), { data: action.data, loading: false, error: null });
      case "ERROR" /* ERROR */:
        return __spreadProps(__spreadValues({}, result2), { loading: false, error: action.error });
      default:
        return result2;
    }
  }, Object.assign({}, defaultResult, { data: defaultData }));
  const requestFunctionCallback = react.useCallback(() => {
    return requestFunction(payload);
  }, [payload]);
  const fetchDataCallback = react.useCallback(async () => {
    try {
      const res = await requestFunctionCallback();
      let data = null;
      if (transformFunction) {
        data = transformFunction(res);
      } else {
        data = defaultTransformFunction(res);
      }
      dispatch({ type: "SUCCESS" /* SUCCESS */, data });
      return data;
    } catch (error) {
      dispatch({ type: "ERROR" /* ERROR */, error });
      return null;
    }
  }, [requestFunctionCallback]);
  react.useEffect(() => {
    dispatch({ type: "FETCH" /* FETCH */ });
    fetchDataCallback();
    return () => {
      if (axiosCancelTokenSource) {
        axiosCancelTokenSource.cancel("[use-request] Cancel Request");
      }
    };
  }, [fetchDataCallback]);
  const refetch = react.useCallback(() => {
    return fetchDataCallback();
  }, [fetchDataCallback]);
  const reset = react.useCallback(() => {
    dispatch({ type: "RESET" /* RESET */ });
  }, [dispatch]);
  return __spreadProps(__spreadValues({}, result), { refetch, reset });
};

var index = {
  useRequest
};

exports["default"] = index;
exports.useRequest = useRequest;
