import InventoryTracker from '@modules/inventory-tracker/views/ScanBarcode.jsx';

export const INVENTORY_TRACKER_ROUTES = {
    ADD: {
        path: '/module/inventory-tracker',
        // permission: 'auth.inventory-tracker',
    },
};

export const MODULE_ROUTES = [

    {
        path: INVENTORY_TRACKER_ROUTES.ADD.path,
        component: InventoryTracker,
        permission: INVENTORY_TRACKER_ROUTES.ADD.permission,
    },


];
