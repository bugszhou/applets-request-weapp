/*
 * @Author: youzhao.zhou
 * @Date: 2021-02-04 16:09:10
 * @Last Modified by: youzhao.zhou
 * @Last Modified time: 2021-02-10 12:10:14
 * @Description request adapter
 *
 * 1. 执行成功需要返回IAppletsRequestResponse，执行失败即为reject返回IAppletsRequestAdapterError
 * 2. 如果取消返回IAppletsRequest.ICanceler
 */

import { isUndefined, merge } from "../helpers/utils";
import getRequestOptions from "./config";

interface IResolveOptions {
  headers: Record<string, any>;
  status: number;
  data: any;
  response?: any;
}

export default function request(
  config: IAppletsRequest.IHttpConfig
): IAppletsRequestPromise {
  function requestSuccess(res: any): IResolveOptions {
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
  function failType(
    err: any,
    timeout: number | undefined
  ): { msg: string; type: "NETWORK_ERROR" | "TIMEOUT" } {
    if (
      err &&
      (err.errMsg || "").toString().toLowerCase().includes("timeout")
    ) {
      return {
        msg: `Timeout of ${timeout || ""} ms exceeded`,
        type: "TIMEOUT",
      };
    }
    return {
      msg: `Network Error`,
      type: "NETWORK_ERROR",
    };
  }

  /**
   * JSON parse data
   * @param data
   */
  function dataParser(data: any): any {
    if (typeof data !== "string") {
      return data;
    }
    try {
      return JSON.parse(data);
    } catch (e) {
      return data;
    }
  }

  function getReqConfig(
    originalConfig: IAppletsRequestWx.RequestOption
  ): IAppletsRequest.IHttpConfig {
    const tmpConfig: any = merge({}, originalConfig);
    tmpConfig.headers = originalConfig.header;
    delete tmpConfig.header;
    delete tmpConfig.Adapter;
    return tmpConfig;
  }

  return new Promise((resolve, reject) => {
    const Adapter = config.Adapter;
    const reqConfig = getRequestOptions(config);
    const adapterConfig = getReqConfig(reqConfig);

    if (!Adapter) {
      throw new TypeError("Adapter is undefined or null");
    }

    const adapter = new Adapter(adapterConfig);

    let request = wx.request({
      ...reqConfig,
      success(res: any) {
        adapter.resolve(requestSuccess(res), resolve);
      },
      fail(err: any) {
        const errData = failType(err, reqConfig.timeout);
        const rejectData = {
          errMsg: errData.msg,
          status: errData.type,
          extra: err,
        };

        adapter.reject(rejectData, reject);
      },
      complete() {
        request = null;
      },
    });

    adapter.subscribeCancelEvent((reason) => {
      reject(reason);
      request.abort();
      request = null;
    });

    if (typeof config.getRequestTask === "function") {
      config.getRequestTask(request);
    }
  });
}
