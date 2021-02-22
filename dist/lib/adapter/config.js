"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.default = getRequestOptions;
//# sourceMappingURL=config.js.map