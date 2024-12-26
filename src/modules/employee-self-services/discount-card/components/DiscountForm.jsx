import React from "react";
import Logo from "../../../../assets/images/company-logos/sapphire.png";
import FormButton from "../../../../components/form/FormButton";

const DiscountForm = ({
  isUserAdmin,
  selectedOption,
  searchQuery,
  handleKeyDown,
  isLoading,
  handleSearch,
  filteredData,
  data,
  setSelectedOption,
  setSearchQuery,
}) => {
  return (
    <div className="col-span-12 xl:col-span-6">
      <div className="box">
        {isUserAdmin && (
          <div className="box-body">
            <div className="flex justify-between items-center space-x-4">
              <select
                className="w-1/4 px-2 py-2 rounded-md form-control"
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                <option value="email">Email</option>
                <option value="card_no">Card Number</option>
              </select>
              <input
                type="text"
                placeholder={`Search by ${
                  selectedOption === "email" ? "Email" : "Card Number"
                }`}
                className="w-1/2 px-4 py-2 form-control"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <FormButton
                isLoading={isLoading}
                text="Search"
                className="px-4 py-2 bg-primary text-white rounded-md"
                onClick={handleSearch}
              />
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center space-y-6 mt-20 mb-20 rounded-3xl">
        <div className="text-black p-6 rounded-3xl shadow-2xl max-w-3xl w-full border bg-white ">
          <div className="flex flex-col items-center mb-4">
            <img src={Logo} alt="Sapphire Logo" className="h-7 w-40 mb-4" />
            <h4 className="text-2xl font-semibold mb-2">
              {filteredData?.name || "N/A"}
            </h4>
            <h6 className="text-sm opacity-80">
              Card No. {filteredData?.card_no || "N/A"}
            </h6>
            {!filteredData && (
              <p className="text-red-500 mt-2">User not available</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            {data?.map(({ title, value }, index) => (
              <div
                key={index}
                className="flex flex-col items-center border border-black rounded-lg p-4 bg-white"
              >
                <div className="flex justify-between w-full">
                  <h5 className="text-lg font-semibold text-black">{title}:</h5>
                  <h5 className="text-lg font-semibold text-black">{value}</h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountForm;
