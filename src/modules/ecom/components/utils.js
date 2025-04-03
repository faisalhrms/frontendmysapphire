export const columns = [
    "Candela Store",
    "0~3 ",
    "4~5 ",
    "6~8 ",
    "9~10 ",
    "+10",
    "Total"
];

export const localData = [
    { "Candela Store": "E Store", "0 ~ 3 Days (Normal)": 2741, "4 ~ 5 Days": 8, "6 ~ 8 Days": 4, "9 ~ 10 Days": 2, "+ 10 Days": 32, "Total": 2787 },
    { "Candela Store": "World Trade Center", "0 ~ 3 Days (Normal)": 197, "4 ~ 5 Days": 3, "6 ~ 8 Days": 1, "9 ~ 10 Days": "", "+ 10 Days": "", "Total": 201 },
    { "Candela Store": "Estore 2", "0 ~ 3 Days (Normal)": 141, "4 ~ 5 Days": 1, "6 ~ 8 Days": 3, "9 ~ 10 Days": "", "+ 10 Days": 8, "Total": 153 },
    { "Candela Store": "GULBERG_NEW", "0 ~ 3 Days (Normal)": 92, "4 ~ 5 Days": 1, "6 ~ 8 Days": "", "9 ~ 10 Days": "", "+ 10 Days": "", "Total": 93 },
    { "Candela Store": "Gujranwala Rahwali store", "0 ~ 3 Days (Normal)": 63, "4 ~ 5 Days": 8, "6 ~ 8 Days": "", "9 ~ 10 Days": "", "+ 10 Days": "", "Total": 71 },
    { "Candela Store": "E-Store 4", "0 ~ 3 Days (Normal)": "", "4 ~ 5 Days": "", "6 ~ 8 Days": "", "9 ~ 10 Days": "", "+ 10 Days": 12, "Total": 36 },
    { "Candela Store": "Multan Store", "0 ~ 3 Days (Normal)": 34, "4 ~ 5 Days": 0, "6 ~ 8 Days": "", "9 ~ 10 Days": "", "+ 10 Days": "", "Total": 34 },
    { "Candela Store": "PWD Islamabad Store", "0 ~ 3 Days (Normal)": 32, "4 ~ 5 Days": 2, "6 ~ 8 Days": "", "9 ~ 10 Days": "", "+ 10 Days": "", "Total": 34 },
    { "Candela Store": "Peshawar Store", "0 ~ 3 Days (Normal)": 23, "4 ~ 5 Days": "", "6 ~ 8 Days": "", "9 ~ 10 Days": "", "+ 10 Days": "", "Total": 23 },
    { "Candela Store": "E-Store 3", "0 ~ 3 Days (Normal)": 7, "4 ~ 5 Days": 1, "6 ~ 8 Days": 1, "9 ~ 10 Days": "", "+ 10 Days": "", "Total": 8 },
    { "Candela Store": "Faisalabad Store", "0 ~ 3 Days (Normal)": 5, "4 ~ 5 Days": 1, "6 ~ 8 Days": "", "9 ~ 10 Days": "", "+ 10 Days": "", "Total": 6 }
];

export const internationalData = [
    { "Candela Store": "E Store", "0 ~ 3 Days (Normal)": 34, "4 ~ 5 Days": 1, "6 ~ 8 Days": 2, "9 ~ 10 Days": 1, "+ 10 Days": 1, "Total": 39 }
];
export const agingData = [
    { courier: "TCS", "0-7Days": 1519, "8-15Days": 9489, "16-25Days": 8421, total: 19429 },
    { courier: "CallCourierN", "0-7Days": 3843, "8-15Days": 6374, "16-25Days": 133, total: 14808 },
    { courier: "SWYFT", "0-7Days": 213, "8-15Days": 851, "16-25Days": 378, total: 1442 },
    { courier: "TPL", "0-7Days": 159, "8-15Days": 279, "16-25Days": 371, total: 440 },
    { courier: "LCS", "0-7Days": 4, "8-15Days": 8, "16-25Days": 48, total: 60 },
];

export const totals = {
    "0-7Days": 10217,
    "8-15Days": 17087,
    "16-25Days": 9309,
    total: 36613,
};


export const megacancelledOrdersData = [
    { date: "03-Jan-2024", orders: 329, qty: 702, value: "1,959,328" },
    { date: "04-Jan-2024", orders: 176, qty: 424, value: "1,246,356" },
    { date: "05-Jan-2024", orders: 92, qty: 299, value: "787,527" },
    { date: "06-Jan-2024", orders: 126, qty: 234, value: "557,894" },
    { date: "07-Jan-2024", orders: 68, qty: 157, value: "502,975" },
];

export const megacancelledOrdersTotals = {
    orders: 791,
    qty: 1816,
    value: "5,054,080",
};

export const returnPercentageData = [
    { courier: "CallCourierN", return: 7554, percentage: "7.5%" },
    { courier: "FastEx", return: 1734, percentage: "15.8%" },
    { courier: "LCS", return: 2533, percentage: "14.4%" },
    { courier: "SWYFT", return: 7071, percentage: "15.5%" },
    { courier: "TCS", return: 5307, percentage: "4.9%" },
    { courier: "TPL", return: 5069, percentage: "17.3%" }
];

export const returnPercentageTotal = {
    return: returnPercentageData.reduce((sum, row) => sum + row.return, 0),
    percentage: "9.4%",
};
export const fulfillmentData = [
    { warehouse: "E Store", lastDay: "47%", last7Days: "51%", mtd: "70%", lastMonth: "67%", ytd: "71%" },
    { warehouse: "Estore 2", lastDay: "0%", last7Days: "3%", mtd: "16%", lastMonth: "23%", ytd: "13%" },
    { warehouse: "E-Store 3", lastDay: "1%", last7Days: "0%", mtd: "3%", lastMonth: "6%", ytd: "2%" },
    { warehouse: "E-Store 4", lastDay: "11%", last7Days: "4%", mtd: "9%", lastMonth: "14%", ytd: "11%" },
    { warehouse: "Faisalabad Store", lastDay: "9%", last7Days: "6%", mtd: "0%", lastMonth: "1%", ytd: "5%" },
    // Add more warehouse data...
];

export const totalsData = {
    lastDay: "25%",
    last7Days: "31%",
    mtd: "46%",
    lastMonth: "47%",
    ytd: "40%"
};

export const courierdata = [
    { courierName: "CallCourierN", lastDay: "100%", last7Days: "36%", mtd: "32%", lastMonth: "29%", ytd: "35%" },
    { courierName: "FastEx", lastDay: "0%", last7Days: "0%", mtd: "3%", lastMonth: "5%", ytd: "6%" },
    { courierName: "LCS", lastDay: "5%", last7Days: "9%", mtd: "5%", lastMonth: "7%", ytd: "7%" },
    { courierName: "M&P", lastDay: "3%", last7Days: "1%", mtd: "5%", lastMonth: "5%", ytd: "0%" },
    { courierName: "SWYFT", lastDay: "3%", last7Days: "14%", mtd: "23%", lastMonth: "18%", ytd: "0%" },
    { courierName: "TCS", lastDay: "53%", last7Days: "36%", mtd: "22%", lastMonth: "23%", ytd: "19%" },
    { courierName: "TPL", lastDay: "8%", last7Days: "3%", mtd: "9%", lastMonth: "16%", ytd: "10%" },
];

export const Couriertotals = {
    lastDay: "25%",
    last7Days: "31%",
    mtd: "46%",
    lastMonth: "47%",
    ytd: "40%"
};




