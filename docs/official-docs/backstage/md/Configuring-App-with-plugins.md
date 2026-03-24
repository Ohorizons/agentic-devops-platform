2/21/26, 3:29 PM                                        Configuring App with plugins | Backstage Software Catalog and Developer Platform



                     Getting Started                 Configuring Backstage                   Configuring App with plugins

    Configuring App with plugins
    Audience: Developers
                NOTE
         Backstage plugins are primarily written using TypeScript, Node.js and React. Having an
         understanding of these technologies will be beneficial on your journey to customizing
         Backstage!

    Summary
    Backstage plugins customize the app for your needs. There is a plugin directory with plugins
    for many common infrastructure needs - CI/CD, monitoring, auditing, and more.

    Adding existing plugins to your app
    The following steps assume that you have created a Backstage app and want to add an
    existing plugin to it.
    You can find many wonderful plugins out there for Backstage, for example through the
    Community Plugins Repository and the Backstage Plugin Directory.
    Adding plugins to your Backstage app is generally a simple process, and ideally each plugin
    will come with its own documentation on how to install and configure it. In this example we will
    add the Tech Radar plugin to our Backstage app.
      1. Add the plugin's npm package to the repo:
                From your Backstage root directory
                yarn --cwd packages/app add @backstage-community/plugin-tech-radar



                                                                                                                                           Feedback
https://backstage.io/docs/getting-started/configure-app-with-plugins                                                                                  1/4
2/21/26, 3:29 PM                                        Configuring App with plugins | Backstage Software Catalog and Developer Platform

           Note the plugin is added to the app package, rather than the root package.json .
           Backstage Apps are set up as monorepos with Yarn workspaces. Frontend UI Plugins are
           generally added to the app folder, while Backend Plugins are added to the backend
           folder. In the example above, the plugin is added to the app package because we are
           adding the frontend plugin.
        2. Now, modify your app routes to include the Router component exported from the tech
           radar, for example:
                packages/app/src/App.tsx
                import { TechRadarPage } from '@backstage-community/plugin-tech-radar';

                const routes = (
                   <FlatRoutes>
                     <Route
                        path="/tech-radar"
                        element={<TechRadarPage width={1500} height={800} />}
                     />
                   </FlatRoutes>
                );



            This is just one example, and if you'd like to continue adding the Tech Radar plugin you
            can do so by going here, keep in mind each Backstage instance may integrate content or
            cards to suit their needs on different pages, tabs, etc. In addition, while some plugins such
            as this example are designed to be used in a stand-alone fashion, others may be intended
            to annotate or support specific software catalog entities and would be added elsewhere in
            the app.
    Adding a plugin page to the Sidebar
    In a standard Backstage app created with @backstage/create-app, the sidebar is managed
    inside packages/app/src/components/Root/Root.tsx . The file exports the entire Sidebar
    element of your app, which you can extend with additional entries by adding new
     SidebarItem elements.


    For example, if you install the api-docs plugin, a matching SidebarItem could be something
    like this:
        packages/app/src/components/Root/Root.tsx
                                                                                                                                           Feedback
https://backstage.io/docs/getting-started/configure-app-with-plugins                                                                                  2/4
2/21/26, 3:29 PM                                        Configuring App with plugins | Backstage Software Catalog and Developer Platform


        // Import icon from Material UI
        import ExtensionIcon from '@material-ui/icons/Extension';

        // ... inside the AppSidebar component
        <SidebarItem icon={ExtensionIcon} to="api-docs" text="APIs" />;



    You can also use your own SVGs directly as icon components. Just make sure they are sized
    according to the Material UI's SvgIcon default of 24x24px, and wrap the SVG elements in a
    SvgIcon component like this:



        import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

        export const ExampleIcon = (props: SvgIconProps) => (
           <SvgIcon {...props}>
             <g>
               <path ... />
               <path ... />
             </g>
           </SvgIcon>
        );



    On mobile devices the Sidebar is displayed at the bottom of the screen. For customizing the
    experience you can group SidebarItems in a SidebarGroup (Example 1) or create a
    SidebarGroup with a link (Example 2). All SidebarGroup s are displayed in the bottom
    navigation with an icon.
        // Example 1
        <SidebarGroup icon={<MenuIcon />} label="Menu">
          ...
          <SidebarItem icon={ExtensionIcon} to="api-docs" text="APIs" />
          ...
        <SidebarGroup />




        // Example 2
        <SidebarGroup label="Search" icon={<SearchIcon />} to="/search">
          ...
          <SidebarItem icon={ExtensionIcon} to="api-docs" text="APIs" />
          ...
        <SidebarGroup />



    If no SidebarGroup is provided a default menu will display the Sidebar content. Feedback
https://backstage.io/docs/getting-started/configure-app-with-plugins                                                                       3/4
2/21/26, 3:29 PM                                        Configuring App with plugins | Backstage Software Catalog and Developer Platform




                                                                                                                                           Feedback
https://backstage.io/docs/getting-started/configure-app-with-plugins                                                                                  4/4
