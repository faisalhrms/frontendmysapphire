import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {setTheme} from "@redux/common/themeSlice.js";

const SidebarToggle = () => {
    const dispatch = useDispatch();
    const theme = useSelector((state) => state.theme);

    const toggleSidebar = () => {
        if (window.innerWidth >= 992) {
            switch (theme.dataVerticalStyle) {
                case "closed":
                    dispatch(setTheme({"dataNavStyle": ""}));
                    dispatch(setTheme({
                        "toggled": theme.toggled === "close-menu-close" ? "" : "close-menu-close"
                    }));
                    break;
                case "overlay":
                    dispatch(setTheme({"dataNavStyle": ""}));
                    dispatch(setTheme({
                        "toggled": theme.toggled === "icon-overlay-close" ? "" : "icon-overlay-close"
                    }));
                    break;
                case "icontext":
                    dispatch(setTheme({"dataNavStyle": ""}));
                    dispatch(setTheme({
                        "toggled": theme.toggled === "icon-text-close" ? "" : "icon-text-close"
                    }));
                    break;
                case "doublemenu":
                    dispatch(setTheme({"dataNavStyle": ""}));
                    if (theme.toggled === "double-menu-open") {
                        dispatch(setTheme({"toggled": "double-menu-close"}));
                    } else {
                        let sidemenu = document.querySelector(".side-menu__item.active");
                        if (sidemenu) {
                            dispatch(setTheme({"toggled": "double-menu-open"}));
                            if (sidemenu.nextElementSibling) {
                                sidemenu.nextElementSibling.classList.add("double-menu-active");
                            } else {
                                dispatch(setTheme({"toggled": "double-menu-close"}));
                            }
                        }
                    }
                    break;
                case "detached":
                    dispatch(setTheme({
                        "toggled": theme.toggled === "detached-close" ? "" : "detached-close"
                    }));
                    break;
                default:
                    dispatch(setTheme({"toggled": ""}));
            }

            switch (theme.dataNavStyle) {
                case "menu-click":
                    dispatch(setTheme({
                        "toggled": theme.toggled === "menu-click-closed" ? "" : "menu-click-closed"
                    }));
                    break;
                case "menu-hover":
                    dispatch(setTheme({
                        "toggled": theme.toggled === "menu-hover-closed" ? "" : "menu-hover-closed"
                    }));
                    break;
                case "icon-click":
                    dispatch(setTheme({
                        "toggled": theme.toggled === "icon-click-closed" ? "" : "icon-click-closed"
                    }));
                    break;
                case "icon-hover":
                    dispatch(setTheme({
                        "toggled": theme.toggled === "icon-hover-closed" ? "" : "icon-hover-closed"
                    }));
                    break;
                default:
                    break;
            }
        } else {
            dispatch(setTheme({"toggled": theme.toggled === "close" ? "open" : "close"}));

            setTimeout(() => {
                if (theme.toggled === "open") {
                    const overlay = document.querySelector("#responsive-overlay");

                    if (overlay) {
                        overlay.classList.add("active");
                        overlay.addEventListener("click", () => {
                            overlay.classList.remove("active");
                        });
                    }
                }

                window.addEventListener("resize", () => {
                    if (window.screen.width >= 992) {
                        const overlay = document.querySelector("#responsive-overlay");

                        if (overlay) {
                            overlay.classList.remove("active");
                        }
                    }
                });
            }, 100);
        }
    };

    return (
        <>
            <div className="header-element md:px-[0.325rem] !items-center" onClick={() => toggleSidebar()}>
                <Link aria-label="Hide Sidebar" className="sidemenu-toggle animated-arrow  hor-toggle horizontal-navtoggle inline-flex items-center" to="#"><span></span></Link>
            </div>
        </>
    );
};

export default SidebarToggle;
