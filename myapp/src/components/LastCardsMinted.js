import { useEffect } from 'react';
import { useEthers } from '@usedapp/core'
import { Box } from '@mui/material';

function Item({token}) { //each item in the flexbox (card + buttons)
    return (

        <Box
            sx={{
            p: 1,
            m: 1,
            width: 190.3,
            height: 306.933,
            borderRadius: 1,
            }}
        >
            <img src={`https://zoombies.world/nft-image/moonbeam/${token}`} alt="" width= "190.3px" height= "306.933px" />
        </Box>

    )
}

export default function LastCardsMinted(zoombiesContract, tokenId) {

    const { account } = useEthers();


    useEffect (() => {
        console.log(tokenId);
    }, [zoombiesContract, tokenId]);


    return (
        <div>

            <b>Last cards minted:</b>
            
            {account && (
                <Box
                    sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    p: 1,
                    m: 1,
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    }}
                >
                    {tokenId.map((token) => (
                        <Item token={token}/>
                    ))}
                </Box>
            )}

        </div>
    )
}