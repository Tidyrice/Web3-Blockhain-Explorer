import { useEffect, useState } from "react";
import { Box } from '@mui/material';
//translated from Svelte
//https://github.com/simeydotme/pokemon-cards-css/blob/main/src/lib/components/Card.svelte

function Card({cardURL}) { //individual card element

    const [card, setCard] = useState(null);

    useEffect(() => {
        getCardFromAPI(cardURL)
        .then((result) => { //result is in this format: https://zoombies.world/services/card_types/mb/37.json (parsed JSON)
            setCard({ //set card object
                name: result.name,
                imageURL: result.image,
                description: result.description,
                
                id: result.attributes[0].value,
                rarity: result.attributes[4].value,
            });
        })
        .catch((error) => {
            console.log(error);
        })
    }, [cardURL]);


    return (
        <div>
            {card && (
                <Box
                    sx={{
                        p: 1,
                        m: 1,
                    }}
                >

                    <img src={card.imageURL} alt="" width= "190.3px" height= "306.933px" />

                </Box>
            )}
        </div>
    )

}

export default function Cards() {

    return (
        <Box
            sx={{
                p: 1,
                m: 1,
            }}
        >

            <b>Card showcase:</b>

            <Card cardURL={"https://zoombies.world/nft/moonbeam/100" /*common*/} />
            <Card cardURL={"https://zoombies.world/nft/moonbeam/1090" /*uncommon*/} />
            <Card cardURL={"https://zoombies.world/nft/moonbeam/6" /*rare*/} />
            {/* <Card cardURL={card4} /> */}
            <Card cardURL={"https://zoombies.world/nft/moonbeam/79" /*platinum*/} />

        </Box>
    )
}

async function getCardFromAPI(URL) {
    const response = await fetch(URL);
    const data = await response.json();
    return data; //return is in this format: https://zoombies.world/services/card_types/mb/37.json
}