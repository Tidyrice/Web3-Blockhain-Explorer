import { useEffect, useState, useCallback, useRef } from "react";
import { Typography } from "@mui/material";
import "./Cards.css";

const cardBackURL = "https://zoombies.world/card-gen/assets/zoombies_card_back.svg";
const cardWidth = 260; //max width of the card (px)
const cardHeight = 410; //max height of the card (px)

//spring configuration
const dampen = 0.020; //dampen the rotation (higher number = less rotation)
const showcaseScale = 1.6; //scale of the showcased card

function Card({cardURL, activeCard, setActiveCard}) { //individual card element

    //getting card from API call
    const [thisCard, setThisCard] = useState(null);
    useEffect(() => {
        getCardFromAPI(cardURL)
        .then((result) => { //result is in this format: https://zoombies.world/nft/moonbeam/1090 (parsed JSON)
            setThisCard({ //set card object
                name: result.name,
                imageURL: result.image,
                description: result.description,
                
                id: result.attributes[0].value,
                rarity: result.attributes[6].value,
                cost: result.attributes[10].value,
                buy_zoom: result.attributes[11].value,
                sacrifice_zoom: result.attributes[13].value,
            });
        })
        .catch((error) => {
            console.log(error);
        })
    }, [cardURL]);


    //animation and showcase precondition
    useEffect(() => {
        if (thisCard) {
            if (activeCard && (activeCard !== thisCard)) { //if this card is not the showcased card, prevent interaction
                document.getElementById(thisCard.id).style.pointerEvents = "none";
            }
            else { //if this card is the showcased card OR there is no showcased card, allow interaction
                document.getElementById(thisCard.id).style.pointerEvents = "auto";
            }
        }
    }, [activeCard, thisCard])


    //card animation
    const [rotation, setRotation] = useState({ x: 0, y: 0 }); //degrees to rotate card (with dampening)
    const [xy, setXy] = useState({ x: 0, y: 0 }); //mouse position within the card
    const [delta, setDelta] = useState({ x: 0, y: 0 }); //distance from card to center of screen (for translation);
    const [isHovered, setIsHovered] = useState(false); //card hovered?

    function handleMouseMove(event) {
        const { clientX, clientY, target } = event;
        const { left, top, width, height } = target.getBoundingClientRect(); //left = left edge of viewport to left edge of card, top = top edge of viewport to top edge of card

        //mouse position within the card
        let x, y;
        if (!isFlipped) {
            x = (clientX - left) / width; //ranges from 0 to 1
            y = (clientY - top) / height; //ranges from 0 to 1
        }
        else {
            x = 1 - ((clientX - left) / width); //x is inverted because card is mirrored when flipped
            y = (clientY - top) / height;
        }
        setXy({ x: x, y: y });

        //calculate rotation
        const rotationX = (xy.y - 0.5) / dampen; // y - 0.5 to center the rotation (y ranges from -0.5 to 0.5)
        const rotationY = (xy.x - 0.5) / dampen; // x - 0.5 to center the rotation

        setRotation({ x: rotationX, y: rotationY });
    }

    function handleMouseEnter() {
        setIsHovered(true);
        document.getElementById(thisCard.id).style.transition = ""; //card rotates responsively (no transition time)
    }

    function handleMouseLeave() {
        setIsHovered(false);
        setRotation({ x: 0, y: 0 }); //reset to default
        document.getElementById(thisCard.id).style.transition = "transform 0.5s"; //card returns to rest gracefully
    }


    //card showcase
    const [showcase, setShowcase] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false); //card flipped?
    const isFlippedPrev = useRef(isFlipped); //previous value of isFlipped (for useEffect)

    function startShowcase() {
        setCenter(); //set card to center of screen
        setShowcase(true);
        setActiveCard(thisCard); //let other cards know this card is being showcased
    }

    function handleOnClick(event) {
        if (!showcase) { //start showcasing when card clicked
            startShowcase();
            setIsFlipped(false); //card is not flipped when initially showcased
            isFlippedPrev.current = false;
        }
        else { //flip the card when clicked again
            setIsFlipped(!isFlipped); //isFlippedPrev is not updated until flipping transition is complete
        }
    }

    
    //set card to center of screen for showcasing
    const setCenter = useCallback(() => { //set card to center of screen
        const cardHtmlElement = document.getElementById(thisCard.id).parentElement; //parent element has constant width and height
        const { left, top, width, height } = cardHtmlElement.getBoundingClientRect(); //get element's position relative to viewport
        const view = document.documentElement; //get viewport size

        //distance to center of screen
        const xTranslate = Math.round((view.clientWidth / 2) - left - (width / 2));
        const yTranslate = Math.round((view.clientHeight / 2) - top - (height / 2));

        const newX = delta.x + xTranslate;
        const newY = delta.y + yTranslate;

        setDelta({ x: newX, y: newY });
    }, [delta, thisCard])


    //reposition showcased card when window is resized
    useEffect(() => {
        if (!showcase) {
            return;
        }

        let repositionTimer;
        function reposition() {
            clearTimeout(repositionTimer);
            repositionTimer = setTimeout(() => {
                if (showcase) {
                    setCenter();
                }
            }, 300);
        }

        document.addEventListener("scroll", reposition);
        window.addEventListener("resize", reposition);

        return () => {
            clearTimeout(repositionTimer);
            document.removeEventListener("scroll", reposition);
            window.removeEventListener("resize", reposition);
        }
    }, [showcase, setCenter]);


    //stop showcasing when clicked outside of card
    useEffect(() => {
        if (!showcase) {
            return;
        }

        function stopShowcase() {
            setShowcase(false);
            setIsFlipped(false);
            isFlippedPrev.current = false;
            setActiveCard(null); //let other cards know this card is no longer being showcased
            setDelta({ x: 0, y: 0 });
            document.getElementById(thisCard.id).style.pointerEvents = "none"; //prevent interaction with this card during transition
        }

        function outsideClickListener(event) {
            if (!document.getElementById(thisCard.id).contains(event.target)) { //if clicked OUTSIDE of card
                stopShowcase();
            }
        }

        let transitionTimer;
        if (isFlippedPrev.current !== isFlipped) { //card is flipping
            transitionTimer = setTimeout(() => { //wait for transition to finish if card flipping (NEEDED TO PREVENT BUG WHEN SPAM CLICKING)
                document.addEventListener("click", outsideClickListener);
            }, 500);
        }
        else { //otherwise, card is not flipping so attach listener immediately
            document.addEventListener("click", outsideClickListener);
        }

        isFlippedPrev.current = isFlipped; //update the useRef

        return () => {
            clearTimeout(transitionTimer);
            document.removeEventListener("click", outsideClickListener);
        }
    }, [showcase, activeCard, setActiveCard, thisCard, isFlipped, isFlippedPrev]);


    return (
        <div
            className={"card" + (isHovered ? " enlarged" : "") + (showcase ? " showcase" : "") + (isFlipped ? " flipped" : "")} //add classnames for CSS
            style={{
                transform: showcase ? (
                    `translate(${delta.x}px, ${delta.y}px) ` +
                    `${isFlipped ? "rotateY(180deg)" : ""} ` +
                    `scale(${showcaseScale})`
                ) : "",
            }}
        >
            {thisCard && (

                <div
                    id={thisCard.id}
                    className="card-content"
                    onMouseEnter={handleMouseEnter}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onClick={handleOnClick}

                    style = {{
                        transform: `perspective(600px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                        width: `${cardWidth}px`,
                        height: `${cardHeight}px`,
                    }}
                >

                    <div className="face front">
                        <img src={thisCard.imageURL} alt="" style={{maxWidth: `${cardWidth}px`, maxHeight: `${cardHeight}px`}} />
                    </div>

                    <div //glare effect only applies to front face
                        className="glare"
                        style={{
                            transform: isHovered ? `translate(${xy.x*120}px, ${xy.y*120}px) scale(${isHovered ? 1.1 : 1})`: "",
                        }}
                    />

                    <div className="face back">
                        <img src={cardBackURL} alt="" style={{ maxWidth: `${cardWidth}px`, maxHeight: `${cardHeight}px`}} />

                        <div className="card-data">
                            
                            <Typography variant="h5">Token #{thisCard.id}</Typography>
                            <br />
                            <Typography variant="p">
                                <span style={{ fontWeight: "bold" }}>GLMR Cost: </span>
                                {thisCard.cost}
                            </Typography>
                            <br />
                            <Typography variant="p">
                                <span style={{ fontWeight: "bold" }}>Sacrifice earn ZOOM: </span>
                                {thisCard.sacrifice_zoom}
                            </Typography>

                        </div>

                        <div className="logo">
                            <img src={"https://zoombies.world/images/moonbeam_label.svg"} alt="" style={{ maxWidth: `${cardWidth / 2.3}px`, maxHeight: `${cardHeight / 2.3}px`}}/>
                        </div>
                    </div>

                </div>

            )}
        </div>
    )

}

export default function Cards() {

    const [activeCard, setActiveCard] = useState(null); //card that is being showcased

    return (
        <div
            className="card-grid"
            style={{ gridTemplateColumns: `repeat(auto-fill, ${cardWidth}`, gridTemplateRows: `repeat(auto-fill, ${cardHeight})`,}}
        >

            <Card cardURL={"https://zoombies.world/nft/moonbeam/100" /*common*/} activeCard={activeCard} setActiveCard={setActiveCard} />
            <Card cardURL={"https://zoombies.world/nft/moonbeam/1090" /*uncommon*/} activeCard={activeCard} setActiveCard={setActiveCard} />
            <Card cardURL={"https://zoombies.world/nft/moonbeam/6" /*rare*/} activeCard={activeCard} setActiveCard={setActiveCard} />
            <Card cardURL={"https://zoombies.world/nft/moonbeam/79" /*platinum*/} activeCard={activeCard} setActiveCard={setActiveCard} />

        </div>
    )
}

async function getCardFromAPI(URL) {
    const response = await fetch(URL);
    const data = await response.json();
    return data; //return is in this format: https://zoombies.world/nft/moonbeam/1090
}