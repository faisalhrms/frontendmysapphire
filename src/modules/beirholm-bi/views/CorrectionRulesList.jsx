import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import DataTable from "@components/datatable/DataTable.jsx";
import {Link} from "react-router-dom";
import {BEIRHOLM_BI_ROUTES} from "@modules/beirholm-bi/routes.js";
import {downloadErrorCorrection} from "@modules/beirholm-bi/services/CorrectionRulesService.js";
import React, {useState} from "react";

const CorrectionRulesList = () => {
    const [isDownloading, setIsDownloading] = useState(false);
    const downloadExcel = async () => {
        setIsDownloading(true);
        try {
            const data = await downloadErrorCorrection();
            const blob = new Blob([data]);
            const url = window.URL.createObjectURL(blob);
            const today = new Date().toISOString().slice(0, 10);
            const filename = `correction_rules_${today}.xlsx`;
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } finally {
            setIsDownloading(false);
        }
    };

    const columns = [
        {
            Header: "Actions",
            Cell: ({row}) => (
                <div className="flex space-x-2">
                    <Link to={BEIRHOLM_BI_ROUTES.CORRECTION_RULE_CREATE.path} state={{id: row.original.id}}>
                        <button className="ti-btn ti-btn-primary ti-btn-sm">
                            <i className="ri-edit-line"></i>
                        </button>
                    </Link>
                </div>
            ),
        },
        {
            Header: "Header Name",
            accessor: "field_definition.header.name"
        },
        {
            Header: "Error Value",
            accessor: "error_value"
        },
        {
            Header: "Sanitized Value",
            accessor: "sanitized_data.name"
        }
    ];

    const buttons = (
        <>
            <div className="flex space-x-2">
                <Link
                    to={BEIRHOLM_BI_ROUTES.CORRECTION_RULE_CREATE.path}
                    className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
                >
                    <i className="ri-add-line font-semibold align-middle"></i> Add
                </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-1">
                <button
                    onClick={downloadExcel}
                    title="Download File"
                    className="ti-btn ti-btn-info"
                    disabled={isDownloading}
                >
                    {isDownloading ? (
                        <i
                            className="ri-file-excel-2-line spin"
                            style={{animation: "spin 1s infinite linear"}}
                        ></i>
                    ) : (
                        <i className="ri-file-excel-2-line"></i>
                    )}
                </button>
            </div>

        </>
    );

    return (
        <>
            <PageHeader currentpage="Correction Rules" mainpage="Correction Rules"/>
            <DataTable
                columns={columns}
                title="Correction Rules"
                apiUrl="error/correction/rule/datatable/"
                buttons={buttons}
            />
        </>
    );
};

export default CorrectionRulesList;