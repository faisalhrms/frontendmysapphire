import React, { useEffect, useState } from "react";
import DiscountForm from "../components/DiscountForm";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import { useSelector } from "react-redux";
import fetchDiscountData from "../../services/discount-card/DiscountCard";

import Notify from "@helpers/toastNotifications.js";

const DiscountCard = () => {
  const [selectedOption, setSelectedOption] = useState("email");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const user = useSelector((state) => state.auth.user);

  const handleFetchData = async (email = "", cardNo = "") => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      if (!email && !cardNo) {
        setErrorMessage("Both email and card number cannot be empty.");
        setIsLoading(false);
        return;
      }

      const data = await fetchDiscountData(email, cardNo);

      if (!data?.card_no) {
        setErrorMessage("No card found for this user.");
        setFilteredData(null);
      } else {
        setFilteredData(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Notify.error("An error occurred while fetching data.");
      setErrorMessage("Failed to fetch data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      handleFetchData(user.email);
    }
  }, [user?.email]);

  const handleSearch = () => {
    if (selectedOption === "email") {
      handleFetchData(searchQuery, "");
    } else if (selectedOption === "card_no") {
      handleFetchData("", searchQuery);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      <PageHeader
        currentpage="Detail Discount Card"
        activepage="Discount Card"
        mainpage="Discount Card"
      />
      <DiscountForm
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleKeyDown={handleKeyDown}
        isLoading={isLoading}
        handleSearch={handleSearch}
        filteredData={filteredData}
        data={filteredData?.data}
        errorMessage={errorMessage}
      />
    </>
  );
};

export default DiscountCard;
