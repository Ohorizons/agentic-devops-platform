/**
 * HomePage.tsx
 * Backstage Open Horizons — Custom Homepage Component
 *
 * This component provides the landing page for Open Horizons with:
 * - Hero section with platform branding
 * - Search bar for catalog discovery
 * - Quick access links to key features
 * - Recently updated components
 * - Featured templates
 * - Starred entities
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Grid,
  LinearProgress,
  Paper,
  Typography,
  Link as MuiLink,
  useTheme,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  HomePageSearchBar,
  HomePageCompanyLogo,
  WelcomeTitle,
} from '@backstage/plugin-home';
import { SearchContextProvider } from '@backstage/plugin-search-react';
import { useRouteRef } from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import {
  InfoCard,
  LinkButton,
  Page,
  Header,
  Content,
  ContentHeader,
  HeaderLabel,
} from '@backstage/core-components';
import LaunchIcon from '@material-ui/icons/Launch';
import StorageIcon from '@material-ui/icons/Storage';
import AddIcon from '@material-ui/icons/Add';
import HelpIcon from '@material-ui/icons/Help';
import BookIcon from '@material-ui/icons/Book';
import GitHubIcon from '@material-ui/icons/GitHub';
import SettingsIcon from '@material-ui/icons/Settings';
import ExtensionIcon from '@material-ui/icons/Extension';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
  },
  heroSection: {
    backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: theme.palette.common.white,
    padding: theme.spacing(8, 0),
    marginBottom: theme.spacing(4),
    textAlign: 'center',
  },
  heroTitle: {
    fontWeight: 600,
    marginBottom: theme.spacing(2),
    fontSize: '2.5rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.75rem',
    },
  },
  heroSubtitle: {
    fontSize: '1.1rem',
    marginBottom: theme.spacing(4),
    opacity: 0.95,
  },
  container: {
    marginBottom: theme.spacing(4),
  },
  sectionTitle: {
    fontWeight: 600,
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(4),
  },
  quickAccessCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[8],
    },
  },
  quickAccessIcon: {
    fontSize: '2.5rem',
    marginBottom: theme.spacing(1),
    color: theme.palette.primary.main,
  },
  cardContent: {
    flexGrow: 1,
  },
  entityCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  entityCardContent: {
    flexGrow: 1,
    paddingBottom: theme.spacing(1),
  },
  emptyState: {
    textAlign: 'center',
    padding: theme.spacing(4),
  },
  gridContainer: {
    marginBottom: theme.spacing(4),
  },
  searchBarContainer: {
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(2),
  },
  featureGrid: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
  },
  linkButton: {
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  resourceLink: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1.5),
    textDecoration: 'none',
    color: theme.palette.primary.main,
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  resourceIcon: {
    marginRight: theme.spacing(1),
    fontSize: '1.25rem',
  },
}));

interface QuickAccessLink {
  title: string;
  description: string;
  icon: React.ReactNode;
  url: string;
}

/**
 * OpenHorizonsHomePage Component
 * Main landing page for Open Horizons platform
 */
export const OpenHorizonsHomePage: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const catalogApi = useApi(catalogApiRef);

  const [recentEntities, setRecentEntities] = useState<any[]>([]);
  const [starredEntities, setStarredEntities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEntities();
  }, []);

  const loadEntities = async () => {
    try {
      setLoading(true);
      // Load recent entities
      const recentResponse = await catalogApi.getEntities({
        filter: {
          kind: 'Component',
        },
        limit: 5,
      });
      setRecentEntities(recentResponse.items);

      // Load starred entities
      const starredResponse = await catalogApi.getEntities({
        filter: {
          kind: ['Component', 'API'],
        },
        limit: 6,
      });
      setStarredEntities(starredResponse.items);
    } catch (error) {
      console.error('Error loading entities:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickAccessLinks: QuickAccessLink[] = [
    {
      title: 'Getting Started',
      description: 'Learn how to use Open Horizons and get up to speed quickly',
      icon: <HelpIcon className={classes.quickAccessIcon} />,
      url: '/docs/getting-started',
    },
    {
      title: 'Software Catalog',
      description: 'Browse all registered components, services, and APIs',
      icon: <StorageIcon className={classes.quickAccessIcon} />,
      url: '/catalog',
    },
    {
      title: 'Create Component',
      description: 'Use templates to scaffold new services and components',
      icon: <AddIcon className={classes.quickAccessIcon} />,
      url: '/create',
    },
    {
      title: 'Documentation',
      description: 'Read comprehensive platform documentation and guides',
      icon: <BookIcon className={classes.quickAccessIcon} />,
      url: '/docs',
    },
    {
      title: 'GitHub Integration',
      description: 'Connect and manage your GitHub repositories',
      icon: <GitHubIcon className={classes.quickAccessIcon} />,
      url: '/settings/integrations',
    },
    {
      title: 'Platform Settings',
      description: 'Configure plugins and platform settings',
      icon: <SettingsIcon className={classes.quickAccessIcon} />,
      url: '/admin/settings',
    },
  ];

  return (
    <Box className={classes.root}>
      {/* Hero Section */}
      <Box className={classes.heroSection}>
        <Container maxWidth="lg">
          <HomePageCompanyLogo logo={<img src="/logo.svg" alt="Open Horizons" style={{ height: 60 }} />} />
          <Typography variant="h3" className={classes.heroTitle}>
            Welcome to Open Horizons
          </Typography>
          <Typography variant="body1" className={classes.heroSubtitle}>
            Your comprehensive platform for managing microservices, APIs, and developer resources
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" className={classes.container}>
        {/* Search Bar */}
        <Box className={classes.searchBarContainer}>
          <SearchContextProvider>
            <HomePageSearchBar />
          </SearchContextProvider>
        </Box>

        {/* Quick Access Links */}
        <Typography variant="h5" className={classes.sectionTitle}>
          Quick Access
        </Typography>
        <Grid container spacing={2} className={classes.featureGrid}>
          {quickAccessLinks.map((link) => (
            <Grid item xs={12} sm={6} md={4} key={link.title}>
              <Card className={classes.quickAccessCard}>
                <CardContent className={classes.cardContent}>
                  <Box textAlign="center">
                    {link.icon}
                    <Typography variant="h6" component="div">
                      {link.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {link.description}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions style={{ justifyContent: 'center' }}>
                  <LinkButton
                    to={link.url}
                    variant="contained"
                    color="primary"
                    endIcon={<LaunchIcon />}
                  >
                    Access
                  </LinkButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Featured Templates Section */}
        <Typography variant="h5" className={classes.sectionTitle}>
          Featured Templates
        </Typography>
        <InfoCard title="Software Templates" noPadding>
          <Box p={2}>
            <Typography variant="body2" color="textSecondary">
              Use pre-built templates to quickly create new services, APIs, and components:
            </Typography>
            <Box mt={2}>
              <MuiLink href="/create?selectedTemplate=microservice" style={{ display: 'block', marginBottom: 8 }}>
                <ExtensionIcon style={{ verticalAlign: 'middle', marginRight: 8 }} />
                Microservice Template
              </MuiLink>
              <MuiLink href="/create?selectedTemplate=api" style={{ display: 'block', marginBottom: 8 }}>
                <ExtensionIcon style={{ verticalAlign: 'middle', marginRight: 8 }} />
                REST API Template
              </MuiLink>
              <MuiLink href="/create?selectedTemplate=library" style={{ display: 'block' }}>
                <ExtensionIcon style={{ verticalAlign: 'middle', marginRight: 8 }} />
                Shared Library Template
              </MuiLink>
            </Box>
          </Box>
        </InfoCard>

        {/* Recently Updated Components */}
        {loading ? (
          <Box my={2}>
            <LinearProgress />
          </Box>
        ) : recentEntities.length > 0 ? (
          <>
            <Typography variant="h5" className={classes.sectionTitle}>
              Recently Updated Components
            </Typography>
            <Grid container spacing={2} className={classes.gridContainer}>
              {recentEntities.slice(0, 3).map((entity) => (
                <Grid item xs={12} sm={6} md={4} key={entity.metadata.uid}>
                  <Card className={classes.entityCard}>
                    <CardContent className={classes.entityCardContent}>
                      <Typography color="textSecondary" gutterBottom>
                        {entity.kind}
                      </Typography>
                      <Typography variant="h6" component="div">
                        {entity.metadata.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {entity.metadata.description || 'No description available'}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <LinkButton
                        to={`/catalog/${entity.kind.toLowerCase()}/${entity.metadata.namespace}/${entity.metadata.name}`}
                        size="small"
                        color="primary"
                      >
                        View
                      </LinkButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        ) : (
          <Box className={classes.emptyState}>
            <Typography variant="body1" color="textSecondary">
              No components found. Start by creating a new component or registering an existing one.
            </Typography>
          </Box>
        )}

        {/* Documentation Links */}
        <Typography variant="h5" className={classes.sectionTitle}>
          Resources & Documentation
        </Typography>
        <Paper style={{ padding: 24 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" gutterBottom>
                Getting Started
              </Typography>
              <Box>
                <MuiLink href="/docs/intro" className={classes.resourceLink}>
                  <BookIcon className={classes.resourceIcon} />
                  Introduction to Open Horizons
                </MuiLink>
                <MuiLink href="/docs/installation" className={classes.resourceLink}>
                  <BookIcon className={classes.resourceIcon} />
                  Installation Guide
                </MuiLink>
                <MuiLink href="/docs/quick-start" className={classes.resourceLink}>
                  <BookIcon className={classes.resourceIcon} />
                  Quick Start Tutorial
                </MuiLink>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" gutterBottom>
                Development
              </Typography>
              <Box>
                <MuiLink href="/docs/plugins" className={classes.resourceLink}>
                  <BookIcon className={classes.resourceIcon} />
                  Plugin Development
                </MuiLink>
                <MuiLink href="/docs/api-reference" className={classes.resourceLink}>
                  <BookIcon className={classes.resourceIcon} />
                  API Reference
                </MuiLink>
                <MuiLink href="/docs/templates" className={classes.resourceLink}>
                  <BookIcon className={classes.resourceIcon} />
                  Creating Templates
                </MuiLink>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" gutterBottom>
                Deployment
              </Typography>
              <Box>
                <MuiLink href="/docs/deployment" className={classes.resourceLink}>
                  <BookIcon className={classes.resourceIcon} />
                  Deployment Options
                </MuiLink>
                <MuiLink href="/docs/kubernetes" className={classes.resourceLink}>
                  <BookIcon className={classes.resourceIcon} />
                  Kubernetes Setup
                </MuiLink>
                <MuiLink href="/docs/configuration" className={classes.resourceLink}>
                  <BookIcon className={classes.resourceIcon} />
                  Configuration Guide
                </MuiLink>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" gutterBottom>
                Community
              </Typography>
              <Box>
                <MuiLink href="https://github.com/open-horizons" target="_blank" rel="noopener" className={classes.resourceLink}>
                  <GitHubIcon className={classes.resourceIcon} />
                  GitHub Repository
                </MuiLink>
                <MuiLink href="/docs/contributing" className={classes.resourceLink}>
                  <BookIcon className={classes.resourceIcon} />
                  Contributing Guide
                </MuiLink>
                <MuiLink href="/docs/support" className={classes.resourceLink}>
                  <BookIcon className={classes.resourceIcon} />
                  Support & FAQ
                </MuiLink>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Footer Info */}
        <Box my={6} textAlign="center">
          <Typography variant="body2" color="textSecondary">
            Open Horizons — Your platform for modern software development
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default OpenHorizonsHomePage;
