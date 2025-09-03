import EquipmentList from '@modules/inventory/views/EquipmentList.jsx';
import AddEquipment from '@modules/inventory/views/AddEquipment.jsx';
import EquipmentDetail from '@modules/inventory/views/EquipmentDetail.jsx';
import EquipmentEdit from '@modules/inventory/views/EquipmentEdit.jsx';
import LaptopList from '@modules/inventory/views/LaptopList.jsx';
import EquipmentReportList from '@modules/inventory/views/EquipmentReportList.jsx';
import EquipmentSiteWiseReport from '@modules/inventory/views/EquipmentSiteWiseReport.jsx';
import ReAssignEquipment from '@modules/inventory/views/ReAssignEquipment.jsx';
import EquipmentHistory from '@modules/inventory/views/EquipmentHistory.jsx';
import Equipment from "@modules/inventory/views/Equipment.jsx";
import LocationSubnetList from "@modules/inventory/views/LocationSubnetList.jsx";
import LocationSubnetAdd from "@modules/inventory/views/LocationSubnetAdd.jsx";
import LocationSubnetEdit from "@modules/inventory/views/LocationSubnetEdit.jsx";

export const INVENTORY_ROUTES = {
    HOME: {
        path: '/module/asset/home',
        permission: 'inventory.view_equipment',
    },
    READ: {
        path: '/module/asset',
        permission: 'inventory.view_equipment',
    },
    ADD: {
        path: '/module/asset/add',
        permission: 'inventory.add_equipment',
    },
    DETAIL: {
        path: '/module/asset/detail/:id',
        permission: 'inventory.view_equipment',
    },
    EDIT: {
        path: '/module/asset/edit/:id',
        permission: 'inventory.change_equipment',
    },
    SUMMARY: {
        path: '/module/asset/transaction',
    },
    LAPTOP_LIST: {
        path: '/module/asset/laptop-list',
        permission: 'inventory.view_equipment',
    },
    EQUIPMENT_REPORT: {
        path: '/module/asset/equipment-report',
        permission: 'inventory.view_equipment',
    },
    EQUIPMENT_REASSIGN: {
        path: '/module/asset/asset-reassign/:id',
        permission: 'inventory.add_equipment',
    },
    EQUIPMENT_SITE_WISE: {
        path: '/module/asset/equipment-site-wise',
        permission: 'inventory.view_equipment',
    },
    EQUIPMENT_HISTORY: {
        path: '/module/asset/equipment-history/:id',
        permission: 'inventory.view_equipment',
    },
    SETUPS: {
        READ: {
            path: '/module/setups/location-subnets'
        },
        ADD:{
            path:'/module/setups/location-subnets/add'
        },
        EDIT:{
            path:'/module/setups/location-subnets/edit/:id'
        }
    }
};

export const MODULE_ROUTES = [
    {
        path: INVENTORY_ROUTES.HOME.path,
        component: Equipment,
        permission: INVENTORY_ROUTES.HOME.permission,
    },
    {
        path: INVENTORY_ROUTES.READ.path,
        component: EquipmentList,
        permission: INVENTORY_ROUTES.READ.permission,
    },
    {
        path: INVENTORY_ROUTES.ADD.path,
        component: AddEquipment,
        permission: INVENTORY_ROUTES.ADD.permission,
    },
    {
        path: INVENTORY_ROUTES.DETAIL.path,
        component: EquipmentDetail,
        permission: INVENTORY_ROUTES.DETAIL.permission,
    },
    {
        path: INVENTORY_ROUTES.EDIT.path,
        component: EquipmentEdit,
        permission: INVENTORY_ROUTES.EDIT.permission,
    },
    {
        path: INVENTORY_ROUTES.LAPTOP_LIST.path,
        component: LaptopList,
        permission: INVENTORY_ROUTES.LAPTOP_LIST.permission,
    },
    {
        path: INVENTORY_ROUTES.EQUIPMENT_REPORT.path,
        component: EquipmentReportList,
        permission: INVENTORY_ROUTES.EQUIPMENT_REPORT.permission,
    },
    {
        path: INVENTORY_ROUTES.EQUIPMENT_SITE_WISE.path,
        component: EquipmentSiteWiseReport,
        permission: INVENTORY_ROUTES.EQUIPMENT_REPORT.permission,
    },
    {
        path: INVENTORY_ROUTES.EQUIPMENT_REASSIGN.path,
        component: ReAssignEquipment,
        permission: INVENTORY_ROUTES.EQUIPMENT_REPORT.permission,
    },
    {
        path: INVENTORY_ROUTES.EQUIPMENT_HISTORY.path,
        component: EquipmentHistory,
        permission: INVENTORY_ROUTES.EQUIPMENT_HISTORY.permission,
    },
    {
        path:INVENTORY_ROUTES.SETUPS.READ.path,
        component:LocationSubnetList,
        permission: INVENTORY_ROUTES.READ.permission,
    },
    {
        path:INVENTORY_ROUTES.SETUPS.ADD.path,
        component:LocationSubnetAdd,
        permission: INVENTORY_ROUTES.READ.permission,
    },
    {
        path:INVENTORY_ROUTES.SETUPS.EDIT.path,
        component:LocationSubnetEdit,
        permission: INVENTORY_ROUTES.READ.permission,
    }
];
