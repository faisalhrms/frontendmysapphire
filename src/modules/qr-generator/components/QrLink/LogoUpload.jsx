import { CheckCircle, X } from "lucide-react";
import sapphireb from "@assets/images/company-logos/sapphireb.png";
import sapphireTextile from "@assets/images/company-logos/sapphireTextile.png";

const LogoUpload = ({
                        logos = [],
                        selectedLogo,
                        onSelectLogo,
                        logoText,
                        onLogoTextChange,
                        logoWidth,
                        onLogoWidthChange,
                        logoHeight,
                        onLogoHeightChange,
                        logoBackground,
                        onLogoBackgroundChange,
                    }) => {
    const logoUrls = [
        sapphireTextile,
        sapphireb,
        "https://me-qr.com/build/images/youTubeLogotype.a0ebc6ae.svg",
        "https://me-qr.com/build/images/faceBookLogotype.dbceffdc.svg",
        "https://me-qr.com/build/images/whatsAppLogotype.a6873f12.svg",
        "https://me-qr.com/build/images/linkedInLogotype.9958ad96.svg",
        "https://me-qr.com/build/images/instagramLogotype.354ba142.svg",
    ];

    const handleUrlInput = (e) => {
        const url = e.target.value.trim();
        if (url && !logos.includes(url)) {
            onSelectLogo(url);
        }
    };

    const sizeOptions = [20, 25, 30, 35, 40, 50,80];

    return (
        <div className="flex items-center justify-center bg-gray-100">
            <div className="bg-white rounded-3xl shadow-xl p-8 max-w-4xl w-full dark:text-gray-200 dark:bg-bodybg">
                <h3 className="text-xl font-bold text-gray-800 mb-4 dark:text-gray-200 dark:bg-bodybg">
                    Logo & Text
                </h3>

                <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div
                        className={`relative flex items-center justify-center w-20 h-20 p-2 rounded-lg border transition-all duration-150 hover:border-primary ${
                            !selectedLogo ? "border-primary ring-2 ring-primary bg-gray-100" : "border-gray-200"
                        }`}
                        onClick={() => onSelectLogo(null)}
                    >
                        <X className="w-8 h-8 text-gray-400" />
                        {!selectedLogo && (
                            <CheckCircle className="absolute top-1 right-1 text-purple-500 w-4 h-4" />
                        )}
                    </div>

                    {logoUrls.map((logo, idx) => (
                        <div
                            key={idx}
                            className={`relative border rounded-lg cursor-pointer p-1 w-20 h-20 flex items-center justify-center transition-all duration-150 hover:border-primary ${
                                selectedLogo === logo ? "border-primary ring-2 ring-primary" : "border-gray-200"
                            }`}
                            onClick={() => onSelectLogo(logo)}
                        >
                            <img
                                src={logo}
                                alt={`Logo ${idx + 1}`}
                                className={`object-contain ${
                                    logo === sapphireb ? "w-24 h-24" : "w-20 h-20"
                                }`}
                            />
                            {selectedLogo === logo && (
                                <CheckCircle className="absolute top-1 right-1 text-purple-500 w-4 h-4" />
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-4">
                    <label className="text-[0.875rem] mb-1 font-semibold">
                        Logo Name (inside QR):
                    </label>
                    <input
                        type="text"
                        value={logoText}
                        onChange={(e) => onLogoTextChange(e.target.value)}
                        placeholder="Enter name to show with logo"
                        className="w-full p-2 border border-gray-300 rounded-lg dark:text-gray-200 dark:bg-bodybg"
                    />
                </div>

                {selectedLogo && (
                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                Logo Width:
                            </label>
                            <select
                                value={logoWidth}
                                onChange={(e) => onLogoWidthChange(Number(e.target.value))}
                                className=" w-20 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:text-gray-200 dark:bg-bodybg"
                            >
                                {sizeOptions.map((size) => (
                                    <option key={size} value={size}>
                                        {size}%
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center space-x-2">
                            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                Logo Height:
                            </label>
                            <select
                                value={logoHeight}
                                onChange={(e) => onLogoHeightChange(Number(e.target.value))}
                                className="p-2 w-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:text-gray-200 dark:bg-bodybg"
                            >
                                {sizeOptions.map((size) => (
                                    <option key={size} value={size}>
                                        {size}%
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center space-x-2">
                            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                Logo Background
                            </label>
                            <input
                                type="checkbox"
                                className="toggle toggle-primary"
                                checked={logoBackground}
                                onChange={(e) => onLogoBackgroundChange(e.target.checked)}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LogoUpload;