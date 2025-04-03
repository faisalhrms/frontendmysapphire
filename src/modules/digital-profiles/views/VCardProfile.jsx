import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import Notify from "@helpers/toastNotifications";
import LoadingSpinner from "@components/LoadingSpinner";
import QRCode from "qrcode";

const VCardProfile = () => {
  const {id} = useParams();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFetchData = async (encodedEmail) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/digital_profiles/profile/${encodedEmail}/`, {
        method: "GET"
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server");
      }
      const jsonResponse = await response.json();
      const data = jsonResponse?.data || null;
      if (!data) {
        setErrorMessage("This user data is not available.");
      } else {
        setProfileData(data);
      }
    } catch (error) {
      Notify.error("Failed to fetch data. Please try again.");
      setErrorMessage("Failed to fetch data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddContact = () => {
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${profileData.name}
ORG:${profileData.department}
TITLE:${profileData.position}
TEL;TYPE=WORK,VOICE:${profileData.phone}
EMAIL;TYPE=WORK,INTERNET:${profileData.email}
ADR;TYPE=WORK:;;${profileData.address};;;; 
END:VCARD`;
    const blob = new Blob([vCardData], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${profileData.name}.vcf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${profileData.name} - Profile`,
        text: "Check out this profile!",
        url: window.location.href
      }).catch(() => {});
    }
  };

  const handleDownloadQR = () => {
    QRCode.toDataURL(window.location.href)
      .then((url) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = `qrcode_${profileData.name}.png`;
        link.click();
      })
      .catch(() => {});
  };

  const handleOpenDialer = () => {
    window.location.href = `tel:${profileData.phone}`;
  };

  const handleOpenEmail = () => {
    window.location.href = `mailto:${profileData.email}`;
  };

  useEffect(() => {
    if (id) {
      handleFetchData(id);
    }
  }, [id]);

  if (isLoading) {
    return <LoadingSpinner/>;
  }

  if (errorMessage) {
    return <div className="p-6 text-white bg-[#0B4F92] min-h-screen">{errorMessage}</div>;
  }

  if (!profileData) {
    return null;
  }

  return (
    <div className="bg-[#0B4F92] min-h-screen w-full flex flex-col text-white p-6">
      <div className="mt-10 text-4xl font-semibold">{profileData.name}</div>
      <div className="text-lg" style={{color: "#FBBF24"}}>{profileData.position}</div>
      <div className="text-xl font-bold mt-1" style={{color: "#FBBF24"}}>{profileData.department}</div>
      <div className="flex items-center space-x-6 mt-8">
        <div className="w-10 h-10 border border-white rounded-full flex items-center justify-center" onClick={handleOpenDialer}>
          <i className="ri-smartphone-line text-white text-lg"/>
        </div>
        <div className="w-10 h-10 border border-white rounded-full flex items-center justify-center" onClick={handleOpenEmail}>
          <i className="ri-mail-line text-white text-lg"/>
        </div>
        <div className="w-10 h-10 border border-white rounded-full flex items-center justify-center">
          <i className="ri-phone-line text-white text-lg"/>
        </div>
      </div>
      <div className="border-t border-dashed border-gray-200 my-6"/>
      <div className="text-lg font-semibold">Call Me</div>
      <div className="text-sm mb-4">{profileData.phone}</div>
      <div className="text-lg font-semibold">Email</div>
      <div className="text-sm mb-4">{profileData.email}</div>
      <div className="text-lg font-semibold">Address</div>
      <div className="text-sm mb-4">{profileData.address}</div>
      <div className="flex justify-evenly mt-auto">
        <div className="w-10 h-10 border border-white rounded-full flex items-center justify-center" onClick={handleDownloadQR}>
          <i className="ri-qr-code-line text-white text-lg"/>
        </div>
        <div className="w-10 h-10 border border-white rounded-full flex items-center justify-center" onClick={handleShare}>
          <i className="ri-share-forward-line text-white text-lg"/>
        </div>
        <button className="flex items-center space-x-2 border border-white rounded-full px-4 py-2" onClick={handleAddContact}>
          <span>Add to Contact</span>
          <i className="ri-add-line text-white text-lg"/>
        </button>
      </div>
    </div>
  );
};

export default VCardProfile;
