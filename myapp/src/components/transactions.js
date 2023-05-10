import { useEffect, useState } from 'react'
import { ethers, utils } from 'ethers';
import { useEthers } from '@usedapp/core'
import { Contract } from '@ethersproject/contracts';
import { Button, Alert, Snackbar } from '@mui/material';

import zoombiesArtifactJson from '../resources/Zoombies.json';
import { MintBoosterNFT, BuyBoosterCredits, BuyAndMintBoosterNFT } from './scripts/mintAndBuy';

export default function Transactions() {
    
    const { account, chainId } = useEthers();
    const [zoombiesContract, setZoombiesContract] = useState(null);

    //error handling and messages
    const [errMessage, setErrMessage] = useState("");
    const [open, setOpen] = useState(false); //for snackbar
    function HandleClose() {
        setOpen(false);
    }
    function DisplayError(message) { //alert user if they don't have enough GLMR
        setErrMessage(message);
        setOpen(true);
    }


    //update contracts
    useEffect (() => {
        if (chainId === 1284 || chainId === 1285 || chainId === 1287) {

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner(account);


            //zoombies
            const zoombiesWethInterface = new utils.Interface(zoombiesArtifactJson.abi);
            const zoombiesContractAddress = zoombiesArtifactJson.networks[chainId].address;
            setZoombiesContract(new Contract(zoombiesContractAddress, zoombiesWethInterface, signer));

        }
    }, [chainId, account]);


    return (
        <div>

            <Snackbar open={open} autoHideDuration={6000} onClose={HandleClose}>
                <Alert severity="error">
                    {errMessage}
                </Alert>
            </Snackbar>

            {account && <Button variant="contained" onClick={() => MintBoosterNFT(zoombiesContract, DisplayError)}>Mint Booster NFT</Button>}

            {account && <Button variant="contained" onClick={() => BuyBoosterCredits(zoombiesContract, DisplayError)}>Buy Booster Credits (1)</Button>}

            {account && <Button variant="contained" onClick={() => BuyAndMintBoosterNFT(zoombiesContract, DisplayError)}>Buy and Mint Booster NFT</Button>}

        </div>
    )

}