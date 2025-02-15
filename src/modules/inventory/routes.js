import EquipmentList from '@modules/inventory/views/EquipmentList.jsx';
import AddEquipment from '@modules/inventory/views/AddEquipment.jsx';
import EquipmentDetail from '@modules/inventory/views/EquipmentDetail.jsx';
import EquipmentEdit from '@modules/inventory/views/EquipmentEdit.jsx';
import LaptopList from '@modules/inventory/views/LaptopList.jsx';
import EquipmentReportList from '@modules/inventory/views/EquipmentReportList.jsx';
import EquipmentSiteWiseReport from '@modules/inventory/views/EquipmentSiteWiseReport.jsx';
import ReAssignEquipment from '@modules/inventory/views/ReAssignEquipment.jsx';
import EquipmentHistory from '@modules/inventory/views/EquipmentHistory.jsx';

export const INVENTORY_ROUTES = {
    READ: {
        path: '/module/equipment',
        permission: 'view_equipment',
    },
    ADD: {
        path: '/module/equipment/add',
        permission: 'add_equipment',
    },
    DETAIL: {
        path: '/module/equipment/detail/:id',
        permission: 'view_equipment',
    },
    EDIT: {
        path: '/module/equipment/edit/:id',
        permission: 'change_equipment',
    },
    SUMMARY: {
        path: '/module/equipment/transaction',
    },
    LAPTOP_LIST: {
        path: '/module/equipment/laptop-list',
        permission: 'view_equipment',
    },
    EQUIPMENT_REPORT: {
        path: '/module/equipment/equipment-report',
        permission: 'view_equipment',
    },
    EQUIPMENT_REASSIGN: {
        path: '/module/equipment/equipment-reassign/:id',
        permission: 'add_equipment',
    },
    EQUIPMENT_SITE_WISE: {
        path: '/module/equipment/equipment-site-wise',
        permission: 'view_equipment',
    },
    EQUIPMENT_HISTORY: {
        path: '/module/equipment/equipment-history/:id',
        permission: 'view_equipment',
    },
};

export const MODULE_ROUTES = [
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
];
