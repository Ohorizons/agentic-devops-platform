2/21/26, 3:34 PM                                             Installation | Backstage Software Catalog and Developer Platform



                      Core Features                  Kubernetes          Installation

     Installation
     The Kubernetes feature is a plugin to Backstage, and it is exposed as a tab when viewing
     entities in the software catalog.
     If you haven't set up Backstage already, read the Getting Started guide.

     Adding the Kubernetes frontend plugin
     The first step is to add the Kubernetes frontend plugin to your Backstage application.
        From your Backstage root directory
        yarn --cwd packages/app add @backstage/plugin-kubernetes



     Once the package has been installed, you need to import the plugin in your app by adding the
     "Kubernetes" tab to the respective catalog pages.
        packages/app/src/components/catalog/EntityPage.tsx
         import { EntityKubernetesContent } from '@backstage/plugin-kubernetes';

        // You can add the tab to any number of pages, the service page is shown as
        an
        // example here
        const serviceEntityPage = (
           <EntityLayout>
             {/* other tabs... */}
             <EntityLayout.Route path="/kubernetes" title="Kubernetes">
               <EntityKubernetesContent refreshIntervalMs={30000} />
             </EntityLayout.Route>
           </EntityLayout>
        );




                NOTE
                                                                                                                                Feedback
https://backstage.io/docs/features/kubernetes/installation                                                                                 1/4
2/21/26, 3:34 PM                                             Installation | Backstage Software Catalog and Developer Platform

          The optional refreshIntervalMs property on the EntityKubernetesContent defines
          the interval in which the content automatically refreshes, if not set this will default to 10
          seconds.
     That's it! But now, we need the Kubernetes Backend plugin for the frontend to work.

     Adding Kubernetes Backend plugin
     First, we need to add the backend package:
        From your Backstage root directory
        yarn --cwd packages/backend add @backstage/plugin-kubernetes-backend



     Then add it to your backend index.ts file:
        packages/backend/src/index.ts
        const backend = createBackend();

        // Other plugins...

         backend.add(import('@backstage/plugin-kubernetes-backend'));

        backend.start();



     That's it! The Kubernetes frontend and backend have now been added to your Backstage app.
     Custom cluster discovery
     If either existing cluster locators don't work for your use-case, it is possible to implement a
     custom KubernetesClustersSupplier.
     Here's a very simplified example:
        packages/backend/src/index.ts
        import { createBackend } from '@backstage/backend-defaults';
        import { createBackendModule } from '@backstage/backend-plugin-api';                                                    Feedback
https://backstage.io/docs/features/kubernetes/installation                                                                                 2/4
2/21/26, 3:34 PM                                             Installation | Backstage Software Catalog and Developer Platform

        import { Duration } from 'luxon';
        import {
          ClusterDetails,
          KubernetesClustersSupplier,
          kubernetesClusterSupplierExtensionPoint,
          kubernetesServiceLocatorExtensionPoint,
        } from '@backstage/plugin-kubernetes-node';

        export class CustomClustersSupplier implements KubernetesClustersSupplier {
          constructor(private clusterDetails: ClusterDetails[] = []) {}

          static create(refreshInterval: Duration) {
            const clusterSupplier = new CustomClustersSupplier();
            // setup refresh, e.g. using a copy of
        https://github.com/backstage/backstage/blob/master/plugins/kubernetes-
        backend/src/service/runPeriodically.ts
            runPeriodically(
               () => clusterSupplier.refreshClusters(),
               refreshInterval.toMillis(),
            );
            return clusterSupplier;
          }

             async refreshClusters(): Promise<void> {
               this.clusterDetails = []; // fetch from somewhere
             }

             async getClusters(): Promise<ClusterDetails[]> {
               return this.clusterDetails;
             }
        }

        const backend = createBackend();

        export const kubernetesModuleCustomClusterDiscovery = createBackendModule({
          pluginId: 'kubernetes',
          moduleId: 'custom-cluster-discovery',
          register(env) {
             env.registerInit({
               deps: {
                 clusterSupplier: kubernetesClusterSupplierExtensionPoint,
                 serviceLocator: kubernetesServiceLocatorExtensionPoint,
               },
               async init({ clusterSupplier, serviceLocator }) {
                 // simple replace of the internal dependency
                 clusterSupplier.addClusterSupplier(
                    CustomClustersSupplier.create(Duration.fromObject({ minutes: 60
        })),
                 );                                                                                                             Feedback
https://backstage.io/docs/features/kubernetes/installation                                                                                 3/4
2/21/26, 3:34 PM                                             Installation | Backstage Software Catalog and Developer Platform

                // there's also the ability to get access to some of the default
        implementations of the extension points where
                // necessary:
                serviceLocator.addServiceLocator(
                  async ({ getDefault, clusterSupplier }) => {
                    // get access to the default service locator:
                    const defaultImplementation = await getDefault();

                                  // build your own with the clusterSupplier dependency:
                                  return new MyNewServiceLocator({ clusterSupplier });
                             },
                     );
                   },
                 });
          },
        });

        // Other plugins...
        backend.add(import('@backstage/plugin-kubernetes-backend'));
        backend.add(kubernetesModuleCustomClusterDiscovery);

        backend.start();




                NOTE
          This example uses items from the @backstage/plugin-kubernetes-node and luxon
          packages, you'll need to add those for this example to work as is.

     Configuration
     After installing the plugins in the code, you'll need to then configure them.

     Troubleshooting
     After installing the plugins in the code, if the Kubernetes information is not showing up, you'll
     need to troubleshoot it.



                                                                                                                                Feedback
https://backstage.io/docs/features/kubernetes/installation                                                                                 4/4
