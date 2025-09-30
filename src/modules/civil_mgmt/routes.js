import SiteDatatable from "@modules/civil_mgmt/site/views/SiteDatatable.jsx";
import CreateSite from "@modules/civil_mgmt/site/views/CreateSite.jsx";
import EditSite from "@modules/civil_mgmt/site/views/EditSite.jsx";
import ItemSetupDatatable from "@modules/civil_mgmt/setup/ItemSetupDatatable.jsx";
import CivilProjectDrawingDatatable from "@modules/civil_mgmt/project/views/CivilProjectDrawingDatatable.jsx";
import CivilProjectDrawingDetail from "@modules/civil_mgmt/project/views/CivilProjectDrawingDetail.jsx";
import CivilBoqDatatable from "@modules/civil_mgmt/boq/views/CivilBoqDatatable.jsx";
import CreateCivilBoq from "@modules/civil_mgmt/boq/views/CreateCivilBoq.jsx";
import EditCivilBoq from "@modules/civil_mgmt/boq/views/EditCivilBoq.jsx";
import CivilBoqDetail from "@modules/civil_mgmt/boq/views/CivilBoqDetail.jsx";
import CivilBoqTenderDatatable from "@modules/civil_mgmt/tender/views/CivilBoqTenderDatatable.jsx";
import CreateCivilBoqTender from "@modules/civil_mgmt/tender/views/CreateCivilBoqTender.jsx";
import EditCivilBoqTender from "@modules/civil_mgmt/tender/views/EditCivilBoqTender.jsx";
import CivilBoqTenderDetail from "@modules/civil_mgmt/tender/views/CivilBoqTenderDetail.jsx";
import CivilVendorTenderDatatable from "@modules/civil_mgmt/bidding/views/CivilVendorTenderDatatable.jsx";
import CivilVendorTenderDetail from "@modules/civil_mgmt/bidding/views/CivilVendorTenderDetail.jsx";
import CivilTenderComparisonDetail from "@modules/civil_mgmt/tender/views/CivilTenderComparisonDetail.jsx";

const SITE_PERMISSION = 'civil_mgmt.site_management'
const ITEM_PERMISSION = 'civil_mgmt.item_management'
const BOQ_PERMISSION = 'civil_mgmt.boq_management'
const TENDER_PERMISSION = 'civil_mgmt.tender_management'
const VENDOR_PERMISSION = 'civil_mgmt.vendor_tender_management'

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
        DRAWING:{
            READ: {
                path: '/module/civil/project/drawing',
                permission:'civil_mgmt.view_civilprojectdrawing'
            },
            DETAIL: {
                path: '/module/civil/project/drawing/detail/:id',
                permission:'civil_mgmt.view_civilprojectdrawing'
            },
        }
    },
    BOQ:{
        READ: {
            path: '/module/civil/boq',
            permission:BOQ_PERMISSION
        },
        CREATE:{
            path:'/module/civil/boq/create',
            permission:BOQ_PERMISSION
        },
        EDIT:{
            path:'/module/civil/boq/edit/:id',
            permission:BOQ_PERMISSION
        },
        DETAIL:{
            path:'/module/civil/boq/detail/:id',
            permission:BOQ_PERMISSION
        },
    },
    TENDER:{
        READ: {
            path: '/module/civil/tender',
            permission:TENDER_PERMISSION
        },
        CREATE:{
            path:'/module/civil/tender/create',
            permission:TENDER_PERMISSION
        },
        EDIT:{
            path:'/module/civil/tender/edit/:id',
            permission:TENDER_PERMISSION
        },
        DETAIL:{
            path:'/module/civil/tender/detail/:id',
            permission:TENDER_PERMISSION
        },
        COMPARISON:{
            path:'/module/civil/tender/comparison/:id',
            permission:TENDER_PERMISSION
        },
    },
    VENDOR:{
        TENDER: {
            path: '/module/civil/vendor/tender',
            permission:VENDOR_PERMISSION
        },
        BIDDING: {
            path: '/module/civil/vendor/tender/:id',
            permission:VENDOR_PERMISSION
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
        permission: CIVIL_ROUTES.PROJECT.DRAWING.DETAIL.permission,
    },
    {
        path: CIVIL_ROUTES.BOQ.READ.path,
        component: CivilBoqDatatable,
        permission: CIVIL_ROUTES.BOQ.READ.permission,
    },
    {
        path: CIVIL_ROUTES.BOQ.CREATE.path,
        component: CreateCivilBoq,
        permission: CIVIL_ROUTES.BOQ.CREATE.permission,
    },
    {
        path: CIVIL_ROUTES.BOQ.EDIT.path,
        component: EditCivilBoq,
        permission: CIVIL_ROUTES.BOQ.EDIT.permission,
    },
    {
        path: CIVIL_ROUTES.BOQ.DETAIL.path,
        component: CivilBoqDetail,
        permission: CIVIL_ROUTES.BOQ.DETAIL.permission,
    },
    {
        path: CIVIL_ROUTES.TENDER.READ.path,
        component: CivilBoqTenderDatatable,
        permission: CIVIL_ROUTES.TENDER.READ.permission,
    },
    {
        path: CIVIL_ROUTES.TENDER.CREATE.path,
        component: CreateCivilBoqTender,
        permission: CIVIL_ROUTES.TENDER.CREATE.permission,
    },
    {
        path: CIVIL_ROUTES.TENDER.EDIT.path,
        component: EditCivilBoqTender,
        permission: CIVIL_ROUTES.TENDER.EDIT.permission,
    },
    {
        path: CIVIL_ROUTES.TENDER.DETAIL.path,
        component: CivilBoqTenderDetail,
        permission: CIVIL_ROUTES.TENDER.DETAIL.permission,
    },
    {
        path: CIVIL_ROUTES.TENDER.COMPARISON.path,
        component: CivilTenderComparisonDetail,
        permission: CIVIL_ROUTES.TENDER.COMPARISON.permission,
    },
    {
        path: CIVIL_ROUTES.VENDOR.TENDER.path,
        component: CivilVendorTenderDatatable,
        permission: CIVIL_ROUTES.VENDOR.TENDER.permission,
    },
    {
        path: CIVIL_ROUTES.VENDOR.BIDDING.path,
        component: CivilVendorTenderDetail,
        permission: CIVIL_ROUTES.VENDOR.BIDDING.permission,
    },
];
