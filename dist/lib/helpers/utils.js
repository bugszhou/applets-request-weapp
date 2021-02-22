"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forEach = exports.isString = exports.merge = exports.isUndefined = exports.assign = exports.isPlainObject = void 0;
function getDataType(val) {
    return Object.prototype.toString.call(val);
}
function isPlainObject(val) {
    if (val === null || getDataType(val) !== "[object Object]") {
        return false;
    }
    var prototype = Object.getPrototypeOf(val);
    return prototype === null || prototype === Object.prototype;
}
exports.isPlainObject = isPlainObject;
function assign(to, from) {
    if (isString(from)) {
        return to;
    }
    for (var key in from) {
        to[key] = from[key];
    }
    return to;
}
exports.assign = assign;
function isUndefined(val) {
    return typeof val === "undefined";
}
exports.isUndefined = isUndefined;
function merge() {
    var objs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        objs[_i] = arguments[_i];
    }
    if (objs.length === 0) {
        return Object.create(null);
    }
    var result = Object.create(null);
    function assignValue(val, key) {
        if (isPlainObject(result[key]) && isPlainObject(val)) {
            result[key] = merge(result[key], val);
        }
        else if (isPlainObject(val)) {
            result[key] = merge({}, val);
        }
        else if (Array.isArray(val)) {
            result[key] = merge(val);
        }
        else {
            result[key] = val;
        }
    }
    if (Array.isArray(objs[0])) {
        result = [];
    }
    else {
        result = Object.create(null);
    }
    objs.forEach(function (obj) {
        forEach(obj, assignValue);
    });
    return result;
}
exports.merge = merge;
function isString(val) {
    return typeof val === "string";
}
exports.isString = isString;
/**
 * 遍历
 * @param {Object|Array} obj
 * @param fn
 */
function forEach(obj, fn) {
    if (typeof obj === "undefined" || obj === null) {
        return;
    }
    var arr = obj;
    // 如果obj是非object类型，例如：number，string等
    if (typeof obj !== "object") {
        arr = [obj];
    }
    if (Array.isArray(arr)) {
        arr.forEach(function (item, i) {
            fn.call(null, item, i, obj);
        });
        return;
    }
    Object.keys(arr).forEach(function (key) {
        fn.call(null, arr[key], key, arr);
    });
}
exports.forEach = forEach;
//# sourceMappingURL=utils.js.map