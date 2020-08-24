import React from 'react';
import { makeStyles, createStyles, MuiThemeProvider, CssBaseline } from '@material-ui/core';
import defaultTheme from './shell/themes/defaultTheme';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import Shell from './shell/Shell';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      padding: 0,
      backgroundColor: "#ff6978"
    },
    
  })
);

function App() {
  const classes = useStyles();
  return (
    <MuiThemeProvider theme={defaultTheme}>
      <CssBaseline />

      <div className={classes.root}>
        <Router>
            <Switch>
              <Route path={'/'}>
                <Shell />
              </Route>
            </Switch>
        </Router>
      </div>
    </MuiThemeProvider>
  );
}

export default App;
