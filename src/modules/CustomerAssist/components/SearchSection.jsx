import React, { useState } from "react";

const SearchSection = ({ onSearch }) => {
    const [caseNumber, setCaseNumber] = useState("");
    const [phone, setPhone] = useState("");

    const handleSearch = () => {
        if (caseNumber.trim()) {
            onSearch("case_number", caseNumber);
        } else if (phone.trim()) {
            onSearch("phone", phone);
        } else {
            alert("Please enter Case Number or Phone Number to search");
        }
    };

    return (
        <div className="flex justify-center p-4">
            <div className="grid grid-cols-12 items-center w-full max-w-3xl">
                <div className="col-span-12">
                    <div className="inline-flex w-full companies-search-input">
                        <input
                            type="text"
                            className="form-control !rounded-e-none !border-e-0"
                            placeholder="Case Number"
                            value={caseNumber}
                            onChange={(e) => setCaseNumber(e.target.value)}
                        />

                        <input
                            type="text"
                            className="form-control !rounded-none !border-s-0"
                            placeholder="Phone Number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />

                        <button
                            type="button"
                            className="ti-btn !mb-0 ti-btn-primary-full !rounded-s-none"
                            onClick={handleSearch}
                        >
                            <i className="ri-search-line"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchSection;
