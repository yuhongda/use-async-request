"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useRequest = exports.UseRequestActionType = void 0;

var _react = require("react");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var UseRequestActionType;
exports.UseRequestActionType = UseRequestActionType;

(function (UseRequestActionType) {
  UseRequestActionType["FETCH"] = "FETCH";
  UseRequestActionType["SUCCESS"] = "SUCCESS";
  UseRequestActionType["ERROR"] = "ERROR";
  UseRequestActionType["RESET"] = "RESET";
})(UseRequestActionType || (exports.UseRequestActionType = UseRequestActionType = {}));

var defaultResult = {
  data: null,
  loading: false,
  error: null
};

var defaultTransformFunction = function defaultTransformFunction(res) {
  return res === null || res === void 0 ? void 0 : res.data;
};

var useRequest = function useRequest(options) {
  var defaultData = options.defaultData,
      requestFunction = options.requestFunction,
      payload = options.payload,
      transformFunction = options.transformFunction,
      axiosCancelTokenSource = options.axiosCancelTokenSource;

  var _useReducer = (0, _react.useReducer)(function (result, action) {
    switch (action.type) {
      case UseRequestActionType.FETCH:
        return _objectSpread(_objectSpread({}, result), {}, {
          loading: true,
          error: null
        });

      case UseRequestActionType.SUCCESS:
        return _objectSpread(_objectSpread({}, result), {}, {
          data: action.data,
          loading: false,
          error: null
        });

      case UseRequestActionType.ERROR:
        return _objectSpread(_objectSpread({}, result), {}, {
          loading: false,
          error: action.error
        });

      default:
        return result;
    }
  }, Object.assign({}, defaultResult, {
    data: defaultData
  })),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      result = _useReducer2[0],
      dispatch = _useReducer2[1];

  var requestFunctionCallback = (0, _react.useCallback)(function () {
    return requestFunction(payload);
  }, [payload]);
  var fetchDataCallback = (0, _react.useCallback)( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var _res, data;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return requestFunctionCallback();

          case 3:
            _res = _context.sent;
            data = null;

            if (transformFunction) {
              data = transformFunction(_res);
            } else {
              data = defaultTransformFunction(_res);
            }

            dispatch({
              type: UseRequestActionType.SUCCESS,
              data: data
            });
            return _context.abrupt("return", data);

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](0);
            dispatch({
              type: UseRequestActionType.ERROR,
              error: _context.t0
            });
            return _context.abrupt("return", null);

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 10]]);
  })), [requestFunctionCallback]);
  (0, _react.useEffect)(function () {
    dispatch({
      type: UseRequestActionType.FETCH
    });
    fetchDataCallback();
    return function () {
      if (axiosCancelTokenSource) {
        axiosCancelTokenSource.cancel('[use-request] Cancel Request');
      }
    };
  }, [fetchDataCallback]);
  var refetch = (0, _react.useCallback)(function () {
    return fetchDataCallback();
  }, [fetchDataCallback]);
  var reset = (0, _react.useCallback)(function () {
    dispatch({
      type: UseRequestActionType.RESET
    });
  }, [dispatch]);
  return _objectSpread(_objectSpread({}, result), {}, {
    refetch: refetch,
    reset: reset
  });
};

exports.useRequest = useRequest;