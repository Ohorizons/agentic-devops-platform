2/21/26, 3:30 PM                            Deploying Backstage | Backstage Software Catalog and Developer Platform



                     Getting Started    Deploying Backstage               Overview

    Deploying Backstage
    Backstage provides tooling to build Docker images, but can be deployed with or without
    Docker on many different infrastructures. The best way to deploy Backstage is in the same way
    you deploy other software at your organization.
    This documentation shows common examples that may be useful when deploying Backstage
    for the first time, or for those without established deployment practices.
                NOTE
         The easiest way to explore Backstage is to visit the live demo site.
    At Spotify, we deploy software generally by:
       1. Building a Docker image
       2. Storing the Docker image on a container registry
       3. Referencing the image in a Kubernetes Deployment YAML
       4. Applying that Deployment to a Kubernetes cluster
    This method is covered in Building a Docker image and Deploying with Kubernetes.
    There are many ways to deploy Backstage! You can find more examples in the community
    contributed guides found here.
    If you need to run Backstage behind a corporate proxy, this contributed guide may help.




                                                                                                                      Feedback
https://backstage.io/docs/deployment/                                                                                            1/1
