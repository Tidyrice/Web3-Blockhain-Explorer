import { useEffect, useState } from 'react'
import { useEthers } from '@usedapp/core'
import { IconButton, Box } from '@mui/material';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

function Item({zoombiesContract, token}) { //each item in the flexbox (card + buttons)

    const { account } = useEthers();


    const [userOwnsCard, setUserOwnsCard] = useState(false);
    useEffect(() => { //check if user owns card (rerender upon promise completion)
        async function UserOwnsCard() {
            setUserOwnsCard(account === await zoombiesContract.ownerOf(token));
        }
        if (zoombiesContract) {
            UserOwnsCard();
        }
    }, [account, zoombiesContract, token]); //only zoombiesContract will change


    function Gift() {
    
    }
    
    function Sacrifice() {
    
    }


    return (
        <div>
            {account && zoombiesContract && (

                <Box
                    sx={{
                    p: 1,
                    m: 1,
                    }}
                >
                    <img src={`https://zoombies.world/nft-image/moonbeam/${token}`} alt="" width= "190.3px" height= "306.933px" />
                    {console.log(zoombiesContract.ownerOf(token))}
                    {userOwnsCard /*check ownership before displaying buttons*/ && (
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <IconButton sx={{mr: 1}} onClick={Gift}>
                                <CardGiftcardIcon color="blue"/>
                            </IconButton>

                            <IconButton sx={{ml: 1}} onClick={Sacrifice}>
                                <DeleteForeverIcon />
                            </IconButton>
                        </div>
                    )}

                </Box>

            )}
        </div>
    )
}

export default function LastCardsMinted(zoombiesContract, tokenId) {

    const { account } = useEthers();


    return (
        <div>
            {account && zoombiesContract && (
                
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
                            <Item zoombiesContract={zoombiesContract} token={token} key={token}/>
                        ))}
                    </Box>

                </div>

            )}
        </div>
    )
}