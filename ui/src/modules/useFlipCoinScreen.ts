import { useEffect, useState } from 'react';
import abi from '../abi';
import Web3 from 'web3';

export default function useFlipCoinScreen() {

    const [isWin, setIsWin] = useState<boolean>(false);
    const [isLost, setIsLost] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [transLink, setTransLink] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [contract, setContract] = useState<any>();
    const [headsOrTails,setHeadsOrTails] = useState<number>(1);
    const [web3prov,setWeb3Prov] = useState<Web3>();
    const [networkName,setNetworkName] = useState<string>();
    const [chainUrl,setChainUrl] = useState<string>("ropsten");
    const [account,setAccount] = useState<any>();

    const contractHash = "0x4c5226029c21279bd9d7bea37cf69b3058d57d97";

    useEffect(() => {
        if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
            setWeb3Prov(web3)
            web3.eth.net.getNetworkType((error : Error,returnValue : string) => {
                setNetworkName(returnValue)
                setChainUrl(`https://${returnValue}.etherscan.io/tx/`);
            })
            try { 
            window.ethereum.enable().then(function(accounts : any) {
                // User has allowed account access to DApp...
                const flipCoinContract = new web3.eth.Contract(abi,contractHash,{from: accounts[0]});
                setAccount(accounts[0])
                setContract(flipCoinContract);
                flipCoinContract.events.placedBet({
                    filter: {},
                    fromBlock: 'latest'
                    }, function(error : any, event : any){ 
                        if(event.returnValues && event.returnValues['isWin'] !== null)
                        {
                            event.returnValues['isWin'] ? setIsWin(true) : setIsLost(false);
                            setIsLoading(false);
                        }  
                })
            });
            } catch(e) {
            // User has denied account access to DApp...
            setIsError(true)
            }
        }
        // Legacy DApp Browsers
        else if (window.web3) {
            const web3 = new Web3(window.web3.currentProvider);
            const flipCoinContract = new web3.eth.Contract(abi,contractHash);
            setContract(flipCoinContract);
            setWeb3Prov(web3)
            flipCoinContract.events.placedBet({
                filter: {},
                fromBlock: 'latest'
                }, function(error : any, event : any){ 
                    if(event.returnValues && event.returnValues['isWin'] !== null)
                    {
                        event.returnValues['isWin'] ? setIsWin(true) : setIsLost(false);
                        setIsLoading(false);
                    }  
            })
        }
        // Non-DApp Browsers
        else {
            alert('You have to install MetaMask !');
        }
    },[]) 
    
    const onSubmit = async (values : any) => {
        console.log(headsOrTails)
        if(contract){
            await contract.methods.flip(headsOrTails).send({from: account, gas: 3000000, value: web3prov?.utils.toWei(values.amount, "ether")})
            .on("transactionHash", function(hash : any){
                setIsLoading(true)
                setTransLink(chainUrl + hash)
            })
            .on("receipt", function(receipt : any){
                console.log(receipt)
            })
            .on("error", function(error : any){
                console.log(error)
                setIsError(true)
            });
        }
       
    }

    const onChange = () => {
        setIsLost(false);
        setIsWin(false);
    }

    const onHeadsOrTails = (e : any,newValue: number | null) => {
        if(newValue !== null){
            setHeadsOrTails(newValue);
        }
    }

    const onWithdraw = async () => {
        if(contract){
            setIsLoading(true)
            await contract.methods.withdraw().send({from: account, gas: 3000000, value: web3prov?.utils.toWei("0.01", "ether")})
            .on("transactionHash", function(hash : any){
                setTransLink(chainUrl + hash)
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
    }


    return {
        isWin,
        isLost, 
        isError, 
        transLink, 
        isLoading, 
        headsOrTails,
        networkName,
        onHeadsOrTails,
        setTransLink,
        onSubmit,
        onChange,
        onWithdraw
    }
}