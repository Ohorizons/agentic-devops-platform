2/21/26, 3:31 PM                                           Registering a Component | Backstage Software Catalog and Developer Platform



                     Getting Started                  Using Backstage                 Registering a Component

    Registering a Component
    Audience: Developers
                NOTE
         Entity files are stored in YAML format, if you are not familiar with YAML, you can learn
         more about it here.

    Summary
    This guide will walk you through how to pull Backstage data from other locations manually.
    There are integrations that will automatically do this for you.

    Prerequisites
    You should have already have a standalone app.

    1. Finding our template
    Register a new component, by going to create and choose Register existing component




    2. Filling out the template
    For repository URL, use
     https://github.com/backstage/backstage/blob/master/catalog-info.yaml                                                                .Feedback
                                                                                                                                          This is
https://backstage.io/docs/getting-started/register-a-component                                                                                       1/3
2/21/26, 3:31 PM                                           Registering a Component | Backstage Software Catalog and Developer Platform

    used in our demo site catalog.




    Hit Analyze and review the changes.

    3. Import the entity
    If the changes from Analyze are correct, click Apply .




                                                                                                                                         Feedback
https://backstage.io/docs/getting-started/register-a-component                                                                                      2/3
2/21/26, 3:31 PM                                           Registering a Component | Backstage Software Catalog and Developer Platform




    You should receive a message that your entities have been added.
    If you go back to Home , you should be able to find backstage . You can click it and see the
    details for this new entity.




                                                                                                                                         Feedback
https://backstage.io/docs/getting-started/register-a-component                                                                                      3/3
