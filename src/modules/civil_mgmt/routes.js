import SiteDatatable from "@modules/civil_mgmt/site/views/SiteDatatable.jsx";
import CreateSite from "@modules/civil_mgmt/site/views/CreateSite.jsx";
import EditSite from "@modules/civil_mgmt/site/views/EditSite.jsx";
import ItemSetupDatatable from "@modules/civil_mgmt/setup/ItemSetupDatatable.jsx";
import CivilProjectDatatable from "@modules/civil_mgmt/project/views/CivilProjectDatatable.jsx";
import CreateCivilProject from "@modules/civil_mgmt/project/views/CreateCivilProject.jsx";
import EditCivilProject from "@modules/civil_mgmt/project/views/EditCivilProject.jsx";
import CivilProjectDrawingDatatable from "@modules/civil_mgmt/project/views/CivilProjectDrawingDatatable.jsx";
import CivilProjectDrawingDetail from "@modules/civil_mgmt/project/views/CivilProjectDrawingDetail.jsx";
import CivilBoqDatatable from "@modules/civil_mgmt/boq/views/CivilBoqDatatable.jsx";
import CreateCivilBoq from "@modules/civil_mgmt/boq/views/CreateCivilBoq.jsx";

const SITE_PERMISSION = 'civil_mgmt.site_management'
const ITEM_PERMISSION = 'civil_mgmt.item_management'
const BOQ_PERMISSION = 'civil_mgmt.boq_management'

export const CIVIL_ROUTES = {
    SITE:{
        READ: {
            path: '/module/civil/site',
            permission:SITE_PERMISSION
        },
        CREATE:{
            path:'/module/civil/site/create',
            permission:SITE_PERMISSION
        },
        EDIT:{
            path:'/module/civil/site/edit/:id',
            permission:SITE_PERMISSION
        }
    },
    PROJECT:{
        READ: {
            path: '/module/civil/project',
            permission:'civil_mgmt.view_civilproject'
        },
        CREATE:{
            path:'/module/civil/project/create',
            permission:'civil_mgmt.add_civilproject'
        },
        EDIT:{
            path:'/module/civil/project/edit/:id',
            permission:'civil_mgmt.change_civilproject'
        },
        DRAWING:{
            READ: {
                path: '/module/civil/project/drawing',
                permission:'civil_mgmt.view_civilprojectdrawing'
            },
            DETAIL: {
                path: '/module/civil/project/drawing/detail/:id',
            },
        }
    },
    BOQ:{
        READ: {
            path: '/module/civil/boq',
            permission:ITEM_PERMISSION
        },
        CREATE:{
            path:'/module/civil/boq/create',
            permission:ITEM_PERMISSION
        },
        EDIT:{
            path:'/module/civil/boq/edit/:id',
            permission:ITEM_PERMISSION
        },
    },
    SETUP: {
        ITEM: {
            path: '/module/civil/setups/item',
            permission:ITEM_PERMISSION
        }
    },
};

export const MODULE_ROUTES = [
    {
        path: CIVIL_ROUTES.SITE.READ.path,
        component: SiteDatatable,
        permission: SITE_PERMISSION,
    },
    {
        path: CIVIL_ROUTES.SITE.CREATE.path,
        component: CreateSite,
        permission: SITE_PERMISSION,
    },
    {
        path: CIVIL_ROUTES.SITE.EDIT.path,
        component: EditSite,
        permission: SITE_PERMISSION,
    },
    {
        path: CIVIL_ROUTES.PROJECT.READ.path,
        component: CivilProjectDatatable,
        permission: CIVIL_ROUTES.PROJECT.READ.permission,
    },
    {
        path: CIVIL_ROUTES.PROJECT.CREATE.path,
        component: CreateCivilProject,
        permission: CIVIL_ROUTES.PROJECT.CREATE.permission,
    },
    {
        path: CIVIL_ROUTES.PROJECT.EDIT.path,
        component: EditCivilProject,
        permission: CIVIL_ROUTES.PROJECT.EDIT.permission,
    },
    {
        path: CIVIL_ROUTES.SETUP.ITEM.path,
        component: ItemSetupDatatable,
        permission: ITEM_PERMISSION,
    },
    {
        path: CIVIL_ROUTES.PROJECT.DRAWING.READ.path,
        component: CivilProjectDrawingDatatable,
        permission: CIVIL_ROUTES.PROJECT.DRAWING.READ.permission,
    },
    {
        path: CIVIL_ROUTES.PROJECT.DRAWING.DETAIL.path,
        component: CivilProjectDrawingDetail,
    },
    {
        path: CIVIL_ROUTES.BOQ.READ.path,
        component: CivilBoqDatatable,
    },
    {
        path: CIVIL_ROUTES.BOQ.CREATE.path,
        component: CreateCivilBoq,
    },
];
