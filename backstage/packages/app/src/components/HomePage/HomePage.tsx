import {
  HomePageCompanyLogo,
  HomePageStarredEntities,
  HomePageToolkit,
  TemplateBackstageLogoIcon,
} from '@backstage/plugin-home';
import { Content, Header, Page } from '@backstage/core-components';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import CategoryIcon from '@material-ui/icons/Category';
import CodeIcon from '@material-ui/icons/Code';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import ExtensionIcon from '@material-ui/icons/Extension';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CloudIcon from '@material-ui/icons/Cloud';
import SecurityIcon from '@material-ui/icons/Security';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';

import logoMsftGithub from '../../assets/logo-msft-github-color.png';
import cloudPicture from '../../assets/cloud-picture.png';
import agenticPicture from '../../assets/agentic-picture.png';
import copilotPicture from '../../assets/github-copilot-multiples.png';

const useStyles = makeStyles(theme => ({
  container: {
    margin: theme.spacing(2, 0),
  },
  heroSection: {
    background: 'linear-gradient(135deg, #0078D4 0%, #00B7C3 100%)',
    borderRadius: 16,
    padding: theme.spacing(6, 4),
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      textAlign: 'center',
      padding: theme.spacing(4, 2),
    },
  },
  heroText: {
    maxWidth: 520,
  },
  heroTitle: {
    fontWeight: 700,
    fontSize: '2rem',
    marginBottom: theme.spacing(1),
  },
  heroSubtitle: {
    fontSize: '1.1rem',
    opacity: 0.9,
    lineHeight: 1.5,
  },
  heroLogo: {
    height: 80,
    width: 'auto',
    [theme.breakpoints.down('sm')]: {
      height: 60,
      marginTop: theme.spacing(3),
    },
  },
  featureCard: {
    borderRadius: 12,
    overflow: 'hidden',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  featureImage: {
    width: '100%',
    height: 180,
    objectFit: 'cover',
  },
  featureContent: {
    padding: theme.spacing(2),
  },
  featureTitle: {
    fontWeight: 600,
    marginBottom: theme.spacing(0.5),
  },
}));

const HomePage = () => {
  const classes = useStyles();

  return (
    <Page themeId="home">
      <Header title="Dev Portal" subtitle="Three Horizons Accelerator — Your Developer Platform" />
      <Content>
        {/* Hero Banner */}
        <div className={classes.heroSection}>
          <div className={classes.heroText}>
            <Typography className={classes.heroTitle} variant="h3">
              Welcome to the Dev Portal
            </Typography>
            <Typography className={classes.heroSubtitle}>
              Build, deploy, and manage services with Golden Path templates,
              integrated documentation, and AI-powered developer experiences.
            </Typography>
          </div>
          <img
            className={classes.heroLogo}
            src={logoMsftGithub}
            alt="Microsoft + GitHub"
          />
        </div>

        <Grid container spacing={3}>
          {/* Quick Actions Toolkit */}
          <Grid item xs={12} md={6}>
            <HomePageToolkit
              title="Quick Actions"
              tools={[
                { url: '/catalog', label: 'Catalog', icon: <CategoryIcon /> },
                { url: '/create', label: 'Create Service', icon: <AddCircleOutlineIcon /> },
                { url: '/api-docs', label: 'APIs', icon: <ExtensionIcon /> },
                { url: '/docs', label: 'TechDocs', icon: <MenuBookIcon /> },
                { url: '/catalog?filters[kind]=component', label: 'Components', icon: <CodeIcon /> },
                { url: '/catalog-graph', label: 'Graph', icon: <TrendingUpIcon /> },
                { url: '/catalog?filters[kind]=system', label: 'Systems', icon: <CloudIcon /> },
                { url: '/catalog?filters[kind]=api', label: 'API Registry', icon: <SecurityIcon /> },
              ]}
            />
          </Grid>

          {/* Starred Entities */}
          <Grid item xs={12} md={6}>
            <HomePageStarredEntities />
          </Grid>

          {/* Company Logo */}
          <Grid item xs={12}>
            <HomePageCompanyLogo logo={<img src={logoMsftGithub} alt="Microsoft + GitHub" style={{ height: 50 }} />} />
          </Grid>

          {/* Feature Cards */}
          <Grid item xs={12} md={4}>
            <div className={classes.featureCard}>
              <img className={classes.featureImage} src={cloudPicture} alt="Cloud Platform" />
              <div className={classes.featureContent}>
                <Typography className={classes.featureTitle} variant="h6">
                  H1 — Foundation
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Core infrastructure on Azure — AKS, networking, security, databases, and identity management.
                </Typography>
              </div>
            </div>
          </Grid>

          <Grid item xs={12} md={4}>
            <div className={classes.featureCard}>
              <img className={classes.featureImage} src={copilotPicture} alt="GitHub Copilot" />
              <div className={classes.featureContent}>
                <Typography className={classes.featureTitle} variant="h6">
                  H2 — Enhancement
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Platform services — ArgoCD GitOps, Developer Hub, observability, Golden Path templates.
                </Typography>
              </div>
            </div>
          </Grid>

          <Grid item xs={12} md={4}>
            <div className={classes.featureCard}>
              <img className={classes.featureImage} src={agenticPicture} alt="Agentic AI" />
              <div className={classes.featureContent}>
                <Typography className={classes.featureTitle} variant="h6">
                  H3 — Innovation
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  AI capabilities — Azure AI Foundry, multi-agent systems, MLOps, and intelligent workflows.
                </Typography>
              </div>
            </div>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};

export default HomePage;
