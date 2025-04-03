import React from "react";
import Table from "./Table.jsx";

const OrderBookingShopify = ({
                               localConfigFiscal = {},
                               internationalConfigFiscal = {},
                               load ,
                             }) => {
  return (
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-12">
          <div className="box-body">
            <div className="font-medium">Fiscal Calendar</div>
            <div className="flex flex-col gap-4">
              <Table
                  title="Local"
                  headers={localConfigFiscal?.headers}
                  data={localConfigFiscal?.data}
                  loading={load}
              />
              <Table
                  title="International"
                  headers={internationalConfigFiscal?.headers}
                  data={internationalConfigFiscal?.data}
                  loading={load}
              />
            </div>
          </div>
        </div>
      </div>
  );
};

export default OrderBookingShopify;
