import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FacebookForm = ({
                          facebookLink,
                          setFacebookLink,
                          qrName,
                          setQrName,
                          category,
                          setCategory,
                      }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [error, setError] = useState("");
    const categories = ["Business", "Education", "Personal", "Other"];
    const navigate = useNavigate();

    const validateFacebookLink = (link) => {
        const urlPattern = /^(https?:\/\/)?(www\.)?(facebook\.com|fb\.com|fb\.me)\/.+$/;
        return urlPattern.test(link);
    };

    const handleCustomize = () => {
        if (!facebookLink.trim()) {
            setError("Please enter a Facebook link.");
            return;
        }
        if (!validateFacebookLink(facebookLink)) {
            setError("Please enter a valid Facebook link.");
            return;
        }
        setError("");
        navigate("/module/qr/qr-customize", {
            state: { facebookLink, qrName, category },
        });
    };

    return (
       <>
            <div className="relative">
                <div
                    className={`flex items-center gap-3 p-4 border rounded-lg bg-white transition-colors  mb-4 dark:text-gray-200 dark:bg-bodybg  ${
                        error ? "border-red-500" : "border-gray-300 hover:border-gray-400"
                    }`}
                >
                    <img
                        src="https://me-qr.com/build/images/faceBookLogotype.dbceffdc.svg"
                        alt="Facebook"
                        className="h-5 w-5 flex-shrink-0"
                    />
                    <input
                        type="url"
                        placeholder="Facebook Link"
                        value={facebookLink}
                        onChange={(e) => {
                            setFacebookLink(e.target.value);
                            setError("");
                        }}
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-gray-200 dark:bg-bodybg  ${
                            error ? "border-danger" : "border-gray-300"
                        }`}
                    />
                </div>
                {error && <p className="text-danger text-sm">{error}</p>}

                <div className="relative">
                    <div className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg bg-white hover:border-gray-400 transition-colors dark:text-gray-200 dark:bg-bodybg ">
                        <input
                            type="text"
                            placeholder="Name your QR "
                            value={qrName}
                            onChange={(e) => setQrName(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary border-gray-300 dark:text-gray-200 dark:bg-bodybg "
                        />
                    </div>
                </div>

                <div className="flex gap-4 items-center pt-4">
                    <button
                        disabled={!facebookLink.trim() || error}
                        onClick={handleCustomize}
                        className={`py-3 px-6 rounded-lg font-semibold flex justify-between items-center   ${
                            facebookLink.trim() && !error
                                ? 'bg-primary text-white hover:bg-primary'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        Customize & Download QR
                    </button>
                </div>
            </div>
       </>
    );
};

export default FacebookForm;
