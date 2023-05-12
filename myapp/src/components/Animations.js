import { useEffect } from "react";
import * as spine from "@esotericsoftware/spine-core";

export default function Animations() {
console.log(spine)
    useEffect(() => {
        if (document.getElementById("spine-animation")) {
            new spine.SpinePlayer('canvas-spine-animation', { //SpinePlayer NOT A FUNCTION :: ERROR
                jsonUrl: "https://zoombies.world/spine/space_walker_green.json",
                atlasUrl: "https://zoombies.world/spine/Space_Walker_02.atlas",
                showControls: false,
                alpha: true,
                backgroundColor: "#00000000",
                success: function (player) {
                    setSpineRef(player); //NOT A FUNCTION :: ERROR
                    startRandomAnimation(player); //NOT A FUNCTION :: ERROR
                },
                error: function (player, reason) {
                    alert(reason);
                }
            })
        }
    }, [])

}