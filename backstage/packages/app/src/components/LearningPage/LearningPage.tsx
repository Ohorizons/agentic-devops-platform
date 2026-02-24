import { Content, Header, Page } from '@backstage/core-components';
import { Grid, makeStyles, Typography, Card, CardContent, CardActions, Button } from '@material-ui/core';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

import copilotLogo from '../../assets/logo-github-copilot.png';
import aiCopilotLogo from '../../assets/logo-ai-copilot.png';
import aiMicrosoftLogo from '../../assets/logo-ai-microsoft.png';

const useStyles = makeStyles(theme => ({
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 12,
  },
  cardMedia: {
    height: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
    padding: theme.spacing(2),
  },
  cardImage: {
    maxHeight: 60,
    maxWidth: '80%',
    objectFit: 'contain',
  },
  cardContent: {
    flexGrow: 1,
  },
  sectionTitle: {
    fontWeight: 600,
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
}));

const resources = [
  {
    title: 'GitHub Copilot',
    description: 'AI-powered code completion and chat for developers. Learn how to use Copilot to accelerate development.',
    image: copilotLogo,
    links: [
      { label: 'Documentation', url: 'https://docs.github.com/en/copilot' },
      { label: 'Best Practices', url: 'https://docs.github.com/en/copilot/using-github-copilot/best-practices-for-using-github-copilot' },
    ],
  },
  {
    title: 'Azure AI Foundry',
    description: 'Build, evaluate, and deploy generative AI solutions with Azure AI Foundry and OpenAI models.',
    image: aiMicrosoftLogo,
    links: [
      { label: 'Documentation', url: 'https://learn.microsoft.com/en-us/azure/ai-studio/' },
      { label: 'Quickstart', url: 'https://learn.microsoft.com/en-us/azure/ai-studio/quickstarts/' },
    ],
  },
  {
    title: 'AI Agents & Copilots',
    description: 'Design multi-agent architectures and custom copilots using Azure AI and GitHub Copilot extensions.',
    image: aiCopilotLogo,
    links: [
      { label: 'Agent Framework', url: 'https://learn.microsoft.com/en-us/azure/ai-services/agents/' },
      { label: 'Copilot Extensions', url: 'https://docs.github.com/en/copilot/building-copilot-extensions' },
    ],
  },
];

const platformDocs = [
  { title: 'Three Horizons Architecture', description: 'Platform architecture covering H1 Foundation, H2 Enhancement, and H3 Innovation.', url: '/docs' },
  { title: 'Golden Path Templates', description: 'Scaffold new services using standardized templates with best practices built in.', url: '/create' },
  { title: 'API Registry', description: 'Discover and consume APIs across the platform.', url: '/api-docs' },
  { title: 'Service Catalog', description: 'Browse all registered components, systems, and domains.', url: '/catalog' },
];

const LearningPage = () => {
  const classes = useStyles();

  return (
    <Page themeId="tool">
      <Header title="Learning Center" subtitle="Resources, guides, and learning paths for the platform" />
      <Content>
        <Typography className={classes.sectionTitle} variant="h5">
          AI & Developer Tools
        </Typography>
        <Grid container spacing={3}>
          {resources.map(resource => (
            <Grid item xs={12} md={4} key={resource.title}>
              <Card className={classes.card} variant="outlined">
                <div className={classes.cardMedia}>
                  <img className={classes.cardImage} src={resource.image} alt={resource.title} />
                </div>
                <CardContent className={classes.cardContent}>
                  <Typography variant="h6" gutterBottom>{resource.title}</Typography>
                  <Typography variant="body2" color="textSecondary">{resource.description}</Typography>
                </CardContent>
                <CardActions>
                  {resource.links.map(link => (
                    <Button
                      key={link.label}
                      size="small"
                      color="primary"
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      endIcon={<OpenInNewIcon fontSize="small" />}
                    >
                      {link.label}
                    </Button>
                  ))}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Typography className={classes.sectionTitle} variant="h5">
          Platform Resources
        </Typography>
        <Grid container spacing={3}>
          {platformDocs.map(doc => (
            <Grid item xs={12} sm={6} md={3} key={doc.title}>
              <Card className={classes.card} variant="outlined">
                <CardContent className={classes.cardContent}>
                  <Typography variant="h6" gutterBottom>{doc.title}</Typography>
                  <Typography variant="body2" color="textSecondary">{doc.description}</Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary" href={doc.url}>
                    Explore
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Content>
    </Page>
  );
};

export default LearningPage;
