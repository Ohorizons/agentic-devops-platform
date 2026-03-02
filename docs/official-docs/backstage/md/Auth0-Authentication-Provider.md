2/21/26, 3:32 PM                                  Auth0 Authentication Provider | Backstage Software Catalog and Developer Platform



                     Core Features              Auth and Identity             Included providers                 Auth0

    Auth0 Authentication Provider
                INFO
         This documentation is written for the new backend system which is the default since
         Backstage version 1.24. If you are still on the old backend system, you may want to read
         its own article instead, and consider migrating!
    The Backstage core-plugin-api package comes with an Auth0 authentication provider that
    can authenticate users using OAuth.

    Create an Auth0 Application
        1. Log in to the Auth0 dashboard
        2. Navigate to Applications
        3. Create an Application
                Name: Backstage (or your custom app name)
                Application type: Single Page Web Application
        4. Click on the Settings tab.
        5. Add under Application URIs > Allowed Callback URLs :
             http://localhost:7007/api/auth/auth0/handler/frame

        6. Click Save Changes .

    Configuration
    The provider configuration can then be added to your app-config.yaml under the root auth
    configuration:
        auth:
          environment: development
          providers:
            auth0:

                                                                                                                                      Feedback
              development:
                clientId: ${AUTH_AUTH0_CLIENT_ID}

https://backstage.io/docs/auth/auth0/provider                                                                                                    1/4
2/21/26, 3:32 PM                                Auth0 Authentication Provider | Backstage Software Catalog and Developer Platform

                clientSecret: ${AUTH_AUTH0_CLIENT_SECRET}
                domain: ${AUTH_AUTH0_DOMAIN_ID}
                audience: ${AUTH_AUTH0_AUDIENCE}
                connection: ${AUTH_AUTH0_CONNECTION}
                connectionScope: ${AUTH_AUTH0_CONNECTION_SCOPE}
                organization: ${AUTH_AUTH0_ORGANIZATION_ID}
                ## uncomment to set lifespan of user session
                # sessionDuration: { hours: 24 } # supports `ms` library format
        (e.g. '24h', '2 days'), ISO duration, "human duration" as used in code
          session:
            secret: ${AUTH_SESSION_SECRET}



    The Auth0 provider is a structure with these configuration keys:
         clientId : The Application client ID, found on the Auth0 Application page.

         clientSecret : The Application client secret, found on the Auth0 Application page.

         domain : The Application domain, found on the Auth0 Application page.


    It additionally relies on the following configuration to function:
         session.secret : The session secret is a key used for signing and/or encrypting cookies
         set by the application to maintain session state. In this case, 'your session secret' should
         be replaced with a long, complex, and unique string that only your application knows.
    Auth0 requires a session, so you need to give the session a secret key.
    Optional
             audience  : The intended recipients of the token.
            connection : Social identity provider name. To check the available social connections,
            please visit Auth0 Social Connections.
            connectionScope : Additional scopes in the interactive token request. It should always be
            used in combination with the connection parameter.
            sessionDuration : Lifespan of the user session.

            organization : Specify a specific organization ID to be targeted as part of the login flow.



    Resolvers
    This provider includes several resolvers out of the box that you can use:
                                                                                                                                    Feedback
https://backstage.io/docs/auth/auth0/provider                                                                                                  2/4
2/21/26, 3:32 PM                                Auth0 Authentication Provider | Backstage Software Catalog and Developer Platform

             emailMatchingUserEntityProfileEmail       : Matches the email address from the auth
            provider with the User entity that has a matching spec.profile.email . If no match is
            found, it will throw a NotFoundError .
             emailLocalPartMatchingUserEntityName : Matches the local part of the email address
            from the auth provider with the User entity that has a matching name . If no match is found,
            it will throw a NotFoundError .
                NOTE
         The resolvers will be tried in order, but will only be skipped if they throw a
         NotFoundError .



    If these resolvers do not fit your needs, you can build a custom resolver, this is covered in the
    Building Custom Resolvers section of the Sign-in Identities and Resolvers documentation.

    Backend Installation
    To add the provider to the backend, we will first need to install the package by running this
    command:
        from your Backstage root directory
        yarn --cwd packages/backend add @backstage/plugin-auth-backend-module-
        auth0-provider



    Then we will need to add this line:
        packages/backend/src/index.ts
        import { createBackend } from '@backstage/backend-defaults';
        //...
        backend.add(import('@backstage/plugin-auth-backend'));
        backend.add(import('@backstage/plugin-auth-backend-module-auth0-
        provider'));
        //...




                                                                                                                                    Feedback
https://backstage.io/docs/auth/auth0/provider                                                                                                  3/4
    Adding the provider to the Backstage
2/21/26, 3:32 PM                                Auth0 Authentication Provider | Backstage Software Catalog and Developer Platform




    frontend
    To add the provider to the frontend, add the auth0AuthApi reference and SignInPage
    component as shown in Adding the provider to the sign-in page.




                                                                                                                                    Feedback
https://backstage.io/docs/auth/auth0/provider                                                                                                  4/4
