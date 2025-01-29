
import React from 'react';
import OrderBookingShopify from "../../obs/components/OrderBookingShopify.jsx";

const OrderShopify = () => {
    const headers = [
        { label: 'Period', key: 'period' },
        { label: 'Orders', key: 'cy.orders' },
        { label: 'Qty', key: 'cy.qty' },
        { label: 'Value', key: 'cy.value' },
        { label: 'Orders', key: 'ly.orders' },
        { label: 'Qty', key: 'ly.qty' },
        { label: 'Value', key: 'ly.value' },
        { label: 'Orders', key: 'yoy.orders' },
        { label: 'Qty', key: 'yoy.qty' },
        { label: 'Value', key: 'yoy.value' },
    ];

    const localData = [
        { period: 'Last Day', cy: { orders: 1845, qty: 3890, value: 13122081 }, ly: { orders: 2298, qty: 5537, value: 13726526 }, yoy: { orders: -19.7, qty: -29.7, value: -4 } },
        { period: 'Last Day 7', cy: { orders: 1845, qty: 3890, value: 13122081 }, ly: { orders: 2298, qty: 5537, value: 13726526 }, yoy: { orders: -19.7, qty: -29.7, value: -4 } },
        { period: 'MTD' , cy: { orders: 1845, qty: 3890, value: 13122081 }, ly: { orders: 2298, qty: 5537, value: 13726526 }, yoy: { orders: -19.7, qty: -29.7, value: -4 } },
        { period: 'YTD', cy: { orders: 1845, qty: 3890, value: 13122081 }, ly: { orders: 2298, qty: 5537, value: 13726526 }, yoy: { orders: -19.7, qty: -29.7, value: -4 } },

    ];

    const internationalData = [
        { period: 'Last Day', cy: { orders: 35, qty: 429, value: 2381092 }, ly: { orders: 11, qty: 102, value: 360240 }, yoy: { orders: 218.2, qty: 320.6, value: 561 } },
        { period: 'Last Day 7', cy: { orders: 1845, qty: 3890, value: 13122081 }, ly: { orders: 2298, qty: 5537, value: 13726526 }, yoy: { orders: -19.7, qty: -29.7, value: -4 } },
        { period: 'MTD' , cy: { orders: 1845, qty: 3890, value: 13122081 }, ly: { orders: 2298, qty: 5537, value: 13726526 }, yoy: { orders: -19.7, qty: -29.7, value: -4 } },
        { period: 'YTD', cy: { orders: 1845, qty: 3890, value: 13122081 }, ly: { orders: 2298, qty: 5537, value: 13726526 }, yoy: { orders: -19.7, qty: -29.7, value: -4 } },
    ];


    const localDataFiscal = [
        { period: 'Last Day', cy: { orders: 1845, qty: 3890, value: 13122081 }, ly: { orders: 2298, qty: 5537, value: 13726526 }, yoy: { orders: -19.7, qty: -29.7, value: -4 } },
        { period: 'Last Day 7', cy: { orders: 1845, qty: 3890, value: 13122081 }, ly: { orders: 2298, qty: 5537, value: 13726526 }, yoy: { orders: -19.7, qty: -29.7, value: -4 } },
        { period: 'MTD' , cy: { orders: 76, qty: 3890, value: 13122081 }, ly: { orders: 2298, qty: 5537, value: 13726526 }, yoy: { orders: -19.7, qty: -29.7, value: -4 } },
        { period: 'YTD', cy: { orders: 1, qty: 3890, value: 13122081 }, ly: { orders: 2298, qty: 5537, value: 13726526 }, yoy: { orders: -19.7, qty: -29.7, value: -4 } },

    ];

    const internationalDataFiscal = [
        { period: 'Last Day', cy: { orders: 35, qty: 429, value: 2381092 }, ly: { orders: 11, qty: 102, value: 360240 }, yoy: { orders: 218.2, qty: 320.6, value: 561 } },
        { period: 'Last Day 7', cy: { orders: 1845, qty: 3890, value: 13122081 }, ly: { orders: 2298, qty: 5537, value: 13726526 }, yoy: { orders: -19.7, qty: -29.7, value: -4 } },
        { period: 'MTD' , cy: { orders: 76, qty: 3890, value: 13122081 }, ly: { orders: 2298, qty: 5537, value: 13726526 }, yoy: { orders: -19.7, qty: -29.7, value: -4 } },
        { period: 'YTD', cy: { orders: 87, qty: 3890, value: 13122081 }, ly: { orders: 2298, qty: 5537, value: 13726526 }, yoy: { orders: -19.7, qty: -29.7, value: -4 } },
    ];

    return (
        <div className="p-4">
            <OrderBookingShopify
                localConfig={{ headers, data: localData }}
                internationalConfig={{ headers, data: internationalData }}
                localConfigFiscal={{ headers, data: localDataFiscal }}
                internationalConfigFiscal={{ headers, data: internationalDataFiscal }}
            />
        </div>
    );
};

export default OrderShopify;

