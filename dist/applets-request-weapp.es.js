import appletsRequest, { getDefaults as getDefaults$1 } from 'applets-request';
export { AppletsRequest, createAppletsRequestInstance, default } from 'applets-request';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

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
function isUndefined(val) {
    return typeof val === "undefined";
}
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

function getRequestOptions(config) {
    var reqConfig = {
        url: config.url || "",
        method: config.method,
        data: config.data,
        header: config.headers,
        dataType: "json",
        timeout: config.timeout,
    };
    var dataType = config.dataType || "json";
    reqConfig.dataType = dataType;
    if (config.responseType && config.responseType !== "json") {
        reqConfig.dataType = "其他";
    }
    return reqConfig;
}

/*
 * @Author: youzhao.zhou
 * @Date: 2021-02-04 16:09:10
 * @Last Modified by: youzhao.zhou
 * @Last Modified time: 2021-02-22 17:16:17
 * @Description request adapter
 *
 * 1. 执行成功需要返回IAppletsRequestResponse，执行失败即为reject返回IAppletsRequestAdapterError
 * 2. 如果取消返回IAppletsRequest.ICanceler
 */
function request(config) {
    function requestSuccess(res) {
        if (isUndefined(res) || res === null) {
            return {
                headers: {},
                status: 200,
                data: {},
                response: res,
            };
        }
        return {
            headers: res.header,
            status: res.statusCode,
            data: dataParser(res.data),
            response: res,
        };
    }
    /**
     * 获取错误类型
     * @param err
     * @param timeout
     * @returns NETWORK_ERROR | TIMEOUT
     * @example {
     *    msg: `Timeout of 2000 ms exceeded`,
     *    type: "TIMEOUT",
     *  }
     */
    function failType(err, timeout) {
        if (err &&
            (err.errMsg || "").toString().toLowerCase().includes("timeout")) {
            return {
                msg: "Timeout of " + (timeout || "") + " ms exceeded",
                type: "TIMEOUT",
            };
        }
        return {
            msg: "Network Error",
            type: "NETWORK_ERROR",
        };
    }
    /**
     * JSON parse data
     * @param data
     */
    function dataParser(data) {
        if (typeof data !== "string") {
            return data;
        }
        try {
            return JSON.parse(data);
        }
        catch (e) {
            return data;
        }
    }
    function getReqConfig(originalConfig) {
        var tmpConfig = merge({}, originalConfig);
        tmpConfig.headers = originalConfig.header;
        delete tmpConfig.header;
        delete tmpConfig.Adapter;
        return tmpConfig;
    }
    return new Promise(function (resolve, reject) {
        var Adapter = config.Adapter;
        var reqConfig = getRequestOptions(config);
        var adapterConfig = getReqConfig(config);
        if (!Adapter) {
            throw new TypeError("Adapter is undefined or null");
        }
        var adapter = new Adapter(adapterConfig);
        var requestor = wx.request(__assign(__assign({}, reqConfig), { success: function (res) {
                adapter.resolve(requestSuccess(res), resolve);
            },
            fail: function (err) {
                var errData = failType(err, reqConfig.timeout);
                var rejectData = {
                    errMsg: errData.msg,
                    status: errData.type,
                    extra: err,
                };
                adapter.reject(rejectData, reject);
            },
            complete: function () {
                requestor = null;
            } }));
        adapter.subscribeCancelEvent(function (reason) {
            reject(reason);
            requestor.abort();
            requestor = null;
        });
        if (typeof config.getRequestTask === "function") {
            config.getRequestTask(request);
        }
    });
}

appletsRequest.defaults.adapter = request;
function getDefaults() {
    var defaults = getDefaults$1();
    defaults.adapter = request;
    return defaults;
}

export { getDefaults };
//# sourceMappingURL=applets-request-weapp.es.js.map
