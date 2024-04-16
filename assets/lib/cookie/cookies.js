import { globalObj } from "./global.js";
import {
  debug,
  getRemainingExpirationTimeMS,
  getExpiresAfterDaysValue,
  elContains,
  safeRun,
} from "./general.js";
import { localStorageManager } from "./localstorage.js";

/**
 * Set plugin's cookie
 * @param {boolean} [useRemainingExpirationTime]
 */
export const setCookie = (useRemainingExpirationTime) => {
  const { hostname, protocol } = location;
  const { name, path, domain, sameSite, useLocalStorage } =
    globalObj._config.cookie;

  const expiresAfterMs = useRemainingExpirationTime
    ? getRemainingExpirationTimeMS()
    : getExpiresAfterDaysValue() * 86400000;

  /**
   * Expiration date
   */
  const date = new Date();
  date.setTime(date.getTime() + expiresAfterMs);

  /**
   * Store the expiration date in the cookie (in case localstorage is used)
   */

  globalObj._state._savedCookieContent.expirationTime = date.getTime();

  const value = JSON.stringify(globalObj._state._savedCookieContent);

  /**
   * Encode value (RFC compliant)
   */
  const cookieValue = encodeURIComponent(value);

  let cookieStr =
    name +
    "=" +
    cookieValue +
    (expiresAfterMs !== 0 ? "; expires=" + date.toUTCString() : "") +
    "; Path=" +
    path +
    "; SameSite=" +
    sameSite;

  /**
   * Set "domain" only if hostname contains a dot (e.g domain.com)
   * to ensure that cookie works with 'localhost'
   */
  if (elContains(hostname, ".")) cookieStr += "; Domain=" + domain;

  if (protocol === "https:") cookieStr += "; Secure";

  useLocalStorage
    ? localStorageManager._setItem(name, value)
    : (document.cookie = cookieStr);

  debug(
    "CookieConsent [SET_COOKIE]: " + name + ":",
    globalObj._state._savedCookieContent
  );
};

/**
 * Parse cookie value using JSON.parse
 * @param {string} value
 */
export const parseCookie = (value, skipDecode) => {
  /**
   * @type {import('../../types').CookieValue}
   */
  let parsedValue;

  parsedValue =
    safeRun(
      () => JSON.parse(skipDecode ? value : decodeURIComponent(value)),
      true
    ) || {};

  return parsedValue;
};

/**
 * Delete cookie by name & path
 * @param {string[]} cookies Array of cookie names
 * @param {string} [customPath]
 * @param {string} [customDomain]
 */
export const eraseCookiesHelper = (cookies, customPath, customDomain) => {
  if (cookies.length === 0) return;

  const domain = customDomain || globalObj._config.cookie.domain;
  const path = customPath || globalObj._config.cookie.path;
  const isWwwSubdomain = domain.slice(0, 4) === "www.";
  const mainDomain = isWwwSubdomain && domain.substring(4);

  /**
   * Helper function to erase cookie
   * @param {string} cookie
   * @param {string} [domain]
   */
  const erase = (cookie, domain) => {
    document.cookie =
      cookie +
      "=" +
      "; path=" +
      path +
      (domain ? "; domain=." + domain : "") +
      "; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  };

  for (const cookieName of cookies) {
    /**
     * 2 attempts to erase the cookie:
     * - without domain
     * - with domain
     */
    erase(cookieName);
    erase(cookieName, domain);

    /**
     * If domain starts with 'www.',
     * also erase the cookie for the
     * main domain (without www)
     */
    if (isWwwSubdomain) erase(cookieName, mainDomain);

    debug(
      'CookieConsent [AUTOCLEAR]: deleting cookie: "' +
        cookieName +
        '" path: "' +
        path +
        '" domain:',
      domain
    );
  }
};

/**
 * Get plugin cookie
 * @param {string} [customName]
 */
export const getPluginCookie = (customName) => {
  const name = customName || globalObj._config.cookie.name;
  const useLocalStorage = globalObj._config.cookie.useLocalStorage;
  const valueStr = useLocalStorage
      ? localStorageManager._getItem(name)
      : getSingleCookie(name, true);
  return parseCookie(valueStr, useLocalStorage);
};

/**
 * Returns the cookie name/value, if it exists
 * @param {string} name
 * @param {boolean} getValue
 * @returns {string}
 */
export const getSingleCookie = (name, getValue) => {
  const found = document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)");

  return found ? (getValue ? found.pop() : name) : "";
};

/**
 * Returns array with all the cookie names
 * @param {RegExp} regex
 * @returns {string[]}
 */
export const getAllCookies = (regex) => {
  const allCookies = document.cookie.split(/;\s*/);

  /**
   * @type {string[]}
   */
  const cookieNames = [];

  /**
   * Save only the cookie names
   */
  for (const cookie of allCookies) {
    let name = cookie.split("=")[0];

    if (regex) {
      safeRun(() => {
        regex.test(name) && cookieNames.push(name);
      });
    } else {
      cookieNames.push(name);
    }
  }

  return cookieNames;
};
