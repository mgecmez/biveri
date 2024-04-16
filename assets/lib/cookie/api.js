import {
  createNode,
  setAttribute,
  appendChild,
  addClass,
  removeClass,
  debug,
  getCurrentCategoriesState,
  elContains,
  setAcceptedCategories,
  isString,
  retrieveRejectedServices,
  isArray,
  isObject,
  focus,
  getActiveElement,
  resolveEnabledCategories,
  resolveEnabledServices,
  updateModalToggles,
  toggleDisableInteraction,
  fireEvent,
  getKeys,
  focusAfterTransition,
  deepCopy
} from './general.js';

import {
  globalObj,
  GlobalState
} from './global.js';

import {
  setCookie,
  eraseCookiesHelper,
  getSingleCookie,
  getAllCookies,
  getPluginCookie
} from './cookies.js';

import {
  TOGGLE_CONSENT_MODAL_CLASS,
  TOGGLE_DISABLE_INTERACTION_CLASS,
  TOGGLE_PREFERENCES_MODAL_CLASS,
  OPT_OUT_MODE,
  CONSENT_MODAL_NAME,
  ARIA_HIDDEN,
  PREFERENCES_MODAL_NAME
} from './constants.js';

import { setConfig } from './config-init.js';

import { localStorageManager } from './localstorage.js';

/**
 * Show cookie consent modal
 * @param {boolean} [createModal] create modal if it doesn't exist
 */
export const show = (createModal) => {
  const { _dom, _state } = globalObj;

  if (_state._consentModalVisible)
      return;

  if (!_state._consentModalExists) {
      if (createModal) {
          createConsentModal(miniAPI, createMainContainer);
      } else {
          return;
      }
  }

  _state._consentModalVisible = true;
  _state._lastFocusedElemBeforeModal = getActiveElement();

  if (_state._disablePageInteraction)
      toggleDisableInteraction(true);

//   focusAfterTransition(_dom._cm, 1);

  addClass(_dom._htmlDom, TOGGLE_CONSENT_MODAL_CLASS);
  setAttribute(_dom._cm, ARIA_HIDDEN, 'false');

  /**
   * Set focus to consentModal
   */
  setTimeout(() => {
      focus(globalObj._dom._cmDivTabindex);
  }, 100);

  debug('CookieConsent [TOGGLE]: show consentModal');

  fireEvent(globalObj._customEvents._onModalShow, CONSENT_MODAL_NAME);
};

/**
 * Returns true if consent is valid
 * @returns {boolean}
 */
export const validConsent = () => !globalObj._state._invalidConsent;

const retrieveState = () => {
    const state = globalObj._state;
    const config = globalObj._config;

    const cookieValue = getPluginCookie();

    const {
        categories,
        services,
        consentId,
        consentTimestamp,
        lastConsentTimestamp,
        data,
        revision
    } = cookieValue;

    const validCategories = isArray(categories);

    state._savedCookieContent = cookieValue;
    state._consentId = consentId;

    // If "_consentId" is present => assume that consent was previously given
    const validConsentId = !!consentId && isString(consentId);

    // Retrieve "_consentTimestamp"
    state._consentTimestamp = consentTimestamp;
    state._consentTimestamp && (state._consentTimestamp = new Date(consentTimestamp));

    // Retrieve "_lastConsentTimestamp"
    state._lastConsentTimestamp = lastConsentTimestamp;
    state._lastConsentTimestamp && (state._lastConsentTimestamp = new Date(lastConsentTimestamp));

    // Retrieve "data"
    state._cookieData = typeof data !== 'undefined'
        ? data
        : null;

    // If revision is enabled and current value !== saved value inside the cookie => revision is not valid
    if (state._revisionEnabled && validConsentId && revision !== config.revision)
        state._validRevision = false;

    state._invalidConsent = !validConsentId
        || !state._validRevision
        || !state._consentTimestamp
        || !state._lastConsentTimestamp
        || !validCategories;

    /**
     * If localStorage is enabled, also check the stored `expirationTime`
     */
    if (config.cookie.useLocalStorage && !state._invalidConsent) {
        state._invalidConsent = new Date().getTime() > (cookieValue.expirationTime || 0);
        state._invalidConsent && (localStorageManager._removeItem(config.cookie.name));
    }

    debug('CookieConsent [STATUS] valid consent:', !state._invalidConsent);
    // retrieveEnabledCategoriesAndServices();

    /**
     * Retrieve last accepted categories from cookie
     * and calculate acceptType
     */
    // if (!state._invalidConsent) {
    //     state._enabledServices = {...state._acceptedServices};

    //     state._acceptedServices = {
    //         ...state._acceptedServices,
    //         ...services
    //     };

    //     setAcceptedCategories([
    //         ...state._readOnlyCategories,
    //         ...categories
    //     ]);
    // } else {
    //     if (config.mode === OPT_OUT_MODE) {
    //         state._acceptedCategories = [
    //             ...state._defaultEnabledCategories
    //         ];
    //     }
    // }
};

export const run = (userConfig) => {
  const {
      _state,
      _config,
      _customEvents
  } = globalObj;

  const win = window;

  if (!win._ccRun) {
      win._ccRun = true;

      setConfig(userConfig);

      if (_state._botAgentDetected)
          return;

      retrieveState(userConfig);

      const consentIsValid = validConsent();

      //{{START: GUI}}
      // const translationLoaded = await loadTranslationData();

      // if (!translationLoaded)
      //     return false;

      // generateHtml(miniAPI);

      if (_config.autoShow && !consentIsValid)
          show(true);
      //{{END: GUI}}

      if (consentIsValid) {
          // manageExistingScripts();
          return fireEvent(_customEvents._onConsent);
      }

      // if (_config.mode === OPT_OUT_MODE)
      //     manageExistingScripts(_state._defaultEnabledCategories);
  }
};