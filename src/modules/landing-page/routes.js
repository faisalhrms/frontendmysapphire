import LandingPage from "@modules/landing-page/views/LandingPage.jsx";


export const landing_ROUTES = {
    ABOUT_US: {
        path: '/about-us',
    },
};

export const MODULE_ROUTES = [
    {
        path: landing_ROUTES.ABOUT_US.path,
        component: LandingPage,
    },

];
