import { useState } from 'react'
import { useEthers } from '@usedapp/core'
import { Button, Alert, Snackbar } from '@mui/material';

import { MintBoosterNFT, BuyBoosterCredits, BuyAndMintBoosterNFT } from './scripts/mintAndBuy';

export default function Transactions({zoombiesContract}) {
    
    const { account } = useEthers();

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