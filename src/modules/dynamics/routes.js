// ✅ views
import SweepersGuardsList from "@modules/dynamics/sweeper-and-gards/views/SweepersGuardsList.jsx";
import SweepersGardsAdd from "@modules/dynamics/sweeper-and-gards/views/SweepersGuardsAdd.jsx";
import SweepersGuardsEdit from "@modules/dynamics/sweeper-and-gards/views/SweepersGuardsEdit.jsx";


export const DYNAMICS_ROUTES = {
   
    READ: {
        path: "/module/dynamics/forms/sweepers-and-guards",
         permission: "dynamics.view_sweepers_and_guards",
    },
    ADD: {
        path: "/module/dynamics/forms/sweepers-and-guards/add",
         permission: "dynamics.add_sweepers_and_guards",
    },
    DETAIL: {
        path: "/module/dynamics/forms/sweepers-and-guards/detail/:id",
        // permission: "dynamics.view_sweepersguards",
    },
    EDIT: {
        path: "/module/dynamics/forms/sweepers-and-guards/edit/:id",
         permission: "dynamics.change_sweepers_and_guards",
    },
};

export const MODULE_ROUTES = [

    {
        path: DYNAMICS_ROUTES.READ.path,
        component: SweepersGuardsList,
         permission: DYNAMICS_ROUTES.READ.permission,
    },
    {
        path: DYNAMICS_ROUTES.ADD.path,
        component: SweepersGardsAdd,
         permission: DYNAMICS_ROUTES.ADD.permission,
    },
    {
        path: DYNAMICS_ROUTES.DETAIL.path,
        component: SweepersGuardsList,
         permission: DYNAMICS_ROUTES.DETAIL.permission,
    },
    {
        path: DYNAMICS_ROUTES.EDIT.path,
        component: SweepersGuardsEdit,
         permission: DYNAMICS_ROUTES.EDIT.permission,
    },
];
