
import React from 'react';
import { Grid, TextField, Button, Container, Box, Typography, CircularProgress } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import {  mdiCurrencyUsdCircle, mdiCurrencyUsdCircleOutline  } from "@mdi/js";
import Icon from '@mdi/react';
import useFlipCoinScreen from './useFlipCoinScreen';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Etherum from '../images/etherum.png';


type FlipCoinFormData = {
    amount: number;
    headsOrTails: number
  };

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            border: 'none'
        },
        content:{
            marginTop: "75px"
        },
        flipCoinBox:{
            borderRadius:"10px",
            backgroundColor:"#faf9f9",
            height: '450px',
            maxHeight: '450px'
        },
        boxContainer:{
            margin: "10px" 
        },
        contentCenter:{
            textAlign: "center" 
        },
        amountContainer:{
            margin: "5px"
        },
        flipCoinBtnContainer: {
            marginTop: "10px"
        },
        flipCoinBtn:{
            color: "#555b6e", 
            borderRadius: "10px", 
            backgroundColor:"#ffd6ba"
        },
        flipCoinError:{
            color :"red"
        },
        flipCoinWonText:{
            color: "green" 
        },
        withrdrawBtn:{
            color: "#555b6e", 
            borderRadius: "10px", 
            backgroundColor:"#ffd6ba" 
        },
        toggleGroupContainer:{
            marginBottom: '20px'
        }

    })
);

const FlipCoinScreen = () => {

    const {
        isWin,
        isLost, 
        isError, 
        transLink, 
        isLoading,
        headsOrTails,
        setIsLost,
        setIsWin,
        onHeadsOrTails,
        onChange,
        onSubmit,
        onWithdraw
    } = useFlipCoinScreen();

    const onPlayAgain = () =>
    {
        setIsWin(false)
        setIsLost(false)
    }

    const {
        register,
        errors,
        handleSubmit,
    } = useForm<FlipCoinFormData>({ mode: 'onChange' });

    const classes = useStyles();
    const WrappedToggleButtonGroup = (props: any) => <ToggleButtonGroup {...props} />;
    WrappedToggleButtonGroup.muiName = 'ToggleButtonGroup';

    return (
        <Grid item xs={12} className={classes.content} justify="center" >
                <Container maxWidth="sm">
                    <Box display="flex" className={classes.flipCoinBox} justifyContent="center">
                        <Grid container item className={classes.boxContainer} alignItems="center" spacing={3} >
                            <Grid item xs={12}>
                            { isLoading ? 
                                <Grid container item xs={12} justify="center">
                                    <Grid item className={classes.contentCenter} xs={12}><CircularProgress size={50}/></Grid><br/>
                                    <Grid item className={classes.contentCenter} xs={12}><a href={transLink}>View on etherscan</a></Grid>
                                </Grid> :
                            !isWin ? <form onSubmit={handleSubmit(onSubmit)}>
                                    <Grid container>
                                        <Grid item className={classes.toggleGroupContainer} container xs={12} justify="center">
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
                                        <Grid item xs={12} className={classes.amountContainer}>
                                            <TextField
                                                fullWidth
                                                name="amount"
                                                type="number"
                                                label="Enter amount" 
                                                placeholder="Amount" 
                                                size="small"
                                                required  
                                                variant="outlined"
                                                inputProps={{ min: "0.1", max: "1", step: "0.1" }}
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
                                        <Grid item container justify="center" className={classes.flipCoinBtnContainer}>
                                            <Button variant="contained" size="large" type="submit" className={classes.flipCoinBtn}>Flip coin</Button>
                                        </Grid>
                                        {isError && <Grid item xs={12} className={classes.contentCenter}><Typography className={classes.flipCoinError}>Something went wrong!</Typography></Grid>}
                                        {isLost && 
                                            <Grid item xs={12} className={classes.contentCenter}>
                                                <img src={Etherum} style={{ height: '150px', width: '150px' }} alt="Etherum"/>
                                                <Typography style={{ color: 'red' }}>You lose, we're sorry!</Typography>
                                                <Button variant="contained" className={classes.withrdrawBtn} size="large" type="submit" onClick={onPlayAgain}>Play again</Button>
                                            </Grid>
                                        }
                                    </Grid>
                                </form> : 
                                <Grid item className={classes.contentCenter}>
                                    <img src={Etherum} style={{ height: '150px', width: '150px' }} alt="Etherum"/>
                                    <Typography className={classes.flipCoinWonText}>You won congratulations!</Typography><br />
                                    <Button variant="contained" className={classes.withrdrawBtn} size="large" type="submit" onClick={onWithdraw}>Withdraw funds</Button>
                                </Grid>}
                            </Grid>
                        </Grid>
                    </Box>
            </Container>
        </Grid>
    )}

export default FlipCoinScreen;