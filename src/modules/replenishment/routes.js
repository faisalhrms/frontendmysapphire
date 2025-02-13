export const REPLENISHMENT_ROUTES = {
    READ: {
        path: '/module/replenishment',
        permission: 'scm_replenishment_report'
    },
    THANK:{
        path: '/module/replenishment/thank-you',
    },
};

export const MODULE_ROUTES = [
    {
        path: REPLENISHMENT_ROUTES.READ.path,
        component: () => import(`@modules/replenishment/views/Replenishment.jsx`),
    },
    {
        path: REPLENISHMENT_ROUTES.THANK.path,
        component: () => import('@modules/replenishment/views/ReplenishmentThank.jsx')
    },


]