"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAppletsRequestInstance = exports.AppletsRequest = exports.defaults = void 0;
var applets_request_1 = require("applets-request");
Object.defineProperty(exports, "AppletsRequest", { enumerable: true, get: function () { return applets_request_1.AppletsRequest; } });
Object.defineProperty(exports, "createAppletsRequestInstance", { enumerable: true, get: function () { return applets_request_1.createAppletsRequestInstance; } });
var request_1 = require("./adapter/request");
applets_request_1.default.defaults.adapter = request_1.default;
exports.default = applets_request_1.default;
exports.defaults = applets_request_1.default.defaults;
//# sourceMappingURL=appletsRequestWeapp.js.map