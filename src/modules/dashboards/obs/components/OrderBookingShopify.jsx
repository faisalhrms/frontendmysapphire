
import React, { useState, useEffect } from 'react';
import Table from "./Table.jsx";

const OrderBookingShopify = ({ localConfig = {}, internationalConfig = {},localConfigFiscal = {}, internationalConfigFiscal = {} }) => {
    return (
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12">
                    <div className="box">
                        <div className="box-header">
                            <h5 className="box-title">Order Booking at Shopify</h5>
                        </div>
                        <div className="box-body ">
                            <h1 className="box-title mb-2">Islamic Calendar</h1>
                            <div className="overflow-hidden col-span-12 flex gap-4">
                                <Table title="Local" headers={localConfig?.headers} data={localConfig?.data}/>
                                <Table title="International" headers={internationalConfig?.headers}
                                       data={internationalConfig?.data}/>
                            </div>
                        </div>
                        <div className="box-body ">
                            <h1 className="box-title mb-2">Fiscal Calendar </h1>
                            <div className="overflow-hidden col-span-12 flex gap-4">
                                <Table title="Local" headers={localConfigFiscal?.headers} data={localConfigFiscal?.data}/>
                                <Table title="International" headers={internationalConfigFiscal?.headers}
                                       data={internationalConfigFiscal?.data}/>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
    );
};

export default OrderBookingShopify;
