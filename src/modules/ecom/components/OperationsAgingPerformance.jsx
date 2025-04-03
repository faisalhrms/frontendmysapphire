import React from "react";
import OperationsTable from "@modules/ecom/components/OperationsTable.jsx";
const ShopifyForm = ({ localTitle, internationalTitle, columns, localData, internationalData }) => {
    return (
        <div className="grid grid-cols-12 gap-6 mt-4">
            <div className="col-span-12">
                <div className="box">
                    <div className="box-body">
                        <div className="overflow-hidden">
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div>
                                    <h className="text-white bg-primary p-2">Pending Liability (Based on Shopify order
                                        landing date)</h>
                                    <OperationsTable title={localTitle} columns={columns} data={localData}/>
                                </div>
                                <div className="mt-6">
                                    <OperationsTable title="International" columns={columns} data={internationalData}/>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <OperationsTable title="Local+International" columns={columns} data={localData}/>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div>
                                    <h className="text-white bg-primary p-2"> Un-Approved Orders at Ginkgo</h>
                                    <OperationsTable title={localTitle} columns={columns} data={localData}/>
                                </div>
                                <div>
                                    <h className="text-white bg-primary p-2">Fulfillment Aging (Orders pending from
                                        Approved Date in Ginkgo)</h>
                                    <OperationsTable title="Sale Not Punched in D365" columns={columns} data={internationalData}/>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div>
                                    <h className="text-white bg-primary p-2">Dispatched in Ginkgo but not Picked by
                                        Courier</h>
                                    <OperationsTable title="Un-Approved Orders at Ginkgo" columns={columns} data={internationalData}/>
                                </div>
                                <div>
                                    <h className="text-white bg-primary p-2">Fulfillment Aging (Orders pending from
                                        Approved Date in Ginkgo)</h>
                                    <OperationsTable
                                        title="Fulfillment Aging (Orders pending from Approved Date in Ginkgo)" columns={columns} data={localData}/>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <OperationsTable title="Dispatched in Ginkgo but not Picked by Courier" columns={columns} data={localData}/>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div>
                                    <h className="text-white bg-primary p-2">Sale Not Punched in D365</h>
                                    <OperationsTable columns={columns} data={internationalData}/>
                                </div>
                                <div>
                                    <h className="text-white bg-primary p-2">Punched in D365 but not dispatched in
                                        Ginkgo</h>
                                    <OperationsTable columns={columns} data={localData}/>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <OperationsTable title="In-Transit to Customer" columns={columns} data={localData}/>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div>
                                    <h className="text-white bg-primary p-2">Aging from Return date marked by
                                        courier</h> <OperationsTable  columns={columns} data={localData}/>
                                </div>
                                <div>
                                    <h className="text-white bg-primary p-2">Aging from Pickup/Dispatch date</h>
                                    <OperationsTable columns={columns} data={localData}/>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopifyForm;
