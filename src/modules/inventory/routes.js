
export const INVENTORY_ROUTES = {
    READ:{
      path:'/module/equipment',
        // permission: 'equipment_read',
    },
    ADD:{
        path:'/module/equipment/add',
        // permission: 'equipment_create',

    },
    DETAIL:{
        path:'/module/equipment/detail/:id',
        // permission: 'equipment_read'
    },
    EDIT:{
        path:'/module/equipment/summary',  
    }

}
export const MODULE_ROUTES = [
    {
        path: INVENTORY_ROUTES.READ.path,
        component: () => import(`/src/modules/inventory/views/InventoryList.jsx`),
        permission: INVENTORY_ROUTES.READ.permission,
    },
    {
        path: INVENTORY_ROUTES.ADD.path,
        component: () => import(`/src/modules/inventory/views/AddInventoryForm.jsx`),
        permission: INVENTORY_ROUTES.ADD.permission,
    },
    {
        path: INVENTORY_ROUTES.DETAIL.path,
        component: () => import(`/src/modules/inventory/views/InventoryDetail.jsx`),
        permission: INVENTORY_ROUTES.DETAIL.permission,
    },
    {
        path: INVENTORY_ROUTES.EDIT.path,
        component: () => import(`/src/modules/inventory/views/EquipmentSummary.jsx`),
        permission: INVENTORY_ROUTES.EDIT.permission,
    }
]