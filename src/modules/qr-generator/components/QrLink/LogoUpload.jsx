import { CheckCircle, X } from "lucide-react";

const LogoUpload = ({
                        logos = [],
                        selectedLogo,
                        logoSize = 100,
                        onSelectLogo,
                        onLogoSizeChange,
                        logoBackground,
                        onLogoBackgroundChange,
                        logoText,
                        onLogoTextChange
                    }) => {
    const logoUrls = [
        "https://be.mysapphire.co/media/uploads/2025/01/10/stm_logo.png",
        "https://be.mysapphire.co/media/uploads/2025/01/10/srl_logo.jpg",
        "https://me-qr.com/build/images/youTubeLogotype.a0ebc6ae.svg",
        "https://me-qr.com/build/images/faceBookLogotype.dbceffdc.svg",
        "https://me-qr.com/build/images/whatsAppLogotype.a6873f12.svg",
        "https://me-qr.com/build/images/linkedInLogotype.9958ad96.svg",
        "https://me-qr.com/build/images/instagramLogotype.354ba142.svg"
    ];

    const handleUrlInput = (e) => {
        const url = e.target.value.trim();
        if (url && !logos.includes(url)) {
            onSelectLogo(url);
        }
    };

    return (
        <div className="flex items-center justify-center bg-gray-100">
            <div className="bg-white rounded-3xl shadow-xl p-8 max-w-4xl w-full dark:text-gray-200 dark:bg-bodybg">
                <h3 className="text-xl font-bold text-gray-800 mb-4 dark:text-gray-200 dark:bg-bodybg">Logo & Text</h3>

                {/* Logos Row */}
                <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div
                        className={`relative border rounded-lg cursor-pointer p-1 flex items-center justify-center w-20 h-20 ${
                            !selectedLogo ? "border-primary" : "border-gray-200"
                        }`}
                        onClick={() => onSelectLogo(null)}
                    >
                        <X className="w-8 h-8 text-gray-400"/>
                    </div>

                    {logoUrls.map((logo, idx) => (
                        <div
                            key={idx}
                            className={`relative border rounded-lg cursor-pointer p-1 w-20 h-20 flex items-center justify-center ${
                                selectedLogo === logo ? "border-primary" : "border-gray-200"
                            }`}
                            onClick={() => onSelectLogo(logo)}
                        >
                            <img
                                src={logo}
                                alt={`Logo ${idx + 1}`}
                                className="w-10 h-10 object-contain"
                            />
                            {selectedLogo === logo && (
                                <CheckCircle className="absolute top-1 right-1 text-purple-500 w-4 h-4"/>
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
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                </div>

                {/* Logo Size & Background */}
                {selectedLogo && (
                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center">
                            <label className="text-sm font-medium text-gray-700 mr-2">
                                Logo Size: {logoSize}%
                            </label>
                            <input
                                type="range"
                                min="20"
                                max="200"
                                step="1"
                                value={logoSize}
                                onChange={(e) => onLogoSizeChange(Number(e.target.value))}
                                className="w-32 accent-primary"
                            />
                        </div>
                        <div className="flex items-center">
                            <label className="text-sm font-medium text-gray-700 mr-2">
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
