import { useState } from 'react';
import { setTheme } from "@redux/common/themeSlice.js";

export function Dark(dispatch) {
    dispatch(setTheme({
        "class": "dark",
        "dataHeaderStyles": "dark",
        "dataMenuStyles": "dark",
        "bodyBg": "",
        "darkBg": "",
        "inputBorder": "",
        "Light": "",
    }));

    localStorage.setItem("ynexdarktheme", "dark");
    localStorage.removeItem("ynexlighttheme");
    localStorage.removeItem('darkBgRGB');
}

export function Light(dispatch) {
    dispatch(setTheme({
        "class": "light",
        "dataHeaderStyles": "light",
        "darkBg": "",
        "bodyBg": "",
        "inputBorder": "",
        "Light": "",
        "dataMenuStyles": "light",
    }));

    localStorage.setItem("ynexlighttheme", "light");
    localStorage.removeItem("ynexdarktheme");
    localStorage.removeItem('Light');
    localStorage.removeItem('bodyBgRGB');
    localStorage.removeItem('darkBgRGB');
}

export function Ltr(dispatch) {
    dispatch(setTheme({
        "dir": "ltr",
    }));
    localStorage.setItem("ynexltr", "ltr");
    localStorage.removeItem("ynexrtl");
}

export function Rtl(dispatch) {
    dispatch(setTheme({
        "dir": "rtl",
    }));
    localStorage.setItem("ynexrtl", "rtl");
    localStorage.removeItem("ynexltr");
}

function closeMenuFn() {
    const closeMenuRecursively = (items) => {
        items?.forEach((item) => {
            item.active = false;
            closeMenuRecursively(item.children);
        });
    };
    closeMenuRecursively([]);
}

export const HorizontalClick = (dispatch) => {
    dispatch(setTheme({
        "dataNavLayout": "horizontal",
        "dataVerticalStyle": "",
        "dataNavStyle": localStorage.ynexnavstyles ? localStorage.ynexnavstyles : "menu-click"
    }));
    localStorage.setItem("ynexlayout", "horizontal");
    localStorage.removeItem("ynexverticalstyles");
    closeMenuFn();
    const Sidebar = document.querySelector(".main-menu");
    if (Sidebar) {
        Sidebar.style.marginInline = "0px";
    }
};

export const Vertical = (dispatch) => {
    dispatch(setTheme({
        "dataNavLayout": "vertical",
        "dataVerticalStyle": "overlay",
        "toggled": "",
        "dataNavStyle": ''
    }));
    localStorage.setItem("ynexlayout", "vertical");
    localStorage.removeItem("ynexnavstyles");
};

export const Menuclick = (dispatch) => {
    dispatch(setTheme({
        "dataNavStyle": "menu-click",
        "dataVerticalStyle": "",
        "toggled": "menu-click-closed",
    }));
    localStorage.setItem("ynexnavstyles", "menu-click");
    localStorage.removeItem("ynexverticalstyles");
    const Sidebar = document.querySelector(".main-menu");
    if (Sidebar) {
        Sidebar.style.marginInline = "0px";
    }
};

export const MenuHover = (dispatch) => {
    dispatch(setTheme({
        "dataNavStyle": "menu-hover",
        "dataVerticalStyle": "",
        "toggled": "menu-hover-closed",
        "horStyle": ""
    }));
    localStorage.setItem("ynexnavstyles", "menu-hover");
    localStorage.removeItem("ynexverticalstyles");
    const Sidebar = document.querySelector(".main-menu");
    if (Sidebar) {
        Sidebar.style.marginInline = "0px";
    }
};

export const IconClick = (dispatch) => {
    dispatch(setTheme({
        "dataNavStyle": "icon-click",
        "dataVerticalStyle": "",
        "toggled": "icon-click-closed",
    }));
    localStorage.setItem("ynexnavstyles", "icon-click");
    localStorage.removeItem("ynexverticalstyles");
    const Sidebar = document.querySelector(".main-menu");
    if (Sidebar) {
        Sidebar.style.marginInline = "0px";
    }
};

export const IconHover = (dispatch) => {
    dispatch(setTheme({
        "dataNavStyle": "icon-hover",
        "dataVerticalStyle": "",
        "toggled": "icon-hover-closed"
    }));
    localStorage.setItem("ynexnavstyles", "icon-hover");
    localStorage.removeItem("ynexverticalstyles");
    const Sidebar = document.querySelector(".main-menu");
    if (Sidebar) {
        Sidebar.style.marginInline = "0px";
    }
};

export const Fullwidth = (dispatch) => {
    dispatch(setTheme({
        "dataWidth": "fullwidth",
    }));
    localStorage.setItem("ynexfullwidth", "Fullwidth");
    localStorage.removeItem("ynexboxed");
};

export const Boxed = (dispatch) => {
    dispatch(setTheme({
        "dataWidth": "boxed",
    }));
    localStorage.setItem("ynexboxed", "Boxed");
    localStorage.removeItem("ynexfullwidth");
};

export const FixedMenu = (dispatch) => {
    dispatch(setTheme({
        "dataMenuPosition": "fixed",
    }));
    localStorage.setItem("ynexmenufixed", "MenuFixed");
    localStorage.removeItem("ynexmenuscrollable");
};

export const scrollMenu = (dispatch) => {
    dispatch(setTheme({
        "dataMenuPosition": "scrollable",
    }));
    localStorage.setItem("ynexmenuscrollable", "Menuscrolled");
    localStorage.removeItem("ynexmenufixed");
};

export const Headerpostionfixed = (dispatch) => {
    dispatch(setTheme({
        "dataHeaderPosition": "fixed",
    }));
    localStorage.setItem("ynexheaderfixed", 'FixedHeader');
    localStorage.removeItem("ynexheaderscrollable");
};

export const Headerpostionscroll = (dispatch) => {
    dispatch(setTheme({
        "dataHeaderPosition": "scrollable",
    }));
    localStorage.setItem("ynexheaderscrollable", "ScrollableHeader");
    localStorage.removeItem("ynexheaderfixed");
};

export const Regular = (dispatch) => {
    dispatch(setTheme({
        "dataPageStyle": "regular"
    }));
    localStorage.setItem("ynexregular", "Regular");
    localStorage.removeItem("ynexclassic");
    localStorage.removeItem("ynexmodern");
};

export const Classic = (dispatch) => {
    dispatch(setTheme({
        "dataPageStyle": "classic",
    }));
    localStorage.setItem("ynexclassic", "Classic");
    localStorage.removeItem("ynexregular");
    localStorage.removeItem("ynexmodern");
};

export const Modern = (dispatch) => {
    dispatch(setTheme({
        "dataPageStyle": "modern",
    }));
    localStorage.setItem("ynexmodern", "Modern");
    localStorage.removeItem("ynexregular");
    localStorage.removeItem("ynexclassic");
};

export const Defaultmenu = (dispatch) => {
    dispatch(setTheme({
        "dataVerticalStyle": "overlay",
        "dataNavLayout": "vertical",
        'toggled': '',
        "dataNavStyle": "",
    }));
    localStorage.removeItem("ynexnavstyles");
    localStorage.setItem("ynexverticalstyles", "default");
    var icon = document.getElementById("switcher-default-menu");
    if (icon) {
        icon.checked = true;
    }
};

export const Closedmenu = (dispatch) => {
    dispatch(setTheme({
        "dataNavLayout": "vertical",
        "dataVerticalStyle": "closed",
        "toggled": "close-menu-close",
        "dataNavStyle": "",
    }));
    localStorage.setItem("ynexverticalstyles", "closed");
    localStorage.removeItem("ynexnavstyles");
};

function icontextOpenFn() {
    let html = document.documentElement;
    if (html.getAttribute('data-toggled') === 'icon-text-close') {
        html.setAttribute('icon-text', 'open');
    }
}

function icontextCloseFn() {
    let html = document.documentElement;
    if (html.getAttribute('data-toggled') === 'icon-text-close') {
        html.removeAttribute('icon-text');
    }
}

export const iconTextfn = (dispatch) => {
    dispatch(setTheme({
        "dataNavLayout": "vertical",
        "dataVerticalStyle": "icontext",
        "toggled": "icon-text-close",
        "dataNavStyle": "",
    }));
    localStorage.setItem("ynexverticalstyles", "icontext");
    localStorage.removeItem("ynexnavstyles");

    const MainContent = document.querySelector(".main-content");
    const appSidebar = document.querySelector('.app-sidebar');

    appSidebar?.addEventListener("click", () => {
        icontextOpenFn();
    });
    MainContent?.addEventListener("click", () => {
        icontextCloseFn();
    });
};

export const iconOverayFn = (dispatch) => {
    dispatch(setTheme({
        "dataNavLayout": "vertical",
        "dataVerticalStyle": "overlay",
        "toggled": "icon-overlay-close",
        "dataNavStyle": "",
    }));
    localStorage.setItem("ynexverticalstyles", "overlay");
    localStorage.removeItem("ynexnavstyles");
    const icon = document.getElementById("switcher-icon-overlay");
    if (icon) {
        icon.checked = true;
    }
    const MainContent = document.querySelector(".main-content");
    const appSidebar = document.querySelector('.app-sidebar');
    appSidebar?.addEventListener("click", () => {
        DetachedOpenFn();
    });
    MainContent?.addEventListener("click", () => {
        DetachedCloseFn();
    });
};

function DetachedOpenFn() {
    if (window.innerWidth > 992) {
        let html = document.documentElement;
        if (html.getAttribute('data-toggled') === 'detached-close' || html.getAttribute('data-toggled') === 'icon-overlay-close') {
            html.setAttribute('icon-overlay', 'open');
        }
    }
}

function DetachedCloseFn() {
    if (window.innerWidth > 992) {
        let html = document.documentElement;
        if (html.getAttribute('data-toggled') === 'detached-close' || html.getAttribute('data-toggled') === 'icon-overlay-close') {
            html.removeAttribute('icon-overlay');
        }
    }
}

export const DetachedFn = (dispatch) => {
    dispatch(setTheme({
        "dataNavLayout": "vertical",
        "dataVerticalStyle": "detached",
        "toggled": "detached-close",
        "dataNavStyle": "",
    }));
    localStorage.setItem("ynexverticalstyles", "detached");
    localStorage.removeItem("ynexnavstyles");

    const MainContent = document.querySelector(".main-content");
    const appSidebar = document.querySelector('.app-sidebar');

    appSidebar?.addEventListener("click", () => {
        DetachedOpenFn();
    });
    MainContent?.addEventListener("click", () => {
        DetachedCloseFn();
    });
};

export const DoubletFn = (dispatch) => {
    dispatch(setTheme({
        "dataNavLayout": "vertical",
        "dataVerticalStyle": "doublemenu",
        "toggled": "double-menu-open",
        "dataNavStyle": "",
    }));
    localStorage.setItem("ynexverticalstyles", "doublemenu");
    localStorage.removeItem("ynexnavstyles");
};

export const bgImage1 = (dispatch) => {
    dispatch(setTheme({
        "bgImg": "bgimg1"
    }));
    localStorage.setItem("bgimage1", "bgimg1");
    localStorage.removeItem("bgimage2");
    localStorage.removeItem("bgimage3");
    localStorage.removeItem("bgimage4");
    localStorage.removeItem("bgimage5");
};

export const bgImage2 = (dispatch) => {
    dispatch(setTheme({
        "bgImg": "bgimg2"
    }));
    localStorage.setItem("bgimage2", "bgimg2");
    localStorage.removeItem("bgimage1");
    localStorage.removeItem("bgimage3");
    localStorage.removeItem("bgimage4");
    localStorage.removeItem("bgimage5");
};

export const bgImage3 = (dispatch) => {
    dispatch(setTheme({
        "bgImg": "bgimg3"
    }));
    localStorage.setItem("bgimage3", "bgimg3");
    localStorage.removeItem("bgimage1");
    localStorage.removeItem("bgimage2");
    localStorage.removeItem("bgimage4");
    localStorage.removeItem("bgimage5");
};

export const bgImage4 = (dispatch) => {
    dispatch(setTheme({
        "bgImg": "bgimg4"
    }));
    localStorage.setItem("bgimage4", "bgimg4");
    localStorage.removeItem("bgimage1");
    localStorage.removeItem("bgimage2");
    localStorage.removeItem("bgimage3");
    localStorage.removeItem("bgimage5");
};

export const bgImage5 = (dispatch) => {
    dispatch(setTheme({
        "bgImg": "bgimg5"
    }));
    localStorage.setItem("bgimage5", "bgimg5");
    localStorage.removeItem("bgimage1");
    localStorage.removeItem("bgimage2");
    localStorage.removeItem("bgimage3");
    localStorage.removeItem("bgimage4");
};

export const colorMenu = (dispatch) => {
    dispatch(setTheme({
        "dataMenuStyles": "color",
    }));
    localStorage.setItem("ynexMenu", "color");
    localStorage.removeItem("gradient");
};

export const lightMenu = (dispatch) => {
    dispatch(setTheme({
        "dataMenuStyles": "light",
    }));
    localStorage.setItem("ynexMenu", "light");
    localStorage.removeItem("gradient");
};

export const darkMenu = (dispatch) => {
    dispatch(setTheme({
        "dataMenuStyles": "dark",
    }));
    localStorage.setItem("ynexMenu", "dark");
    localStorage.removeItem("light");
};

export const gradientMenu = (dispatch) => {
    dispatch(setTheme({
        "dataMenuStyles": "gradient",
    }));
    localStorage.setItem("ynexMenu", "gradient");
    localStorage.removeItem("color");
};

export const transparentMenu = (dispatch) => {
    dispatch(setTheme({
        "dataMenuStyles": "transparent",
    }));
    localStorage.setItem("ynexMenu", "transparent");
    localStorage.removeItem("gradient");
};

export const lightHeader = (dispatch) => {
    dispatch(setTheme({
        "dataHeaderStyles": "light",
    }));
    localStorage.setItem("ynexHeader", "light");
    localStorage.removeItem("dark");
};

export const darkHeader = (dispatch) => {
    dispatch(setTheme({
        "dataHeaderStyles": "dark",
    }));
    localStorage.setItem("ynexHeader", "dark");
    localStorage.removeItem("light");
};

export const colorHeader = (dispatch) => {
    dispatch(setTheme({
        "dataHeaderStyles": "color",
    }));
    localStorage.setItem("ynexHeader", "color");
    localStorage.removeItem("dark");
};

export const gradientHeader = (dispatch) => {
    dispatch(setTheme({
        "dataHeaderStyles": "gradient",
    }));
    localStorage.setItem("ynexHeader", "gradient");
    localStorage.removeItem("transparent");
};

export const transparentHeader = (dispatch) => {
    dispatch(setTheme({
        "dataHeaderStyles": "transparent",
    }));
    localStorage.removeItem("gradient");
    localStorage.setItem("ynexHeader", "transparent");
};

export const primaryColor1 = (dispatch) => {
    dispatch(setTheme({
        "colorPrimaryRgb": "58, 88, 146",
        "colorPrimary": "58 88 146"
    }));
    localStorage.setItem("primaryRGB", "58, 88, 146");
    localStorage.setItem("primaryRGB1", "58 88 146");
};

export const primaryColor2 = (dispatch) => {
    dispatch(setTheme({
        "colorPrimaryRgb": "92, 144, 163",
        "colorPrimary": "92 144 163"
    }));
    localStorage.setItem("primaryRGB", "92, 144, 163");
    localStorage.setItem("primaryRGB1", "92 144 163");
};

export const primaryColor3 = (dispatch) => {
    dispatch(setTheme({
        "colorPrimaryRgb": "161, 90, 223",
        "colorPrimary": "161 90 223"
    }));
    localStorage.setItem("primaryRGB", "161, 90, 223");
    localStorage.setItem("primaryRGB1", "161 90 223");
};

export const primaryColor4 = (dispatch) => {
    dispatch(setTheme({
        "colorPrimaryRgb": "78, 172, 76",
        "colorPrimary": "78 172 76"
    }));
    localStorage.setItem("primaryRGB", "78, 172, 76");
    localStorage.setItem("primaryRGB1", "78 172 76");
};

export const primaryColor5 = (dispatch) => {
    dispatch(setTheme({
        "colorPrimaryRgb": "223, 90, 90",
        "colorPrimary": "223 90 90"
    }));
    localStorage.setItem("primaryRGB", "223, 90, 90");
    localStorage.setItem("primaryRGB1", "223 90 90");
};

export const backgroundColor1 = (dispatch) => {
    dispatch(setTheme({
        "bodyBg": "34 44 110",
        "darkBg": "20 30 96",
        "inputBorder": "255, 255, 255, 0.1",
        "Light": "25 35 102",
        "class": "dark",
        "dataMenuStyles": "dark",
        "dataHeaderStyles": "dark"
    }));
    localStorage.setItem('darkBgRGB', "20 30 96");
    localStorage.setItem('bodyBgRGB', "34 44 110");
    localStorage.setItem('Light', "25 35 102");
    localStorage.setItem("inputBorder", "255, 255, 255, 0.1");
    localStorage.removeItem("ynexdarktheme");
};

export const backgroundColor2 = (dispatch) => {
    dispatch(setTheme({
        "bodyBg": "22 92 129",
        "Light": "13 83 120",
        "darkBg": "8 78 115",
        "inputBorder": "255, 255, 255, 0.1",
        "class": "dark",
        "dataMenuStyles": "dark",
        "dataHeaderStyles": "dark"
    }));
    localStorage.setItem('darkBgRGB', "8 78 115");
    localStorage.setItem('bodyBgRGB', "22 92 129");
    localStorage.setItem('Light', "13 83 120");
    localStorage.setItem("inputBorder", "255, 255, 255, 0.1");
    localStorage.removeItem("ynexdarktheme");
};

export const backgroundColor3 = (dispatch) => {
    dispatch(setTheme({
        "bodyBg": "104 51 149",
        "Light": "95 42 140",
        "darkBg": "90 37 135",
        "inputBorder": "255, 255, 255, 0.1",
        "class": "dark",
        "dataMenuStyles": "dark",
        "dataHeaderStyles": "dark"
    }));
    localStorage.setItem('darkBgRGB', "90 37 135");
    localStorage.setItem('bodyBgRGB', "104 51 149");
    localStorage.setItem('Light', "95 42 140");
    localStorage.setItem("inputBorder", "255, 255, 255, 0.1");
    localStorage.removeItem("ynexdarktheme");
};

export const backgroundColor4 = (dispatch) => {
    dispatch(setTheme({
        "Light": "29 106 56",
        "bodyBg": "38 115 64",
        "darkBg": "24 101 51",
        "inputBorder": "255, 255, 255, 0.1",
        "class": "dark",
        "dataMenuStyles": "dark",
        "dataHeaderStyles": "dark"
    }));
    localStorage.setItem('darkBgRGB', "24 101 51");
    localStorage.setItem('bodyBgRGB', "38 115 64");
    localStorage.setItem('Light', "29 106 56");
    localStorage.setItem("inputBorder", "255, 255, 255, 0.1");
    localStorage.removeItem("ynexdarktheme");
};

export const backgroundColor5 = (dispatch) => {
    dispatch(setTheme({
        "bodyBg": "134 80 34",
        "Light": "125 71 25",
        "darkBg": "120 66 20",
        "inputBorder": "255, 255, 255, 0.1",
        "class": "dark",
        "dataMenuStyles": "dark",
        "dataHeaderStyles": "dark"
    }));
    localStorage.setItem('darkBgRGB', "120 66 20");
    localStorage.setItem('bodyBgRGB', "134 80 34");
    localStorage.setItem('Light', "125 71 25");
    localStorage.setItem("inputBorder", "255, 255, 255, 0.1");
    localStorage.removeItem("ynexdarktheme");
};

const ColorPicker = (props) => {
    return (
        <div className="color-picker-input">
            <input type="color" {...props} />
        </div>
    );
};

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

const Themeprimarycolor = ({ dispatch }) => {
    const [state, updateState] = useState("#FFFFFF");

    const handleInput = (e) => {
        const rgb = hexToRgb(e.target.value);

        if (rgb !== null) {
            const { r, g, b } = rgb;
            updateState(e.target.value);
            dispatch(setTheme({
                "colorPrimaryRgb": `${r},  ${g},  ${b}`,
                "colorPrimary": `${r} ${g} ${b}`
            }));
            localStorage.setItem("dynamiccolor", `${r}, ${g} ,${b}`);
        }
    };

    return (
        <div className="Themeprimarycolor theme-container-primary pickr-container-primary">
            <ColorPicker onChange={handleInput} value={state} />
        </div>
    );
};

export default Themeprimarycolor;

export const Themebackgroundcolor = ({ dispatch }) => {
    const [state, updateState] = useState("#FFFFFF");
    const handleInput = (e) => {
        const { r, g, b } = hexToRgb(e.target.value);
        updateState(e.target.value);
        dispatch(setTheme({
            "bodyBg": `${r} ${g} ${b}`,
            "Light": `${r - 9} ${g - 9} ${b - 9}`,
            "darkBg": `${r - 14} ${g - 14} ${b - 14}`,
            "inputBorder": `255, 255, 255, 0.1`,
            "class": "dark",
            "dataHeaderStyles": "dark",
            "dataMenuStyles": "dark"
        }));

        localStorage.setItem("darkBgRGB", `${r - 14} ${g - 14} ${b - 14}`);
        localStorage.setItem("Light", `${r - 9} ${g - 9} ${b - 9}`);
        localStorage.setItem("bodyBgRGB", `${r} ${g} ${b}`);
        localStorage.setItem("inputBorder", "255, 255, 255, 0.1");
        localStorage.removeItem("ynexMenu");
        localStorage.removeItem("ynexHeader");
        localStorage.removeItem("ynexdarktheme");
    };
    return (
        <div className="Themebackgroundcolor">
            <ColorPicker onChange={handleInput} value={state} />
        </div>
    );
};

export const Reset = (dispatch) => {
    Vertical(dispatch);
    dispatch(setTheme({
        lang: "en",
        dir: "ltr",
        class: "light",
        dataMenuStyles: "light",
        dataNavLayout: "vertical",
        dataHeaderStyles: "light",
        dataVerticalStyle: "overlay",
        StylebodyBg: "107 64 64",
        StyleDarkBg: "93 50 50",
        toggled: "",
        dataNavStyle: "",
        horStyle: "",
        dataPageStyle: "regular",
        dataWidth: "fullwidth",
        dataMenuPosition: "fixed",
        dataHeaderPosition: "fixed",
        iconOverlay: "",
        colorPrimaryRgb: "26, 26, 26",
        colorPrimary: "26 26 26",
        bodyBg: "",
        Light: "",
        darkBg: "",
        inputBorder: "",
        bgImg: "",
        iconText: "",
        body: {
            class: ""
        }
    }));

    localStorage.removeItem("ynexdarktheme");
    localStorage.removeItem("ynexlighttheme");
    localStorage.removeItem("ynexltr");
    localStorage.removeItem("ynexrtl");
    localStorage.removeItem("ynexlayout");
    localStorage.removeItem("ynexnavstyles");
    localStorage.removeItem("ynexverticalstyles");
    localStorage.removeItem("ynexregular");
    localStorage.removeItem("ynexclassic");
    localStorage.removeItem("ynexmodern");
    localStorage.removeItem("ynexfullwidth");
    localStorage.removeItem("ynexboxed");
    localStorage.removeItem("ynexmenufixed");
    localStorage.removeItem("ynexmenuscrollable");
    localStorage.removeItem("ynexheaderfixed");
    localStorage.removeItem("ynexheaderscrollable");
    localStorage.removeItem("primaryRGB");
    localStorage.removeItem("primaryRGB1");
    localStorage.removeItem("ynexMenu");
    localStorage.removeItem("ynexHeader");
    localStorage.removeItem("bgimage1");
    localStorage.removeItem("bgimage2");
    localStorage.removeItem("bgimage3");
    localStorage.removeItem("bgimage4");
    localStorage.removeItem("bgimage5");


    const icon = document.getElementById("switcher-default-menu");
    if (icon) {
        icon.checked = true;
    }
};

export const LocalStorageBackup = (dispatch) => {

    if (localStorage.ynexltr) {
        Ltr(dispatch);
    } else if (localStorage.ynexrtl) {
        Rtl(dispatch);
    }

    if (localStorage.ynexdarktheme) {
        Dark(dispatch);
    } else if (localStorage.ynexlighttheme) {
        Light(dispatch);
    }

    if (localStorage.ynexregular) {
        Regular(dispatch);
    }
    if (localStorage.ynexclassic) {
        Classic(dispatch);
    }
    if (localStorage.ynexmodern) {
        Modern(dispatch);
    }
    if (localStorage.ynexfullwidth) {
        Fullwidth(dispatch);
    }
    if (localStorage.ynexboxed) {
        Boxed(dispatch);
    }
    if (localStorage.ynexmenufixed) {
        FixedMenu(dispatch);
    }
    if (localStorage.ynexmenuscrollable) {
        scrollMenu(dispatch);
    }
    if (localStorage.ynexheaderfixed) {
        Headerpostionfixed(dispatch);
    }
    if (localStorage.ynexheaderscrollable) {
        Headerpostionscroll(dispatch);
    }

    // Navigation styles
    switch (localStorage.ynexnavstyles) {
        case "menu-click":
            Menuclick(dispatch);
            break;
        case "menu-hover":
            MenuHover(dispatch);
            break;
        case "icon-click":
            IconClick(dispatch);
            break;
        case "icon-hover":
            IconHover(dispatch);
            break;
        default:
            break;
    }

    // Background images
    for (let i = 1; i <= 5; i++) {
        if (localStorage[`bgimage${i}`]) {
            switch (i) {
                case 1:
                    bgImage1(dispatch);
                    break;
                case 2:
                    bgImage2(dispatch);
                    break;
                case 3:
                    bgImage3(dispatch);
                    break;
                case 4:
                    bgImage4(dispatch);
                    break;
                case 5:
                    bgImage5(dispatch);
                    break;
                default:
                    break;
            }
        }
    }

    // Layout type
    if (localStorage.ynexlayout === 'horizontal') {
        HorizontalClick(dispatch);
    } else if (localStorage.ynexlayout === 'vertical') {
        Vertical(dispatch);
    }

    if (
        localStorage.getItem("ynexltr") === null ||
        localStorage.getItem("ynexltr") === "ltr"
    ) {
        if (localStorage.getItem("ynexrtl") === "rtl") {
            document.querySelector("body")?.classList.add("rtl");
            document.querySelector("html[lang=en]")?.setAttribute("dir", "rtl");
        }
    }

    if (localStorage.dynamiccolor) {
        dispatch(setTheme({
            "colorPrimaryRgb": localStorage.dynamiccolor,
            "colorPrimary": localStorage.dynamiccolor.replace(/,/g, ' ')
        }));
    }

    if (localStorage.bodyBgRGB && localStorage.darkBgRGB && localStorage.Light && localStorage.inputBorder) {
        dispatch(setTheme({
            "bodyBg": localStorage.bodyBgRGB,
            "Light": localStorage.Light,
            "darkBg": localStorage.darkBgRGB,
            "inputBorder": localStorage.inputBorder,
            "class": "dark",
            "dataHeaderStyles": "dark",
            "dataMenuStyles": "dark"
        }));
    }

    // Layout styles
    const verticalStyles = localStorage.ynexverticalstyles;
    if (verticalStyles) {
        switch (verticalStyles) {
            case "default":
                Defaultmenu(dispatch);
                break;
            case "closed":
                Closedmenu(dispatch);
                break;
            case "icontext":
                iconTextfn(dispatch);
                break;
            case "overlay":
                iconOverayFn(dispatch);
                break;
            case "detached":
                DetachedFn(dispatch);
                break;
            case "doublemenu":
                DoubletFn(dispatch);
                break;
            default:
                break;
        }
    }

    // Menu Color
    switch (localStorage.ynexMenu) {
        case 'light':
            lightMenu(dispatch);
            break;
        case 'dark':
            darkMenu(dispatch);
            break;
        case 'color':
            colorMenu(dispatch);
            break;
        case 'gradient':
            gradientMenu(dispatch);
            break;
        case 'transparent':
            transparentMenu(dispatch);
            break;
        default:
            break;
    }

    // Header Colors
    switch (localStorage.ynexHeader) {
        case 'light':
            lightHeader(dispatch);
            break;
        case 'dark':
            darkHeader(dispatch);
            break;
        case 'color':
            colorHeader(dispatch);
            break;
        case 'gradient':
            gradientHeader(dispatch);
            break;
        case 'transparent':
            transparentHeader(dispatch);
            break;
        default:
            break;
    }

    const primaryRGB = localStorage.primaryRGB;
    if (!localStorage.dynamiccolor) {
        switch (primaryRGB) {
            case '58, 88, 146':
                primaryColor1(dispatch);
                break;
            case '92, 144, 163':
                primaryColor2(dispatch);
                break;
            case '161, 90, 223':
                primaryColor3(dispatch);
                break;
            case '78, 172, 76':
                primaryColor4(dispatch);
                break;
            case '223, 90, 90':
                primaryColor5(dispatch);
                break;
            default:
                break;
        }
    }

    const darkBgRGB = localStorage.darkBgRGB;
    if (!localStorage.bodyBgRGB || !localStorage.darkBgRGB || !localStorage.Light || !localStorage.inputBorder) {
        switch (darkBgRGB) {
            case '20 30 96':
                backgroundColor1(dispatch);
                break;
            case '8 78 115':
                backgroundColor2(dispatch);
                break;
            case '90 37 135':
                backgroundColor3(dispatch);
                break;
            case '24 101 51':
                backgroundColor4(dispatch);
                break;
            case '120 66 20':
                backgroundColor5(dispatch);
                break;
            default:
                break;
        }
    }
};