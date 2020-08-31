
import React, { useEffect, useState } from 'react';
import { Grid, TextField, Button, Container, Box, Typography, CircularProgress } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import {  mdiCurrencyUsdCircle, mdiCurrencyUsdCircleOutline  } from "@mdi/js";
import Icon from '@mdi/react';
import useFlipCoinScreen from './useFlipCoinScreen';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import useSWR from 'swr'
import {formatEther} from'@ethersproject/units'


type FlipCoinFormData = {
    amount: number;
    headsOrTails: number
  };

  interface Chain {
      id: number;
      name: string;
  }
  
  const supportedChainIds = [
    1, // Mainet
    3, // Ropsten
    4, // Rinkeby
    5, // Goerli
    42, // Kovan
  ];

  const chains : Chain[] = [
      { id: 1 , name : 'Mainnet' },
      { id: 3 , name : 'Ropsten' },
      { id: 4 , name : 'Rinkeby' },
      { id: 5 , name : 'Goerli' },
      { id: 42 , name : 'Kovan' },
  ]
const useStyles = makeStyles(() =>
    createStyles({
        root: {
            border: 'none'
        }
    })
);

function getLibrary(provider: any): Web3Provider {
    const library = new Web3Provider(provider)
    library.pollingInterval = 12000
    return library
  }

export const injectedConnector = new InjectedConnector({
    supportedChainIds
  })

  
  const fetcher = (library : any) => (...args : any) => {
    const [method, ...params] = args
    console.log(method, params)
    return library[method](...params)
  }

  interface IWallet {
      networkName: string
  }

  
const capitalizeFirst = (str : string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const Wallet = ( { networkName  } : IWallet) => {
    const { chainId, account, activate, active } = useWeb3React<Web3Provider>()
    const { library } = useWeb3React<Web3Provider>()
    const { data: balance, mutate } = useSWR(['getBalance', account, 'latest'], {
      fetcher: fetcher(library),
    })

    const onClick = () => {
      activate(injectedConnector)
    }

    useEffect(() => {
        // listen for changes on an Ethereum address
        library?.on('block', () => {
          mutate(undefined, true)
        })
        // remove listener when the component is unmounted
        return () => {
          library?.removeAllListeners('block')
        }
      }, [])
      
    return (
       <Grid container justify="flex-end"> 
          {active ? (
            <Grid item container justify="flex-end"> 
                <Grid item><Typography style={{ background: "#F9E0D9", borderRadius: "5px", padding: "2px 12px" }}>{capitalizeFirst(networkName)}</Typography></Grid>&nbsp;&nbsp;
                <Grid item>
                    <Typography style={{ background: "#E6DBD0", borderRadius: "5px", padding: "2px 12px" }}>{balance && parseFloat(formatEther(balance)).toPrecision(4)} ETH</Typography>
                </Grid>
                <Grid item style={{ marginLeft: "-5px" }}>
                    <Typography  style={{ background: "#F1EBE4", borderRadius: "5px", padding: "2px 12px" }}>{account?.substr(0,6)}...{account?.substr(36,4)}</Typography>  
                </Grid>
            </Grid>
            ) : (
            <Grid item> <Button variant="contained" size="small" type="submit" style={{ color: "#555b6e", borderRadius: "10px", backgroundColor:"#ffd6ba" }} onClick={onClick}>Connect wallet</Button></Grid> 
          )}
     </Grid>
    )
}

const FlipCoinScreen = () => {

    const {
        isWin,
        isLost, 
        isError, 
        transLink, 
        isLoading,
        headsOrTails,
        networkName,
        onHeadsOrTails,
        onChange,
        onSubmit,
        onWithdraw
    } = useFlipCoinScreen();

    const {
        register,
        control,
        errors,
        handleSubmit,
    } = useForm<FlipCoinFormData>({ mode: 'onChange' });

    const classes = useStyles();
    const WrappedToggleButtonGroup = (props: any) => <ToggleButtonGroup {...props} />;
    WrappedToggleButtonGroup.muiName = 'ToggleButtonGroup';

    return (
        <Grid container>
            <Grid item xs={6} container alignItems="center">
                    <Icon path={mdiCurrencyUsdCircle}
                        size={2}
                        horizontal
                        vertical
                        color="#555b6e"
                    />
             <Typography variant="h4" style={{ color: "#555b6e" }}>Flip coin </Typography>
            </Grid>
            <Grid item container xs={6} justify="flex-end">
                    <Web3ReactProvider getLibrary={getLibrary}>
                        <Wallet networkName={networkName!}/>
                    </Web3ReactProvider>
            </Grid>
            <Grid item xs={12} justify="center" style={{ marginTop: "75px" }}>
                <Container maxWidth="sm">
                        <Box display="flex" justifyContent="center" style={{ borderRadius:"10px", backgroundColor:"#faf9f9" }}>
                            <Grid container item alignItems="center" spacing={3} style={{ margin: "10px" }}>
                            <Grid item xs={12}>
                                {isLoading ? 
                                <Grid container item xs={12} justify="center">
                                    <Grid item style={{ textAlign: "center" }} xs={12}><CircularProgress size={50}/></Grid><br/>
                                    <Grid item style={{ textAlign: "center" }} xs={12}><a href={transLink}>View on etherscan</a></Grid>
                                </Grid> :
                            !isWin ? <form onSubmit={handleSubmit(onSubmit)}>
                                    <Grid container>
                                        <Grid item container xs={12} justify="center">
                                        <ToggleButtonGroup  value={headsOrTails} exclusive onChange={onHeadsOrTails}>
                                            <ToggleButton value={1} className={classes.root}>
                                                <Icon path={mdiCurrencyUsdCircle}
                                                        size={5}
                                                        horizontal
                                                        vertical
                                                        color="#555b6e"
                                                    /> 
                                            </ToggleButton>
                                            <ToggleButton value={0} className={classes.root}>
                                                <Icon path={mdiCurrencyUsdCircleOutline}
                                                        size={5}
                                                        horizontal
                                                        vertical
                                                        color="#555b6e"
                                                    /> 
                                            </ToggleButton>
                                        </ToggleButtonGroup>
                                        </Grid>
                                        <Grid item xs={12} style={{ margin: "5px" }}>
                                            <TextField
                                                fullWidth
                                                name="amount"
                                                type="number"
                                                label="Enter amount" 
                                                placeholder="Amount" 
                                                size="small"
                                                required  
                                                variant="outlined"
                                                inputProps={{ min: "0.1", max: "1", step: "0.5" }}
                                                inputRef={
                                                    register({
                                                        required: 'Amount is required',
                                                        min: { value: 0.1, message: 'Minimum amount is 0.1 eth', },
                                                        max: { value: 1, message: 'Max amount is 1 eth', },
                                                    })
                                                }
                                                onChange={onChange}
                                                helperText={errors?.amount?.message}
                                                error={!!errors.amount}
                                        
                                            /> 
                                        </Grid>
                                        <Grid item container justify="center" style={{ marginTop: "10px" }}>
                                            <Button variant="contained" size="large" type="submit" style={{ color: "#555b6e", borderRadius: "10px", backgroundColor:"#ffd6ba" }}>Flip coin</Button>
                                        </Grid>
                                        {isError && <Grid item style={{ textAlign: "center" }}><Typography style={{ color :"red"}}>Something went wrong!</Typography></Grid>}
                                        {isLost && <Grid item>
                                            <Typography>You lose, we're sorry!</Typography>
                                        </Grid>}
                                    </Grid>
                                </form> : <Grid item>
                                            <Typography>You won congratulations!</Typography>
                                            <Button variant="contained" size="large" type="submit" style={{ color: "#555b6e", borderRadius: "10px", backgroundColor:"#ffd6ba" }} onClick={onWithdraw}>Withdraw funds</Button>
                                        </Grid>} 
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Grid>
      
            
        </Grid>
    )}

export default FlipCoinScreen;