
export const INVENTORY_ROUTES = {
    READ:{
      path:'/module/equipment',
        permission: 'view_equipment',
    },
    ADD:{
        path:'/module/equipment/add',
        permission: 'add_equipment',

    },
    DETAIL:{
        path:'/module/equipment/detail/:id',
        permission: 'view_equipment'
    },
    EDIT:{
        path:'/module/equipment/edit/:id',
        permission: 'change_equipment'
    },
    SUMMARY:{
        path:'/module/equipment/transaction',  
    }

}
export const MODULE_ROUTES = [
    {
        path: INVENTORY_ROUTES.READ.path,
        component: () => import(`/src/modules/inventory/views/EquipmentList.jsx`),
        permission: INVENTORY_ROUTES.READ.permission,
    },
    {
        path: INVENTORY_ROUTES.ADD.path,
        component: () => import(`/src/modules/inventory/views/AddEquipment.jsx`),
        permission: INVENTORY_ROUTES.ADD.permission,
    },
    {
        path: INVENTORY_ROUTES.DETAIL.path,
        component: () => import(`/src/modules/inventory/views/EquipmentDetail.jsx`),
        permission: INVENTORY_ROUTES.DETAIL.permission,
    },
    {
        path: INVENTORY_ROUTES.EDIT.path,
        component: () => import(`/src/modules/inventory/views/EquipmentEdit.jsx`),
         permission: INVENTORY_ROUTES.EDIT.permission,
    },
    // {
    //     path: INVENTORY_ROUTES.SUMMARY.path,
    //     component: () => import(`/src/modules/inventory/views/ReAssignEquipment.jsx`),
    //     // permission: INVENTORY_ROUTES.SUMMARY.permission,
    // },
    
]