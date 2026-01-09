import FieldDefinitionList from "@modules/beirholm-bi/views/FieldDefinitionList.jsx";
import FieldDefinitionForm from "@modules/beirholm-bi/components/FieldDefinitionForm.jsx";
import CorrectionRulesList from "@modules/beirholm-bi/views/CorrectionRulesList.jsx";
import CorrectionRulesForm from "@modules/beirholm-bi/components/CorrectionRulesForm.jsx";
import DataSanitizationList from "@modules/beirholm-bi/views/DataSanitizationList.jsx";
import CompetitorAnalysis from "@modules/beirholm-bi/views/CompetitorAnalysis.jsx";
import CorrectionPatternsList from "@modules/beirholm-bi/views/CorrectionPatternsList.jsx";
import CorrectionPatternsForm from "@modules/beirholm-bi/components/CorrectionPatternsForm.jsx";
import ExchangeRateList from "@modules/beirholm-bi/views/ExchangeRateList.jsx";
import ExchangeRateForm from "@modules/beirholm-bi/components/ExchangeRateForm.jsx";
import DataMappingRuleList from "@modules/beirholm-bi/views/DataMappingRuleList.jsx";
import DataMappingRuleForm from "@modules/beirholm-bi/components/DataMappingRuleForm.jsx";
import DataHealthRulesetEditor from "@modules/beirholm-bi/components/DataHealthRulesetEditor.jsx";
import DataHealthRulesetList from "@modules/beirholm-bi/views/DataHealthRulesetList.jsx";
import CompetitorsList from "@modules/beirholm-bi/views/CompetitorsList.jsx";
import CompetitorsAdd from "@modules/beirholm-bi/components/CompetitorsAdd.jsx";
import CompetitorsEdit from "@modules/beirholm-bi/components/CompetitorsEdit.jsx";

export const COMPETITORS_ROUTES = {
    READ:{
        path:'/competitors/list',
        permission:'beirholm_bi.view_competitors'
    },
    ADD:{
        path:'/competitors/add',
        permission:'beirholm_bi.add_competitors'
    },
    EDIT:{
        path:'/competitors/edit/:id',
        permission:'beirholm_bi.change_competitors'
    },


}

export const BEIRHOLM_BI_ROUTES = {
    FIELD_DEFINITION_READ: {
        path: '/module/field/definitions',
        permission: 'beirholm_bi.view_beirholm_field_definitions',
    },
    FIELD_DEFINITION_CREATE: {
        path: '/module/field/definitions/add/',
        permission: 'beirholm_bi.add_beirholm_field_definitions',
    },

    CORRECTION_RULE_READ: {
        path: '/module/correction/rules',
        permission: 'beirholm_bi.view_beirholm_error_correction_rule',
    },
    CORRECTION_RULE_CREATE: {
        path: '/module/correction/rules/add/',
        permission: 'beirholm_bi.add_beirholm_error_correction_rule',
    },

    CORRECTION_PATTERN_READ: {
        path: '/module/correction/patterns',
        permission: 'beirholm_bi.view_error_correction_pattern',
    },
    CORRECTION_PATTERN_CREATE: {
        path: '/module/correction/patterns/add/',
        permission: 'beirholm_bi.add_error_correction_pattern',
    },

    DATA_SANITIZATION_READ: {
        path: '/module/data/sanitization',
        permission: 'beirholm_bi.view_data_sanitization',
    },
    COMPETITOR_ANALYSIS: {
        path: '/module/competitor/analysis',
        permission: 'auth.view_competitor_analysis',
    },

    EXCHANGE_RATE_READ: {
        path: '/module/exchange/rate',
        permission: 'beirholm_bi.view_exchange_rate',
    },
    EXCHANGE_RATE_CREATE: {
        path: '/module/exchange/rate/add/',
        permission: 'beirholm_bi.add_exchange_rate',
    },

    DATA_MAPPING_RULE_LIST: {
        path: '/module/beirholm/bi/mapping-rule',
        permission: 'beirholm_bi.view_data_mapping_rule'
    },
    DATA_MAPPING_RULE_CREATE: {
        path: '/module/beirholm/bi/mapping-rule/add',
        permission: 'beirholm_bi.add_data_mapping_rule'
    },

    DATA_HEALTH_FLOW_CREATE: {
        path: '/module/beirholm-bi/health/add',
        permission: 'beirholm_bi.add_beirholm_data_health_ruleset'
    },

    DATA_HEALTH_FLOW_LIST: {
        path: '/module/beirholm-bi/health',
        permission: 'beirholm_bi.view_beirholm_data_health_ruleset'
    },

    DATA_HEALTH_FLOW_EDIT: {
        path: '/module/beirholm-bi/health/:id',
        permission: 'beirholm_bi.change_beirholm_data_health_ruleset'
    },



};

export const MODULE_ROUTES = [
    {
        path: BEIRHOLM_BI_ROUTES.FIELD_DEFINITION_READ.path,
        component: FieldDefinitionList,
        permission: BEIRHOLM_BI_ROUTES.FIELD_DEFINITION_READ.permission,
    },
    {
        path: BEIRHOLM_BI_ROUTES.FIELD_DEFINITION_CREATE.path,
        component: FieldDefinitionForm,
        permission: BEIRHOLM_BI_ROUTES.FIELD_DEFINITION_CREATE.permission,
    },

    {
        path: BEIRHOLM_BI_ROUTES.CORRECTION_RULE_READ.path,
        component: CorrectionRulesList,
        permission: BEIRHOLM_BI_ROUTES.CORRECTION_RULE_READ.permission,
    },
    {
        path: BEIRHOLM_BI_ROUTES.CORRECTION_RULE_CREATE.path,
        component: CorrectionRulesForm,
        permission: BEIRHOLM_BI_ROUTES.CORRECTION_RULE_CREATE.permission,
    },

    {
        path: BEIRHOLM_BI_ROUTES.CORRECTION_PATTERN_READ.path,
        component: CorrectionPatternsList,
        permission: BEIRHOLM_BI_ROUTES.CORRECTION_PATTERN_READ.permission,
    },
    {
        path: BEIRHOLM_BI_ROUTES.CORRECTION_PATTERN_CREATE.path,
        component: CorrectionPatternsForm,
        permission: BEIRHOLM_BI_ROUTES.CORRECTION_PATTERN_CREATE.permission,
    },

    {
        path: BEIRHOLM_BI_ROUTES.DATA_SANITIZATION_READ.path,
        component: DataSanitizationList,
        permission: BEIRHOLM_BI_ROUTES.DATA_SANITIZATION_READ.permission,
    },
    {
        path: BEIRHOLM_BI_ROUTES.COMPETITOR_ANALYSIS.path,
        component: CompetitorAnalysis,
        permission: BEIRHOLM_BI_ROUTES.COMPETITOR_ANALYSIS.permission,
    },
    {
        path: BEIRHOLM_BI_ROUTES.EXCHANGE_RATE_READ.path,
        component: ExchangeRateList,
        permission: BEIRHOLM_BI_ROUTES.EXCHANGE_RATE_READ.permission,
    },
    {
        path: BEIRHOLM_BI_ROUTES.EXCHANGE_RATE_CREATE.path,
        component: ExchangeRateForm,
        permission: BEIRHOLM_BI_ROUTES.EXCHANGE_RATE_CREATE.permission,
    },
    {
        path: BEIRHOLM_BI_ROUTES.DATA_MAPPING_RULE_LIST.path,
        component: DataMappingRuleList,
        permission: BEIRHOLM_BI_ROUTES.DATA_MAPPING_RULE_LIST.permission
    },
    {
        path: BEIRHOLM_BI_ROUTES.DATA_MAPPING_RULE_CREATE.path,
        component: DataMappingRuleForm,
        permission: BEIRHOLM_BI_ROUTES.DATA_MAPPING_RULE_CREATE.permission
    },
    {
        path: BEIRHOLM_BI_ROUTES.DATA_HEALTH_FLOW_CREATE.path,
        component: DataHealthRulesetEditor,
        permission: BEIRHOLM_BI_ROUTES.DATA_HEALTH_FLOW_CREATE.permission
    },

    {
        path: BEIRHOLM_BI_ROUTES.DATA_HEALTH_FLOW_EDIT.path,
        component: DataHealthRulesetEditor,
        permission: BEIRHOLM_BI_ROUTES.DATA_HEALTH_FLOW_EDIT.permission
    },

    {
        path: BEIRHOLM_BI_ROUTES.DATA_HEALTH_FLOW_LIST.path,
        component: DataHealthRulesetList,
        permission: BEIRHOLM_BI_ROUTES.DATA_HEALTH_FLOW_LIST.permission
    },
    {
        path:COMPETITORS_ROUTES.READ.path,
        component:CompetitorsList,
        permission:COMPETITORS_ROUTES.READ.permission
    },
    {
        path:COMPETITORS_ROUTES.ADD.path,
        component:CompetitorsAdd,
        permission:COMPETITORS_ROUTES.ADD.permission
    },
    {
        path:COMPETITORS_ROUTES.EDIT.path,
        component:CompetitorsEdit,
        permission:COMPETITORS_ROUTES.EDIT.permission
    }
];
