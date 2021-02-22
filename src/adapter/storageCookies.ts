import { isPlainObject, isString, merge } from "../../helpers/utils";

const STORAGE_COOKIES_KEY = "miniRequest:cookies";

export default function storageCookies(
  cookies: Record<string, string> | undefined
): void {
  if (!cookies || !isPlainObject(cookies)) {
    return;
  }
  try {
    const cacheCookies = wx.getStorageSync(STORAGE_COOKIES_KEY);
    wx.setStorageSync(STORAGE_COOKIES_KEY, merge(cacheCookies, cookies));
  } catch (e) {
    console.error(e);
  }
}

export function getCookie(cookieName: string | undefined): string {
  try {
    const cacheCookies = wx.getStorageSync(STORAGE_COOKIES_KEY);
    if (!cacheCookies || !cookieName || !isString(cacheCookies[cookieName])) {
      return "";
    }

    return cacheCookies[cookieName];
  } catch (e) {
    console.error(e);
    return "";
  }
}
