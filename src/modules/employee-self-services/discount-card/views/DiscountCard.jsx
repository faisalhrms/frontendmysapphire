import React, { useEffect, useMemo, useState } from "react";
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
  const adminEmail = ["sana.asghar@srl.com.pk", "rehab.zafar@srl.com.pk"];
  const isUserAdmin = adminEmail?.includes(user.email);

  const handleFetchData = async (email, cardNo, load) => {
    if (load && isUserAdmin) {
      setIsLoading(true);
      const data = await fetchDiscountData(email, cardNo);
      console.log(data);
      setFilteredData(data);
    } else {
      const data = await fetchDiscountData(email, cardNo);
      setFilteredData(data);
    }
    setIsLoading(false);
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
    } catch (error) {}
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
        isUserAdmin={isUserAdmin}
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
