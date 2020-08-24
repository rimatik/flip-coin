
import React, { useEffect, useState } from 'react';
import { Grid, TextField, Button, Container, Box, Typography, CircularProgress } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import {  mdiCurrencyUsdCircle, mdiCurrencyUsdCircleOutline  } from "@mdi/js";
import Icon from '@mdi/react';
import abi from '../abi';
import Web3 from 'web3';

type FlipCoinFormData = {
    amount: number;
  };

const FlipCoinScreen = () => {

const [isWin, setIsWin] = useState<boolean>(false);
const [isLost, setIsLost] = useState<boolean>(false);
const [isError, setIsError] = useState<boolean>(false);
const [transLink, setTransLink] = useState<string>("");
const [isLoading, setIsLoading] = useState<boolean>(false);
const [contract, setContract] = useState<any>();
const [web3provider,setWeb3Provider] = useState<Web3>();
const [account,setAccount] = useState<any>();

useEffect(() => {
    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        setWeb3Provider(web3)
  
        try { 
           window.ethereum.enable().then(function(accounts : any) {
               // User has allowed account access to DApp...
               const flipCoinContract = new web3.eth.Contract(abi,"0xC1415AC14e5F00c6da10934d7556fa39b1f626E4",{from: accounts[0]});
               flipCoinContract.events.placedBet({
                filter: {},
                fromBlock: 'latest'
                }, function(error : any, event : any){ 
                     if(event.returnValues && event.returnValues['isWin'] !== null){
                        if(event.returnValues['isWin'] !== null ){
                            setIsWin(true);
                        }else {
                            setIsLost(true);
                        }
                            setIsLoading(false);
                     }
                     
                    })
 
               setAccount(accounts[0])
               setContract(flipCoinContract);
           });
        } catch(e) {
           // User has denied account access to DApp...
        }
     }
     // Legacy DApp Browsers
     else if (window.web3) {
         const web3 = new Web3(window.web3.currentProvider);
         const flipCoinContract = new web3.eth.Contract(abi,"0xC1415AC14e5F00c6da10934d7556fa39b1f626E4");
               setContract(flipCoinContract);
         setWeb3Provider(web3)
     }
     // Non-DApp Browsers
     else {
         alert('You have to install MetaMask !');
     }
},[]) 
  

const onSubmit = async (values : any) => {
   await contract.methods.flip().send({from: account, gas: 3000000, value: web3provider?.utils.toWei(values.amount, "ether")})
    .on("transactionHash", function(hash : any){
        setIsLoading(true)
        setTransLink("https://ropsten.etherscan.io/tx/" + hash)
        web3provider?.eth.getBlockNumber((error, blockNumber) =>{

        })
    })
    .on("receipt", function(receipt : any){
        console.log(receipt)
        
    })
    .on("error", function(error : any){
        console.log(error)
        setIsError(true)
    });
}

const handleOnChange = () => {
    setIsLost(false);
    setIsWin(false);
}

const handleOnWithdraw = async () => {
setIsLoading(true)
 await contract.methods.withdraw().send({from: account, gas: 3000000, value: web3provider?.utils.toWei("0.01", "ether")})
    .on("transactionHash", function(hash : any){
        setTransLink("https://ropsten.etherscan.io/tx/" + hash)
    })
    .on("receipt", function(receipt : any){
        setIsLost(false)
        setIsWin(false)
        setIsLoading(false)
        console.log(receipt)
    })
    .on("error", function(error : any){
        console.log(error)
        setIsError(true)
        setIsLoading(false)
    });
}

const {
    register,
    errors,
    handleSubmit,
} = useForm<FlipCoinFormData>({ mode: 'onChange' });


return (
    <Container maxWidth="sm">
    <Box display="flex" justifyContent="center" style={{ borderRadius:"10px", backgroundColor:"#faf9f9" }}>
        <Grid container item alignItems="center" spacing={3} style={{ margin: "10px" }}>
            <Grid container item xs={12} justify="center">
                <Grid item><Typography variant="h3" style={{ color: "#555b6e" }}>Flip coin </Typography></Grid>
            </Grid>
            <Grid item xs={12}>
                {isLoading ? 
                <Grid container item xs={12} justify="center">
                    <Grid item style={{ textAlign: "center" }} xs={12}><CircularProgress size={50}/></Grid><br/>
                    <Grid item style={{ textAlign: "center" }} xs={12}><a href={transLink}>View on etherscan</a></Grid>
                </Grid> :
               !isWin ? <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container>
                        <Grid item container xs={12} justify="center">
                            <Icon path={mdiCurrencyUsdCircle}
                                size={5}
                                horizontal
                                vertical
                                color="#555b6e"
                            /> 
                            <Icon path={mdiCurrencyUsdCircleOutline}
                                size={5}
                                horizontal
                                vertical
                                color="grey"
                            />  
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
                                onChange={handleOnChange}
                                helperText={errors?.amount?.message}
                                error={!!errors.amount}
                           
                            /> 
                        </Grid>
                        <Grid item container justify="center" style={{ marginTop: "10px" }}>
                            <Button variant="contained" size="large" type="submit" style={{ color: "#555b6e", borderRadius: "10px", backgroundColor:"#ffd6ba" }}>Flip coin</Button>
                        </Grid>
                        {isError && <Grid><Typography >Something went wrong!</Typography></Grid>}
                        {isLost && <Grid item>
                            <Typography>You lose, we're sorry!</Typography>
                        </Grid>}
                    </Grid>
                </form> : <Grid item>
                            <Typography>You won congratulations!</Typography>
                            <Button variant="contained" size="large" type="submit" style={{ color: "#555b6e", borderRadius: "10px", backgroundColor:"#ffd6ba" }} onClick={handleOnWithdraw}>Withdraw funds</Button>
                        </Grid>} 
            </Grid>
        </Grid>
    </Box>

    </Container>

)}

export default FlipCoinScreen;