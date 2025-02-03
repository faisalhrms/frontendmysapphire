import React from "react";
import OperationsTable from "@modules/ecom/components/OperationsTable.jsx";
const ShopifyForm = ({ localTitle, internationalTitle, columns, localData, internationalData }) => {
    return (
        <div className="grid grid-cols-12 gap-6 mt-4">
            <div className="col-span-12">
                <div className="box">

                    <div className="box-body">
                        <div className="overflow-hidden">
                            <div className="grid grid-cols-2 gap-4">
                                <OperationsTable title={localTitle} columns={columns} data={localData} />
                                <OperationsTable title={internationalTitle} columns={columns} data={internationalData} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopifyForm;
