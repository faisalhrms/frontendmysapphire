import React, { useRef, useEffect } from 'react';
import Lottie from 'lottie-react';
import elephantAnimation from '@assets/jsons/elephant.json';

const LottieLoader = ({
                          width = 200,
                          height = 200,
                          loop = true,
                          autoplay = true,
                          animationData = elephantAnimation,
                          className = "",
                          opacity = 0.8,
                          loadingText = "",
                          speed = 1,
                          style = {}
                      }) => {
    const lottieRef = useRef();

    useEffect(() => {
        if (lottieRef.current) {
            lottieRef.current.setSpeed(speed);
        }
    }, [speed]);

    const containerStyle = {
        width,
        height,
        opacity,
        ...style
    };

    return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
            <Lottie
                lottieRef={lottieRef}
                animationData={animationData}
                loop={loop}
                autoplay={autoplay}
                style={containerStyle}
            />
            {loadingText && (
                <p className="mt-4 text-gray-600 text-sm font-medium">
                    {loadingText}
                </p>
            )}
        </div>
    );
};

export default LottieLoader;