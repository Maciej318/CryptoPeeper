import { Container, Typography, makeStyles } from '@material-ui/core';
import React from 'react';
import videoBg from '../assets/video.mp4';
import Carousel from './Carousel';


const useStyles = makeStyles(() => ({
  baner: {
    position: 'relative',
  },
  banerContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    padding: 15,
    background: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
    color: '#fff',
  },
  video: {
    objectFit: 'cover',
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  tagline: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: 15,
    fontFamily: 'Jost',
  },
}));

function Baner() {
  const classes = useStyles();

  return (
    <div className={classes.baner}>
      <video className={classes.video} src={videoBg} autoPlay loop muted />
      <Container className={classes.banerContent}>
        <div className={classes.tagline}>
          <Typography variant="h2" style={{ fontWeight: 'bold', fontSize: 100,}}>
            Crypto Peeker
          </Typography>
          <Typography variant="subtitle2" style={{color: 'darkgray', textTransform: 'capitalize',fontWeight: 'bold' }}>
            Get all the info regarding your favourite Crypto Currency
          </Typography>
        </div>
        <Carousel />
      </Container>
    </div>
  );
}

export default Baner;