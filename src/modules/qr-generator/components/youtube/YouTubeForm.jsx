import { useState } from "react";
import { Youtube, HelpCircle, ChevronDown } from "lucide-react";
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
        // Basic URL validation with YouTube-specific check
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
        <div className="space-y-6 p-8 bg-white">
            {/* YouTube Link Input */}
            <div className="relative">
                <div
                    className={`flex items-center gap-3 p-4 border rounded-lg bg-white transition-colors ${
                        error ? "border-red-500" : "border-gray-300 hover:border-gray-400"
                    }`}
                >
                    <Youtube className="text-red h-5 w-5 flex-shrink-0" />
                    <input
                        type="url"
                        placeholder="YouTube Link"
                        value={youtubeLink}
                        onChange={(e) => {
                            setYoutubeLink(e.target.value);
                            setError("");
                        }}
                        className="flex-1 text-gray-600 placeholder-gray-400 bg-transparent outline-none text-sm"
                    />
                </div>
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

            {/* Name your QR */}
            <div className="relative">
                <div className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg bg-white hover:border-gray-400 transition-colors">
                    <input
                        type="text"
                        placeholder="Name your QR (optional)"
                        value={qrName}
                        onChange={(e) => setQrName(e.target.value)}
                        className="flex-1 text-gray-600 placeholder-gray-400 bg-transparent outline-none text-sm"
                    />
                </div>
            </div>

            {/* Category Dropdown */}


            {/* Buttons */}
            <div className="flex gap-4 items-center pt-4">
                <button
                    disabled={!youtubeLink.trim()}
                    onClick={handleCustomize}
                    className={`py-3 px-6 rounded-lg font-semibold flex justify-between items-center ${
                        youtubeLink.trim() && !error
                            ? "bg-primary text-white cursor-pointer"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                >
                    Customize & Download QR
                </button>
            </div>
        </div>
    );
};

export default YouTubeForm;