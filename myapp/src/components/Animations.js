import { useEffect, useState } from "react";
import {  useBlockNumber, useEthers } from '@usedapp/core';
import * as spine from "@esotericsoftware/spine-player";

import { SubscribeCardMintedAnim, SubscribeCardSacrificeAnim } from "./scripts/listeners";

export default function Animations({zoombiesContract}) {

    const [spinePlayer, setSpinePlayer] = useState(null);

    const { chainId } = useEthers();
    const blockNumber = useBlockNumber();
    const [lastBlockNumber, setLastBlockNumber] = useState(null);


    //animations
    useEffect(() => {
        const animationContainer = document.getElementById("spine-animation");
        if (animationContainer && document.getElementsByClassName("spine-player").length < 2 /*prevents duplicates*/) {
            new spine.SpinePlayer('spine-animation', {
                jsonUrl: "https://zoombies.world/spine/space_walker_green.json",
                atlasUrl: "https://zoombies.world/spine/Space_Walker_02.atlas",
                animation: "idle", //animation on initial render
                animations: ["fall_down", "idle", "idle2", "jump", "run"], //avaliable animations
                showControls: false,
                showLoading: false,
                alpha: true,
                backgroundColor: "#00000000",
                success: function (player) { //called after spinePlayer is successfully constructed. WARN: calling startAnimation or play() does not work
                    setSpinePlayer(player);
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

    }, [zoombiesContract, spinePlayer]);

    //block update listener
    useEffect(() => {
        if (blockNumber && lastBlockNumber !== blockNumber && (chainId === 1284 || chainId === 1285 || chainId === 1287)) {
            if (spinePlayer) {
                newBlockAnimationHandler(spinePlayer);
            }
            setLastBlockNumber(blockNumber);
        }
    }, [blockNumber, lastBlockNumber, chainId, spinePlayer]);

}


//PRIVATE FUNCTIONS

function startIdleAnimation(player) {
    if (player) {
        const anim = getRandomIdleAnimation();
        player.animationState.setAnimation(0, anim, true); //loop this animation
        /*setTimeout(() => {
        startIdleAnimation(player);
        }, 1000);*/
    }
};

function cardMintedAnimationHandler(player) {
    if (player) {
        player.animationState.setAnimation(0, "run", false);
        setTimeout(() => {
            startIdleAnimation(player);
        }, 1000);
    }
}

function cardSacrificedAnimationHandler(player) {
    if (player) {
        player.animationState.setAnimation(0, "fall_down", false);
        setTimeout(() => {
            startIdleAnimation(player);
        }, 1000);
    }
}

function newBlockAnimationHandler(player) {
    if (player) {
        player.animationState.setAnimation(0, "jump", false);
        setTimeout(() => {
            startIdleAnimation(player);
        }, 1000);
    }
}

function clickAnimationHandler(player) {
    if (player) {
        console.log("clicked");
    }
}

function getRandomIdleAnimation() {
    const animations = ["idle", "idle2"];
    const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
    return randomAnimation;
}