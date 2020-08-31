import React, { Suspense } from 'react';
import {
  createStyles,
  Grid,
  Theme,
  CircularProgress,
} from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Paper from '@material-ui/core/Paper';
import FlipCoinScreen from '../modules/FlipCoinScreen';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minHeight: '100vh',
    },
    content: {
      padding: theme.spacing(2),
      flexGrow: 1,
      marginTop: 10,
      [theme.breakpoints.down('sm')]: {
        marginTop: 60,
      },
    },

  })
);

const Shell = () => {
  const classes = useStyles();

  return (
    <>
    <Paper square style={{ backgroundColor: "#bee3db" }}>
        <Grid container direction={'column'} className={classes.root}>
          <Grid item className={classes.content}>
            <Suspense fallback={<CircularProgress />}>
              <FlipCoinScreen />
            </Suspense>
          </Grid>
        
        </Grid>
      </Paper>
    </>
  );
};

export default Shell;
