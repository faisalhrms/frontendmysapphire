
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
    },
    LAPTOP_LIST:{
    path:'/module/equipment/laptop-list',
        permission: 'view_equipment',
    },
    EQUIPMENT_REPORT:{
        path:'/module/equipment/equipment-report',
        permission: 'view_equipment',
    },
    EQUIPMENT_REASSIGN:{
        path:'/module/equipment/equipment-reassign/:id',
        permission: 'add_equipment',
    },
    EQUIPMENT_HISTORY:{
        path:'/module/equipment/equipment-history/:id',
        permission: 'view_equipment',
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
    },{
        path:INVENTORY_ROUTES.LAPTOP_LIST.path,
        component:()=>import(`/src/modules/inventory/views/LaptopList.jsx`),
        permission: INVENTORY_ROUTES.LAPTOP_LIST.permission
    },
    {
        path:INVENTORY_ROUTES.EQUIPMENT_REPORT.path,
        component:()=>import(`/src/modules/inventory/views/EquipmentReportList.jsx`),
        permission: INVENTORY_ROUTES.EQUIPMENT_REPORT.permission
    },
    {
        path:INVENTORY_ROUTES.EQUIPMENT_REASSIGN.path,
        component:()=>import(`/src/modules/inventory/views/ReAssignEquipment.jsx`),
        permission: INVENTORY_ROUTES.EQUIPMENT_REPORT.permission
    },
    {
        path:INVENTORY_ROUTES.EQUIPMENT_HISTORY.path,
        component:()=>import(`/src/modules/inventory/views/EquipmentHistory.jsx`),
        permission: INVENTORY_ROUTES.EQUIPMENT_HISTORY.permission
    }
    // {
    //     path: INVENTORY_ROUTES.SUMMARY.path,
    //     component: () => import(`/src/modules/inventory/views/ReAssignEquipment.jsx`),
    //     // permission: INVENTORY_ROUTES.SUMMARY.permission,
    // },
    
]