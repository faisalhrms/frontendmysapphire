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
    setFilteredData(null);
    setErrorMessage("");

    try {
      if (selectedOption === "email" && !email) {
        setErrorMessage("Email is required for the search.");
        setIsLoading(false);
        return;
      }
      if (selectedOption === "card_no" && !cardNo) {
        setErrorMessage("Card Number is required for the search.");
        setIsLoading(false);
        return;
      }

      const data = await fetchDiscountData(email, cardNo);
      if (!data || !data.card_no) {
        setErrorMessage("This user data is not available.");
      } else {
        setFilteredData(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Notify.error("Failed to fetch data. Please try again.");
      setErrorMessage("Failed to fetch data.");
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
            errorMessage={errorMessage}
        />
      </>
  );
};

export default DiscountCard;
