import React, { Suspense, useState } from 'react';
import {
  createStyles,
  Grid,
  Theme,
  CircularProgress,
} from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Paper from '@material-ui/core/Paper';
import FlipCoinScreen from '../modules/FlipCoinScreen';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers'
import Wallet from '../modules/Wallet';

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
    }
  })
);

function getLibrary(provider: any): Web3Provider {
  const lib = new Web3Provider(provider)
  lib.pollingInterval = 12000
  return lib
}

const Shell = () => {
  const classes = useStyles();
  const [activate, setActivate] = useState<boolean>(false);

  const handleActivate = (activate : boolean) => {
    setActivate(activate)
  }

  return (
    <>
    <Paper square style={{ backgroundColor: "#bee3db" }}>
        <Grid container direction={'column'} className={classes.root}>
          <Grid item className={classes.content}>
            <Suspense fallback={<CircularProgress />}>
              <Grid container>
                  <Grid item xs={12} container style={{ maxHeight: '50px' }}>
                    <Web3ReactProvider getLibrary={getLibrary}>
                          <Wallet onConnect={handleActivate} />
                      </Web3ReactProvider>
                </Grid>
                {activate && <FlipCoinScreen />}  
              </Grid>
            </Suspense>
          </Grid>
        
        </Grid>
      </Paper>
    </>
  );
};

export default Shell;
