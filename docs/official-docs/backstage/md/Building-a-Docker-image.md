2/21/26, 3:30 PM                                 Building a Docker image | Backstage Software Catalog and Developer Platform



                     Getting Started          Deploying Backstage                Docker

    Building a Docker image
    Summary
    This section describes how to build a Backstage App into a deployable Docker image. It is split
    into three sections, first covering the host build approach, which is recommended due to its
    speed and more efficient and often simpler caching. The second section covers a full multi-
    stage Docker build, and the last section covers how to deploy the frontend and backend as
    separate images.

    Prerequisites
    This guide assumes your have a basic understanding of Docker and how it works. If you are
    new to Docker, you can start with the Docker overview guide.
    You'll also want to complete the following prerequisites:
      1. Created an app following the Getting Started guide
      2. Setup an auth provider, the Authentication guide is a good starting point for this, the
         default Guest auth provider is not intended for use in containerized environments
      3. A Postgres database setup that you are able to connect to, the Database guide can help
         you with this
               WARNING
         Moving forward without addressing these prerequisites is very likely to cause undesirable
         results, the most common being not having a proper auth provider setup as the default
         Guest auth provider is not intended for use in containerized environments.

    Host Build
    This section describes how to build a Docker image from a Backstage repo with mostFeedback
                                                                                          of the
    build happening outside of Docker. This is almost always the faster approach, as the build
https://backstage.io/docs/deployment/docker                                                                                    1/10
2/21/26, 3:30 PM                              Building a Docker image | Backstage Software Catalog and Developer Platform

    steps tend to execute faster, and it's possible to have more efficient caching of dependencies
    on the host, where a single change won't bust the entire cache.
    The required steps in the host build are to install dependencies with yarn install , generate
    type definitions using yarn tsc , and build the backend package with yarn build:backend .
    In a CI workflow it might look something like this, from the root:
        yarn install --immutable

        # tsc outputs type definitions to dist-types/ in the repo root, which are
        then consumed by the build
        yarn tsc

        # Build the backend, which bundles it all up into the packages/backend/dist
        folder.
        yarn build:backend



    Once the host build is complete, we are ready to build our image. The following Dockerfile is
    included when creating a new app with @backstage/create-app :
        FROM node:24-trixie-slim

        # Set Python interpreter for `node-gyp` to use
        ENV PYTHON=/usr/bin/python3

        # Install isolate-vm dependencies, these are needed by the @backstage/plugin-
        scaffolder-backend.
        RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
            --mount=type=cache,target=/var/lib/apt,sharing=locked \
            apt-get update && \
            apt-get install -y --no-install-recommends python3 g++ build-essential &&
            rm -rf /var/lib/apt/lists/*

        # Install sqlite3 dependencies. You can skip this if you don't use sqlite3 in
        the image,
        # in which case you should also move better-sqlite3 to "devDependencies" in
        package.json.
        RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
            --mount=type=cache,target=/var/lib/apt,sharing=locked \
            apt-get update && \
            apt-get install -y --no-install-recommends libsqlite3-dev && \
            rm -rf /var/lib/apt/lists/*

        # From here on we use the least-privileged `node` user to run the backend.
        USER node
                                                                                                                            Feedback
https://backstage.io/docs/deployment/docker                                                                                            2/10
2/21/26, 3:30 PM                              Building a Docker image | Backstage Software Catalog and Developer Platform



        # This should create the app dir as `node`.
        # If it is instead created as `root` then the `tar` command below will fail:
        `can't create directory 'packages/': Permission denied`.
        # If this occurs, then ensure BuildKit is enabled (`DOCKER_BUILDKIT=1`) so the
        app dir is correctly created as `node`.
        WORKDIR /app

        # Copy files needed by Yarn
        COPY --chown=node:node .yarn ./.yarn
        COPY --chown=node:node .yarnrc.yml ./
        COPY --chown=node:node backstage.json ./

        # This switches many Node.js dependencies to production mode.
        ENV NODE_ENV=production

        # This disables node snapshot for Node 20 to work with the Scaffolder
        ENV NODE_OPTIONS="--no-node-snapshot"

        # Copy repo skeleton first, to avoid unnecessary docker cache invalidation.
        # The skeleton contains the package.json of each package in the monorepo,
        # and along with yarn.lock and the root package.json, that's enough to run yar
        install.
        COPY --chown=node:node yarn.lock package.json
        packages/backend/dist/skeleton.tar.gz ./
        RUN tar xzf skeleton.tar.gz && rm skeleton.tar.gz

        RUN --
        mount=type=cache,target=/home/node/.cache/yarn,sharing=locked,uid=1000,gid=100
        \
            yarn workspaces focus --all --production && rm -rf "$(yarn cache clean)"

        # This will include the examples, if you don't need these simply remove this
        line
        COPY --chown=node:node examples ./examples

        # Then copy the rest of the backend bundle, along with any other files we migh
        want.
        COPY --chown=node:node packages/backend/dist/bundle.tar.gz app-config*.yaml ./
        RUN tar xzf bundle.tar.gz && rm bundle.tar.gz

        CMD ["node", "packages/backend", "--config", "app-config.yaml", "--config",
        "app-config.production.yaml"]



    For more details on how the backend:bundle command and the skeleton.tar.gz file works,
    see the backend:bundle command docs.
                                                                              Feedback
https://backstage.io/docs/deployment/docker                                                                                 3/10
2/21/26, 3:30 PM                              Building a Docker image | Backstage Software Catalog and Developer Platform

    The Dockerfile is located at packages/backend/Dockerfile , but needs to be executed with
    the root of the repo as the build context, in order to get access to the root yarn.lock and
    package.json , along with any other files that might be needed, such as .npmrc .


    The @backstage/create-app command adds the following .dockerignore in the root of the
    repo to speed up the build by reducing build context size:
        .git
        .yarn/cache
        .yarn/install-state.gz
        node_modules
        packages/*/src
        packages/*/node_modules
        plugins
        *.local.yaml



    With the project built and the .dockerignore and Dockerfile in place, we are now ready to
    build the final image. From the root of the repo, execute the build:
        docker image build . -f packages/backend/Dockerfile --tag backstage



    To try out the image locally you can run the following:
        docker run -it -p 7007:7007 backstage



    You should then start to get logs in your terminal, and then you can open your browser at
     http://localhost:7007




    Multi-stage Build
               NOTE
         The .dockerignore is different in this setup, read on for more details.
    This section describes how to set up a multi-stage Docker build that builds the entire project
    within Docker. This is typically slower than a host build, but is sometimes desired because
    Docker in Docker is not available in the build environment, or due to other requirements.
                                                                                         Feedback
https://backstage.io/docs/deployment/docker                                                                                 4/10
2/21/26, 3:30 PM                              Building a Docker image | Backstage Software Catalog and Developer Platform

    The build is split into three different stages, where the first stage finds all of the package.json
    files that are relevant for the initial install step enabling us to cache the initial yarn install
    that installs all dependencies. The second stage executes the build itself, and is similar to the
    steps we execute on the host in the host build. The third and final stage then packages it all
    together into the final image, and is similar to the Dockerfile of the host build.
    The following Dockerfile executes the multi-stage build and should be added to the repo
    root:
        # Stage 1 - Create yarn install skeleton layer
        FROM node:24-trixie-slim AS packages

        WORKDIR /app
        COPY backstage.json package.json yarn.lock ./
        COPY .yarn ./.yarn
        COPY .yarnrc.yml ./

        COPY packages packages

        # Comment this out if you don't have any internal plugins
        COPY plugins plugins

        RUN find packages \! -name "package.json" -mindepth 2 -maxdepth 2 -exec rm -rf
        {} \+

        # Stage 2 - Install dependencies and build packages
        FROM node:24-trixie-slim AS build

        # Set Python interpreter for `node-gyp` to use
        ENV PYTHON=/usr/bin/python3

        # Install isolate-vm dependencies, these are needed by the @backstage/plugin-
        scaffolder-backend.
        RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
            --mount=type=cache,target=/var/lib/apt,sharing=locked \
            apt-get update && \
            apt-get install -y --no-install-recommends python3 g++ build-essential &&
            rm -rf /var/lib/apt/lists/*

        # Install sqlite3 dependencies. You can skip this if you don't use sqlite3 in
        the image,
        # in which case you should also move better-sqlite3 to "devDependencies" in
        package.json.
        RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
            --mount=type=cache,target=/var/lib/apt,sharing=locked \
            apt-get update && \
            apt-get install -y --no-install-recommends libsqlite3-dev && \                                                  Feedback
https://backstage.io/docs/deployment/docker                                                                                            5/10
2/21/26, 3:30 PM                              Building a Docker image | Backstage Software Catalog and Developer Platform

                rm -rf /var/lib/apt/lists/*

        USER node
        WORKDIR /app

        COPY --from=packages --chown=node:node /app .

        RUN --
        mount=type=cache,target=/home/node/.cache/yarn,sharing=locked,uid=1000,gid=100
        \
            yarn install --immutable

        COPY --chown=node:node . .

        RUN yarn tsc
        RUN yarn --cwd packages/backend build

        RUN mkdir packages/backend/dist/skeleton packages/backend/dist/bundle \
            && tar xzf packages/backend/dist/skeleton.tar.gz -C
        packages/backend/dist/skeleton \
            && tar xzf packages/backend/dist/bundle.tar.gz -C
        packages/backend/dist/bundle

        # Stage 3 - Build the actual backend image and install production dependencies
        FROM node:24-trixie-slim

        # Set Python interpreter for `node-gyp` to use
        ENV PYTHON=/usr/bin/python3

        # Install isolate-vm dependencies, these are needed by the @backstage/plugin-
        scaffolder-backend.
        RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
            --mount=type=cache,target=/var/lib/apt,sharing=locked \
            apt-get update && \
            apt-get install -y --no-install-recommends python3 g++ build-essential &&
            rm -rf /var/lib/apt/lists/*

        # Install sqlite3 dependencies. You can skip this if you don't use sqlite3 in
        the image,
        # in which case you should also move better-sqlite3 to "devDependencies" in
        package.json.
        RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
            --mount=type=cache,target=/var/lib/apt,sharing=locked \
            apt-get update && \
            apt-get install -y --no-install-recommends libsqlite3-dev && \
            rm -rf /var/lib/apt/lists/*

        # From here on we use the least-privileged `node` user to run the backend.
        USER node                                                                                                           Feedback
https://backstage.io/docs/deployment/docker                                                                                            6/10
2/21/26, 3:30 PM                              Building a Docker image | Backstage Software Catalog and Developer Platform

        # This should create the app dir as `node`.
        # If it is instead created as `root` then the `tar` command below will
        # fail: `can't create directory 'packages/': Permission denied`.
        # If this occurs, then ensure BuildKit is enabled (`DOCKER_BUILDKIT=1`)
        # so the app dir is correctly created as `node`.
        WORKDIR /app

        # Copy the install dependencies from the build stage and context
        COPY --from=build --chown=node:node /app/.yarn ./.yarn
        COPY --from=build --chown=node:node /app/.yarnrc.yml ./
        COPY --from=build --chown=node:node /app/backstage.json ./
        COPY --from=build --chown=node:node /app/yarn.lock /app/package.json
        /app/packages/backend/dist/skeleton/ ./

        # Note: The skeleton bundle only includes package.json files -- if your app ha
        # plugins that define a `bin` export, the bin files need to be copied as well
        to
        # be linked in node_modules/.bin during yarn install.

        RUN --
        mount=type=cache,target=/home/node/.cache/yarn,sharing=locked,uid=1000,gid=100
        \
            yarn workspaces focus --all --production && rm -rf "$(yarn cache clean)"

        # Copy the built packages from the build stage
        COPY --from=build --chown=node:node /app/packages/backend/dist/bundle/ ./

        # Copy any other files that we need at runtime
        COPY --chown=node:node app-config*.yaml ./

        # This will include the examples, if you don't need these simply remove this
        line
        COPY --chown=node:node examples ./examples

        # This switches many Node.js dependencies to production mode.
        ENV NODE_ENV=production

        # This disables node snapshot for Node 20 to work with the Scaffolder
        ENV NODE_OPTIONS="--no-node-snapshot"

        CMD ["node", "packages/backend", "--config", "app-config.yaml", "--config",
        "app-config.production.yaml"]



    Note that a newly created Backstage app will typically not have a plugins/ folder, so you will
    want to comment that line out. This build also does not work in the main repo, since the
    backstage-cli which is used for the build doesn't end up being properly installed.

                                                                                        Feedback
https://backstage.io/docs/deployment/docker                                                                                 7/10
2/21/26, 3:30 PM                              Building a Docker image | Backstage Software Catalog and Developer Platform

    To speed up the build when not running in a fresh clone of the repo you should set up a
    .dockerignore . This one is different than the host build one, because we want to have access
    to the source code of all packages for the build. We can however ignore any existing build
    output or dependencies on the host. For our new .dockerignore , replace the contents of
    your existing one with this:
        dist-types
        node_modules
        packages/*/dist
        packages/*/node_modules
        plugins/*/dist
        plugins/*/node_modules
        *.local.yaml



    Once you have added both the Dockerfile and .dockerignore to the root of your project,
    run the following to build the container under a specified tag.
        docker image build -t backstage .



    To try out the image locally you can run the following:
        docker run -it -p 7007:7007 backstage



    You should then start to get logs in your terminal, and then you can open your browser at
     http://localhost:7007




    Separate Frontend
               NOTE
         This is an optional step, and you will lose out on the features of the @backstage/plugin-
         app-backend plugin. Most notably the frontend configuration will no longer be injected by
         the backend, you will instead need to use the correct configuration when building the
         frontend bundle.
    It is sometimes desirable to serve the frontend separately from the backend, either from a
    separate image or for example a static file serving provider. The first step in doing so is to
    remove the app-backend plugin from the backend package, which is done as follows:      Feedback
https://backstage.io/docs/deployment/docker                                                                                 8/10
2/21/26, 3:30 PM                              Building a Docker image | Backstage Software Catalog and Developer Platform

       1. Delete packages/backend/src/plugins/app.ts
       2. Remove the following line from packages/backend/src/index.ts :
               backend.add(import('@backstage/plugin-app-backend'));



      3. Remove the @backstage/plugin-app-backend and the app package dependency (e.g.
         app ) from packages/backend/package.json . If you don't remove the app package
         dependency the app will still be built and bundled with the backend.
    Once the app-backend is removed from the backend, you can use your favorite static file
    serving method for serving the frontend. An example of how to set up an NGINX image is
    available in the contrib folder in the main repo
    Note that if you're building a separate docker build of the frontend you probably need to adjust
    .dockerignore appropriately. Most likely by making sure packages/app/dist is not ignored.




    Troubleshooting Tips
    When building Docker images you may run into problems from time to time, there are two
    handy flags you can use to help:
        --progress=plain : this will give you a more verbose output and not fold the logs into
        sections. This is very useful when have an error but it just shows you the last command
        and possibly an exit code. Using this flag you are more likely to see where the error
        actually is.
        --no-cache : this will rebuild all the layers every time. This is helpful when you want to be
        sure that it's building from scratch.
    Here's an example of these flags in use:
        docker image build . -f packages/backend/Dockerfile --tag backstage --
        progress=plain --no-cache




    Community Contributed Dockerfile
    Alternatives                     Feedback
https://backstage.io/docs/deployment/docker                                                                                 9/10
2/21/26, 3:30 PM                              Building a Docker image | Backstage Software Catalog and Developer Platform

    The Dockerfile mentioned above located in packages/backend is maintained by the
    maintainers of Backstage, however there are also community contributed Dockerfile
    alternatives located in contrib/docker . The Dockerfile s in contrib/docker are not
    maintained by the maintainers of Backstage and are not necessarily updated when the
    Dockerfile located in packages/backend is updated.



    Minimal Hardened Image
    A contributed Dockerfile exists within the directory of contrib/docker/minimal-
    hardened-image which uses the wolfi-base image to reduce vulnerabilities. When this was
    contributed, this alternative Dockerfile reduced 98.2% of vulnerabilities in the built
    Backstage docker image when compared with the image built from
    packages/backend/Dockerfile .


    To reduce maintenance, the digest of the image has been removed from the
    contrib/docker/minimal-hardened-image/Dockerfile file. A complete example with the
    digest would be cgr.dev/chainguard/wolfi-
    base:latest@sha256:3d6dece13cdb5546cd03b20e14f9af354bc1a56ab5a7b47dca3e6c155721
    1fcf   and it is suggested to update the FROM line in the Dockerfile to use a digest. Please do
    a docker pull on the image to get the latest digest. Using the digest allows tools such as
    Dependabot or Renovate to know exactly which image digest is being utilized and allows for
    Pull Requests to be triggered when a new digest is available.
    It is suggested to setup Dependabot/Renovate or a similar tool to ensure the image is kept up
    to date so that vulnerability fixes that have been addressed are pulled in frequently.




                                                                                                                            Feedback
https://backstage.io/docs/deployment/docker                                                                                            10/10
