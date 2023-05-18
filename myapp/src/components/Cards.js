import { useEffect, useState, useRef } from "react";
import { Box } from '@mui/material';
import { transform } from "typescript";

//spring configuration
const dampen = 0.020; //dampen the rotation (higher number = less rotation)
const enlargeScale = 1.1 //scale up when hovered

function Card({cardURL}) { //individual card element

    //getting card from API call
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


    //card animation
    const [rotation, setRotation] = useState({ x: 0, y: 0});
    const [isHovered, setIsHovered] = useState(false); //keep track of whether card is hovered

    function handleMouseMove(event) {
        const { clientX, clientY, target } = event;
        const { left, top, width, height } = target.getBoundingClientRect(); //left = left edge of viewport to left edge of card, top = top edge of viewport to top edge of card

        //mouse position within the card
        const x = (clientX - left) / width; //ranges from 0 to 1
        const y = (clientY - top) / height; //ranges from 0 to 1

        //calculate rotation
        const rotationX = (y - 0.5) / dampen; // y - 0.5 to center the rotation (y ranges from -0.5 to 0.5)
        const rotationY = (x - 0.5) / dampen; // x - 0.5 to center the rotation

        setRotation({ x: rotationX, y: rotationY });
    }

    function handleMouseEnter() {
        setIsHovered(true);
    }

    function handleMouseLeave() {
        setIsHovered(false);
        setRotation({ x: 0, y: 0 }); //reset to default
    }

    function handleOnClick() {

    }


    return (
        <div>
            {card && (
                <div
                    onMouseEnter={handleMouseEnter}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onClick={handleOnClick}

                    style = {{
                        zIndex : isHovered ? 2 : 1, //overlap other cards when hovered (scaling up)
                        transform: `perspective(600px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${isHovered ? enlargeScale : 1})`
                    }}
                >

                    <img src={card.imageURL} alt="" width= "190.3px" height= "306.933px" />

                </div>
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


//IMPLEMENTATION WITH REACT-SPRING
/*
const ref = useRef();
const [isHovered, setIsHovered] = useState(false); //keep track of whether card is hovered
const [springRotate, setSpringRotate] = useSpring(() => {
    return {
        xys: [0, 0, 1],
        config: springConfig,
    };
});

<animated.div // CODE REFERENCED: https://usehooks.com/useSpring/
    ref={ref}
    onMouseEnter={() => setIsHovered(true)}
    onMouseMove={({ clientX, clientY }) => {

        //get mouse x position within card
        const x =
            clientX -
            (ref.current.offsetLeft -
                (window.scrollX || window.pageXOffset || document.body.scrollLeft));

        //get mouse y position within card
        const y =
            clientY -
            (ref.current.offsetTop -
                (window.scrollY || window.pageYOffset || document.body.scrollTop));

        //set animated values based on mouse position and card dimensions
        const dampen = damp; //dampen the rotation
        const xys = [
            -(y - ref.current.clientHeight / 2) / dampen, //x rotation
            (x - ref.current.clientWidth / 2) / dampen, //y rotation
            1.07, //scale
        ];

        //update values to animate to
        setSpringRotate({ xys: xys });

    }}
    onMouseLeave={() => {
        setIsHovered(false);
        setSpringRotate({ xys: [0, 0, 1] }); //reset to default
    }}
    style={{
        zIndex : isHovered ? 2 : 1, //overlap other cards when hovered (scaling up)
        transform: springRotate.xys.to(
            (x, y, s) =>
                `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`
        ),
    }}
>

    <img src={card.imageURL} alt="" width= "190.3px" height= "306.933px" />

</animated.div>
*/