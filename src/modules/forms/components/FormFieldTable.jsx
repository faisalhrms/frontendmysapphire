import React from "react";
import ClientSideTable from "@components/ClientSideTable.jsx";

const FormFieldTable = ({ fields }) => {
    const tableConfig = {
        headers: [
            { label: "Order", accessor: "order", },
            { label: "Label", accessor: "label", align: "text-left" },
            { label: "Name", accessor: "name", align: "text-left" },
            { label: "Short Description", accessor: "short_description", align: "text-left" },
            { label: "Field Type", accessor: "field_type", align: "text-left" },
            { label: "Group", accessor: "group", align: "text-left" },
            { label: "Options", accessor: "options", align: "text-left" },
            { label: "Required", accessor: "required",align: "text-left" },
            {
                label: "Unique",
                accessor: "unique",
                align: "text-left",
                render: (value) => (
                    <input type="checkbox" checked={!!value} readOnly />
                )
            },
        ],

    };

    const tableData = fields || [];

    return (
        <ClientSideTable
            config={tableConfig}
            data={tableData}
            title={null}
            tHeadClasses="bg-slate-50 border-b border-slate-200 py-4 px-6 text-sm font-semibold text-slate-700 uppercase tracking-wider dark:text-gray-200 dark:bg-bodybg  border border-slate-300"
        />
    );
};

export default React.memo(FormFieldTable);
