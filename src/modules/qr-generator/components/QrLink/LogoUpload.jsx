import { CheckCircle, X } from "lucide-react";

const LogoUpload = ({
                        logos = [],
                        selectedLogo,
                        logoSize = 50,
                        onSelectLogo,
                        onLogoSizeChange,
                        logoBackground,
                        onLogoBackgroundChange,
                        logoText,                 // ✅ logo name text
                        onLogoTextChange          // ✅ callback for name
                    }) => {
    const logoUrls = [
        "https://be.mysapphire.co/media/uploads/2025/01/10/stm_logo.png",
        "https://be.mysapphire.co/media/uploads/2025/01/10/srl_logo.jpg",
    ];

    const handleUrlInput = (e) => {
        const url = e.target.value.trim();
        if (url && !logos.includes(url)) {
            onSelectLogo(url);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Logo & Text</h3>

            {/* Logos Row */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
                <div
                    className={`relative border rounded-lg cursor-pointer p-1 flex items-center justify-center w-14 h-14 ${
                        !selectedLogo ? "border-purple-500" : "border-gray-200"
                    }`}
                    onClick={() => onSelectLogo(null)}
                >
                    <X className="w-8 h-8 text-gray-400" />
                </div>

                {logoUrls.map((logo, idx) => (
                    <div
                        key={idx}
                        className={`relative border rounded-lg cursor-pointer p-1 w-14 h-14 flex items-center justify-center ${
                            selectedLogo === logo ? "border-purple-500" : "border-gray-200"
                        }`}
                        onClick={() => onSelectLogo(logo)}
                    >
                        <img
                            src={logo}
                            alt={`Logo ${idx + 1}`}
                            className="w-10 h-10 object-contain"
                        />
                        {selectedLogo === logo && (
                            <CheckCircle className="absolute top-1 right-1 text-purple-500 w-4 h-4" />
                        )}
                    </div>
                ))}
            </div>

            {/* URL Input */}
            <div className="border-2 border-dashed border-purple-300 rounded-lg p-4 text-center bg-purple-50 mb-2">
                <input
                    type="text"
                    placeholder="Enter Logo URL"
                    onBlur={handleUrlInput}
                    className="w-full p-2 border border-purple-300 rounded-lg text-center text-purple-600"
                />
            </div>

            {/* Logo Name Text */}
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                            min="10"
                            max="70"
                            step="1"
                            value={logoSize}
                            onChange={(e) => onLogoSizeChange(Number(e.target.value))}
                            className="w-32 accent-purple-500"
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
    );
};

export default LogoUpload;
