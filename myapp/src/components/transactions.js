import { MintBoosterNFT, BuyBoosterCredits, BuyAndMintBoosterNFT } from './scripts/mintAndBuy';

import { useState } from 'react'
import { useEthers } from '@usedapp/core'
import { Button, Alert, Snackbar } from '@mui/material';

export default function Transactions({zoombiesContract}) {
    
    const { account } = useEthers();

    //error handling and messages
    const [errMessage, setErrMessage] = useState("");
    const [openErr, setOpenErr] = useState(false); //for snackbar
    function DisplayError(message) { //alert user if they don't have enough GLMR
        setErrMessage(message);
        setOpenErr(true);
    }

    //success message
    const [openSuccess, setOpenSuccess] = useState(false); //for snackbar

    function HandleClose() {
        setOpenErr(false);
        setOpenSuccess(false);
    }


    return (
        <div>

            <Snackbar open={openErr} autoHideDuration={6000} onClose={HandleClose}>
                <Alert severity="error">
                    {errMessage}
                </Alert>
            </Snackbar>

            <Snackbar open={openSuccess} autoHideDuration={6000} onClose={HandleClose}>
                <Alert severity="success">
                    Transaction success!
                </Alert>
            </Snackbar>

            {account && <Button variant="contained" onClick={() => MintBoosterNFT(zoombiesContract, DisplayError)}>Mint Booster NFT</Button>}

            {account && <Button variant="contained" onClick={() => BuyBoosterCredits(zoombiesContract, 1, DisplayError)}>Buy Booster Credits (1)</Button>}

            {account && <Button variant="contained" onClick={() => BuyAndMintBoosterNFT(zoombiesContract, DisplayError)}>Buy and Mint Booster NFT</Button>}

        </div>
    )

}