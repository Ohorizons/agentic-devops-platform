import Keycloak from '/modules/contrib/red_hat_jwt/js/vendor/keycloak/keycloak.js?v=26.0.7';

/**
 * @file
 * SSO custom behaviors
 */

/*eslint no-magic-numbers: ["error", { "ignore": [1, 0, -1] }]*/

(function ($, Drupal, drupalSettings, rhdp_fe_app, cookies) {
  Drupal.behaviors.rhd_sso = {
    attach: function (context, settings) {
      // increment attached count.
      rhdp_fe_app.sso.attached++
      // dont run if already attached.
      if (rhdp_fe_app.sso.attached > 1) {
        return;
      }

      const clientId = drupalSettings.red_hat_jwt.client_id;
      const scope = drupalSettings.red_hat_jwt.scopes;
      const origin = window.location.host;
      const realm = drupalSettings.red_hat_jwt.realm;
      const cookie_name = drupalSettings.red_hat_jwt.cookie_name;
      const refresh_cookie_name = cookie_name + "_refresh";
      const url = drupalSettings.red_hat_jwt.sso_host + "/auth";
      const cookie_refresh_interval= 30000;
      let rhd_keycloak;
      drupalSettings.rhd_sso = drupalSettings.rhd_sso || {};

      // Error message template.
      const loginErrorMessageTemplate = `
      <div class="component dark rhd-m-max-width-solid-bg-xl pf-c-content pf-u-py-xl pf-u-background-color-dark-100" id="login-failure-alert">
          <div class="pf-c-alert pf-m-danger pf-m-inline" aria-label="Login failure alert" style="--pf-c-alert--BackgroundColor: rgba(243, 250, 242, 0.2);">
              <div class="pf-c-alert__icon">
                  <i class="fas fa-fw fa-exclamation-circle" aria-hidden="true"></i>
              </div>
              <p class="pf-c-alert__title pf-u-font-size-2xl">
                  <span class="pf-screen-reader">Login failure alert:</span>
                  Sorry, we are unable to log you in.
              </p>
              <div class="pf-c-alert__action">
                  <button
                  class="pf-c-button pf-m-link"
                  onclick="document.getElementById('login-failure-alert').setAttribute('style','display:none');"
                  type="button"
                  aria-label="Close login failure alert: Login failure alert title"
                  >
                  <i class="fas fa-times" aria-hidden="true"></i>
                  </button>
              </div>
              <div class="pf-c-alert__description">
                  <p>
                  We're having trouble logging you in via your single sign-on authentication credentials.
                  </p>
              </div>
          </div>
      </div>
      `;

      // Debug info.
      drupalSettings.rhd_sso.cookie_log = {};
      let sso_debug = drupalSettings.red_hat_jwt.debug === 1 ? true : false;
      // uncomment to force local debug.
      // sso_debug = true;

      // Constructor configuration options.
      const configuration = {
        realm: realm,
        "ssl-required": "external",
        "public-client": true,
        "token-store": "cookie",
        clientId: clientId,
        url: url
      };

      // Initialization options.
      let options = {
        scope: scope,
        onLoad: "check-sso",
        silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso",
        checkLoginIframeInterval: 10,
        responseMode: "fragment",
        timeSkew: 0
      };

      if (sso_debug === true) {
        options.enableLogging = true;
        debugToConsole("Debug Enabled");
      }

      // Call rhd sso.
      if (typeof Keycloak !== "undefined") {
        // Start SSO.
        initSso();
      } else {
        // eslint-disable-next-line no-console
        debugToConsole("Warning: Keycloak not loaded, sso not running!");
      }

      /**
       * Debug to console if sso_debug is true.
       * Only displays a console message if const sso_debug is true
       * @param {string} content - A string param
       *
       * @example
       *
       *     debugToConsole(content)
       */
      function debugToConsole(content) {
        if (!sso_debug) { return; }
        if ((typeof content === 'object' || Array.isArray(content)) && content !== null) {
          console.log("Debug:");
          console.log(content);
        } else {
          console.log(`Debug: ${content}`);
        }
      }

      // Init main Keycloak sso.
      function initSso() {
        debugToConsole(configuration);
        debugToConsole(options);

        // Create and initialize the Keycloak object.
        rhd_keycloak = new Keycloak(configuration);
        rhdp_fe_app.rhdKeycloak = rhd_keycloak;

        // Load tokens
        let token = cookie_name;
        if (token) {
          options.token = loadToken(token);
          options.refreshToken = loadToken(refresh_cookie_name);
        }

        rhd_keycloak
          .init(options)
          .then(function (authenticated) {
            debugToConsole(`rhd_keycloak success: authenticated: ${authenticated}`);
            document.dispatchEvent(new Event('pageUserUpdate'));
            document.dispatchEvent(new Event('updateAudienceSelectionState'));
            document.dispatchEvent(new Event('updatePageUserAnalytics'));
            postTasks();
          })
          .catch(function (e) {
            debugToConsole(`rhd_keycloak Failed to initialize authorization: ${e}`);
            document.dispatchEvent(new Event('pageUserUpdate'));
            document.dispatchEvent(new Event('updateAudienceSelectionState'));
            document.dispatchEvent(new Event('updatePageUserAnalytics'));
          });

        rhd_keycloak.onReady = function () {
          debugToConsole('rhd_keycloak.onReady');

          // Used by universal navigation module.
          // Use to activate the rhd_web keycloak login.
          document.addEventListener("keycloakRhdLogin", function () {
            rhd_keycloak.login();
          });

          // Used by universal navigation module.
          // Use to activate the rhd_web keycloak login.
          document.addEventListener("keycloakRhdLogout", function () {
            userLogout();
          });

          /* Register and return back to referrer if it exists. */

          // Explicit check for registration page or registration page with url parameter included.
          let hrefArray = window.location.href.toLowerCase().split("/");
          let registrationPage = false;
          if (hrefArray[3] === "register" ||
              hrefArray[3].startsWith('register?') ||
              hrefArray[3].startsWith('register#')) {
            registrationPage = true;
          }

          if (registrationPage === true) {
            // Set initial redirect to homepage.
            let redirectUri = window.location.protocol + "//" + window.location.hostname;

            // Check for a referring domain, validate and set it.
            if (document.referrer) {

              // document.referrer is not reliable and will often return only the hostname.
              let referrerHost = new URL(document.referrer).hostname;
              let allowedReferrerDomains = [
                "dxp-developer.docksal.site",
                "developers.qa.redhat.com",
                "developers.stage.redhat.com",
                "developers.redhat.com"
              ]

              // Check for allowed referrers and include special case for MR environments.
              if (allowedReferrerDomains.includes(referrerHost) || referrerHost.includes("dxp-drhc-preview-")) {
                redirectUri = document.referrer;
              }
            }

            // Check if the url parameter needed for offerId is present.
            // If so, get, validate & set it to persist on registration redirect.
            let queryString = window.location.search;
            let urlParams = new URLSearchParams(queryString);
            let offerId;
            if (urlParams.has('offerid')) {
              let offerIdParam = urlParams.get('offerid');
              let offerIdValidation = /^[a-z0-9]+$/i;
              if (offerIdValidation.test(offerIdParam)) {
                offerId = offerIdParam;
              }
            }

            // Check for an "offerid", validate and add it to the redirect
            if (typeof offerId !== 'undefined') {
              let offerIdRedirectParams;

              // We're using "intcmp" because that's already available in marketing.js.
              // Noting that this is confusing as it's not namespaced at all.
              if (redirectUri.indexOf("?") < 0) {
                offerIdRedirectParams = '/?intcmp=' + offerId;
              }
              else {
                offerIdRedirectParams = '&intcmp=' + offerId;
              }
              redirectUri = encodeURI(redirectUri + offerIdRedirectParams);
            }

            // Go to SSO registration form with a redirect_uri.
            rhd_keycloak.login({
              action: "register",
              redirectUri: redirectUri
            });
          }

          /* End: Register and return back to referrer if it exists. */

          // Log in if there is a .protected elem here.
          // @TODO: Do we need this? How/where is it used?
          if (!rhd_keycloak.authenticated && $(".protected").length) {
            rhd_keycloak.login();
          }
        };

        rhd_keycloak.onAuthSuccess = function () {
          let redirectUri = rhdp_fe_app.page_state.createRedirectUri();
          if (!cookies.get(cookie_name)) {
            // Try to set the cookie if it doesn't exist yet, and return whether or
            // not it was successful and now exists.
            let cookieSet = setCookies();
            if (cookieSet) {
              window.location.href = redirectUri;
            } else {
              $("main").prepend(loginErrorMessageTemplate);
            }
          }

          // Call updateToken once then start an interval to check again.
          refreshCookie();
          setInterval(refreshCookie, cookie_refresh_interval);
        };

        rhd_keycloak.onAuthRefreshSuccess = function () {
          console.warn("Calling onAuthRefreshSuccess!");
          let cookieSet = setCookies();
          if (cookieSet) {
            debugToConsole("Cookies are set");
          }
        };

        rhd_keycloak.onTokenExpired = function () {
          // Ideally, this will never run, if we update the token 60 seconds sooner.
          console.warn("Calling onTokenExpired!");
          rhd_keycloak.updateToken();
        };

        rhd_keycloak.onAuthError = function () {
          console.warn("Calling onAuthError!");
          unsetCookies();
        };

        rhd_keycloak.onAuthRefreshError = function () {
          console.warn("Calling onAuthRefreshError!");
          unsetCookies();
        };
      }

      // Check for downloads etc.
      function postTasks() {
        // Start Downloads
        // rhd_is_download_page test for tcDownloadURL is not empty, tcDownloadFileName is not empty and tcSourceLink (contains 'download-manager')
        if (rhdp_fe_app.file_download.is_download_page) {
          // triggers event on the download script.
          document.dispatchEvent(new Event('rhdp_feDownloadFile'));
        }

        // If the user is authenticated, dispatch an event.
        if (rhdp_fe_app.rhdKeycloak.authenticated) {
          document.dispatchEvent(new Event('userIsAuthenticated'));
        }
      }

      // Logout.
      function userLogout() {
        let redirect_uri = rhdp_fe_app.page_state.createRedirectUri();
        rhd_keycloak.logout({post_logout_redirect_uri: redirect_uri});
        unsetCookies();
      }

      // Load token by name.
      function loadToken(name) {
        debugToConsole(name);
        let returnToken;
        let ca;
        let tmp_token = "";
        ca = document.cookie.split(";");
        for (let tmpItem of ca) {
          // Trim whitespace and explode on =
          let c = tmpItem.trim().split("=");
          if (c[0] === name && c[1]) {
            debugToConsole(c[1]);
            tmp_token = c[1]
            returnToken = tmp_token;
            break;
          }
        }
        return returnToken;
      }

      /**
       * Set the Keycloak cookies.
       *
       * @returns {boolean}
       */
      function setCookies() {
        // Get the max age of the cookies by subtracting the issued time from
        // the expiry time.
        let max_age = rhd_keycloak.tokenParsed.exp - rhd_keycloak.tokenParsed.iat;

        // For logging
        if (sso_debug === true) {
          let now = new Date(Date.now());
          let iat = new Date(rhd_keycloak.tokenParsed.iat * 1000);
          drupalSettings.rhd_sso.cookie_log = {
            now: now,
            iat: iat.toUTCString()
          };
        }

        // Set cookies with SameSite=None, or without, depending on
        // compatibility.
        // Here, a cookie could:
        // * be set properly without issues
        // * not be set at all
        // * attempt to be set, but not stored due to something like cookie size
        let tmp_token = rhd_keycloak.token;
        let tmp_token_refresh = rhd_keycloak.refreshToken;
        let sameSite = samesiteCompatible() ? 'SameSite=None;' : '';

        document.cookie = `${cookie_name}=${tmp_token};path=/;max-age=${max_age};domain=${origin};${sameSite}secure;`;
        document.cookie = `${refresh_cookie_name}=${tmp_token_refresh};path=/;max-age=${max_age};domain=${origin};${sameSite}secure;`;

        // We can construct the cookie, but in some cases, such as if the overall
        // cookie length is too great, it can't be stored. So, here we can check
        // if the cookie has been stored and can be found.
        return Boolean(cookies.get(cookie_name));
      }

      /**
       * Unsets Keycloak cookies.
       */
      function unsetCookies() {
        // Main token cookie.
        document.cookie = `${cookie_name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;domain=.${origin};path=/;SameSite=None;secure;`;
        document.cookie = `${cookie_name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;domain=.${origin};path=/;secure;`;
        document.cookie = `${cookie_name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;domain=.${origin};path=/;`;

        // Refresh token cookie.
        document.cookie = `${cookie_name}_refresh=;expires=Thu, 01 Jan 1970 00:00:00 GMT;domain=.${origin};path=/;SameSite=None;secure;`;
        document.cookie = `${cookie_name}_refresh=;expires=Thu, 01 Jan 1970 00:00:00 GMT;domain=.${origin};path=/;secure;`;
        document.cookie = `${cookie_name}_refresh=;expires=Thu, 01 Jan 1970 00:00:00 GMT;domain=.${origin};path=/;`;
      }

      /**
       * Check if the browser supports SameSite=None or not.
       *
       * @returns {boolean}
       */
      function samesiteCompatible() {
        // Random cookie name.
        let name = "lcevt7rmgHDX6gqB";
        // Save a cookie with SameSite=None.
        document.cookie = `${name}=PzwXSfsMbjG4HoSpk;SameSite=None;secure;`;
        // Try to get the cookie back.
        let compatible = cookies.get(name);
        // Unset the cookie whether or not it exists.
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;SameSite=None;secure;`;

        return Boolean(compatible);
      }

      // To avoid cookie expiration, update the token 60 seconds
      // before it expires, and check every 30 seconds.
      function refreshCookie() {
        // Update the token if it's going to expire in X seconds.
        rhd_keycloak
          .updateToken(60)
          .then(function () {
            debugToConsole("checked token: success checking to update token");
          })
          .catch(function () {
            debugToConsole("checked token: failed to check to update token.");
          });
      }
    }
  }
})(jQuery, Drupal, drupalSettings, window.rhdp_fe_app, window.Cookies);
