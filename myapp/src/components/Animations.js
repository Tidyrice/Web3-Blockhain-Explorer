import { useEffect, useState } from "react";
import * as spine from "@esotericsoftware/spine-player";

import { SubscribeCardMintedAnim, SubscribeCardSacrificeAnim } from "./scripts/listeners";

export default function Animations({zoombiesContract}) {

    //functional components
    const [spinePlayer, setSpinePlayer] = useState(null);
    useEffect(() => {

        const animationContainer = document.getElementById("spine-animation");

        if (animationContainer && !document.getElementsByClassName("spine-player")[0] /*prevents duplicates*/) {
            new spine.SpinePlayer('spine-animation', {
                jsonUrl: "https://zoombies.world/spine/space_walker_green.json",
                atlasUrl: "https://zoombies.world/spine/Space_Walker_02.atlas",
                showControls: false, //ERROR :: when set to true, animations show. when set to false, animations don't show :: ERROR
                alpha: true,
                backgroundColor: "#00000000",
                success: function (player) { //called after spinePlayer is successfully constructed
                    setSpinePlayer(player);
                    startRandomAnimation(player);
                    player.play();
                    animationContainer.addEventListener("click", () => clickAnimationHandler(player)); //do something on click
                },
                error: function (reason) {
                    alert(reason);
                }
            })
        }

        if (spinePlayer && zoombiesContract) { //listeners to update animations
            SubscribeCardMintedAnim(zoombiesContract, spinePlayer, cardMintedAnimationHandler);
            SubscribeCardSacrificeAnim(zoombiesContract, spinePlayer, cardSacrificedAnimationHandler);
        }

    }, [zoombiesContract, spinePlayer])

}


//PRIVATE FUNCTIONS

function cardMintedAnimationHandler(player) {
    if (player) {
        player.animationState.setAnimation(0, "run", false);
        setTimeout(() => {
            //return to idling
        }, 1000);
    }
}

function cardSacrificedAnimationHandler(player) {
    if (player) {
        player.animationState.setAnimation(0, "fall_down", false);
        setTimeout(() => {
            //return to idling
        }, 1000);
    }
}

function clickAnimationHandler(player) {
    if (player) {
        console.log("clicked");
    }
}

function getRandomAnimation() {
    const animations = ["idle", "idle2", "run", "jump", "fall_down"];
    const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
    return randomAnimation;
}

function startRandomAnimation(player) {
    const anim = getRandomAnimation();
    player.animationState.setAnimation(0, anim, false);

    setTimeout(() => {
      startRandomAnimation(player);
    }, 1000);
};