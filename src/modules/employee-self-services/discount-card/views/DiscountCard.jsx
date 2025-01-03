import React, { useEffect, useState } from "react";
import DiscountForm from "../components/DiscountForm";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import { useSelector } from "react-redux";
import fetchDiscountData from "../../services/discount-card/DiscountCard";

const DiscountCard = () => {
  const [selectedOption, setSelectedOption] = useState("email");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const user = useSelector((state) => state.auth.user);

  const handleFetchData = async (email, cardNo, load) => {
    if (load) {
      setIsLoading(true);
      const data = await fetchDiscountData(email, cardNo);
      console.log(data);
      setFilteredData(data);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user.email) handleFetchData(user.email, "");
  }, [user.email]);

  const handleSearch = () => {
    try {
      if (selectedOption === "email") {
        handleFetchData(searchQuery, "", true);
      } else if (selectedOption === "card_no") {
        handleFetchData("", searchQuery, true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <>
      <PageHeader
        currentpage={`Detail Discount Card`}
        activepage="Discount Card"
        mainpage="Discount Card"
      />

      <DiscountForm
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        searchQuery={searchQuery}
        handleKeyDown={handleKeyDown}
        isLoading={isLoading}
        handleSearch={handleSearch}
        setSearchQuery={setSearchQuery}
        filteredData={filteredData}
        data={filteredData?.data}
      />
    </>
  );
};

export default DiscountCard;
