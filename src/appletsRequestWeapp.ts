import appletsRequest, {
  AppletsRequest,
  createAppletsRequestInstance,
  getDefaults as getAppletsRequestDefaults,
} from "applets-request";
import weappAdapter from "./adapter/request";

appletsRequest.defaults.adapter = weappAdapter;

export default appletsRequest;

export { AppletsRequest as AppletsRequest };

export { createAppletsRequestInstance as createAppletsRequestInstance };

export function getDefaults(): IAppletsRequestConfig {
  const defaults = getAppletsRequestDefaults();
  defaults.adapter = weappAdapter;

  return defaults;
}
