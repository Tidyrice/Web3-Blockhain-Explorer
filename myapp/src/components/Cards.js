import { useEffect, useState, useRef } from "react";
import { useSpring, animated } from "react-spring";
import { Box } from '@mui/material';

//spring configuration
const mass = 10;
const tension = 400;
const friction = 40;
const damp = 10; //dampen the rotation
const springConfig = { mass: mass, tension: tension, friction: friction, precision: 0.00001 };

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
    const ref = useRef();
    const [isHovered, setIsHovered] = useState(false); //keep track of whether card is hovered
    const [springRotate, setSpringRotate] = useSpring(() => {
        return {
            xys: [0, 0, 1],
            config: springConfig,
        };
    });


    //card glare. CODE REFERENCED: https://github.com/simeydotme/pokemon-cards-css/blob/main/src/lib/components/Card.svelte
    const [springGlare, setSpringGlare] = useSpring(() => {
        return {
            xys: [50, 50, 0],
            config: springConfig,
        };
    });
    const [springRotateDelta, setSpringRotateDelta] = useSpring(() => {
        return {
            xys: [0, 0, 0],
            config: springConfig,
        }
    });
    const [springBackground, setSpringBackground] = useSpring(() => {
        return {
            xys: [50, 50, 0],
            config: springConfig,
        }
    });
    const [springTranslate, setSpringTranslate] = useSpring(() => {
        return {
            xys: [0, 0, 0],
            config: springConfig,
        }
    });
    const [springScale, setSpringScale] = useSpring(() => {
        return {
            scale: 1,
        }
    });

    const [dynamicStyles, setDynamicStyles] = useState(null);
    useEffect(() => {

        const updatedDynamicStyles = `
            --pointer-x: ${springGlare.x}%;
            --pointer-y: ${springGlare.y}%;
            --pointer-from-center: ${Math.sqrt(
            (springGlare.y - 50) ** 2 + (springGlare.x - 50) ** 2
            ) / 50}, 0, 1);
            --pointer-from-top: ${springGlare.y / 100};
            --pointer-from-left: ${springGlare.x / 100};
            --card-opacity: ${springGlare.o};
            --rotate-x: ${springRotate.x + springRotateDelta.x}deg;
            --rotate-y: ${springRotate.y + springRotateDelta.y}deg;
            --background-x: ${springBackground.x}%;
            --background-y: ${springBackground.y}%;
            --card-scale: ${springScale};
            --translate-x: ${springTranslate.x}px;
            --translate-y: ${springTranslate.y}px
        `;

        setDynamicStyles(updatedDynamicStyles);
    }, [springRotate, springGlare, springRotateDelta, springBackground, springTranslate, springScale]);

    
    return (
        <div>
            {card && (
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

function clamp(value, min = 0, max = 100) {
    return Math.min(Math.max(min, value), max);
}