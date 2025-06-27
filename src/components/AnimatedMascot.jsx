import React, { useEffect, useRef } from "react";
import Lottie from "lottie-react";
import panda from "@assets/jsons/panda.json";
import catEyes from "@assets/jsons/cat-eyes.json";
import frog from "@assets/jsons/frog.json";
import parrot from "@assets/jsons/parrot.json";
import penguin from "@assets/jsons/penguin.json";
import pigeon from "@assets/jsons/pigeon.json";
import owl from "@assets/jsons/owl.json";
import fox from "@assets/jsons/fox.json";
import monkey from "@assets/jsons/monkey.json";
import fish from "@assets/jsons/fish.json";
import fishes from "@assets/jsons/fishes.json";
import mouse from "@assets/jsons/mouse.json";

const mascots = [
    {
        name: "panda",
        animation: panda,
        topOffset: "-137px",
        width: 150,
        speed: 0.2,
        classes: 'right-0'
    },
    {
        name: "cat",
        animation: catEyes,
        topOffset: "-257px",
        width: 150,
        speed: 0.5,
        classes: 'right-0'
    },
    {
        name: "parrot",
        animation: parrot,
        topOffset: "-115px",
        width: 200,
        speed: 0.8,
        classes: 'right-0'
    },
    {
        name: "penguin",
        animation: penguin,
        topOffset: "-180px",
        width: 230,
        speed: 0.8,
        classes: 'right-0'
    },
    {
        name: "pigeon",
        animation: pigeon,
        topOffset: "-110px",
        width: 130,
        speed: 0.8,
        classes: 'right-0'
    },
    {
        name: "owl",
        animation: owl,
        topOffset: "-107px",
        width: 145,
        speed: 0.8,
        classes: 'right-0'
    },
    {
        name: "fox",
        animation: fox,
        topOffset: "-126px",
        width: 150,
        speed: 0.8,
        classes: 'right-0'
    },
    {
        name: "monkey",
        animation: monkey,
        topOffset: "44px",
        width: 150,
        speed: 0.8,
        classes: 'right-0'
    },
    {
        name: "fish",
        animation: fish,
        topOffset: "-100px",
        width: 170,
        speed: 0.8,
        classes: 'right-0'
    },
    {
        name: "fishes",
        animation: fishes,
        topOffset: "-157px",
        width: 170,
        speed: 0.8,
        classes: 'right-0'
    },
    {
        name: "mouse",
        animation: mouse,
        topOffset: "-165px",
        width: 170,
        speed: 0.8,
        classes: 'left-0'
    },
];

const getRandomMascot = () => mascots[Math.floor(Math.random() * mascots.length)];

const AnimatedMascot = () => {
    const mascot = useRef(getRandomMascot());
    const lottieRef = useRef();

    useEffect(() => {
        if (lottieRef.current) {
            lottieRef.current.setSpeed(mascot.current.speed || 1);
        }
    }, []);

    return (
        <div
            className={`absolute z-20 pointer-events-none ${mascot.current.classes}`}
            style={{
                top: mascot.current.topOffset,
                width: mascot.current.width,
            }}
        >
            <Lottie
                lottieRef={lottieRef}
                animationData={mascot.current.animation}
                loop
                autoplay
            />
        </div>
    );
};

export default AnimatedMascot;
