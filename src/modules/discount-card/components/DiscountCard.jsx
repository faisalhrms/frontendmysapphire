import React, { useState, useEffect } from "react";
import Logo from "../../../assets/images/company-logos/sapphire.png";

const DiscountCard = () => {
  const [selectedOption, setSelectedOption] = useState("card");
  const [discountData, setDiscountData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(null);

  useEffect(() => {
    const fetchDiscountData = async () => {
      try {
        const data = {
          data: [
            {
              Name: "Kashif Hussain",
              Account_Number: "SRL12032522124",
              Customer_Group: "CG008",
              Remaining_Quantity: 0.0,
              Remaining_Value: 8750.0,
              Remaining_Value_x4: 35000,
              Card_No: "SRL-2024-246-81002897",
              Email: "kashif.hussain@example.com",
              Total_Value: 35000,
              Total_Value_x4: 35000,
              Limit_Type: "Monthly",
              Blocked: "No",
            },
            {
              Name: "Ali Ahmed",
              Account_Number: "SRL12032522125",
              Customer_Group: "CG009",
              Remaining_Quantity: 0.0,
              Remaining_Value: 15000.0,
              Remaining_Value_x4: 60000,
              Card_No: "SRL-2024-246-81002999",
              Email: "ali.ahmed@example.com",
              Total_Value: 60000,
              Total_Value_x4: 60000,
              Limit_Type: "Yearly",
              Blocked: "No",
            },
          ],
        };

        setDiscountData(data.data);
        setFilteredData(data.data[0]);
      } catch (error) {
        console.error("Failed to fetch discount data:", error);
      }
    };

    fetchDiscountData();
  }, []);

  const handleSelect = (option) => {
    setSelectedOption(option);
  };

  const handleSearch = () => {
    const query = searchQuery.toLowerCase();

    const filtered = discountData.find(
      (item) =>
        item.Email.toLowerCase().includes(query) ||
        item.Card_No.toLowerCase().includes(query)
    );

    setFilteredData(filtered || discountData[0]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const data = filteredData
    ? [
        {
          title: "Total Balance",
          value: `PKR ${filteredData.Total_Value || "0.00"}`,
        },
        {
          title: "Remaining Balance",
          value: `PKR ${filteredData.Remaining_Value || "0.00"}`,
        },
        { title: "Discount Price", value: filteredData.Limit_Type || "N/A" },
        {
          title: "Max Limit",
          value: `PKR ${filteredData.Remaining_Value_x4 || "0.00"}`,
        },
      ]
    : [];

  return (
    <div className="col-span-12 xl:col-span-6 mt-10">
      <div className="box">
        <div className="box-body">
          <div className="flex justify-between items-center space-x-4">
            <select
              className="w-1/3 px-2 py-2 rounded-md form-control"
              value={selectedOption}
              onChange={(e) => handleSelect(e.target.value)}
            >
              <option value="email">Email</option>
              <option value="card_no">Card Number</option>
            </select>
            <input
              type="text"
              placeholder="Search by Email or Card Number"
              className="w-1/3 px-4 py-2 form-control me-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown} 
            />
          </div>

          {/* Discount Card UI */}
        </div>
      </div>
      <div className="flex flex-col items-center space-y-6 mt-20 mb-20 rounded-3xl">
        <div className="text-black p-6 rounded-3xl shadow-2xl max-w-3xl w-full border bg-white">
          <div className="flex flex-col items-center mb-4">
            <img src={Logo} alt="Sapphire Logo" className="h-7 w-40 mb-4" />
            <h4 className="text-2xl font-semibold mb-2">
              {filteredData?.Name || "N/A"}
            </h4>
            <h6 className="text-sm opacity-80">
              Card No. {filteredData?.Card_No || "N/A"}
            </h6>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            {data.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center border border-black rounded-lg p-4 bg-white"
              >
                <div className="flex justify-between w-full">
                  <h5 className="text-lg font-semibold text-black">
                    {item.title}:
                  </h5>
                  <h5 className="text-lg font-semibold text-black">
                    {item.value}
                  </h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountCard;
