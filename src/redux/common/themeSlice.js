import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    lang: "en",
    dir: "ltr",
    class: "light",
    dataMenuStyles: "light",
    dataNavLayout: "vertical",
    dataHeaderStyles: "light",
    dataVerticalStyle: "overlay",
    toggled: "",
    dataNavStyle: "",
    horStyle: "",
    dataPageStyle: "regular",
    dataWidth: "fullwidth",
    dataMenuPosition: "fixed",
    dataHeaderPosition: "fixed",
    loader: "enable",
    iconOverlay: "",
    colorPrimary: "26 26 26",
    colorPrimaryRgb: "26, 26, 26",
    bodyBg: "",
    Light: "",
    darkBg: "",
    inputBorder: "",
    bgImg: "",
    iconText: "",
    body: {
        class: ""
    }
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setTheme: (state, action) => {
            return { ...state, ...action.payload };
        },
    },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
