import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {setTheme} from "../../../../../redux/common/themeSlice.js";

const ThemeModeToggle = () => {
    const dispatch = useDispatch();
    const theme = useSelector((state) => state.theme);

    const toggleDarkMode = () => {
        const newClass = theme.class === 'dark' ? 'light' : 'dark';
        dispatch(setTheme({
            "class": newClass,
            "dataHeaderStyles": newClass,
            "dataMenuStyles": theme.dataNavLayout === 'horizontal' ? newClass === 'dark' ? 'light' : 'dark' : newClass === 'dark' ? 'dark' : 'light',
        }));

        if (newClass !== 'dark') {
            dispatch(setTheme({
                "bodyBg": '', "Light": '', "darkBg": '', "inputBorder": ''
            }));
            localStorage.setItem("ynexlighttheme", "light");
            localStorage.removeItem("ynexdarktheme");
            localStorage.removeItem("ynexMenu");
            localStorage.removeItem("ynexHeader");
        } else {
            localStorage.setItem("ynexdarktheme", "dark");
            localStorage.removeItem("ynexlighttheme");
            localStorage.removeItem("ynexMenu");
            localStorage.removeItem("ynexHeader");
        }
    };

    return (
        <div className="header-element header-theme-mode hidden !items-center sm:block !py-[1rem]" onClick={toggleDarkMode}>
            <Link aria-label="anchor"
                  className="hs-dark-mode-active:hidden flex hs-dark-mode group flex-shrink-0 justify-center items-center gap-2  rounded-full font-medium transition-all text-xs dark:bg-bgdark dark:hover:bg-black/20 dark:text-[#8c9097] dark:text-white/50 dark:hover:text-white dark:focus:ring-white/10 dark:focus:ring-offset-white/10"
                  to="#" data-hs-theme-click-value="dar
                  k">
                <i className="bx bx-moon header-link-icon"></i>
            </Link>
            <Link aria-label="anchor"
                  className="hs-dark-mode-active:flex hidden hs-dark-mode group flex-shrink-0 justify-center items-center gap-2 rounded-full font-medium text-defaulttextcolor  transition-all text-xs dark:bg-bodybg dark:bg-bgdark dark:hover:bg-black/20 dark:text-[#8c9097] dark:text-white/50 dark:hover:text-white dark:focus:ring-white/10 dark:focus:ring-offset-white/10"
                  to="#" data-hs-theme-click-value="light">
                <i className="bx bx-sun header-link-icon"></i>
            </Link>
        </div>
    );
};

export default ThemeModeToggle;
