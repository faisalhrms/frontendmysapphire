import {useState} from "react";

const useFullScreen = () => {
    const [isFullscreen, setIsFullscreen] = useState(false);

    const handleFullscreenClick = (e) => {
        e.stopPropagation();
        setIsFullscreen(!isFullscreen);
    };

    return {
        isFullscreen,
        handleFullscreenClick
    }

}

export default useFullScreen