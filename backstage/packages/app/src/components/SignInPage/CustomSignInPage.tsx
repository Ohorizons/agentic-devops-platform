import { useCallback, useState } from 'react';
import { SignInPageProps, githubAuthApiRef, useApi } from '@backstage/core-plugin-api';
import { UserIdentity } from '@backstage/core-components';
import { Box, Button, CircularProgress, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    minHeight: '100vh',
    width: '100%',
    background: '#ffffff',
    color: '#1a1a1a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
    overflowX: 'hidden',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: 4,
      zIndex: 1000,
      background:
        'linear-gradient(to right, #F25022 0%, #F25022 25%, #7FBA00 25%, #7FBA00 50%, #00A4EF 50%, #00A4EF 75%, #FFB900 75%, #FFB900 100%)',
    },
  },
  container: {
    width: '100%',
    maxWidth: 480,
    padding: 20,
    textAlign: 'center',
  },
  logo: {
    marginBottom: 32,
    animation: '$fadeInDown 0.8s ease-out',
  },
  title: {
    fontSize: 40,
    fontWeight: 700,
    letterSpacing: '-0.5px',
    marginBottom: 8,
    animation: '$fadeInDown 0.8s ease-out 0.1s both',
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 4,
    animation: '$fadeInDown 0.8s ease-out 0.2s both',
  },
  tagline: {
    fontSize: 14,
    color: '#999999',
    marginBottom: 40,
    animation: '$fadeInDown 0.8s ease-out 0.3s both',
  },
  signInButton: {
    width: '100%',
    height: 56,
    borderRadius: 8,
    border: 'none',
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 600,
    textTransform: 'none',
    background: '#24292e',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
    gap: 12,
    animation: '$fadeInUp 0.8s ease-out 0.4s both, $pulse 3s ease-in-out 2s infinite',
    '&:hover': {
      background: '#2f363d',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.16)',
      transform: 'translateY(-2px)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  },
  infoText: {
    fontSize: 13,
    color: '#999999',
    margin: '24px 0 48px',
    lineHeight: 1.5,
    animation: '$fadeInUp 0.8s ease-out 0.5s both',
  },
  horizons: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
    marginBottom: 48,
    animation: '$fadeInUp 0.8s ease-out 0.6s both',
    '@media (max-width: 600px)': {
      gridTemplateColumns: '1fr',
    },
  },
  horizonCard: {
    background: '#ffffff',
    border: '1px solid #e0e0e0',
    borderRadius: 8,
    padding: 20,
    textAlign: 'center',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.08)',
    },
    '@media (max-width: 600px)': {
      padding: 16,
    },
  },
  foundation: { borderTop: '3px solid #00A4EF' },
  enhancement: { borderTop: '3px solid #7FBA00' },
  innovation: { borderTop: '3px solid #FFB900' },
  horizonIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  horizonTitle: {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 6,
  },
  horizonDescription: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 1.4,
  },
  footer: {
    fontSize: 12,
    color: '#cccccc',
    borderTop: '1px solid #f0f0f0',
    paddingTop: 20,
    animation: '$fadeInUp 0.8s ease-out 0.7s both',
  },
  errorText: {
    marginTop: 16,
    color: '#d13438',
    fontSize: 13,
  },
  '@keyframes fadeInDown': {
    from: { opacity: 0, transform: 'translateY(-20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  '@keyframes fadeInUp': {
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  '@keyframes pulse': {
    '0%, 100%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(1.02)' },
  },
});

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.51 11.51 0 0112 5.8c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.431.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.8 24 17.302 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const MicrosoftSquares = ({ size }: { size: number }) => (
  <svg viewBox="0 0 23 23" width={size} height={size} aria-hidden>
    <rect x="1" y="1" width="10" height="10" fill="#F25022" />
    <rect x="12" y="1" width="10" height="10" fill="#7FBA00" />
    <rect x="1" y="12" width="10" height="10" fill="#00A4EF" />
    <rect x="12" y="12" width="10" height="10" fill="#FFB900" />
  </svg>
);

const CustomSignInPage = ({ onSignInSuccess }: SignInPageProps) => {
  const classes = useStyles();
  const githubAuthApi = useApi(githubAuthApiRef);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleSignIn = useCallback(async () => {
    try {
      setError(undefined);
      setLoading(true);

      const identityResponse = await githubAuthApi.getBackstageIdentity({
        instantPopup: true,
      });
      if (!identityResponse) {
        throw new Error('Could not resolve Backstage identity from GitHub sign-in');
      }

      const profile = await githubAuthApi.getProfile();

      // Use the native OAuth provider flow so session/token refresh works across all tabs.
      onSignInSuccess(
        UserIdentity.create({
          identity: identityResponse.identity,
          profile,
          authApi: githubAuthApi,
        }),
      );
    } catch (e) {
      const message = e instanceof Error ? e.message : 'GitHub sign-in failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [githubAuthApi, onSignInSuccess]);

  return (
    <Box className={classes.root}>
      <Box className={classes.container}>
        <div className={classes.logo}>
          <MicrosoftSquares size={80} />
        </div>

        <Typography component="h1" className={classes.title}>
          Open Horizons
        </Typography>
        <Typography className={classes.subtitle}>Agentic DevOps Platform</Typography>
        <Typography className={classes.tagline}>Powered by Backstage</Typography>

        <Button
          className={classes.signInButton}
          onClick={handleSignIn}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <GitHubIcon />}
        >
          {loading ? 'Signing in...' : 'Sign in with GitHub'}
        </Button>

        <Typography className={classes.infoText}>
          Sign in with your GitHub organization account to access the developer portal.
        </Typography>

        <div className={classes.horizons}>
          <div className={`${classes.horizonCard} ${classes.foundation}`}>
            <div className={classes.horizonIcon}>H1</div>
            <div className={classes.horizonTitle}>Foundation</div>
            <div className={classes.horizonDescription}>Core infrastructure and CI/CD</div>
          </div>
          <div className={`${classes.horizonCard} ${classes.enhancement}`}>
            <div className={classes.horizonIcon}>H2</div>
            <div className={classes.horizonTitle}>Enhancement</div>
            <div className={classes.horizonDescription}>Platform services and GitOps</div>
          </div>
          <div className={`${classes.horizonCard} ${classes.innovation}`}>
            <div className={classes.horizonIcon}>H3</div>
            <div className={classes.horizonTitle}>Innovation</div>
            <div className={classes.horizonDescription}>AI agents and next-gen workflows</div>
          </div>
        </div>

        <div className={classes.footer}>Microsoft · GitHub · Open Source</div>
        {error ? <Typography className={classes.errorText}>{error}</Typography> : null}
      </Box>
    </Box>
  );
};

export default CustomSignInPage;
