

import React from "react";
import Logo from "../../../../assets/images/company-logos/sapphire.png";
import FormButton from "../../../../components/form/FormButton";
import HasPermission from "@components/HasPermission.jsx";
import LoadingSpinner from "../../../../components/LoadingSpinner.jsx";

const DiscountForm = ({
  selectedOption,
  setSelectedOption,
  searchQuery,
  setSearchQuery,
  handleKeyDown,
  isLoading,
  handleSearch,
  filteredData,
  data,
  errorMessage
}) => {
  return (
    <div className="col-span-12 xl:col-span-6">
      <HasPermission permission="discount_card_management">
        <div className="box">
          <div className="box-body">
            <div className="flex flex-wrap justify-between items-center">
              <select
                className="w-full md:w-1/2 px-4 py-2 rounded-md form-control"
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                <option value="card_no">Card Number</option>
                <option value="email">Email</option>
              </select>

              <input
                type="text"
                placeholder={`Search by ${
                  selectedOption === "email" ? "Email" : "Card Number"
                }`}
                className="w-full md:w-1/3 px-4 py-2 form-control"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />

              <FormButton
                isLoading={isLoading}
                text="Search"
                className="w-full md:w-auto px-4 py-2 bg-primary text-white rounded-md"
                onClick={handleSearch}
              />
            </div>
          </div>
        </div>
      </HasPermission>

      <div className="flex flex-col items-center space-y-6 mt-10 mb-10 rounded-3xl">
        <div className="text-black p-6 rounded-3xl shadow-2xl max-w-full md:max-w-3xl w-full border bg-white">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="flex flex-col items-center mb-4">
                <img src={Logo} alt="Sapphire Logo" className="h-7 w-40 mb-4" />
                <h4 className="text-xl md:text-2xl font-semibold mb-2">
                  {filteredData?.name || "N/A"}
                </h4>
                <h6 className="text-sm opacity-80">
                  {selectedOption === "email"
                    ? `Email: ${filteredData?.email || "N/A"}`
                    : `Card No: ${filteredData?.card_no || "N/A"}`}
                </h6>
                {!filteredData && !errorMessage && (
                  <p className="text-red-500 mt-2">Data not available</p>
                )}
                {errorMessage && (
                  <p className="text-red-500 mt-2">{errorMessage}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {data?.map(({ title, value }, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center border rounded-lg p-4 bg-white"
                  >
                    <div className="flex justify-between w-full">
                      <h5 className="text-lg font-semibold">{title}:</h5>
                      <h5 className="text-lg font-semibold">{value}</h5>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscountForm;
