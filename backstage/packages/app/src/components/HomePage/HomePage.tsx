import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Link as MuiLink,
  TextField,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { Page, Content } from '@backstage/core-components';
import { Link as RouterLink } from 'react-router-dom';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CategoryIcon from '@material-ui/icons/Category';
import ExtensionIcon from '@material-ui/icons/Extension';
import DescriptionIcon from '@material-ui/icons/Description';
import SecurityIcon from '@material-ui/icons/Security';
import MergeTypeIcon from '@material-ui/icons/MergeType';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import LanguageIcon from '@material-ui/icons/Language';
import AssessmentIcon from '@material-ui/icons/Assessment';
import MemoryIcon from '@material-ui/icons/Memory';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import CloudQueueIcon from '@material-ui/icons/CloudQueue';
import CloudDoneIcon from '@material-ui/icons/CloudDone';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

const useStyles = makeStyles(theme => ({
  pageRoot: {
    minHeight: '100%',
    backgroundColor: '#ffffff',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: 4,
      zIndex: 1200,
      background:
        'linear-gradient(to right, #F25022 0%, #F25022 25%, #7FBA00 25%, #7FBA00 50%, #00A4EF 50%, #00A4EF 75%, #FFB900 75%, #FFB900 100%)',
    },
  },
  hero: {
    background: 'linear-gradient(135deg, #00A4EF 0%, #00d4ff 50%, #00A4EF 100%)',
    color: '#ffffff',
    padding: theme.spacing(7, 4),
    textAlign: 'center',
    borderRadius: 12,
  },
  heroContent: {
    maxWidth: 900,
    margin: '0 auto',
  },
  heroBrand: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: theme.spacing(2.5),
  },
  heroGithubBadge: {
    width: 32,
    height: 32,
    borderRadius: 6,
    background: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 17,
    fontWeight: 700,
  },
  heroTitle: {
    fontSize: '3rem',
    fontWeight: 700,
    letterSpacing: -0.5,
    marginBottom: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      fontSize: '2.1rem',
    },
  },
  heroSubtitle: {
    fontSize: 18,
    opacity: 0.95,
    marginBottom: theme.spacing(2),
  },
  heroDesc: {
    maxWidth: 700,
    margin: '0 auto',
    fontSize: 16,
    lineHeight: 1.6,
    opacity: 0.92,
  },
  heroButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(2),
    flexWrap: 'wrap',
    marginTop: theme.spacing(4),
  },
  createBtn: {
    background: '#ffffff',
    color: '#00A4EF',
    textTransform: 'none',
    padding: theme.spacing(1.5, 3.5),
    fontWeight: 600,
    '&:hover': {
      background: '#f0f9ff',
      transform: 'translateY(-2px)',
    },
  },
  catalogBtn: {
    color: '#ffffff',
    borderColor: '#ffffff',
    textTransform: 'none',
    padding: theme.spacing(1.5, 3.5),
    fontWeight: 600,
    '&:hover': {
      borderColor: '#ffffff',
      backgroundColor: 'rgba(255,255,255,0.1)',
      transform: 'translateY(-2px)',
    },
  },
  stats: {
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(4),
    flexWrap: 'wrap',
    marginTop: theme.spacing(4),
    paddingTop: theme.spacing(4),
    borderTop: '1px solid rgba(255,255,255,0.24)',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 700,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 13,
    opacity: 0.9,
    textAlign: 'center',
  },
  contentWrap: {
    paddingTop: theme.spacing(4),
  },
  searchField: {
    maxWidth: 800,
    '& .MuiOutlinedInput-root': {
      borderRadius: 8,
      background: '#ffffff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    },
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: '#1a1a1a',
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(3),
  },
  horizonCard: {
    border: '1px solid #e8e8e8',
    borderRadius: 12,
    overflow: 'hidden',
    height: '100%',
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
      transform: 'translateY(-4px)',
    },
  },
  horizonHeader: {
    padding: theme.spacing(3),
    color: '#ffffff',
    fontWeight: 600,
  },
  foundation: { background: 'linear-gradient(135deg, #00A4EF 0%, #0088d0 100%)' },
  enhancement: { background: 'linear-gradient(135deg, #7FBA00 0%, #6aa500 100%)' },
  innovation: { background: 'linear-gradient(135deg, #FFB900 0%, #ff9d00 100%)' },
  horizonItems: {
    padding: theme.spacing(2.5, 3),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.2),
  },
  horizonItem: {
    fontSize: 13,
    color: '#666666',
    background: '#f8f8f8',
    borderRadius: 6,
    padding: theme.spacing(1.2, 1.5),
  },
  quickCard: {
    border: '1px solid #e8e8e8',
    borderRadius: 12,
    borderLeft: '4px solid #00A4EF',
    height: '100%',
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
      transform: 'translateY(-4px)',
    },
  },
  quickCardGreen: { borderLeftColor: '#7FBA00' },
  quickCardYellow: { borderLeftColor: '#FFB900' },
  quickCardRed: { borderLeftColor: '#F25022' },
  quickIcon: {
    marginBottom: theme.spacing(1.2),
    color: '#3a3a3a',
  },
  quickTitle: {
    fontSize: 15,
    fontWeight: 600,
    marginBottom: theme.spacing(0.8),
  },
  quickDesc: {
    fontSize: 12,
    color: '#888888',
  },
  templatesRow: {
    display: 'flex',
    overflowX: 'auto',
    gap: theme.spacing(2),
    paddingBottom: theme.spacing(1),
  },
  templateCard: {
    minWidth: 200,
    border: '1px solid #e8e8e8',
    borderRadius: 8,
    textAlign: 'center',
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
      transform: 'translateY(-4px)',
    },
  },
  templateIcon: {
    fontSize: 30,
    marginBottom: theme.spacing(1),
  },
  activityFeed: {
    border: '1px solid #e8e8e8',
    borderRadius: 12,
    padding: theme.spacing(3),
    marginBottom: theme.spacing(6),
  },
  activityItem: {
    display: 'flex',
    gap: theme.spacing(2),
    padding: theme.spacing(2, 0),
    borderBottom: '1px solid #f0f0f0',
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #00A4EF 0%, #7FBA00 100%)',
    flexShrink: 0,
  },
  footer: {
    marginTop: theme.spacing(2),
    borderTop: '1px solid #e8e8e8',
    background: '#f5f5f5',
    borderRadius: 8,
    padding: theme.spacing(3),
    textAlign: 'center',
    color: '#999999',
    fontSize: 13,
  },
  footerLinks: {
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(3),
    marginBottom: theme.spacing(1.5),
    flexWrap: 'wrap',
  },
  footerLink: {
    color: '#666666',
    fontSize: 13,
    '&:hover': {
      color: '#00A4EF',
      textDecoration: 'none',
    },
  },
  '@global': {
    '::-webkit-scrollbar': {
      width: 8,
      height: 8,
    },
    '::-webkit-scrollbar-thumb': {
      background: '#d0d0d0',
      borderRadius: 4,
    },
  },
}));

const MicrosoftSquares = () => (
  <svg viewBox="0 0 23 23" width="40" height="40" aria-hidden>
    <rect x="1" y="1" width="10" height="10" fill="#FFFFFF" />
    <rect x="12" y="1" width="10" height="10" fill="#FFFFFF" />
    <rect x="1" y="12" width="10" height="10" fill="#FFFFFF" />
    <rect x="12" y="12" width="10" height="10" fill="#FFFFFF" />
  </svg>
);

const HomePage = () => {
  const classes = useStyles();

  const quickAccessItems = [
    {
      title: 'Software Catalog',
      desc: 'Discover all services and components',
      icon: <CategoryIcon className={classes.quickIcon} />,
      to: '/catalog',
      extraClass: '',
    },
    {
      title: 'Software Templates',
      desc: 'Golden paths and starter projects',
      icon: <ExtensionIcon className={classes.quickIcon} />,
      to: '/create',
      extraClass: classes.quickCardGreen,
    },
    {
      title: 'API Explorer',
      desc: 'Browse and test APIs',
      icon: <LanguageIcon className={classes.quickIcon} />,
      to: '/api-docs',
      extraClass: classes.quickCardYellow,
    },
    {
      title: 'TechDocs',
      desc: 'Technical documentation hub',
      icon: <DescriptionIcon className={classes.quickIcon} />,
      to: '/docs',
      extraClass: classes.quickCardRed,
    },
    {
      title: 'GitHub Organization',
      desc: 'Open organization repositories and workflows',
      icon: <MemoryIcon className={classes.quickIcon} />,
      href: 'https://github.com/paulanunes85',
      extraClass: '',
    },
    {
      title: 'Azure Portal',
      desc: 'Open Azure resources and platform services',
      icon: <AutorenewIcon className={classes.quickIcon} />,
      href: 'https://portal.azure.com/',
      extraClass: classes.quickCardGreen,
    },
  ];

  const popularTemplates = [
    ['Node.js', 'Express backend service', <CloudQueueIcon key="i1" />],
    ['Python', 'FastAPI microservice', <CloudDoneIcon key="i2" />],
    ['React', 'Modern web application', <FlashOnIcon key="i3" />],
    ['.NET', 'C# service', <SecurityIcon key="i4" />],
    ['Spring Boot', 'Java application', <MergeTypeIcon key="i5" />],
    ['Terraform', 'Infrastructure as code', <AssessmentIcon key="i6" />],
  ];

  return (
    <Page themeId="home" className={classes.pageRoot}>
      <Content>
        <Box className={classes.hero}>
          <div className={classes.heroContent}>
            <div className={classes.heroBrand}>
              <MicrosoftSquares />
              <div className={classes.heroGithubBadge}>GH</div>
            </div>

            <Typography component="h1" className={classes.heroTitle}>
              Open Horizons
            </Typography>
            <Typography className={classes.heroSubtitle}>Agentic DevOps Platform</Typography>
            <Typography className={classes.heroDesc}>
              Build, deploy, and manage services with Golden Path templates, integrated
              documentation, and AI-powered developer experiences.
            </Typography>

            <div className={classes.heroButtons}>
              <Button
                component={RouterLink}
                to="/create"
                className={classes.createBtn}
                variant="contained"
                startIcon={<AddCircleOutlineIcon />}
              >
                Create New Service
              </Button>
              <Button
                component={RouterLink}
                to="/catalog"
                className={classes.catalogBtn}
                variant="outlined"
                endIcon={<ArrowForwardIcon />}
              >
                Explore Catalog
              </Button>
            </div>

            <div className={classes.stats}>
              <div>
                <div className={classes.statValue}>22</div>
                <div className={classes.statLabel}>Templates</div>
              </div>
              <div>
                <div className={classes.statValue}>3</div>
                <div className={classes.statLabel}>Horizons</div>
              </div>
              <div>
                <div className={classes.statValue}>13</div>
                <div className={classes.statLabel}>Portal Pages</div>
              </div>
              <div>
                <div className={classes.statValue}>99.9%</div>
                <div className={classes.statLabel}>Uptime</div>
              </div>
            </div>
          </div>
        </Box>

        <Box className={classes.contentWrap}>
          <TextField
            placeholder="Search components, APIs, templates, documentation..."
            variant="outlined"
            fullWidth
            className={classes.searchField}
          />

          <Typography className={classes.sectionTitle}>The Three Horizons</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card className={classes.horizonCard}>
                <div className={`${classes.horizonHeader} ${classes.foundation}`}>
                  <Typography variant="h6">Foundation</Typography>
                  <Typography variant="body2">Core infrastructure and CI/CD foundations</Typography>
                </div>
                <div className={classes.horizonItems}>
                  <div className={classes.horizonItem}>AKS Clusters</div>
                  <div className={classes.horizonItem}>ACR Registry</div>
                  <div className={classes.horizonItem}>Key Vault</div>
                  <div className={classes.horizonItem}>GitHub Actions</div>
                </div>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card className={classes.horizonCard}>
                <div className={`${classes.horizonHeader} ${classes.enhancement}`}>
                  <Typography variant="h6">Enhancement</Typography>
                  <Typography variant="body2">Platform services, GitOps, microservices</Typography>
                </div>
                <div className={classes.horizonItems}>
                  <div className={classes.horizonItem}>Service Mesh</div>
                  <div className={classes.horizonItem}>Helm Charts</div>
                  <div className={classes.horizonItem}>ArgoCD</div>
                  <div className={classes.horizonItem}>TechDocs</div>
                </div>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card className={classes.horizonCard}>
                <div className={`${classes.horizonHeader} ${classes.innovation}`}>
                  <Typography variant="h6">Innovation</Typography>
                  <Typography variant="body2">AI capabilities, intelligent agents</Typography>
                </div>
                <div className={classes.horizonItems}>
                  <div className={classes.horizonItem}>MCP Servers</div>
                  <div className={classes.horizonItem}>Copilot</div>
                  <div className={classes.horizonItem}>AI Foundry</div>
                  <div className={classes.horizonItem}>Coding Agent</div>
                </div>
              </Card>
            </Grid>
          </Grid>

          <Typography className={classes.sectionTitle}>Quick Access</Typography>
          <Grid container spacing={3}>
            {quickAccessItems.map(item => (
              <Grid item xs={12} sm={6} md={4} key={item.title}>
                <Card className={`${classes.quickCard} ${item.extraClass}`}>
                  {item.to ? (
                    <CardActionArea component={RouterLink} to={item.to}>
                      <CardContent>
                        {item.icon}
                        <Typography className={classes.quickTitle}>{item.title}</Typography>
                        <Typography className={classes.quickDesc}>{item.desc}</Typography>
                      </CardContent>
                    </CardActionArea>
                  ) : (
                    <CardActionArea component="a" href={item.href} target="_blank" rel="noopener noreferrer">
                      <CardContent>
                        {item.icon}
                        <Typography className={classes.quickTitle}>
                          {item.title} <OpenInNewIcon style={{ fontSize: 14, verticalAlign: 'middle' }} />
                        </Typography>
                        <Typography className={classes.quickDesc}>{item.desc}</Typography>
                      </CardContent>
                    </CardActionArea>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>

          <Typography className={classes.sectionTitle}>Popular Templates</Typography>
          <div className={classes.templatesRow}>
            {popularTemplates.map(([name, desc, icon]) => (
              <Card key={name as string} className={classes.templateCard}>
                <CardActionArea component={RouterLink} to="/create">
                  <CardContent>
                    <div className={classes.templateIcon}>{icon}</div>
                    <Typography variant="subtitle1">{name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {desc}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </div>

          <Typography className={classes.sectionTitle}>Recent Activity</Typography>
          <div className={classes.activityFeed}>
            {[
              ['New service deployed', 'payment-service v2.1.0 deployed to production', '2 hours ago'],
              ['Template updated', 'Node.js template now includes OpenTelemetry', '4 hours ago'],
              ['Documentation published', 'Kubernetes migration guide published in TechDocs', '1 day ago'],
              ['New API available', 'Analytics API v1.0 is now available in API Explorer', '2 days ago'],
            ].map(([title, message, time]) => (
              <div key={title as string} className={classes.activityItem}>
                <div className={classes.avatar} />
                <div>
                  <Typography variant="subtitle2">{title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {message}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {time}
                  </Typography>
                </div>
              </div>
            ))}
          </div>

          <div className={classes.footer}>
            <div className={classes.footerLinks}>
              <MuiLink component={RouterLink} to="/docs" className={classes.footerLink}>Documentation</MuiLink>
              <MuiLink component={RouterLink} to="/catalog" className={classes.footerLink}>Catalog</MuiLink>
              <MuiLink component={RouterLink} to="/api-docs" className={classes.footerLink}>APIs</MuiLink>
              <MuiLink component={RouterLink} to="/platform-status" className={classes.footerLink}>Status</MuiLink>
            </div>
            <Typography variant="body2">Microsoft · GitHub · Open Source · Open Horizons Developer Portal</Typography>
          </div>
        </Box>
      </Content>
    </Page>
  );
};

export default HomePage;
