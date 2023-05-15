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
        if (animationContainer && !document.getElementsByClassName("spine-player")[0] /*prevents duplicates*/) {
            new spine.SpinePlayer('spine-animation', {
                jsonUrl: "https://zoombies.world/spine/space_walker_green.json",
                atlasUrl: "https://zoombies.world/spine/Space_Walker_02.atlas",
                animation: "idle", //animation on initial render
                animations: ["idle", "idle2", "run", "fall_down"], //avaliable animations
                showControls: false, //ERROR :: when set to true, animations show. when set to false, animations don't show :: ERROR
                alpha: true,
                backgroundColor: "#00000000",
                success: function (player) { //called after spinePlayer is successfully constructed
                    setSpinePlayer(player);
                    startIdleAnimation(player);
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
    const anim = getRandomIdleAnimation();
    player.animationState.setAnimation(0, anim, false);
    setTimeout(() => {
      startIdleAnimation(player);
    }, 1000);
};

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

function newBlockAnimationHandler(player) {
    if (player) {
        player.animationState.setAnimation(0, "jump", false);
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

function getRandomIdleAnimation() {
    const animations = ["idle", "idle2"];
    const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
    return randomAnimation;
}