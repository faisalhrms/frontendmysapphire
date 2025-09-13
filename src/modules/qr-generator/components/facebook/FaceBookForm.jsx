// import { Facebook } from "lucide-react";
// import { useNavigate } from "react-router-dom";
//
// const FacebookForm = ({
//                           facebookLink,
//                           setFacebookLink,
//                           qrName,
//                           setQrName,
//                           category,
//                           setCategory,
//                       }) => {
//     const categories = ["Business", "Education", "Personal", "Other"];
//     const navigate = useNavigate();
//
//     const handleCustomize = () => {
//         if (facebookLink.trim()) {
//
//             navigate("/module/qr/qr-customize", {
//                 state: { facebookLink, qrName, category },
//             });
//         }
//     };
//
//     return (
//         <div className="space-y-4 p-6 border rounded-xl bg-white shadow-sm w-full">
//
//             <div className="relative flex items-center">
//                 <Facebook className="absolute left-3 text-secondary  bg-blue h-5 w-5" />
//                 <input
//                     type="url"
//                     placeholder="Facebook Link"
//                     value={facebookLink}
//                     onChange={(e) => setFacebookLink(e.target.value)}
//                     className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
//                 />
//             </div>
//
//
//             <input
//                 type="text"
//                 placeholder="Name your QR (optional)"
//                 value={qrName}
//                 onChange={(e) => setQrName(e.target.value)}
//                 className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
//             />
//
//
//
//
//             <div className="flex gap-4 items-center">
//                 <button
//                     disabled={!facebookLink.trim()}
//                     onClick={handleCustomize}
//                     className={`py-3 px-6 rounded-lg font-semibold flex justify-between items-center bg-gray-300 text-gray-500 cursor-not-allowed ${
//                         facebookLink.trim()
//                             ? "bg-primary text-white hover:bg-primary/80"
//                             : "bg-gray-200 text-gray-500 cursor-not-allowed"
//                     }`}
//                 >
//                     Customize & Download QR
//                 </button>
//             </div>
//         </div>
//     );
// };
//
// export default FacebookForm;
import { useState } from "react";
import { Facebook, ChevronDown, HelpCircle } from "lucide-react";
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
        // Basic URL validation with Facebook-specific check
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
        <div className="space-y-4 p-6 border rounded-xl bg-white shadow-sm w-full">
            {/* Facebook Link Input */}
            <div className="relative flex items-center">
                <Facebook className="absolute left-3 text-blue h-5 w-5" />
                <input
                    type="url"
                    placeholder="Facebook Link"
                    value={facebookLink}
                    onChange={(e) => {
                        setFacebookLink(e.target.value);
                        setError("");
                    }}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                        error ? "border-red-500" : "border-gray-300"
                    }`}
                />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Name your QR */}
            <input
                type="text"
                placeholder="Name your QR (optional)"
                value={qrName}
                onChange={(e) => setQrName(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex gap-4 items-center">
                <button
                    disabled={!facebookLink.trim() || error}
                    onClick={handleCustomize}
                    className={`py-3 px-6 rounded-lg font-semibold flex justify-between items-center ${
                        facebookLink.trim() && !error
                            ? "bg-primary text-white hover:bg-primary/80"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                >
                    Customize & Download QR
                </button>
            </div>
        </div>
    );
};

export default FacebookForm;