import "applets-request";

declare const AppletsRequest: AppletsRequest;
declare const appletsRequest: AppletsRequestInstance;

export default appletsRequest;

export { AppletsRequest as AppletsRequest };

export function createAppletsRequestInstance(
  config?: IAppletsRequestConfig
): AppletsRequestInstance;

export const defaults: IAppletsRequestConfig;