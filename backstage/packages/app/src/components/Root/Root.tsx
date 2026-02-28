import { PropsWithChildren } from 'react';
import { makeStyles } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import CategoryIcon from '@material-ui/icons/Category';
import ExtensionIcon from '@material-ui/icons/Extension';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import CreateComponentIcon from '@material-ui/icons/AddCircleOutline';
import SchoolIcon from '@material-ui/icons/School';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AssessmentIcon from '@material-ui/icons/Assessment';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LogoFull from './LogoFull';
import LogoIcon from './LogoIcon';
import {
  Settings as SidebarSettings,
  UserSettingsSignInAvatar,
} from '@backstage/plugin-user-settings';
import { SidebarSearchModal } from '@backstage/plugin-search';
import {
  Sidebar,
  sidebarConfig,
  SidebarDivider,
  SidebarGroup,
  SidebarItem,
  SidebarPage,
  SidebarScrollWrapper,
  SidebarSpace,
  useSidebarOpenState,
  Link,
} from '@backstage/core-components';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import { MyGroupsSidebarItem } from '@backstage/plugin-org';
import GroupIcon from '@material-ui/icons/People';
import { NotificationsSidebarItem } from '@backstage/plugin-notifications';

const useSidebarLogoStyles = makeStyles({
  page: {
    position: 'relative',
    '@global': {
      body: {
        backgroundColor: '#FFFFFF',
      },
      '.MuiDrawer-paper': {
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid #e8e8e8',
      },
      '.MuiListItem-root': {
        borderRadius: 0,
      },
      '.MuiListItem-root:hover': {
        backgroundColor: '#f5f5f5',
      },
    },
    '&::before': {
      content: '""',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: 4,
      zIndex: 1400,
      background:
        'linear-gradient(to right, #F25022 0%, #F25022 25%, #7FBA00 25%, #7FBA00 50%, #00A4EF 50%, #00A4EF 75%, #FFB900 75%, #FFB900 100%)',
    },
  },
  root: {
    width: sidebarConfig.drawerWidthClosed,
    height: 3 * sidebarConfig.logoHeight,
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    marginBottom: -14,
  },
  link: {
    width: sidebarConfig.drawerWidthClosed,
    marginLeft: 24,
  },
});

const SidebarLogo = () => {
  const classes = useSidebarLogoStyles();
  const { isOpen } = useSidebarOpenState();

  return (
    <div className={classes.root}>
      <Link to="/" underline="none" className={classes.link} aria-label="Home">
        {isOpen ? <LogoFull /> : <LogoIcon />}
      </Link>
    </div>
  );
};

export const Root = ({ children }: PropsWithChildren<{}>) => {
  const classes = useSidebarLogoStyles();

  return (
    <div className={classes.page}>
      <SidebarPage>
        <Sidebar>
          <SidebarLogo />
          <SidebarGroup label="Search" icon={<SearchIcon />} to="/search">
            <SidebarSearchModal />
          </SidebarGroup>
          <SidebarDivider />
          <SidebarGroup label="Menu" icon={<MenuIcon />}>
            <SidebarItem icon={HomeIcon} to="home" text="Home" />
            <SidebarItem icon={CategoryIcon} to="catalog" text="Catalog" />
            <MyGroupsSidebarItem
              singularTitle="My Group"
              pluralTitle="My Groups"
              icon={GroupIcon}
            />
            <SidebarItem icon={ExtensionIcon} to="api-docs" text="APIs" />
            <SidebarItem icon={LibraryBooks} to="docs" text="Docs" />
            <SidebarItem icon={CreateComponentIcon} to="create" text="Create..." />
            <SidebarDivider />
            <SidebarItem icon={SchoolIcon} to="learning" text="Learning" />
            <SidebarItem icon={AssessmentIcon} to="copilot-metrics" text="Copilot" />
            <SidebarItem icon={FavoriteIcon} to="platform-status" text="Status" />
            <SidebarItem icon={DashboardIcon} to="catalog-graph" text="Graph" />
            <SidebarDivider />
            <SidebarScrollWrapper />
          </SidebarGroup>
          <SidebarSpace />
          <SidebarDivider />
          <NotificationsSidebarItem />
          <SidebarDivider />
          <SidebarGroup
            label="Settings"
            icon={<UserSettingsSignInAvatar />}
            to="/settings"
          >
            <SidebarSettings />
          </SidebarGroup>
        </Sidebar>
        {children}
      </SidebarPage>
    </div>
  );
};
