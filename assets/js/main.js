// import * as CookieConsent from "../lib/cookie/index.js";

// let api;

$(document).ready(async function () {
  cookieSettins();
  // api = CookieConsent;

  menuHover();
});

function menuHover() {
  $(".menu-item-base").hover(
    function () {
      $(this).find(".header-dropdown").addClass("show");
      $(".hero-header-section").addClass("active");
    },
    function () {
      $(this).find(".header-dropdown").removeClass("show");
      $(".hero-header-section").removeClass("active");
    }
  );
}

function cookieSettins() {
  var cookie = localStorage.getItem("biveri-cookie");
  if (!cookie) {
    $(".cookie-overlay").show();
    $(".cookie").addClass("active");
  } else {
    $(".cookie-overlay").hide();
    $(".cookie").removeClass("active");
  }
  // console.log(api);
  // api.run(config);
}

function acceptCookie() {
  localStorage.setItem(
    "biveri-cookie",
    JSON.stringify({
      expirationTime: new Date().getTime(),
    })
  );

  $(".cookie-overlay").hide();
  $(".cookie").removeClass("active");
}

const config = {
  root: document.body,
  mode: "opt-in",
  autoShow: true,
  revision: 0,
  autoClearCookies: true,
  manageScriptTags: true,
  hideFromBots: true,
  disablePageInteraction: true,
  lazyHtmlGeneration: false,

  onFirstConsent: () => {},
  onConsent: () => {},
  onChange: () => {},

  cookie: {
    name: "cc_cookie",
    path: "/",
    domain: location.host,
    sameSite: "Lax",
    expiresAfterDays: 200,
  },

  guiOptions: {
    consentModal: {
      layout: "box wide",
      position: "bottom left",
      flipButtons: false,
      equalWeightButtons: false,
    },
    preferencesModal: {
      layout: "bar",
      position: "left",
      flipButtons: false,
      equalWeightButtons: false,
    },
  },

  categories: {
    necessary: {
      enabled: true,
      readOnly: true,
      services: {
        service1: {
          label: "Necessary Service 1",
          onAccept: () => {
            window.__service1Enabled = true;
          },
          onReject: () => {},
        },
      },
    },
    analytics: {
      enabled: true,
      readOnly: false,
      autoClear: {
        cookies: [
          {
            name: /^test_cookie/,
          },
        ],
      },
      services: {
        service1: {
          label: "Service 1",
          onAccept: () => {
            setCookie("service1Cookie1", 1, 1);
            setCookie("service1Cookie2", 1, 1);
          },
          onReject: () => {},
          cookies: [
            {
              name: /^service1Cookie/,
            },
          ],
        },
        service2: {
          label: "Service 2",
          onAccept: () => {
            setCookie("service2Cookie", 1, 1);
          },
          onReject: () => {},
          cookies: [
            {
              name: "service2Cookie",
            },
          ],
        },
      },
    },
    ads: {
      enabled: false,
      readOnly: false,
    },
  },
  language: {
    default: "en",

    translations: {
      it: "./it.json",
      en: {
        consentModal: {
          title: "title",
          description: "desc",
          acceptAllBtn: "accept all",
          acceptNecessaryBtn: "accept necessary",
          showPreferencesBtn: "Show preferences",
          closeIconLabel: "Reject all",
          footer: `
                      <a href="#">Link</a>
                  `,
        },
        preferencesModal: {
          title: "title",
          acceptAllBtn: "ACCEPT ALL",
          acceptNecessaryBtn: "ACCEPT MNECESSARY",
          savePreferencesBtn: "Show preferences",
          closeIconLabel: "Close",
          serviceCounterLabel: "Services",
          sections: [
            {
              title: "Initial section",
              description: "SECTION DESC",
            },
            {
              title: "Necessary Cookies",
              description: "SECTION DESC",
              linkedCategory: "necessary",
            },
            {
              title: "Analytics Cookies",
              description: "SECTION DESC",
              linkedCategory: "analytics",
              cookieTable: {
                headers: {
                  name: "Name",
                  description: "Description",
                  Service: "Provider",
                },
                body: [
                  {
                    name: "_ga_*, _gid",
                    description: "Used to track you ...",
                    Service: "Google Analytics",
                  },
                ],
              },
            },
            {
              title: "Ads cookies",
              description: "SECTION DESC",
              linkedCategory: "ads",
            },
          ],
        },
      },
    },
  },
};
