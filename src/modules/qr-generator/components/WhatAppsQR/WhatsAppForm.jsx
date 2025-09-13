import React, { useState } from "react";
import { HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const countries = [
    { code: "+92", name: "Pakistan", flag: "https://flagcdn.com/w20/pk.png" },
    { code: "+1", name: "USA", flag: "https://flagcdn.com/w20/us.png" },
    { code: "+91", name: "India", flag: "https://flagcdn.com/w20/in.png" },
    { code: "+44", name: "UK", flag: "https://flagcdn.com/w20/gb.png" },
];

const WhatsAppForm = () => {
    const navigate = useNavigate();
    const [selectedCountry, setSelectedCountry] = useState(countries[0]);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [message, setMessage] = useState("");
    const [qrName, setQrName] = useState("");
    const [error, setError] = useState("");

    const validatePhoneNumber = (number) => {

        const cleanNumber = number.replace(/\D/g, "");
        return cleanNumber.length >= 7; // Minimum length for a valid phone number
    };

    const constructWhatsAppLink = () => {
        const cleanNumber = phoneNumber.replace(/\D/g, "");
        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/${selectedCountry.code}${cleanNumber}${message ? `?text=${encodedMessage}` : ""}`;
    };

    const handleCustomizeClick = () => {
        if (!phoneNumber.trim()) {
            setError("Please enter a phone number.");
            return;
        }
        if (!validatePhoneNumber(phoneNumber)) {
            setError("Please enter a valid phone number (at least 7 digits).");
            return;
        }
        setError("");
        navigate("/module/qr/qr-customize", {
            state: {
                country: selectedCountry,
                phoneNumber,
                message,
                qrName,
                whatsappLink: constructWhatsAppLink(),
            },
        });
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm">
            {/* Phone Number Field with Country Code */}
            <div className="mb-4">
                <div
                    className={`relative flex items-center border rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent ${
                        error ? "border-red-500" : "border-gray-300"
                    }`}
                >
                    {/* Country selector */}
                    <select
                        value={selectedCountry.code}
                        onChange={(e) =>
                            setSelectedCountry(countries.find((c) => c.code === e.target.value))
                        }
                        className="flex items-center pl-2 pr-6 py-3 border-r border-gray-300 bg-gray-50 text-gray-700 text-sm rounded-l-lg focus:outline-none"
                    >
                        {countries.map((country) => (
                            <option key={country.code} value={country.code}>
                                {country.code} {country.name}
                            </option>
                        ))}
                    </select>

                    {/* Phone Input */}
                    <input
                        type="tel"
                        placeholder="Phone number"
                        value={phoneNumber}
                        onChange={(e) => {
                            setPhoneNumber(e.target.value);
                            setError("");
                        }}
                        className="flex-1 px-4 py-3 text-gray-900 placeholder-gray-500 bg-transparent focus:outline-none"
                    />
                    <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <HelpCircle size={20} />
                    </button>
                </div>
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

            {/* Text Message Field with Counter */}
            <div className="mb-4">
                <div className="relative">
          <textarea
              placeholder="Text Message (optional)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              maxLength={5000}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
          />
                    <div className="absolute bottom-3 right-3 text-sm text-gray-400">
                        {message.length}/5000
                    </div>
                </div>
            </div>

            {/* QR Name Field */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Name your QR (optional)"
                    value={qrName}
                    onChange={(e) => setQrName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="flex gap-4">
                <button
                    onClick={handleCustomizeClick}
                    disabled={!phoneNumber.trim() || error}
                    className={`py-3 px-6 rounded-lg font-semibold flex justify-between items-center ${
                        phoneNumber.trim() && !error
                            ? "bg-primary text-white hover:bg-primary/80"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                    Customize & Download QR
                </button>
            </div>
        </div>
    );
};

export default WhatsAppForm;