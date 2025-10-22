import MailApp from "@modules/customer-hub/mail-app/views/email/MailApp.jsx";
import CustomerHubEmailConfig
    from "@modules/customer-hub/mail-app/components/customer-hub-email-config/CustomerHubEmailConfig.jsx";
import CustomerHubEmailList from "@modules/customer-hub/mail-app/views/email/CustomerHubEmailList.jsx";
import MasterData from "@modules/customer-hub/master-data/views/MasterData.jsx";
import DyeingChargeForm from "@modules/customer-hub/master-data/dyeing-charges/components/DyeingChargeForm.jsx";
import DyeingChargeList from "@modules/customer-hub/master-data/dyeing-charges/views/DyeingChargeList.jsx";
import SizingCostList from "@modules/customer-hub/master-data/sizing-cost/views/SizingCostList.jsx";
import SizingCostForm from "@modules/customer-hub/master-data/sizing-cost/components/SizingCostForm.jsx";
import AgreementPlacementPage from "@modules/customer-hub/mail-app/components/AgreementPlacementPage.jsx";
import CustomerItemList from "@modules/customer-hub/master-data/customer-item-data/views/CustomerItemList.jsx";
import CustomerItemForm from "@modules/customer-hub/master-data/customer-item-data/components/CustomerItemForm.jsx";
import WeavingParameterList from "@modules/customer-hub/master-data/WeavingParameter/views/WeavingParameterList.jsx";
import WeavingParameterForm
    from "@modules/customer-hub/master-data/WeavingParameter/components/WeavingParameterForm.jsx";
import QualityWeavingList from "@modules/customer-hub/master-data/QualityWeaving/views/QualityWeavingList.jsx";
import QualityWeavingForm from "@modules/customer-hub/master-data/QualityWeaving/components/QualityWeavingForm.jsx";


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
};

export const AIRJET_COSTING = {
    READ: {
        path: '/module/customer/hub/airjet-costing',
        permission: 'auth.view_customer_hub_master_data',
    },
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


export const MODULE_ROUTES = [
    {
        path: CUSTOMER_HUB_ROUTES.EMAIL.MAIL_APP.path,
        component: MailApp,
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
        path: AIRJET_COSTING.READ.path,
        component: AgreementPlacementPage,
        permission: AIRJET_COSTING.READ.permission,
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
];
