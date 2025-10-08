import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {setTheme} from "@redux/common/themeSlice.js";


const useDarkMode = () => {
    const dispatch = useDispatch();
    const [isDark, setIsDark] = useState(
        window.matchMedia("(prefers-color-scheme: dark)").matches
    );

    useEffect(() => {
        const mq = window.matchMedia("(prefers-color-scheme: dark)");


        dispatch(setTheme({ class: mq.matches ? "dark" : "light" }));

        const handler = (e) => {
            setIsDark(e.matches);
            dispatch(setTheme({ class: e.matches ? "dark" : "light" }));
        };

        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, [dispatch]);

    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
    }, [isDark]);

    return isDark;
};

export default useDarkMode;
