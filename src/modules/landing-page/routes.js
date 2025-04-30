import LandingPage from "@modules/landing-page/views/LandingPage.jsx";


export const landing_ROUTES = {
    READ: {
        path: '/module/about',
    },
};

export const MODULE_ROUTES = [
    {
        path: landing_ROUTES.READ.path,
        component: LandingPage,
    },

];
