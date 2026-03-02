2/21/26, 3:31 PM                                        Keeping Backstage Updated | Backstage Software Catalog and Developer Platform



                      Getting Started                Keeping Backstage Updated

    Keeping Backstage Updated
    Audience: Developers and Admins
                NOTE
         To better understand the concepts in this section, it's recommended to have an
         understanding of Monorepos, Semantic Versioning and CHANGELOGs.

    Summary
    Backstage is always improving, so it's a good idea to stay in sync with the latest releases.
    Backstage is more of a library than an application or service; similar to create-react-app , the
    @backstage/create-app tool gives you a starting point that's meant to be evolved.




    Updating Backstage versions with
    backstage-cli
    The Backstage CLI has a command to bump all @backstage packages and dependencies
    you're using to the latest versions: versions:bump.
        yarn backstage-cli versions:bump



    The reason for bumping all @backstage packages at once is to maintain the dependencies
    that they have between each other.
                TIP
         To make the version bump process even easier and more streamlined we highly
         recommend using the Backstage yarn plugin
    By default the bump command will upgrade @backstage packages to the latest main release
    line which is released monthly. For those in a hurry that want to track the next release line
                                                                                         Feedback
https://backstage.io/docs/getting-started/keeping-backstage-updated                                                                     1/5
2/21/26, 3:31 PM                                        Keeping Backstage Updated | Backstage Software Catalog and Developer Platform

    which releases weekly can do so using the --release next option.
        yarn backstage-cli versions:bump --release next



    You can also use the --release option to target a specific version. This is useful if you need
    to pin your app to a specific release or if you need to downgrade to a previous version (e.g.
    moving from 1.45.0 back to 1.43.0 ).
                WARNING
         Note that downgrading across significant version gaps (e.g. 2-3 releases) may result in
         package mismatches or errors due to the way Backstage manages dependencies. This
         method is best suited for small adjustments.

        yarn backstage-cli versions:bump --release 1.43.0



    If you are using other plugins you can pass in the --pattern option to update more than just
    the @backstage/* dependencies.
        yarn backstage-cli versions:bump --pattern '@{backstage,roadiehq}/*'




    Following create-app template changes
    The @backstage/create-app command creates the initial structure of your Backstage
    installation from a template. The source of this template in the Backstage repository is
    updated periodically, but your local app and backend packages are established at create-
    app time and won't automatically get these template updates.


    For this reason, any changes made to the template are documented along with upgrade
    instructions in the changelog of the @backstage/create-app package. We recommend
    peeking at this changelog for any applicable updates when upgrading packages. As an
    alternative, the Backstage Upgrade Helper provides a consolidated view of all the changes
    between two versions of Backstage. You can find the current version of your Backstage
    installation in backstage.json .

                                                                                                                                        Feedback
https://backstage.io/docs/getting-started/keeping-backstage-updated                                                                                2/5
    Managing package versions with the
2/21/26, 3:31 PM                                        Keeping Backstage Updated | Backstage Software Catalog and Developer Platform




    Backstage yarn plugin
    The Backstage yarn plugin makes it easier to manage Backstage package versions, by
    determining the appropriate version for each package based on the overall Backstage version
    in backstage.json . This avoids the need to update every package.json across your
    Backstage monorepo, and means that when adding new @backstage dependencies, you don't
    need to worry about figuring out the right version to use to match the currently-installed
    release of Backstage.
    Requirements
    In order to use the yarn plugin, you'll need to be using yarn 4.1.1 or greater.
    Installation
    To install the yarn plugin, run the following command in your Backstage monorepo:
        yarn plugin import https://versions.backstage.io/v1/tags/main/yarn-plugin



    The resulting changes in the file system should be committed to your repo.
                TIP
         For best results it's ideal to add the Backstage Yarn plugin when you are about to do a
         Backstage upgrade as it will make it easier to confirm everything is working.

    Usage
    When the yarn plugin is installed, versions for currently-released @backstage packages can
    be replaced in package.json with the string "backstage:^" . This instructs yarn to resolve the
    version based on the overall Backstage version in backstage.json .
                TIP
         The backstage.json is key for the plugin to work, make sure this file is included in your
         CI/CD pipelines and/or any Container builds.
                                                                                          Feedback
https://backstage.io/docs/getting-started/keeping-backstage-updated                                                                     3/5
2/21/26, 3:31 PM                                        Keeping Backstage Updated | Backstage Software Catalog and Developer Platform

    The backstage-cli versions:bump command documented above will detect the installation
    of the yarn plugin, and when it's installed, will automatically migrate dependencies across the
    monorepo to use it.

    More information on dependency
    mismatches
    Backstage is structured as a monorepo with Yarn workspaces. This means the app and
    backend packages, as well as any custom plugins you've added, are separate packages with
    their own package.json and dependencies.
    When a given dependency version is the same between different packages, the dependency is
    hoisted to the main node_modules folder in the monorepo root to be shared between
    packages. When different versions of the same dependency are encountered, Yarn creates a
    node_modules folder within a particular package. This can lead to multiple versions of the
    same package being installed and used in the same app.
    All Backstage core packages are implemented in such as way that package duplication is not a
    problem. For example, duplicate installations of packages like @backstage/core-plugin-api ,
    @backstage/core-components , @backstage/plugin-catalog-react , and
    @backstage/backend-plugin-api are all acceptable.


    While package duplication might be acceptable in many cases, you might want to deduplicate
    packages for the purpose of optimizing bundle size and installation speed. We recommend
    using deduplication utilities such as yarn dedupe to trim down the number of duplicate
    packages.

    Proxy
    The Backstage CLI uses global-agent and undici to configure HTTP/HTTPS proxy settings
    using environment variables. This allows you to route the CLI’s network traffic through a proxy
    server, which can be useful in environments with restricted internet access.
    Additionally, yarn needs a proxy too (sometimes), when in environments with restricted
    internet access. It uses different settings than the other modules. If you decide to use the
    backstage yarn plugin mentioned above, you will need to set additional proxy values. If you will
    always need proxy settings in all environments and situations, you can add httpProxy and
                                                                                          Feedback
     httpsProxy values to the yarnrc.yml file. If some environments need it (say a developer

https://backstage.io/docs/getting-started/keeping-backstage-updated                                                                     4/5
2/21/26, 3:31 PM                                        Keeping Backstage Updated | Backstage Software Catalog and Developer Platform

    workstation) but other environments do not (perhaps a CI build server running on AWS), then
    you may not want to update the yarnrc.yml file but just set environment variables
     YARN_HTTP_PROXY and YARN_HTTPS_PROXY in the environments/situations where you need to
    proxy.
    If you plan to use the backstage yarn plugin, you will need these extra yarn proxy
    settings to both install the plugin and run the versions:bump command. If you do not plan
    to use the backstage yarn plugin, it seems like the global agent proxy settings alone are
    sufficient.
    Example Configuration
        export HTTP_PROXY=http://proxy.company.com:8080
        export HTTPS_PROXY=https://secure-proxy.company.com:8080
        export NO_PROXY=localhost,internal.company.com
        export GLOBAL_AGENT_HTTP_PROXY=${HTTP_PROXY}
        export GLOBAL_AGENT_HTTPS_PROXY=${HTTPS_PROXY}
        export GLOBAL_AGENT_NO_PROXY=${NO_PROXY}
        export YARN_HTTP_PROXY=${HTTP_PROXY}                                                                                   # optional
        export YARN_HTTPS_PROXY=${HTTPS_PROXY}                                                                                 # optional




    Rollback migrations
    In some cases you could need to downgrade Backstage instance due to some problem or
    maybe because you are using a test environment to validate the new version of Backstage. You
    can check the Manual Rollback using Knex guide to know how to rollback migrations using
    Knex.




                                                                                                                                        Feedback
https://backstage.io/docs/getting-started/keeping-backstage-updated                                                                                5/5
