// ✅ views
import SweepersGuardsList from "@modules/dynamics/sweeper-and-gards/views/SweepersGuardsList.jsx";
import SweepersGardsAdd from "@modules/dynamics/sweeper-and-gards/views/SweepersGuardsAdd.jsx";
import SweepersGuardsEdit from "@modules/dynamics/sweeper-and-gards/views/SweepersGuardsEdit.jsx";


export const DYNAMICS_ROUTES = {
    HOME: {
        path: "/module/dynamics/sweepers-and-guards/home",
        // permission: "dynamics.view_sweepersguards",
    },
    READ: {
        path: "/module/dynamics/sweepers-and-guards/",
        // permission: "dynamics.view_sweepersguards",
    },
    ADD: {
        path: "/module/dynamics/sweepers-and-guards/add",
        // permission: "dynamics.add_sweepersguards",
    },
    DETAIL: {
        path: "/module/dynamics/sweepers-and-guards/detail/:id",
        // permission: "dynamics.view_sweepersguards",
    },
    EDIT: {
        path: "/module/dynamics/sweepers-and-guards/edit/:id",
        // permission: "dynamics.change_sweepersguards",
    },
};

export const MODULE_ROUTES = [

    {
        path: DYNAMICS_ROUTES.READ.path,
        component: SweepersGuardsList,
        // permission: DYNAMICS_ROUTES.READ.permission,
    },
    {
        path: DYNAMICS_ROUTES.ADD.path,
        component: SweepersGardsAdd,
        // permission: DYNAMICS_ROUTES.ADD.permission,
    },
    {
        path: DYNAMICS_ROUTES.DETAIL.path,
        component: SweepersGuardsList,
        // permission: DYNAMICS_ROUTES.DETAIL.permission,
    },
    {
        path: DYNAMICS_ROUTES.EDIT.path,
        component: SweepersGuardsEdit,
        // permission: DYNAMICS_ROUTES.EDIT.permission,
    },
];
