import React, { useEffect, useRef } from "react";
import Lottie from "lottie-react";
import panda from "@assets/jsons/panda.json";
import catEyes from "@assets/jsons/cat-eyes.json";
import frog from "@assets/jsons/frog.json";
import parrot from "@assets/jsons/parrot.json";
import penguin from "@assets/jsons/penguin.json";
import pigeon from "@assets/jsons/pigeon.json";
import owl from "@assets/jsons/owl.json";

const mascots = [
    {
        name: "panda",
        animation: panda,
        topOffset: "-137px",
        width: 150,
        speed: 0.2,
    },
    {
        name: "cat",
        animation: catEyes,
        topOffset: "-257px",
        width: 150,
        speed: 0.5,
    },
    {
        name: "parrot",
        animation: parrot,
        topOffset: "-115px",
        width: 200,
        speed: 0.8,
    },
    {
        name: "penguin",
        animation: penguin,
        topOffset: "-180px",
        width: 230,
        speed: 0.8,
    },
    {
        name: "pigeon",
        animation: pigeon,
        topOffset: "-110px",
        width: 130,
        speed: 0.8,
    },
    {
        name: "owl",
        animation: owl,
        topOffset: "-107px",
        width: 145,
        speed: 0.8,
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
            className="absolute right-0 z-20 pointer-events-none"
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
