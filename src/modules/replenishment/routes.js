import Replenishment from '@modules/replenishment/views/Replenishment.jsx';
import ReplenishmentThank from '@modules/replenishment/views/ReplenishmentThank.jsx';

export const REPLENISHMENT_ROUTES = {
    READ: {
        path: '/module/replenishment',
        permission: 'scm.scm_replenishment_report'
    },
    THANK: {
        path: '/module/replenishment/thank-you',
    },
};

export const MODULE_ROUTES = [
    {
        path: REPLENISHMENT_ROUTES.READ.path,
        component: Replenishment,
    },
    {
        path: REPLENISHMENT_ROUTES.THANK.path,
        component: ReplenishmentThank,
    },
];
