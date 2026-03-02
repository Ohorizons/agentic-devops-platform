2/21/26, 3:29 PM                                              Database | Backstage Software Catalog and Developer Platform



                      Getting Started                 Configuring Backstage              Database

     Database
     Audience: Admins

     Summary
     This guide walks through how to set up a PostgreSQL database to host your Backstage data. It
     assumes you've already have a scaffolded Backstage app from following the Creating your
     Backstage App guide.
     By the end of this tutorial, you will have a working PostgreSQL database hooked up to your
     Backstage install.

     Prerequisites
     This guide assumes a basic understanding of working on a Linux based operating system and
     have some experience with the terminal, specifically, these commands: apt-get , psql , yarn .
         Access to a Linux-based operating system, such as Linux, MacOS or Windows Subsystem
         for Linux
         An account with elevated rights to install prerequisites on your operating system
         If the database is not hosted on the same server as the Backstage app, the PostgreSQL
         port needs to be accessible (the default is 5432 or 5433 )

     1. Install and Configure PostgreSQL
                ALREADY CONFIGURED YOUR DATABASE?
          If you've already installed PostgreSQL and created a schema and user, you can skip to
          Step 2.
     Let's install PostgreSQL and get it set up for our Backstage app. First, we'll need to actually
     install the SQL server.                                                               Feedback
https://backstage.io/docs/getting-started/config/database                                                                    1/7
2/21/26, 3:29 PM                                            Database | Backstage Software Catalog and Developer Platform


                CAUTION
          The command below is for Linux. If you're not on Linux or having issues with package
          managers, check out how to install PostgreSQL to help you get sorted.

        sudo apt-get install postgresql



     To test if your database is working:
        sudo -u postgres psql



     You should see a very welcoming message, like:
        psql (12.9 (Ubuntu 12.9-0ubuntu0.20.04.1))
        Type "help" for help.

        postgres=#



     For this tutorial we're going to use the existing postgres user. The next step is to set the
     password for this user. You'll want to replace the <secret> with a real password in the
     command below. Keep note of the password you choose here, you'll need it later.
        postgres=# ALTER USER postgres PASSWORD '<secret>';



     That's enough database administration to get started. Type \q , followed by pressing the enter
     key. Then again type exit and press enter. Next, you need to install and configure the client.

     2. Configuring Backstage pg Client
     Use your favorite editor to open app-config.yaml and add your PostgreSQL configuration in
     the root directory of your Backstage app using the credentials from the previous steps.
        app-config.yaml
        backend:

                                                                                                                           Feedback
          database:
            client: better-sqlite3

https://backstage.io/docs/getting-started/config/database                                                                             2/7
2/21/26, 3:29 PM                                            Database | Backstage Software Catalog and Developer Platform

                 connection: ':memory:'
                 # config options: https://node-postgres.com/apis/client
                 client: pg
                 connection:
                   host: ${POSTGRES_HOST}
                   port: ${POSTGRES_PORT}
                   user: ${POSTGRES_USER}
                   password: ${POSTGRES_PASSWORD}



     The ${...} syntax denotes environment variables, specifically,
      1. POSTGRES_HOST - The URL/IP to access your PostgreSQL database at. If you've installed
         PostgreSQL locally, this will likely be 127.0.0.1.
      2. POSTGRES_PORT - The port to access your PostgreSQL database on. If you've installed
         PostgreSQL locally, this will be 5432 or 5433 .
      3. POSTGRES_USER - The user from the SQL command above, postgres .
      4. POSTGRES_PASSWORD - The password you set in the SQL command above.
     When filling these out, you have 2 choices,
      1. Use environment variables when you launch Backstage, either using an environment
         variable injector like dotenv-cli or env-cmd or loading the variables directly with EXPORT
         POSTGRES_...=... .

      2. Replacing the entire ${POSTGRES_...} string with the value you identified earlier. This is
         the less secure option, but worth doing if you don't have much experience with
         environment variables.
                DANGER
          If you opt for the second option of replacing the entire string, take care to not commit
          your app-config.yaml to source control. It may contain passwords that you don't want
          leaked.
          Passwordless PostgreSQL in the Cloud
          If you want to host your PostgreSQL server in the cloud with passwordless authentication,
          you can use Azure Database for PostgreSQL with Microsoft Entra authentication or
          Google Cloud SQL for PostgreSQL with Cloud IAM.
          Azure with Entra authentication
          Remove password from the connection configuration and set type to azure . Feedback
https://backstage.io/docs/getting-started/config/database                                                                  3/7
2/21/26, 3:29 PM                                            Database | Backstage Software Catalog and Developer Platform

          Optionally set tokenCredential with the following properties. If no credential
          information is provided, it will default to using Default Azure Credential and a
          tokenRenewalOffsetTime of 5 minutes.
          Credential Selection
          The credential type is automatically inferred based on the fields you provide:
               Client Secret Credential is used when all three are provided:
                         tenantId

                         clientId

                         clientSecret

              Managed Identity Credential is used when only clientId is provided. This enables
              user-assigned managed identity.
              Default Azure Credential is used when no credential fields are provided. Default
              Azure Credential supports many credential types, choosing one based on the runtime
              environment.
          Token Renewal
          Set tokenRenewalOffsetTime to control how early OAuth tokens should be refreshed.
          The value may be:
              A human-readable string such as '1d', '2 hours', '30 seconds'
              A duration object, e.g. { minutes: 3, seconds: 30 }
          Azure PostgreSQL uses short-lived Entra ID access tokens. By default, the database
          connector refreshes tokens 5 minutes before they expire.
          User Configuration
          Set user to the display name of your Entra ID group, service principal, or managed
          identity. Set it to the user principal name if you're authenticating with a user's credentials.
          Example
             app-config.yaml
             backend:
               database:
                 client: pg
                 connection:
                   type: azure
                                                                                                                           Feedback
https://backstage.io/docs/getting-started/config/database                                                                             4/7
2/21/26, 3:29 PM                                            Database | Backstage Software Catalog and Developer Platform

                          tokenCredential:
                            tokenRenewalOffsetTime: 5 minutes
                          host: ${POSTGRES_HOST}
                          port: ${POSTGRES_PORT}
                          user: ${POSTGRES_USER}
                          password: ${POSTGRES_PASSWORD}



          Google with Cloud IAM
          Remove password from the connection configuration and set type to cloudsql .
          Under the hood, this implements Automatic IAM Database Authentication.
          For an IAM user account, set user to the user's email address. For a service account, set
          user to the service account's email without the .gserviceaccount.com domain suffix.


             app-config.yaml
             backend:
               database:
                 client: pg
                 connection:
                   type: cloudsql
                   instance: my-project:region:my-instance
                   host: ${POSTGRES_HOST}
                   port: ${POSTGRES_PORT}
                   user: ${POSTGRES_USER}
                   password: ${POSTGRES_PASSWORD}




     Start the Backstage app:
        yarn start



     After the Backstage frontend launches, you should notice that nothing has changed. This is a
     good sign. If everything is setup correctly above, this means that the data is flowing from the
     demo data files directly into your database!
     We've now made your data persist in your Backstage database.

     Alternatives                                                                                                          Feedback
https://backstage.io/docs/getting-started/config/database                                                                             5/7
2/21/26, 3:29 PM                                            Database | Backstage Software Catalog and Developer Platform

     You may not want to install Postgres locally, the following sections outline alternatives.
     Docker
     You can run Postgres in a Docker container, this is great for local development or getting a
     Backstage POC up and running quickly, here's how:
     First we need to pull down the container image, we'll use Postgres 18, check out the Postgres
     Version Policy to learn which versions are supported.
        docker pull postgres:18-trixie



     Then we just need to start up the container.
        docker run -d --name postgres --restart=always -p 5432:5432 -e
        POSTGRES_PASSWORD=<secret> postgres:18-trixie



     This will run Postgres in the background for you, but remember to start it up again when you
     reboot your system.
     Docker Compose
     Another way to run Postgres is to use Docker Compose, here's what that would look like:
        docker-compose.local.yaml
        services:
          postgres:
            image: postgres:18-trixie
            environment:
              POSTGRES_USER: postgres
              POSTGRES_PASSWORD: <secret>
              # If you want to set a timezone you can use the following environment
        variables, this is handy when trying to figure out when scheduled tasks
        will run!
              # TZ: Europe/Stockholm
              # PGTZ: Europe/Stockholm
            ports:
              - 5432:5432


                                                                                                                           Feedback
https://backstage.io/docs/getting-started/config/database                                                                             6/7
2/21/26, 3:29 PM                                            Database | Backstage Software Catalog and Developer Platform

     Then you would just run docker compose -f docker-compose.local.yaml up to start
     Postgres.

     Next Steps
     We recommend you read Setting up authentication next.

     Further Reading
     If you want to read more about the database configuration, here are some helpful links:
          Configuring Plugin Databases
          Manual Knex Rollback
          Read more about Knex, the database wrapper that we use.
          Install pgAdmin 4, a helpful tool for querying your database.




                                                                                                                           Feedback
https://backstage.io/docs/getting-started/config/database                                                                             7/7
