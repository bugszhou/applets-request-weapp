import appletsRequest, { AppletsRequest } from "applets-request";
import weappAdapter from "./adapter/request";

appletsRequest.defaults.adapter = weappAdapter;

export default appletsRequest;

export const defaults = appletsRequest.defaults;

export { AppletsRequest as AppletsRequest };
