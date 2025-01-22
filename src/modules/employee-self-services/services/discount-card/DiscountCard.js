
// import api from "@config/axiosConfig.js";

// const fetchDiscountData = async (email = "", cardNo = "") => {
//   try {
//     const response = await api.post("dc/remaining-balance/", {
//       email,
//       card_no: cardNo,
//     });
//     const filteredData = response?.data?.data || null;

//     return filteredData
//         ? {
//           name: filteredData?.name || "N/A",
//           card_no: filteredData?.card_no || "",
//           data: [
//             {
//               title: "Allowed Balance",
//               value: `PKR ${filteredData?.allowed_balance || "0.00"}`,
//             },
//             {
//               title: "Remaining Balance",
//               value: `PKR ${filteredData?.remaining_balance || "0.00"}`,
//             },
//             {
//               title: "Discount Percentage",
//               value: `${filteredData?.discount_percentage || "N/A"}%`,
//             },
//             {
//               title: "Limit Type",
//               value: `${filteredData?.limit_type || "N/A"}`,
//             },
//           ],
//         }
//         : null;
//   } catch (error) {
//     console.error("Error fetching discount data:", error);
//     return null;
//   }
// };

// export default fetchDiscountData;
import api from "@config/axiosConfig.js";

const formatAmount = (amount) => {
  return new Intl.NumberFormat('en-US').format(amount);
};

const fetchDiscountData = async (email = "", cardNo = "") => {
  try {
    const response = await api.post("dc/remaining-balance/", {
      email,
      card_no: cardNo,
    });
    const filteredData = response?.data?.data || null;

    return filteredData
        ? {
          name: filteredData?.name || "N/A",
          card_no: filteredData?.card_no || "",
          data: [
            {
              title: "Allowed Balance",
              value: `PKR ${formatAmount(filteredData?.allowed_balance || "0.00")}`,
            },
            {
              title: "Remaining Balance",
              value: `PKR ${formatAmount(filteredData?.remaining_balance || "0.00")}`,
            },
            {
              title: "Discount Percentage",
              value: `${filteredData?.discount_percentage || "N/A"}%`,
            },
            {
              title: "Limit Type",
              value: `${filteredData?.limit_type || "N/A"}`,
            },
          ],
        }
        : null;
  } catch (error) {
    console.error("Error fetching discount data:", error);
    return null;
  }
};

export default fetchDiscountData;
