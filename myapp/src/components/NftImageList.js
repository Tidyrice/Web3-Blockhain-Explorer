import { Box } from '@mui/material';

function Item() { //each item in the flexbox (card + buttons)
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
            <img src={`https://zoombies.world/nft-image/moonbeam/1`} alt="" width= "190.3px" height= "306.933px" />
        </Box>

    )
}

export default function NftImageList({zoombiesContract}) {

    return (
        <div>

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
                <Item>Item 1</Item>
                <Item>Item 2</Item>
                <Item>Item 3</Item>
            </Box>

        </div>
    )
}