"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCookie = void 0;
var utils_1 = require("../helpers/utils");
var STORAGE_COOKIES_KEY = "miniRequest:cookies";
function storageCookies(cookies) {
    if (!cookies || !utils_1.isPlainObject(cookies)) {
        return;
    }
    try {
        var cacheCookies = wx.getStorageSync(STORAGE_COOKIES_KEY);
        wx.setStorageSync(STORAGE_COOKIES_KEY, utils_1.merge(cacheCookies, cookies));
    }
    catch (e) {
        console.error(e);
    }
}
exports.default = storageCookies;
function getCookie(cookieName) {
    try {
        var cacheCookies = wx.getStorageSync(STORAGE_COOKIES_KEY);
        if (!cacheCookies || !cookieName || !utils_1.isString(cacheCookies[cookieName])) {
            return "";
        }
        return cacheCookies[cookieName];
    }
    catch (e) {
        console.error(e);
        return "";
    }
}
exports.getCookie = getCookie;
//# sourceMappingURL=storageCookies.js.map