import CustomerOrders from "@modules/customer-hub/customer-orders/views/CustomerOrders.jsx";
import MasterData from "@modules/customer-hub/master-data/views/MasterData.jsx";
import DyeingChargeForm from "@modules/customer-hub/master-data/dyeing-charges/components/DyeingChargeForm.jsx";
import DyeingChargeList from "@modules/customer-hub/master-data/dyeing-charges/views/DyeingChargeList.jsx";
import SizingCostList from "@modules/customer-hub/master-data/sizing-cost/views/SizingCostList.jsx";
import SizingCostForm from "@modules/customer-hub/master-data/sizing-cost/components/SizingCostForm.jsx";
import CustomerItemList from "@modules/customer-hub/master-data/customer-item-data/views/CustomerItemList.jsx";
import CustomerItemForm from "@modules/customer-hub/master-data/customer-item-data/components/CustomerItemForm.jsx";
import WeavingParameterList from "@modules/customer-hub/master-data/WeavingParameter/views/WeavingParameterList.jsx";
import WeavingParameterForm
    from "@modules/customer-hub/master-data/WeavingParameter/components/WeavingParameterForm.jsx";
import QualityWeavingList from "@modules/customer-hub/master-data/QualityWeaving/views/QualityWeavingList.jsx";
import QualityWeavingForm from "@modules/customer-hub/master-data/QualityWeaving/components/QualityWeavingForm.jsx";
import IntegrationView from "@modules/customer-hub/integrations/views/IntegrationView.jsx";
import CustomerHubEmailList from "@modules/customer-hub/mail-settings/views/CustomerHubEmailList.jsx";
import CustomerHubEmailConfig from "@modules/customer-hub/mail-settings/components/CustomerHubEmailConfig.jsx";
import GreigeLeadTimeList from "@modules/customer-hub/master-data/greige-lead-times/views/GreigeLeadTimeList.jsx";
import GreigeLeadTimeForm from "@modules/customer-hub/master-data/greige-lead-times/components/GreigeLeadTimeForm.jsx";
import AgreementApprovalDetail from "@modules/customer-hub/customer-orders/components/agreement-placement/AgreementApprovalDetail.jsx";
import ReadAgreementList from "@modules/customer-hub/approved-orders/views/ReadAgreementList.jsx";
import AgreementPlacementReadOnly
    from "@modules/customer-hub/approved-orders/components/AgreementPlacementReadOnly.jsx";
import ReadAgreementDetail from "@modules/customer-hub/approved-orders/components/ReadAgreementDetail.jsx";


export const CUSTOMER_HUB_ROUTES = {
    EMAIL: {
        MAIL_APP: {
            path: "/module/customer/hub/mails",
            permission: 'customer_hub.view_customer_hub_emails',
        },
        MAIL_LIST: {
            path: "/module/customer/hub/mail/list",
            permission: 'customer_hub.view_customer_hub_email_config_list',
        },
        MAIL_SETTINGS: {
            path: "/module/customer/hub/mail/settings",
            permission: 'customer_hub.add_customer_hub_email_config',
        },
    },
    INTEGRATIONS: {
        HOME: {
            path: "/module/customer/hub/integrations",
            permission: "customer_hub.view_integrations"
        }
    },
    AGREEMENTS_APPROVAL:{
        path:'/module/agreement/detail/:id',
        permission: "customer_hub.approved_customer_hub_agreements"
    },
};

export const READ_AGREEMENTS = {
        READ: {
            path: '/module/agreement/list',
            permission: "customer_hub.approved_customer_hub_agreements"
        },
        DETAIL: {
            path: '/module/agreement/read/:id',
            permission: "customer_hub.approved_customer_hub_agreements"
        }
};

export const MASTER_DATA = {
    READ: {
        path: '/module/master/data',
        permission: 'auth.view_customer_hub_master_data',
    },
};

export const WEAVING_PARAMETER = {
    CREATE: {
        path: '/module/customer/hub/weaving/params/add',
        permission: 'customer_hub.add_weave_params',
    },
    READ: {
        path: '/module/customer/hub/weaving/params',
        permission: 'customer_hub.view_weave_params',
    },
};

export const QUALITY_WEAVING = {
    CREATE: {
        path: '/module/customer/hub/quality/weaving/add',
        permission: 'customer_hub.add_quality_weaving',
    },
    READ: {
        path: '/module/customer/hub/quality/weaving',
        permission: 'customer_hub.view_quality_weaving',
    },
};

export const DYEING_CHARGES = {
    CREATE: {
        path: '/module/customer/hub/dyeing/charges/add',
        permission: 'customer_hub.add_dyeing_charge',
    },
    READ: {
        path: '/module/customer/hub/dyeing/charges',
        permission: 'customer_hub.view_dyeing_charge',
    },
};

export const SIZING_COST = {
    CREATE: {
        path: '/module/customer/hub/sizing/cost/add',
        permission: 'customer_hub.add_sizing_cost',
    },
    READ: {
        path: '/module/customer/hub/sizing/cost',
        permission: 'customer_hub.view_sizing_cost',
    },
};

export const CUSTOMER_ITEMS = {
    CREATE: {
        path: '/module/customer/hub/customer/items/add',
        permission: 'customer_hub.add_customer_item',
    },
    READ: {
        path: '/module/customer/hub/customer/items',
        permission: 'customer_hub.view_customer_item',
    },
};

export const GREIGE_LEAD_TIMES = {
    CREATE: {
        path: '/module/customer/hub/lead-time/add',
        permission: 'customer_hub.add_greige_lead_time',
    },
    READ: {
        path: '/module/customer/hub/lead-time',
        permission: 'customer_hub.view_greige_lead_time',
    },
};


export const MODULE_ROUTES = [
    {
        path: CUSTOMER_HUB_ROUTES.EMAIL.MAIL_APP.path,
        component: CustomerOrders,
        permission: CUSTOMER_HUB_ROUTES.EMAIL.MAIL_APP.permission,
    },
    {
        path: CUSTOMER_HUB_ROUTES.EMAIL.MAIL_LIST.path,
        component: CustomerHubEmailList,
        permission: CUSTOMER_HUB_ROUTES.EMAIL.MAIL_LIST.permission,
    },
    {
        path: CUSTOMER_HUB_ROUTES.EMAIL.MAIL_SETTINGS.path,
        component: CustomerHubEmailConfig,
        permission: CUSTOMER_HUB_ROUTES.EMAIL.MAIL_SETTINGS.permission,
    },
    {
        path: MASTER_DATA.READ.path,
        component: MasterData,
        permission: MASTER_DATA.READ.permission,
    },
    {
        path: WEAVING_PARAMETER.CREATE.path,
        component: WeavingParameterForm,
        permission: WEAVING_PARAMETER.CREATE.permission,
    },
    {
        path: WEAVING_PARAMETER.READ.path,
        component: WeavingParameterList,
        permission: WEAVING_PARAMETER.READ.permission,
    },

    {
        path: DYEING_CHARGES.CREATE.path,
        component: DyeingChargeForm,
        permission: DYEING_CHARGES.CREATE.permission,
    },
    {
        path: DYEING_CHARGES.READ.path,
        component: DyeingChargeList,
        permission: DYEING_CHARGES.READ.permission,
    },

    {
        path: SIZING_COST.CREATE.path,
        component: SizingCostForm,
        permission: SIZING_COST.CREATE.permission,
    },
    {
        path: SIZING_COST.READ.path,
        component: SizingCostList,
        permission: SIZING_COST.READ.permission,
    },
    {
        path: CUSTOMER_ITEMS.READ.path,
        component: CustomerItemList,
        permission: CUSTOMER_ITEMS.READ.permission,
    },
    {
        path: CUSTOMER_ITEMS.CREATE.path,
        component: CustomerItemForm,
        permission: CUSTOMER_ITEMS.CREATE.permission,
    },
    {
        path: QUALITY_WEAVING.READ.path,
        component: QualityWeavingList,
        permission: QUALITY_WEAVING.READ.permission,
    },
    {
        path: QUALITY_WEAVING.CREATE.path,
        component: QualityWeavingForm,
        permission: QUALITY_WEAVING.CREATE.permission,
    },
    {
        path: CUSTOMER_HUB_ROUTES.INTEGRATIONS.HOME.path,
        component: IntegrationView,
        permission: CUSTOMER_HUB_ROUTES.INTEGRATIONS.HOME.permission,
    },
    {
        path: GREIGE_LEAD_TIMES.CREATE.path,
        component: GreigeLeadTimeForm,
        permission: GREIGE_LEAD_TIMES.CREATE.permission,
    },
    {
        path: GREIGE_LEAD_TIMES.READ.path,
        component: GreigeLeadTimeList,
        permission: GREIGE_LEAD_TIMES.READ.permission,
    },
    {
        path: CUSTOMER_HUB_ROUTES.AGREEMENTS_APPROVAL.path,
        component: AgreementApprovalDetail,
        permission: CUSTOMER_HUB_ROUTES.AGREEMENTS_APPROVAL.permission,
    },
    {
        path: READ_AGREEMENTS.READ.path,
        component: ReadAgreementList,
        permission: READ_AGREEMENTS.READ.permission,
    },
    {
        path: READ_AGREEMENTS.DETAIL.path,
        component: ReadAgreementDetail,
        permission: READ_AGREEMENTS.DETAIL.permission,
    },
];
