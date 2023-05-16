import { useEffect } from "react";
import Phaser from "phaser";

export default function StarField() {

    useEffect(() => {

        //star params
        const distance = 800;
        const speed = 0.5;
        const stars = [];

        const max = 100; //max amount of stars
        const x = [];
        const y = [];
        const z = [];

        //window sizing
        let screenWidth = window.screen.width;
        let screenHeight = window.screen.height;

        window.addEventListener('resize', function() {
            screenWidth = window.screen.width;
            screenHeight = window.screen.height;
        }, true);


        //rendering the stars
        function preload() {
            this.load.image("star", "star.png");
        }
        function create() {
            for (let i = 0; i < max; i++) {
                stars.push(this.add.image(config.width / 2, config.height / 2, "star"));
                x[i] = Math.floor(Math.random() * 800) - 400;
                y[i] = Math.floor(Math.random() * 600) - 300;
                z[i] = Math.floor(Math.random() * 1700) - 100;
            }
        }
        function update() {
            for (let i = 0; i < max; i++) {
                const perspective = distance / (distance - z[i]);
                const starX = (config.width / 2) + (x[i] * perspective);
                const starY = (config.height / 2) + (y[i] * perspective);
    
                z[i] += speed;
    
                if (z[i] > 600) {
                    z[i] -= 600;
                }
    
                stars[i].setPosition(starX, starY);
            }
        }

        const config = {
            type: Phaser.AUTO,
            parent: "star-field",
            width: screenWidth,
            height: screenHeight,
            scale: {
                mode: Phaser.Scale.ENVELOP,
                autoCenter: Phaser.Scale.CENTER_BOTH,
            },
            transparent: true,
            fps: {
                target: 60,
            },
            scene: {
                preload: preload,
                create: create,
                update: update,
            }
        };

        const game = new Phaser.Game(config);

        //clean up the game instance on unmount
        return () => {
            game.destroy(true);
        }

    }, []);

    return <div id="star-field"></div>
}