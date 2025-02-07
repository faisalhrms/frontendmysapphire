export  const SELF_SERVICES_ROUTES={
    SERVICES:{
        READ:{
            path:'/module/ess/services-request',
        },
        CREATE:{
            path:'/module/ess/service-request/create',
        },
        EDIT:{
            path:'/module/ess/service-request/edit/:id',
        },
        DETAIL:{
            path:'/module/ess/service-request/detail/:id',
        },
        WORK_DESK:{
            path:'/module/ess/work-desk',
        },
        DISCOUNT_CARD: {
            path: "/module/ess/discount-card",
         
         
          },
        DIGITAL_PROFILE: {
            path: "/module/ess/my/digital/profile",

          },
    }
}
export  const MODULE_ROUTES = [
{
    path:SELF_SERVICES_ROUTES.SERVICES.READ.path,
    component:()=>import('/src/modules/employee-self-services/service-request/views/ServiceRequestList.jsx'),
},
    {
        path:SELF_SERVICES_ROUTES.SERVICES.CREATE.path,
        component:()=>import('/src/modules/employee-self-services/service-request/views/ServiceRequestCreate.jsx'),
    },
    {
        path:SELF_SERVICES_ROUTES.SERVICES.EDIT.path,
        component:()=>import('/src/modules/employee-self-services/service-request/views/ServiceRequestEdit.jsx')
    },
    {
        path:SELF_SERVICES_ROUTES.SERVICES.DETAIL.path,
        component:()=>import('/src/modules/employee-self-services/service-request/views/ServiceRequestDetail.jsx')
    },
    {
        path:SELF_SERVICES_ROUTES.SERVICES.WORK_DESK.path,
        component:()=>import('/src/modules/employee-self-services/work-desk/views/WorkDesk.jsx')
    },
    {
        path:SELF_SERVICES_ROUTES.SERVICES.DISCOUNT_CARD.path,
        component:()=>import('/src/modules/employee-self-services/discount-card/views/DiscountCard.jsx')
    },
    {
        path:SELF_SERVICES_ROUTES.SERVICES.DIGITAL_PROFILE.path,
        component:()=>import('/src/modules/employee-self-services/my-digital-profile/views/DigitalProfile.jsx')
    }
]