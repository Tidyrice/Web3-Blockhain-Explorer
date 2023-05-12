import { GiftCard, SacrificeCard } from './scripts/giftAndSacrifice';

import { useEffect, useState } from 'react'
import { useEthers } from '@usedapp/core'
import { Button, IconButton, Box, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

function Item({zoombiesContract, token, tokenArr}) { //each item in the flexbox (card + buttons)

    const { account } = useEthers();


    const [userOwnsCard, setUserOwnsCard] = useState(false);
    useEffect(() => { //check if user owns card (rerender upon promise completion)
        async function UserOwnsCard() {
            setUserOwnsCard(account === await zoombiesContract.ownerOf(token));
        }
        if (zoombiesContract) {
            UserOwnsCard();
        }
    }, [account, zoombiesContract, token, tokenArr]); //only zoombiesContract will change


    //error handling and messages
    const [errMessage, setErrMessage] = useState("");
    const [openErr, setOpenErr] = useState(false); //for snackbar
    function DisplayError(message) { //alert user if they don't have enough GLMR
        setErrMessage(message);
        setOpenErr(true);
    }

    //success message
    const [openSuccess, setOpenSuccess] = useState(false); //for snackbar
    function DisplaySuccess() {
        setOpenSuccess(true);
    }

    function HandleClose() {
        setOpenErr(false);
        setOpenSuccess(false);
    }


    //gift
    const [openGift, setOpenGift] = useState(false);
    const handleGiftOpen = () => setOpenGift(true);
    const handleGiftClose = () => setOpenGift(false);
    async function Gift() { //gift the card to the address entered in the dialog
        handleGiftClose();
        const recipient = document.getElementById("giftAddress").value;
        GiftCard(zoombiesContract, token, recipient, DisplayError, DisplaySuccess);
    }


    //sacrifice
    const [openSacrifice, setOpenSacrifice] = useState(false);
    const handleSacrificeOpen = () => setOpenSacrifice(true);
    const handleSacrificeClose = () => setOpenSacrifice(false);
    async function Sacrifice() {
        handleSacrificeClose();
        SacrificeCard(zoombiesContract, token, tokenArr, DisplayError, DisplaySuccess);
    }


    return (
        <div>
            {account && zoombiesContract && (
                <div>

                    {/*card image and gift/sacrifice buttons (displayed conditionally upon card ownership)*/}
                    <Box
                        sx={{
                            p: 1,
                            m: 1,
                        }}
                    >
                        <img src={`https://zoombies.world/nft-image/moonbeam/${token}`} alt="" width= "190.3px" height= "306.933px" />
                        {userOwnsCard /*check ownership before displaying buttons*/ && (
                            <div style={{display: "flex", justifyContent: "center"}}>
                                <IconButton sx={{mr: 1}} onClick={handleGiftOpen}>
                                    <CardGiftcardIcon color="blue"/>
                                </IconButton>

                                <IconButton sx={{ml: 1}} onClick={handleSacrificeOpen}>
                                    <DeleteForeverIcon />
                                </IconButton>
                            </div>
                        )}

                    </Box>

                    <Snackbar open={openErr} autoHideDuration={6000} onClose={HandleClose}>
                        <Alert severity="error">
                            {errMessage}
                        </Alert>
                    </Snackbar>

                    <Snackbar open={openSuccess} autoHideDuration={6000} onClose={HandleClose}>
                        <Alert severity="success">
                            Transaction successful!
                        </Alert>
                    </Snackbar>

                    {/*gift dialog*/}
                    <Dialog open={openGift} onClose={handleGiftClose}>
                        <DialogTitle>Gift Card</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                To gift this card, please enter the recipient's address below.
                            </DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="giftAddress"
                                label="Recipient Address"
                                type="text"
                                fullWidth
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleGiftClose}>Cancel</Button>
                            <Button onClick={Gift}>Gift</Button>
                        </DialogActions>
                    </Dialog>

                    {/*sacrifice dialog*/}
                    <Dialog open={openSacrifice} onClose={handleSacrificeClose}>
                        <DialogTitle>Sacrifice Card</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Please confirm you want to sacrifice this card.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleSacrificeClose}>Cancel</Button>
                            <Button onClick={Sacrifice}>Sacrifice</Button>
                        </DialogActions>
                    </Dialog>

                </div>
            )}
        </div>
    )
}

export default function LastCardsMinted(zoombiesContract, tokenId) {

    const { account } = useEthers();


    return (
        <div>
            {account && zoombiesContract && (tokenId.length !== 0) && (
                
                <div>

                    <b>Last cards minted:</b>
                    
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                        }}
                    >
                        {tokenId.map((token) => (
                            <Item zoombiesContract={zoombiesContract} token={token} tokenArr={tokenId} key={token}/>
                        ))}
                    </Box>

                </div>

            )}
        </div>
    )
}