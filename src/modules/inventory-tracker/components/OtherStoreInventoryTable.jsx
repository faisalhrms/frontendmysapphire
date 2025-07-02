import React from "react";
import ClientSideTable from "@components/ClientSideTable.jsx";
import ProgressBar from "@components/ProgressBar.jsx";
import {getBadgeClasses} from "@helpers/badges.js";

const OtherStoreInventoryTable = ({ rows }) => {

    const tableData = (rows || []).map((item) => ({
        warehousename: <span><i
            className="bi bi-shop align-middle me-2 text-[#8c9097] dark:text-white/50"></i> {item.warehousename}</span>,
        warehousename_text: item.warehousename,
        onhand_qty: item.onhand_qty,
        combos: item.combos,
        sizes: item.sizes,
        order: <i className="bi bi-bag-check text-success font-bold"></i>,
    }));

    const tableConfig = {
        headers: [
            {label: "Store", accessor: "warehousename", align: "text-left"},
            { label: "Quantity", accessor: "onhand_qty" },
            { label: "Sizes", accessor: "sizes" },
            { label: "Combos", accessor: "combos" },
            { label: "Order On Behalf", accessor: "order" },

        ],
    };
    return (
        <ClientSideTable config={tableConfig} data={tableData} title={null} />
    )
}
export default React.memo(OtherStoreInventoryTable)