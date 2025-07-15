import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import ProfileCard from "@modules/employee-self-services/my-digital-profile/components/ProfileCard.jsx";
import Notify from "@helpers/toastNotifications.js";
import {fetchProfileData} from "@modules/employee-self-services/services/my-digital-profile/myDigitalProfile.js";
import { User } from "lucide-react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";

const DigitalProfile = () => {
    const user = useSelector((state) => state.auth.user);
    const [selectedOption, setSelectedOption] = useState("email");
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleFetchData = async (email = "") => {
        setIsLoading(true);
        setFilteredData(null);
        setErrorMessage("");

        try {
            if (selectedOption === "email" && !email) {
                setErrorMessage("Email is required for the search.");
                setIsLoading(false);
                return;
            }

            const data = await fetchProfileData(email);
            if (!data) {
                setErrorMessage("Your Digital Profile is not available.");
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

    return (
        <>
            <IconPageHeader
                heading="My Digital Profile"
                description="Your professional profile with contact details and a QR code for easy sharing."
                icon={User}
            />
            <ProfileCard
                isLoading={isLoading}
                errorMessage={errorMessage}
                filteredData={filteredData}

            />
        </>
    );
};

export default DigitalProfile;
