2/21/26, 3:33 PM                          OAuth and OpenID Connect | Backstage Software Catalog and Developer Platform



                     Core Features     Auth and Identity            OAuth and OpenID Connect

    OAuth and OpenID Connect
    This section describes how Backstage allows plugins to request OAuth Access Tokens and
    OpenID Connect ID Tokens on behalf of the user, to be used for auth to various third party
    APIs.

    Summary
    There are occasions when the user wants to perform actions towards third party services that
    require authorization via OAuth. Backstage provides standardized Utility APIs such as the
    GoogleAuthApi for that use-case. Backstage also includes a set of implementations of these
    APIs that integrate with the auth-backend plugin to provide a popup-based OAuth flow.

    Background
    Access control in OAuth is implemented in terms of scope, which is a list of permissions given
    to the app. An OAuth service can issue Access Tokens that are tied to a certain set of scopes,
    such as viewing profile information, reading and/or writing user data in the service. The scope
    format and handling is specific to each OAuth provider, and the set of available scopes are
    typically found in the documentation describing the auth solution of the provider, for example
    developers.google.com/identity/protocols/oauth2/scopes.
    As a part of logging in with an OAuth provider, the user needs to consent to both the login itself
    and the set of scopes that the app is requesting to use. This is done by loading a page
    provided by the OAuth provider, where a user can choose an account to log in with, and accept
    or reject the request. If the user accepts the login request, a token is issued, and any holder of
    the token can use it to make authenticated requests towards the third party service.

    OAuth in @backstage/core-app-api and
    auth-backend
    The default OAuth implementation in Backstage is based on an OAuth server-side offline
                                                                                       FeedbackA
    access flow, which means that it uses the backend as a helper in order to trade credentials.
https://backstage.io/docs/auth/oauth                                                                                     1/4
2/21/26, 3:33 PM                       OAuth and OpenID Connect | Backstage Software Catalog and Developer Platform

    benefit of this type of flow is that it does not require the use of third party cookies, and is
    robust on a wide selection of browsers and privacy browsing plugins, strict security settings,
    etc.
    The implementation also uses a popup-based flow, where auth requests are handled in a new
    popup window that is opened by the app. By using a popup-based flow it is possible to request
    authentication at any point in the app, without requiring a redirect. Because of this there is no
    need to ask for all scopes upfront, or interrupt the app with a redirect and forcing plugin
    authors to take care in restoring state after a redirect has been made. All in all it makes it much
    easier to make authenticated requests inside a plugin.

    OAuth Flow
    The following describes the OAuth flow implemented by the auth-backend and
    DefaultAuthConnector in @backstage/core-app-api .
    Component and APIs can request Access or ID Tokens from any available Auth provider. If
    there already exists a cached fresh token that covers (at least) the requested scopes, it will be
    returned immediately. If the OAuth provider implements token refreshes, this check will also
    trigger a token refresh attempt if no session is available.
    If new scopes are requested, or the user is not yet logged in with that provider, a dialog is
    shown informing the user that they need to log in with the specified provider. If the user agrees
    to continue, a separate popup window is opened that implements the entire consent flow.
    The popup window is pointed to the /start endpoint of the auth provider in the auth-
    backend plugin, which then redirects to the OAuth consent screen of the provider. The
    consent screen is controlled by the OAuth provider, and will do things like prompting the user
    to log in with an account, and possibly reviewing the set of requested scopes. If the login
    request is accepted, the popup window will be redirected back to the /handler/frame
    endpoint of the auth backend. The redirect URL will contain a short-term authorization code,
    which is picked up by the backend and exchanged for long-term tokens via a call to the OAuth
    provider. The Access and possibly ID Token is then handed back to the main Backstage page
    via postMessage . If the OAuth provider implements offline refresh, a refresh token will be
    stored in an HTTP-only cookie scoped to the specific provider in the auth-backend plugin.
    To protect against certain attacks, the above flow also includes a simple nonce check and a
    lightweight CSRF protection header. The nonce check is done to protect against attacks where
    an attacker tricks a user to log in with an account of the attacker's choosing in orderFeedback
                                                                                            to gather
    data. In the first part of the flow where the popup is directed to the /start endpoint, a nonce
https://backstage.io/docs/auth/oauth                                                                                  2/4
2/21/26, 3:33 PM                                                 OAuth and OpenID Connect | Backstage Software Catalog and Developer Platform

    is generated and placed in both a cookie and the OAuth state. The nonces received in the
    cookie and OAuth state in the redirect handler are then checked, and the auth attempt will fail
    if they're not valid. The CSRF protection for the /refresh and /logout endpoints is
    implemented by simply checking for the presence of a X-Requested-With header.
    The target origin of the postMessage is also of importance to keep the flow secure. It is
    configured to a single value for each auth provider and environment. Without a single
    configured origin, any page could open a popup and request an access token.
    Sequence Diagram
    The following diagram visualizes the flow described in the previous section.
                                                                            OAuth Consent and Refresh Flow

                  Browser                                    Popup Window                                                   auth-backend plugin
                                                                                                                                                    Consent Screen       OAuth Provider

      Components on page ask for an
      access token with greater
      scope than the existing session.

                       Open popup

                                                                       GET /auth/<provider>/start?scope=some%20scopes

                                                                        Redirect to consent screen with
                                                                        random nonce in OAuth state and
                                                                        short-lived cookie with the same nonce.

                                                                       GET /consent_url?redirect_uri=<redirect_uri>?nonce=<n>
                                                                       where redirect_uri=<app-origin>/auth/<provider>/handler/frame

                                                                                                                                                 User consents to
                                                                                                                                                 access the new scope.

                                                                        Redirect to given redirect URL, with authorization code

                                                                       GET /auth/<provider>/handler/frame?code=<c>&nonce=<n>
                                                                       Request includes the previously set none cookie

                                                                                                                    Verify that the nonce in the cookie
                                                                                                                    matches the nonce in the OAuth state

                                                                                                                                       Authorization Code
                                                                                                                                       Client ID
                                                                                                                                       Client Secret

                                                                                                                                                                 Verify and generate tokens

                                                                                                                                         Access Token
                                                                                                                                         (ID Token)
                                                                                                                                         (Refresh Token)
                                                                                                                                         Scope
                                                                                                                                         Expire Time

                                                                        Small HTML page with inlined response payload
                                                                        Store Refresh Token in HTTP-only cookie

                         postMessage() with tokens and info or error

                                                                       Close self


      A later point when a refresh
      is needed. Either because of
      a reload or an expiring session.

                       GET /auth/<provider>/token
                       Refresh Token cookie included

                                                                                                                                       Refresh Token
                                                                                                                                       Client ID
                                                                                                                                       Client Secret

                                                                                                                                         Access Token
                                                                                                                                         (ID Token)
                                                                                                                                         Scope
                                                                                                                                         Expire Time

                         Tokens and info

                                                                                                                                                    Consent Screen       OAuth Provider
                  Browser                                    Popup Window                                                   auth-backend plugin




                                                                                                                                                                          Feedback
https://backstage.io/docs/auth/oauth                                                                                                                                                          3/4
2/21/26, 3:33 PM                       OAuth and OpenID Connect | Backstage Software Catalog and Developer Platform




                                                                                                                      Feedback
https://backstage.io/docs/auth/oauth                                                                                             4/4
