import { makeStyles } from '@material-ui/core';
import logoMsftGithub from '../../assets/logo-msft-github-white.png';

const useStyles = makeStyles({
  img: {
    height: 28,
    width: 'auto',
  },
});

const LogoFull = () => {
  const classes = useStyles();

  return (
    <img
      className={classes.img}
      src={logoMsftGithub}
      alt="Dev Portal"
    />
  );
};

export default LogoFull;
