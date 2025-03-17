// import React from 'react';
//
// const SalesReportTable = ({ title, data }) => {
//     return (
//         <div className="overflow-x-auto w-full p-4 bg-white mt-4 mb-4 rounded-lg shadow-md dark:text-gray-200 dark:bg-bodybg">
//             <table className="w-full border-collapse bg-white">
//                 <thead>
//                 <tr style={{ backgroundColor: "rgba(30, 58, 138, 0.85)", color: "white" }}>
//                     <th colSpan="1" className="py-2 px-2 border border-gray-400 p-2 text-center">Store Type</th>
//                     <th colSpan="2" className="py-2 px-2 border border-gray-400 p-2 text-center">Full Price</th>
//                     <th colSpan="2" className="py-2 px-2 border border-gray-400 p-2 text-center">Discounted</th>
//                     <th colSpan="2" className="py-2 px-2 border border-gray-400 p-2 text-center">Total</th>
//                 </tr>
//                 <tr style={{ backgroundColor: "rgba(30, 58, 138, 0.85)", color: "white" }}>
//                     <th className="py-2 px-3 text-left border border-gray-400 w-1/4">Store Name</th>
//                     <th className="py-2 border border-gray-400 px-3 text-center">Sale Qty</th>
//                     <th className="py-2 border border-gray-400 px-3 text-center">Sale Value</th>
//                     <th className="py-2 border border-gray-400 px-3 text-center">Sale Qty</th>
//                     <th className="py-2 border border-gray-400 px-3 text-center">Sale Value</th>
//                     <th className="py-2 border border-gray-400 px-3 text-center font-bold">Sale Qty</th>
//                     <th className="py-2 border border-gray-400 px-3 text-center font-bold">Sale Value</th>
//                 </tr>
//                 </thead>
//                 <tbody>
//                 {data.map((section, index) => (
//                     <React.Fragment key={index}>
//                         {section.rows.map((row, rowIndex) => (
//                             <tr key={rowIndex}>
//                                 <td className={`border border-gray-300 p-2 font-medium sticky left-0 z-10 ${row.isHeader ? 'bg-yellow-100' : row.isSubHeader ? 'bg-yellow-50' : 'bg-white'}`}
//                                     style={{ paddingLeft: `${(row.indent || 0) * 0.5}rem` }}>
//                                     {row.storeName}
//                                 </td>
//                                 <td className="py-1 px-3 text-right border border-gray-400">{row.fullPriceQty}</td>
//                                 <td className="py-1 px-3 text-right border border-gray-400">{row.fullPriceValue}</td>
//                                 <td className="py-1 px-3 text-right border border-gray-400">{row.discountedQty}</td>
//                                 <td className="py-1 px-3 text-right border border-gray-400 text-red-600">{row.discountedValue}</td>
//                                 <td className="py-1 px-3 text-right border border-gray-400 font-bold">{row.totalQty}</td>
//                                 <td className="py-1 px-3 text-right border border-gray-400 font-bold">{row.totalValue}</td>
//                             </tr>
//                         ))}
//                     </React.Fragment>
//                 ))}
//                 <tr className="bg-gray-300 text-black font-bold">
//                     <td className="py-2 px-3">Total</td>
//                     <td className="py-2 px-3 text-right border border-gray-400">{data.reduce((sum, section) =>
//                         sum + section.rows.reduce((s, row) => s + (parseInt(row.fullPriceQty.replace(/,/g, '')) || 0), 0), 0).toLocaleString()}</td>
//                     <td className="py-2 px-3 text-right border border-gray-400">{data.reduce((sum, section) =>
//                         sum + section.rows.reduce((s, row) => s + (parseInt(row.fullPriceValue.replace(/,/g, '')) || 0), 0), 0).toLocaleString()}</td>
//                     <td className="py-2 px-3 text-right border border-gray-400">{data.reduce((sum, section) =>
//                         sum + section.rows.reduce((s, row) => s + (parseInt(row.discountedQty.replace(/,/g, '')) || 0), 0), 0).toLocaleString()}</td>
//                     <td className="py-2 px-3 text-right border border-gray-400">{data.reduce((sum, section) =>
//                         sum + section.rows.reduce((s, row) => s + (parseInt(row.discountedValue.replace(/,/g, '')) || 0), 0), 0).toLocaleString()}</td>
//                     <td className="py-2 px-3 text-right border border-gray-400">{data.reduce((sum, section) =>
//                         sum + section.rows.reduce((s, row) => s + (parseInt(row.totalQty.replace(/,/g, '')) || 0), 0), 0).toLocaleString()}</td>
//                     <td className="py-2 px-3 text-right border border-gray-400">{data.reduce((sum, section) =>
//                         sum + section.rows.reduce((s, row) => s + (parseInt(row.totalValue.replace(/,/g, '')) || 0), 0), 0).toLocaleString()}</td>
//                 </tr>
//                 </tbody>
//             </table>
//         </div>
//     );
// };
//
// // Main Component
// const DailySalesReportStoreWise = () => {
//     const lastDayData = [
//         {
//             title: 'Sales by Store Type',
//             rows: [
//                 {
//                     storeName: 'Offline',
//                     fullPriceQty: '20,000',
//                     fullPriceValue: '120,000,000',
//                     discountedQty: '1,000',
//                     discountedValue: '2,500,000',
//                     totalQty: '21,000',
//                     totalValue: '122,500,000',
//                     isHeader: true,
//                     indent: 0
//                 },
//                 {
//                     storeName: 'A-Class',
//                     fullPriceQty: '13,025',
//                     fullPriceValue: '66,878,870',
//                     discountedQty: '675',
//                     discountedValue: '1,980,082',
//                     totalQty: '13,700',
//                     totalValue: '68,858,952',
//                     isSubHeader: true,
//                     indent: 1
//                 },
//                 {
//                     storeName: 'Central',
//                     fullPriceQty: '10,580',
//                     fullPriceValue: '53,992,178',
//                     discountedQty: '507',
//                     discountedValue: '1,329,781',
//                     totalQty: '11,087',
//                     totalValue: '55,241,916',
//                     indent: 2
//                 },
//
//                 {
//                     storeName: 'Gulberg II, Lahore',
//                     fullPriceQty: '1,134',
//                     fullPriceValue: '6,154,505',
//                     discountedQty: '58',
//                     discountedValue: '211,340',
//                     totalQty: '1,192',
//                     totalValue: '6,365,845',
//                     indent: 3
//                 },
//                 {
//                     storeName: 'North',
//                     fullPriceQty: '1,500',
//                     fullPriceValue: '7,550,000',
//                     discountedQty: '110',
//                     discountedValue: '350,300',
//                     totalQty: '1,610',
//                     totalValue: '7,900,300',
//                     indent: 2
//                 },
//                 {
//                     storeName: 'Emporium Mall, Lahore',
//                     fullPriceQty: '800',
//                     fullPriceValue: '4,100,000',
//                     discountedQty: '60',
//                     discountedValue: '200,300',
//                     totalQty: '860',
//                     totalValue: '4,300,300',
//                     indent: 3
//                 },
//
//                 {
//                     storeName: 'South',
//                     fullPriceQty: '945',
//                     fullPriceValue: '5,336,692',
//                     discountedQty: '58',
//                     discountedValue: '300,001',
//                     totalQty: '1,003',
//                     totalValue: '5,636,693',
//                     indent: 2
//                 },
//                 {
//                     storeName: 'Emporium Mall, Lahore',
//                     fullPriceQty: '500',
//                     fullPriceValue: '2,850,500',
//                     discountedQty: '30',
//                     discountedValue: '150,000',
//                     totalQty: '530',
//                     totalValue: '3,000,500',
//                     indent: 3
//                 },
//
//                 {
//                     storeName: 'FOL',
//                     fullPriceQty: '6,295',
//                     fullPriceValue: '40,018,865',
//                     discountedQty: '300',
//                     discountedValue: '400,000',
//                     totalQty: '6,595',
//                     totalValue: '40,418,865',
//                     isSubHeader: true,
//                     indent: 1
//                 },
//                 {
//                     storeName: 'FOL',
//                     fullPriceQty: '6,295',
//                     fullPriceValue: '40,018,865',
//                     discountedQty: '300',
//                     discountedValue: '400,000',
//                     totalQty: '6,595',
//                     totalValue: '40,418,865',
//                     indent: 2
//                 },
//                 {
//                     storeName: 'Emporium Mall, Lahore',
//                     fullPriceQty: '3,595',
//                     fullPriceValue: '23,018,865',
//                     discountedQty: '200',
//                     discountedValue: '250,000',
//                     totalQty: '3,795',
//                     totalValue: '23,268,865',
//                     indent: 3
//                 },
//
//                 {
//                     storeName: 'Other',
//                     fullPriceQty: '680',
//                     fullPriceValue: '13,102,265',
//                     discountedQty: '25',
//                     discountedValue: '119,918',
//                     totalQty: '705',
//                     totalValue: '13,222,183',
//                     isSubHeader: true,
//                     indent: 1
//                 },
//                 {
//                     storeName: 'Online',
//                     fullPriceQty: '680',
//                     fullPriceValue: '13,102,265',
//                     discountedQty: '25',
//                     discountedValue: '119,918',
//                     totalQty: '705',
//                     totalValue: '13,222,183',
//                     indent: 2
//                 },
//                 {
//                     storeName: 'Offline',
//                     fullPriceQty: '7,500',
//                     fullPriceValue: '35,000,000',
//                     discountedQty: '350',
//                     discountedValue: '700,000',
//                     totalQty: '7,850',
//                     totalValue: '35,700,000',
//                     isHeader: true,
//                     indent: 0
//                 },
//                 {
//                     storeName: 'Total',
//                     fullPriceQty: '27,500',
//                     fullPriceValue: '155,000,000',
//                     discountedQty: '1,350',
//                     discountedValue: '3,200,000',
//                     totalQty: '28,850',
//                     totalValue: '158,200,000',
//                     isHeader: true,
//                     indent: 0
//                 },
//                 {
//                     storeName: 'Total',
//                     fullPriceQty: '27,500',
//                     fullPriceValue: '155,000,000',
//                     discountedQty: '1,350',
//                     discountedValue: '3,200,000',
//                     totalQty: '28,850',
//                     totalValue: '158,200,000',
//                     isHeader: true,
//                     indent: 0
//                 }
//             ]
//         }
//     ];
//
//     const mtdData = [
//         {
//             title: 'Sales by Store Type',
//             rows: [
//                 {
//                     storeName: 'Offline',
//                     fullPriceQty: '60,000',
//                     fullPriceValue: '360,000,000',
//                     discountedQty: '3,000',
//                     discountedValue: '7,500,000',
//                     totalQty: '63,000',
//                     totalValue: '367,500,000',
//                     isHeader: true,
//                     indent: 0
//                 },
//                 {
//                     storeName: 'A-Class',
//                     fullPriceQty: '39,075',
//                     fullPriceValue: '200,636,610',
//                     discountedQty: '2,025',
//                     discountedValue: '5,940,246',
//                     totalQty: '41,100',
//                     totalValue: '206,576,856',
//                     isSubHeader: true,
//                     indent: 1
//                 },
//                 {
//                     storeName: 'Central',
//                     fullPriceQty: '31,740',
//                     fullPriceValue: '161,976,534',
//                     discountedQty: '1,521',
//                     discountedValue: '3,989,343',
//                     totalQty: '33,261',
//                     totalValue: '165,965,877',
//                     indent: 2
//                 },
//
//                 {
//                     storeName: 'Gulberg II, Lahore',
//                     fullPriceQty: '3,402',
//                     fullPriceValue: '18,463,515',
//                     discountedQty: '174',
//                     discountedValue: '634,020',
//                     totalQty: '3,576',
//                     totalValue: '19,097,535',
//                     indent: 3
//                 },
//                 {
//                     storeName: 'North',
//                     fullPriceQty: '4,500',
//                     fullPriceValue: '22,650,000',
//                     discountedQty: '330',
//                     discountedValue: '1,050,900',
//                     totalQty: '4,830',
//                     totalValue: '23,700,900',
//                     indent: 2
//                 },
//
//                 {
//                     storeName: 'Gulberg II, Lahore',
//                     fullPriceQty: '2,100',
//                     fullPriceValue: '10,350,000',
//                     discountedQty: '150',
//                     discountedValue: '450,000',
//                     totalQty: '2,250',
//                     totalValue: '10,800,000',
//                     indent: 3
//                 },
//                 {
//                     storeName: 'South',
//                     fullPriceQty: '2,835',
//                     fullPriceValue: '16,010,076',
//                     discountedQty: '174',
//                     discountedValue: '900,003',
//                     totalQty: '3,009',
//                     totalValue: '16,910,079',
//                     indent: 2
//                 },
//                 {
//                     storeName: 'Emporium Mall, Lahore',
//                     fullPriceQty: '1,500',
//                     fullPriceValue: '8,551,500',
//                     discountedQty: '90',
//                     discountedValue: '450,000',
//                     totalQty: '1,590',
//                     totalValue: '9,001,500',
//                     indent: 3
//                 },
//
//                 {
//                     storeName: 'FOL',
//                     fullPriceQty: '18,885',
//                     fullPriceValue: '120,056,595',
//                     discountedQty: '900',
//                     discountedValue: '1,200,000',
//                     totalQty: '19,785',
//                     totalValue: '121,256,595',
//                     isSubHeader: true,
//                     indent: 1
//                 },
//                 {
//                     storeName: 'FOL',
//                     fullPriceQty: '18,885',
//                     fullPriceValue: '120,056,595',
//                     discountedQty: '900',
//                     discountedValue: '1,200,000',
//                     totalQty: '19,785',
//                     totalValue: '121,256,595',
//                     indent: 2
//                 },
//
//                 {
//                     storeName: 'Gulberg II, Lahore',
//                     fullPriceQty: '8,100',
//                     fullPriceValue: '51,000,000',
//                     discountedQty: '300',
//                     discountedValue: '450,000',
//                     totalQty: '8,400',
//                     totalValue: '51,450,000',
//                     indent: 3
//                 },
//                 {
//                     storeName: 'Other',
//                     fullPriceQty: '2,040',
//                     fullPriceValue: '39,306,795',
//                     discountedQty: '75',
//                     discountedValue: '359,754',
//                     totalQty: '2,115',
//                     totalValue: '39,666,549',
//                     isSubHeader: true,
//                     indent: 1
//                 },
//                 {
//                     storeName: 'Online',
//                     fullPriceQty: '2,040',
//                     fullPriceValue: '39,306,795',
//                     discountedQty: '75',
//                     discountedValue: '359,754',
//                     totalQty: '2,115',
//                     totalValue: '39,666,549',
//                     indent: 2
//                 },
//                 {
//                     storeName: 'Offline',
//                     fullPriceQty: '22,500',
//                     fullPriceValue: '105,000,000',
//                     discountedQty: '1,050',
//                     discountedValue: '2,100,000',
//                     totalQty: '23,550',
//                     totalValue: '107,100,000',
//                     isHeader: true,
//                     indent: 0
//                 },
//                 {
//                     storeName: 'Total',
//                     fullPriceQty: '82,500',
//                     fullPriceValue: '465,000,000',
//                     discountedQty: '4,050',
//                     discountedValue: '9,600,000',
//                     totalQty: '86,550',
//                     totalValue: '474,600,000',
//                     isHeader: true,
//                     indent: 0
//                 },
//                 {
//                     storeName: 'Total',
//                     fullPriceQty: '82,500',
//                     fullPriceValue: '465,000,000',
//                     discountedQty: '4,050',
//                     discountedValue: '9,600,000',
//                     totalQty: '86,550',
//                     totalValue: '474,600,000',
//                     isHeader: true,
//                     indent: 0
//                 }
//             ]
//         }
//     ];
//
//     return (
//         <div className="overflow-x-auto p-4 mt-4 mb-4 rounded-lg dark:text-gray-200 dark:bg-bodybg">
//             <div className="flex justify-between items-center mb-4">
//                 <div className="bg-red-600 text-white px-4 py-2 text-lg font-semibold inline-block rounded-lg">Last Day</div>
//                 <div className="bg-blue-600 text-white px-4 py-2 text-lg font-semibold inline-block rounded-lg">MTD</div>
//             </div>
//
//             <div className="flex flex-wrap md:flex-nowrap gap-6 p-2 dark:text-gray-900 dark:bg-bodybg">
//                 <SalesReportTable title="Last Day" data={lastDayData} />
//                 <SalesReportTable title="MTD" data={mtdData} />
//             </div>
//         </div>
//     );
// };
//
// export default DailySalesReportStoreWise;


import React, {useState, useEffect} from 'react';

const SalesReportTable = ({title, data, filters}) => {
    const [filteredData, setFilteredData] = useState(data);

    const formatDate = (date) => {
        const [year, month, day] = date.split('-');
        return new Date(year, month - 1, day);
    };

    useEffect(() => {
        if (filters.date_from && filters.date_to) {
            const startDate = formatDate(filters.date_from);
            const endDate = formatDate(filters.date_to);

            const filtered = data.map(section => {
                const filteredRows = section.rows.filter(row => {
                    const rowDate = formatDate(row.date);
                    return rowDate >= startDate && rowDate <= endDate;
                });

                return {...section, rows: filteredRows};
            });

            setFilteredData(filtered);
        }
    }, [filters, data]);

    return (
        <div
            className="overflow-x-auto w-full p-4 bg-white mt-4 mb-4 rounded-lg shadow-md dark:text-gray-200 dark:bg-bodybg">
            <table className="w-full border-collapse bg-white">
                <thead>
                <tr style={{backgroundColor: "rgba(30, 58, 138, 0.85)", color: "white"}}>
                    <th colSpan="1" className="py-2 px-2 border border-gray-400 p-2 text-center">Store Type</th>
                    <th colSpan="2" className="py-2 px-2 border border-gray-400 p-2 text-center">Full Price</th>
                    <th colSpan="2" className="py-2 px-2 border border-gray-400 p-2 text-center">Discounted</th>
                    <th colSpan="2" className="py-2 px-2 border border-gray-400 p-2 text-center">Total</th>
                </tr>
                <tr style={{backgroundColor: "rgba(30, 58, 138, 0.85)", color: "white"}}>
                    <th className="py-2 px-3 text-left border border-gray-400 w-1/4">Store Name</th>
                    <th className="py-2 border border-gray-400 px-3 text-center">Sale Qty</th>
                    <th className="py-2 border border-gray-400 px-3 text-center">Sale Value</th>
                    <th className="py-2 border border-gray-400 px-3 text-center">Sale Qty</th>
                    <th className="py-2 border border-gray-400 px-3 text-center">Sale Value</th>
                    <th className="py-2 border border-gray-400 px-3 text-center font-bold">Sale Qty</th>
                    <th className="py-2 border border-gray-400 px-3 text-center font-bold">Sale Value</th>
                </tr>
                </thead>
                <tbody>
                {filteredData.map((section, index) => (
                    <React.Fragment key={index}>
                        {section.rows.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                <td className={`border border-gray-300 p-2 font-medium sticky left-0 z-10 ${row.isHeader ? 'bg-yellow-100' : row.isSubHeader ? 'bg-yellow-50' : 'bg-white'}`}
                                    style={{paddingLeft: `${(row.indent || 0) * 0.5}rem`}}>
                                    {row.storeName}
                                </td>
                                <td className="py-1 px-3 text-right border border-gray-400">{row.fullPriceQty}</td>
                                <td className="py-1 px-3 text-right border border-gray-400">{row.fullPriceValue}</td>
                                <td className="py-1 px-3 text-right border border-gray-400">{row.discountedQty}</td>
                                <td className="py-1 px-3 text-right border border-gray-400 text-red-600">{row.discountedValue}</td>
                                <td className="py-1 px-3 text-right border border-gray-400 font-bold">{row.totalQty}</td>
                                <td className="py-1 px-3 text-right border border-gray-400 font-bold">{row.totalValue}</td>
                            </tr>
                        ))}
                    </React.Fragment>
                ))}
                <tr className="bg-gray-300 text-black font-bold">
                    <td className="py-2 px-3">Total</td>
                    <td className="py-2 px-3 text-right border border-gray-400">{filteredData.reduce((sum, section) =>
                        sum + section.rows.reduce((s, row) => s + (parseInt(row.fullPriceQty.replace(/,/g, '')) || 0), 0), 0).toLocaleString()}</td>
                    <td className="py-2 px-3 text-right border border-gray-400">{filteredData.reduce((sum, section) =>
                        sum + section.rows.reduce((s, row) => s + (parseInt(row.fullPriceValue.replace(/,/g, '')) || 0), 0), 0).toLocaleString()}</td>
                    <td className="py-2 px-3 text-right border border-gray-400">{filteredData.reduce((sum, section) =>
                        sum + section.rows.reduce((s, row) => s + (parseInt(row.discountedQty.replace(/,/g, '')) || 0), 0), 0).toLocaleString()}</td>
                    <td className="py-2 px-3 text-right border border-gray-400">{filteredData.reduce((sum, section) =>
                        sum + section.rows.reduce((s, row) => s + (parseInt(row.discountedValue.replace(/,/g, '')) || 0), 0), 0).toLocaleString()}</td>
                    <td className="py-2 px-3 text-right border border-gray-400">{filteredData.reduce((sum, section) =>
                        sum + section.rows.reduce((s, row) => s + (parseInt(row.totalQty.replace(/,/g, '')) || 0), 0), 0).toLocaleString()}</td>
                    <td className="py-2 px-3 text-right border border-gray-400">{filteredData.reduce((sum, section) =>
                        sum + section.rows.reduce((s, row) => s + (parseInt(row.totalValue.replace(/,/g, '')) || 0), 0), 0).toLocaleString()}</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

const DailySalesReportStoreWise = ({filters}) => {
    const lastDayData = [];

    const mtdData = [

    ];

    return (
        <div className="overflow-x-auto p-4 mt-4 mb-4 rounded-lg dark:text-gray-200 dark:bg-bodybg">
            <div className="flex flex-wrap md:flex-nowrap gap-6 p-2 dark:text-gray-900 dark:bg-bodybg">
                <div className="w-full">
                    <h3 className="text-start font-bold text-xl mb-2">Last Day</h3>
                    <SalesReportTable title="Last Day" data={lastDayData} filters={filters}/>
                </div>
                <div className="w-full">
                    <h3 className="text-start font-bold text-xl mb-2">MTD</h3>
                    <SalesReportTable title="MTD" data={mtdData} filters={filters}/>
                </div>

            </div>
        </div>
    );
};

export default DailySalesReportStoreWise;

