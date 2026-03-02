2/21/26, 3:35 PM                                     Kubernetes Authentication Strategies | Backstage Software Catalog and Developer Platform



                      Core Features                 Kubernetes               Authentication Strategies

     Kubernetes Auth Strategies
     A Kubernetes Auth Strategy specifies the authentication steps executed on the server side to
     authenticate against a Kubernetes cluster, it also defines what authentication metadata about
     a Kubernetes cluster is returned to the front-end in case a client side auth provider requires
     it.

     Context
     Backstage includes by default some Kubernetes Auth Providers to ease the authentication
     process to kubernetes clusters, it includes:
           Server Side Providers like localKubectlProxy or serviceAccount where the same
          set of kubernetes permissions are shared and granted among the Backstage users and
          plugins.
           Client Side Providers like aks or oidc where the user is authenticated with the
          cluster, getting only the kubernetes permissions granted to that specific user.
     Although there are Server Side Providers and Client Side Providers , authenticating
     with a cluster requires code on both sides. Perhaps one of them does most of the job, but in
     general not all steps to authenticate against a Kubernetes cluster are always executed
     exclusively on the server side or client side. A Kubernetes authentication flow could require
     splitting the authentication process among steps on the client side and steps on the server
     side.

     AuthenticationStrategy interface
     The AuthenticationStrategy interface defines the steps executed on the server side to
     authenticate against a Kubernetes cluster. It is similar to the KubernetesAuthProvider
     interface, which defines corresponding steps on the client side.
        plugins/kubernetes-node/src/types/types.ts
        export interface AuthenticationStrategy {
          getCredential(
                                                                                                                                                Feedback
https://backstage.io/docs/features/kubernetes/authentication-strategies                                                                                    1/9
2/21/26, 3:35 PM                                     Kubernetes Authentication Strategies | Backstage Software Catalog and Developer Platform

              clusterDetails: ClusterDetails,
              authConfig: KubernetesRequestAuth,
            ): Promise<KubernetesCredential>;

            presentAuthMetadata(authMetadata: AuthMetadata): AuthMetadata;

            validateCluster(authMetadata: AuthMetadata): Error[];
        }



     The AuthenticationStrategy interface defines the following signature:
         getCredential : Executes the steps require on the server side to authenticate against a
         Kubernetes Cluster. It receives the cluster info on the clusterDetails parameter and the
         authentication data provided from the Client Side on the authConfig parameter.
         presentAuthMetadata : A Kubernetes cluster configuration could include extra metadata
         specific to a given authentication flow (like AWS clusters do). The presentAuthMetadata
         method receives that metadata and filters/adds information that could be required by the
         front-end in a client side authentication process. The front-end gets this info via the
         /clusters endpoint.

         validateCluster : Allows strategies to reject clusters if they have invalid metadata.
         Currently this method only gets invoked when reading clusters from the app-config.
     KubernetesCredential type
     Something to highlight is that the getCredential method on an AuthenticationStrategy
     will return a KubernetesCredential object representing a single method of authenticating
     with a Kubernetes cluster. This value can be:
           A bearer token
           A x509 client certificate and key
           Anonymous authentication
        plugins/kubernetes-node/src/types/types.ts
        export type KubernetesCredential =
          | { type: 'bearer token'; token: string }
          | { type: 'x509 client certificate'; cert: string; key: string }
          | { type: 'anonymous' };



                                                                                                                                                Feedback
https://backstage.io/docs/features/kubernetes/authentication-strategies                                                                                    2/9
     AuthenticationStrategies examples
2/21/26, 3:35 PM                                     Kubernetes Authentication Strategies | Backstage Software Catalog and Developer Platform




     AksStrategy
     Some kubernetes Authentication Strategies are pretty simple, since the Authentication process
     was executed on the client side by the KubernetesAuthProvider , So Authentication
     Strategies like AksStrategy or GoogleStrategy only map the info that the corresponding
     KubernetesAuthProvider returned on the client side.


        plugins/kubernetes-backend/src/auth/AksStrategy.ts
        export class AksStrategy implements AuthenticationStrategy {
          public async getCredential(
            _: ClusterDetails,
            requestAuth: KubernetesRequestAuth,
          ): Promise<KubernetesCredential> {
            const token = requestAuth.aks;
            return token
              ? { type: 'bearer token', token: token as string }
              : { type: 'anonymous' };
          }

            public validateCluster(): Error[] {
              return [];
            }

            public presentAuthMetadata(_authMetadata: AuthMetadata): AuthMetadata {
              return {};
            }
        }



     The AksStrategy is pretty simple, it is only mapping the token that
     AksKubernetesAuthProvider.ts was able to get in the Client Side authentication flow.



     AwsIamStrategy
     Another AuthenticationStrategy is AwsIamStrategy , it is more complex than AksStrategy ,
     since it consumes some AWS APIs to get a kubernetes token.
        plugins/kubernetes-backend/src/auth/AwsIamStrategy.ts
                                                                                                                                                Feedback
https://backstage.io/docs/features/kubernetes/authentication-strategies                                                                                    3/9
2/21/26, 3:35 PM                                     Kubernetes Authentication Strategies | Backstage Software Catalog and Developer Platform


        export class AwsIamStrategy implements AuthenticationStrategy {
          // ... code ...

             public async getCredential(
               clusterDetails: ClusterDetails,
             ): Promise<KubernetesCredential> {
               return {
                 type: 'bearer token',
                 token: await this.getBearerToken(
                   clusterDetails.authMetadata[ANNOTATION_KUBERNETES_AWS_CLUSTER_ID]
        ??
                          clusterDetails.name,
                        clusterDetails.authMetadata[ANNOTATION_KUBERNETES_AWS_ASSUME_ROLE],
                        clusterDetails.authMetadata[ANNOTATION_KUBERNETES_AWS_EXTERNAL_ID],
                      ),
                 };
             }

             private async getBearerToken(
               clusterId: string,
               assumeRole?: string,
               externalId?: string,
             ): Promise<string> {
               // ... code ...

                 const request = await signer.presign(
                    {
                      headers: {
                         host: `sts.${region}.amazonaws.com`,
                         'x-k8s-aws-id': clusterId,
                      },
                      hostname: `sts.${region}.amazonaws.com`,
                      method: 'GET',
                      path: '/',
                      protocol: 'https:',
                      query: {
                         Action: 'GetCallerIdentity',
                         Version: '2011-06-15',
                      },
                    },
                    { expiresIn: 0 },
                 );

                 // ... code ...
             }

             public presentAuthMetadata(_authMetadata: AuthMetadata): AuthMetadata {

             }
               return {};
                                                                                                                                                Feedback
https://backstage.io/docs/features/kubernetes/authentication-strategies                                                                                    4/9
2/21/26, 3:35 PM                                     Kubernetes Authentication Strategies | Backstage Software Catalog and Developer Platform

            public validateCluster(): Error[] {
              return [];
            }
        }




     Custom AuthStrategy
     Sometimes you need to add a new way to authenticate against a kubernetes cluster not
     support by default by Backstage. This is how integrators can bring their own kubernetes auth
     strategies through the use of the addAuthStrategy method on KubernetesBuilder or
     through the AuthStrategyExtensionPoint. So, on the following sections, we are going to
     introduce a new AuthStrategy for Pinniped, an authentication service for Kubernetes clusters.
     Custom Pinniped auth strategy in the new backend system
     To add a new AuthStrategy, we need to create a new Pinniped backend module to extend the
     Kubernetes-Backend plugin. The Pinniped module will interact with the Kubernetes-Backend
     plugin through the extension points registered by the plugin. The Kubernetes-Backend plugin
     registers multiple extension points like kubernetesObjectsProvider ,
     kubernetesClusterSupplier , kubernetesFetcher , kubernetesServiceLocator and the
     kubernetesAuthStrategy .


     Notice that this guide assumes that you already installed the Kubernetes Plugin.
     To create the Backend module, run yarn new , select backend-module . Then fill out:
        ? What do you want to create? backend-module - A new backend module
        ? Enter the ID of the plugin [required] kubernetes
        ? Enter the ID of the module [required] pinniped



     This will create a new package at plugins/kubernetes-backend-module-pinniped . We are
     going to need also the @backstage/plugin-kubernetes-node and @backstage/plugin-
     kubernetes-common dependencies, the @backstage/plugin-kubernetes-node houses the
     kubernetesAuthStrategyExtensionPoint and a Pinniped Helper class.
        From your Backstage root directory
        yarn --cwd plugins/kubernetes-backend-module-pinniped add
        @backstage/plugin-kubernetes-node                                                                                                       Feedback
https://backstage.io/docs/features/kubernetes/authentication-strategies                                                                                    5/9
2/21/26, 3:35 PM                                     Kubernetes Authentication Strategies | Backstage Software Catalog and Developer Platform

        yarn --cwd plugins/kubernetes-backend-module-pinniped add
        @backstage/plugin-kubernetes-common



     Let's create a new file to house the Pinniped authentication strategy which will implement the
     AuthenticationStrategy interface.


        plugins/kubernetes-backend-module-pinniped/src/PinnipedStrategy.ts
        import { KubernetesRequestAuth } from '@backstage/plugin-kubernetes-
        common';
        import { LoggerService } from '@backstage/backend-plugin-api';
        import {
          AuthMetadata,
          AuthenticationStrategy,
          ClusterDetails,
          KubernetesCredential,
          PinnipedClientCerts,
          PinnipedHelper,
          PinnipedParameters,
        } from '@backstage/plugin-kubernetes-node';
        import { JsonObject } from '@backstage/types';

        export class PinnipedStrategy implements AuthenticationStrategy {
          private pinnipedHelper: PinnipedHelper;

            constructor(private readonly logger: LoggerService) {
              this.pinnipedHelper = new PinnipedHelper(logger);
            }

          public async getCredential(
            clusterDetails: ClusterDetails,
            requestAuth: KubernetesRequestAuth,
          ): Promise<KubernetesCredential> {
            const params: PinnipedParameters = {
               token:
                 ((requestAuth.pinniped as JsonObject)?.clusteridtoken as string) ||
        '',
               authenticator: {
                 apiGroup: 'authentication.concierge.pinniped.dev',
                 kind: 'JWTAuthenticator',
                 name: 'supervisor',
               },
               tokenCredentialRequest: {
                 apiGroup: 'login.concierge.pinniped.dev/v1alpha1',
               },
            };
                                                                                                                                                Feedback
https://backstage.io/docs/features/kubernetes/authentication-strategies                                                                                    6/9
2/21/26, 3:35 PM                                     Kubernetes Authentication Strategies | Backstage Software Catalog and Developer Platform

            const x509Data: PinnipedClientCerts =
               await this.pinnipedHelper.tokenCredentialRequest(clusterDetails,
        params);
            return {
               type: 'x509 client certificate',
               cert: x509Data.cert,
               key: x509Data.key,
            };
          }

            public validateCluster(): Error[] {
              return [];
            }

            presentAuthMetadata: (authMetadata: AuthMetadata): AuthMetadata => {
               return {
                  audience: authMetadata['kubernetes.io/x-pinniped-audience'],
               };
            },
        }



     The PinnipedStrategy implements the AuthenticationStrategy interface, it uses the
     PinnipedHelper class to exchange the clusterIdToken ( created by a custom Pinniped
     client-side KubernetesAuthProvider ) for a x509 certificate, certificate that will allow us to
     consume the kubernetes cluster. It also returns the audience value to the front-end through
     presentAuthMetadata .


        Notice that the PinnipedHelper class will help you only to exchange the token, It doesn't
        introduce a cache layer, something that your strategy could introduce.
     Finally we could use the kubernetesAuthStrategyExtensionPoint to register our new
     PinnipedStrategy.
        plugins/kubernetes-backend-module-pinniped/src/module.ts
        import {
          coreServices,
          createBackendModule,
        } from '@backstage/backend-plugin-api';
        import { kubernetesAuthStrategyExtensionPoint } from '@backstage/plugin-
        kubernetes-node';
        import { PinnipedStrategy } from './PinnipedStrategy';

        export const kubernetesModulePinniped = createBackendModule({
          pluginId: 'kubernetes',
          moduleId: 'pinniped',
                                                                                                                                                Feedback
https://backstage.io/docs/features/kubernetes/authentication-strategies                                                                                    7/9
2/21/26, 3:35 PM                                     Kubernetes Authentication Strategies | Backstage Software Catalog and Developer Platform

          register(reg) {
             reg.registerInit({
               deps: {
                 logger: coreServices.logger,
                 authStrategy: kubernetesAuthStrategyExtensionPoint,
               },
               async init({ logger, authStrategy }) {
                 authStrategy.addAuthStrategy('pinniped', new
        PinnipedStrategy(logger));
               },
             });
          },
        });




     Custom Pinniped auth strategy in the old backend system
     To add a new AuthStrategy, You could use addAuthStrategy method on
     KubernetesBuilder . We are going to reuse the PinnipedStrategy created on the previous
     section. So when setting up the Kubernetes Backend plugin, you could add a new Strategy:
        packages/backend/src/plugins/kubernetes.ts
        import { KubernetesBuilder } from '@backstage/plugin-kubernetes-backend';
        import { Router } from 'express';
        import { PluginEnvironment } from '../types';
        import { CatalogClient } from '@backstage/catalog-client';
        import { AuthenticationStrategy } from '@backstage/plugin-kubernetes-node';
        import { PinnipedStrategy } from '@internal/plugin-kubernetes-backend-
        module-pinniped';

        export default async function createPlugin(
          env: PluginEnvironment,
        ): Promise<Router> {
          const catalogApi = new CatalogClient({ discoveryApi: env.discovery });
          const pinnipedStrategy: AuthenticationStrategy = new PinnipedStrategy(
             env.logger,
          );
          const { router } = await KubernetesBuilder.createBuilder({
             logger: env.logger,
             config: env.config,
             catalogApi,
             permissions: env.permissions,
          })
             .addAuthStrategy('pinniped', pinnipedStrategy)

                                                                                                                                                Feedback
             .build();


https://backstage.io/docs/features/kubernetes/authentication-strategies                                                                                    8/9
2/21/26, 3:35 PM                                     Kubernetes Authentication Strategies | Backstage Software Catalog and Developer Platform

            return router;
        }




                                                                                                                                                Feedback
https://backstage.io/docs/features/kubernetes/authentication-strategies                                                                                    9/9
