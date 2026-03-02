2/21/26, 3:28 PM                                        Technical overview | Backstage Software Catalog and Developer Platform



                     Overview               Technical overview

    Technical overview
    Purpose
    Backstage is an open source framework for building developer portals that was created at
    Spotify to simplify end-to-end software development. As Spotify grew, their infrastructure
    became more fragmented and teams couldn't find the APIs they were supposed to use, or who
    owned a service, or documentation on anything.
    Backstage is powered by a centralized software catalog and utilizes an abstraction layer that
    sits on top of all of your infrastructure and developer tooling, allowing you to manage all of
    your software, services, tooling, and testing in one place.
    Backstage uses a plugin-architecture which allows you to customize the functionality of your
    Backstage application using a wide variety of available plugins or you can write your own. It
    also includes automated templates that your teams can use to create new microservices,
    helping to ensure consistency and adherence to your best practices. Backstage also provides
    the ability to create, maintain, and find the documentation for all of your software.
    Backstage is now a CNCF incubation project.

    Benefits
            For engineering managers, it allows you to maintain standards and best practices across
            the organization, and can help you manage your whole tech ecosystem, from migrations to
            test certification.
            For end users (developers), it makes it fast and simple to build software components in a
            standardized way, and it provides a central place to manage all projects and
            documentation.
            For platform engineers, it enables extensibility and scalability by letting you easily
            integrate new tools and services (via plugins), as well as extending the functionality of
            existing ones.
                                                                                               Feedback
https://backstage.io/docs/overview/technical-overview                                                                            1/6
2/21/26, 3:28 PM                                        Technical overview | Backstage Software Catalog and Developer Platform

         For everyone, it is a single, consistent experience that ties all of your infrastructure tooling,
         resources, standards, owners, contributors, and administrators together in one place.
    If you have question or want support, please join our Discord server.

    Core Features
    Backstage includes the following set of core features:
        Authentication and Identity - Sign-in and identification of users, and delegating access to
        third-party resources, using built-in authentication providers.
        Kubernetes - A tool that allows developers to check the health of their services whether it
        is on a local host or in production.
        Notifications - Provides a means for plugins and external services to send messages to
        either individual users or groups.
        Permissions - Ability to enforce rules concerning the type of access a user is given to
        specific data, APIs, or interface actions.
        Search - Search for information in the Backstage ecosystem. You can customize the look
        and feel of each search result and use your own search engine.
        Software Catalog - A centralized system that contains metadata for all your software, such
        as services, websites, libraries, ML models, data pipelines, and so on. It can also contain
        metadata for the physical or virtual infrastructure needed to operate a piece of software.
        The software catalog can be viewed and searched through a UI.
        Software Templates - A tool to help you create components inside Backstage. A template
        can load skeletons of code, include some variables, and then publish the template to a
        location, such as GitHub.
        TechDocs - A docs-like-code solution built into Backstage. Documentation is written in
        Markdown files which lives together with the code.

    Plugin Architecture Overview
    Plugins are client side applications which mount themselves on the Backstage UI. They allow
    you to incorporate a wide variety of infrastructure and software development tools into your
    Backstage application. Backstage uses a plugin-architecture to provide a consistent user
    experience, in a single UI, around all of your plugins.
    The Backstage architecture supports three types of plugins:                        Feedback
https://backstage.io/docs/overview/technical-overview                                                                            2/6
2/21/26, 3:28 PM                                          Technical overview | Backstage Software Catalog and Developer Platform

        Standalone - runs entirely in a browser and it does not make any API requests to other
        services.
        Service backed - makes API requests to a service within the ecosystem of the organization
        running Backstage.
        Third-party backed - similar to service-backed, but the service backing the plugin is
        hosted outside of the ecosystem of the company hosting Backstage.
    Many of the features available in Backstage are provided by plugins. For example, the Software
    Catalog is a service backed plugin. When you view the catalog, it retrieves a set of services
    ("entities") from the Backstage Backend service and renders them in a table in the UI for you.

    Software Catalog System Model
    The system model behind the software catalog is based on entities and it models two main
    types:
        Core Entities
        Organizational Entities
    Core Entities include:


         Components - Individual pieces of software that can be tracked in source control and can
        implement APIs for other components to consume.
         APIs - Implemented by components and form the boundaries between different
        components. The API can be either public, restricted, or private.
         Resources - The physical or virtual infrastructure needed to operate a component.


                                            providesAPI                                              dependsOn
                      API                                               Component                                               Resource
          (e.g. OpenAPI, gRPC API,          consumesAPI         (e.g. backend service, data                              (e.g. SQL Database, S3
               Avro, Dataset, ...)                                      pipeline ...)                dependsOn                  bucket, ...)



                                                                         partOf          dependsOn                                          dependsOn



     Organizational Entities    include:
        User - A person, such as an employee, contractor, or similar.

        Group - An organizational entity, such as a team, business unit, and so on.


    When you have a large catalogue of components, APIs, and resources, it can be difficult to
                                                                                     Feedback
    understand how they work together. Ecosystem modeling allows you to organize a large
https://backstage.io/docs/overview/technical-overview                                                                                                   3/6
2/21/26, 3:28 PM                                        Technical overview | Backstage Software Catalog and Developer Platform

    catalog of core entities into:
         Systems - A collection of resources and components that cooperate to perform a function
         by exposing one or several public APIs. It hides the resources and private APIs between
         the components from the consumer.
         Domains - A collection of systems that share terminology, domain models, metrics, KPIs,
         business purpose, or documentation.
    There are three additional items that can be part of the system model:
          Location - A marker that references other places to look for catalog data.

          Type - It has no set meaning. You can assign your own types and use them as desired.

          Template - Describes both the parameters that are rendered in the frontend part of the
         scaffolding wizard, and the steps that are executed when scaffolding that component.
    The following diagram illustrates an example of ecosystem modeling, and provides sample
    relationships between a domain, system, core entities, and organization entities.




                                                                                                                                 Feedback
https://backstage.io/docs/overview/technical-overview                                                                                       4/6
2/21/26, 3:28 PM                                                Technical overview | Backstage Software Catalog and Developer Platform


                Kind: Template
                                                   Kind: Location                                                                         Types
           Parameters rendered in the
                                               a marker that references
             frontend and the steps                                                                                                      database
                                                other places to look for
           executed in the scaffolding
                                                     catalog data
                    process                                                                                                              s3-bucket

                                                                                                                                          cluster
                   subdomainOf
                                                                                         partOf             Resource
                                                                                                     (e.g. SQL Database, S3
                                                                                                            bucket, ...)

                    Domain                    partOf             System
                 (e.g. domain                           Collection of entities that        dependsOn           dependsOn
              models, metrics, KPIs,                   cooperate to perform some
               business purpose)                                 function                                                                 Types


                                                             partOf
                                                                                                                                          Service
                                                                                                                                          service
                                                                                         partOf           Component
                                                                                                  (e.g. backend service, data            website
                           Types                                                                          pipeline ...)
                          openapi                                                                                                        website
                                                                                                                                         library
                                                                                       providesAPI
                          asyncapi                                 API
                                                       (e.g. OpenAPI, gRPC API,
                                                                                      consumesAPI
                           graphql                          Avro, Dataset, ...)

                            grpc




                                                                OwnedBy                    OwnerOf




                                      Types
                                       team                                                       parentOf

                                   business-unit                           Kind: Group
                                                                                                     childOf
                                   product-area

                                       root                        hasMember           memberOf




                                                                            Kind: User




    The following shows an example of viewing all of the components, APIs, and resources that are
    managed by your group after setting up the relationships to create a group organizational
    entity.




                                                                                                                                          Feedback
https://backstage.io/docs/overview/technical-overview                                                                                                5/6
2/21/26, 3:28 PM                                        Technical overview | Backstage Software Catalog and Developer Platform




                                                                                                                                 Feedback
https://backstage.io/docs/overview/technical-overview                                                                                       6/6
