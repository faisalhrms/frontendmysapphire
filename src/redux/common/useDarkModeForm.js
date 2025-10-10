// // hooks/useDarkMode.js
// import { useEffect } from "react";
// import { useSelector } from "react-redux";
//
// const useDarkModeForm = () => {
//     const theme = useSelector((state) => state.theme.class);
//     const isDark = theme === "dark";
//
//     useEffect(() => {
//         const root = document.documentElement;
//         if (isDark) {
//             root.classList.add("dark");
//         } else {
//             root.classList.remove("dark");
//         }
//     }, [isDark]);
//
//     return isDark;
// };
//
// export default useDarkModeForm();
// hooks/useDarkModeForm.js
import { useEffect } from "react";
import { useSelector } from "react-redux";

const useDarkModeForm = () => {
    const theme = useSelector((state) => state.theme.class);
    const isDark = theme === "dark";

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

export default useDarkModeForm;
