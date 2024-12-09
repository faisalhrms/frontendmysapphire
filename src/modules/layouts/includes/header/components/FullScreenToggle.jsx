import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';

const FullScreenToggle = () => {
    const [fullScreen, setFullScreen] = useState(false);

    const toggleFullScreen = () => {
        const elem = document.documentElement;

        if (!document.fullscreenElement) {
            elem.requestFullscreen().then(() => setFullScreen(true));
        } else {
            document.exitFullscreen().then(() => setFullScreen(false));
        }
    };

    const handleFullscreenChange = () => {
        setFullScreen(!!document.fullscreenElement);
    };

    useEffect(() => {
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    return (
        <>
            <div className="header-element header-fullscreen py-[1rem] md:px-[0.65rem] px-2">

                <Link to="#" aria-label="anchor" onClick={toggleFullScreen}
                      className="inline-flex flex-shrink-0 justify-center items-center gap-2  !rounded-full font-medium dark:hover:bg-black/20 dark:text-[#8c9097] dark:text-white/50 dark:hover:text-white dark:focus:ring-white/10 dark:focus:ring-offset-white/10">
                    {fullScreen ? (
                        <i className="bx bx-exit-fullscreen full-screen-close header-link-icon"></i>) : (
                        <i className="bx bx-fullscreen full-screen-open header-link-icon"></i>)}
                </Link>
            </div>
        </>
    );
};

export default FullScreenToggle;
