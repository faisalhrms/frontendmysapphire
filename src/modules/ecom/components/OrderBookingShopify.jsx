
import React from 'react';
import Table from "./Table.jsx";

const OrderBookingShopify = ({ localConfig = {}, internationalConfig = {}, localConfigFiscal = {}, internationalConfigFiscal = {} }) => {
    return (
        <div className="grid grid-cols-12 gap-2">
            <div className="col-span-12">

                    <div className="box-body">

                        <div className="grid grid-cols-2 gap-2">
                            <Table title="Local" headers={localConfig?.headers} data={localConfig?.data}/>
                            <Table title="International" headers={internationalConfig?.headers} data={internationalConfig?.data}/>
                        </div>
                    </div>
                    <div className="box-body">

                        <div className="grid grid-cols-2 gap-4">
                            <Table title="Local" headers={localConfigFiscal?.headers} data={localConfigFiscal?.data}/>
                            <Table title="International" headers={internationalConfigFiscal?.headers} data={internationalConfigFiscal?.data}/>
                        </div>
                    </div>

                </div>

        </div>
    );
};

export default OrderBookingShopify;
