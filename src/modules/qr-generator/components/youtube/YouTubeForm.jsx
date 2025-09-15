import { useState } from "react";
import { useNavigate } from "react-router-dom";

const YouTubeForm = () => {
    const [youtubeLink, setYoutubeLink] = useState("");
    const [qrName, setQrName] = useState("");
    const [category, setCategory] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const categories = ["Business", "Education", "Personal", "Other"];

    const validateYouTubeLink = (link) => {
        const urlPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
        return urlPattern.test(link);
    };

    const handleCustomize = () => {
        if (!youtubeLink.trim()) {
            setError("Please enter a YouTube link.");
            return;
        }
        if (!validateYouTubeLink(youtubeLink)) {
            setError("Please enter a valid YouTube link.");
            return;
        }
        setError("");
        navigate("/module/qr/qr-customize", {
            state: { youtubeLink, qrName, category },
        });
    };

    return (
  <>

            <div className="relative">
                <div
                    className={`flex items-center gap-3 p-4 border rounded-lg bg-white transition-colors  dark:text-gray-200 dark:bg-bodybg  ${
                        error ? "border-red-500" : "border-gray-300 hover:border-gray-400"
                    }`}
                >

                    <img
                        src="https://me-qr.com/build/images/youTubeLogotype.a0ebc6ae.svg"
                        alt="YouTube"
                        className="h-5 w-5 flex-shrink-0"
                    />
                    <input
                        type="url"
                        placeholder="YouTube Link"
                        value={youtubeLink}
                        onChange={(e) => {
                            setYoutubeLink(e.target.value);
                            setError("");
                        }}
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-gray-200 dark:bg-bodybg  ${
                            error ? "border-danger" : "border-gray-300"
                        }`}                    />
                </div>
                {error && <p className="text-danger text-sm ">{error}</p>}
            </div>

            <div className="relative">
                <div className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg bg-white hover:border-gray-400 transition-colors dark:text-gray-200 dark:bg-bodybg ">
                    <input
                        type="text"
                        placeholder="Name your QR"
                        value={qrName}
                        onChange={(e) => setQrName(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary border-gray-300 dark:text-gray-200 dark:bg-bodybg "
                    />
                </div>
            </div>

            <div className="flex gap-4 items-center ">
                <button
                    disabled={!youtubeLink.trim()}
                    onClick={handleCustomize}
                    className={`py-3 px-6 rounded-lg font-semibold flex justify-between items-center bg-gray-200 text-gray-500 cursor-not-allowed  ${
                        youtubeLink.trim() && !error
                            ? "bg-primary text-white hover:bg-primary/80"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                >
                    Customize & Download QR
                </button>
            </div>
  </>

    );
};

export default YouTubeForm;
