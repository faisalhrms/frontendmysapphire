import { QRCodeCanvas } from "qrcode.react";

const QRPreview = ({ url, qrOptions, selectedFrame, qrRef, logo, logoSize, logoBackground, logoText }) => {
    return (
        <div className="relative inline-block">

            <QRCodeCanvas
                ref={qrRef}
                value={url || "https://example.com"}
                size={qrOptions.size}
                bgColor={qrOptions.backgroundColor}
                fgColor={qrOptions.foregroundColor}
                level={qrOptions.errorCorrection}
                includeMargin={false}
                className="relative z-0"
            />


            {(logo || logoText) && (
                <div
                    className="absolute z-10 flex flex-col items-center bg-white justify-center"
                    style={{
                        transform: "translate(-50%, -50%)",
                        top: "40%",
                        left: "50%",
                        pointerEvents: "none",
                    }}
                >

                    {logo && (
                        <img
                            src={logo}
                            alt="QR Logo"
                            style={{

                                objectFit: "contain",
                                ...(logoBackground && {
                                    backgroundColor: "white",
                                    padding: "6px",
                                    borderRadius: "6px",
                                }),
                            }}
                        />
                    )}


                    {logoText && (
                        <span className="font-bold  mt-4 text-gray-800 bg-white/70 rounded">
                            {logoText}
                        </span>
                    )}
                </div>
            )}


            {selectedFrame !== "none" && (
                <div
                    className={`absolute inset-0 pointer-events-none z-20 ${
                        selectedFrame === "basic"
                            ? "border-4 border-gray-800"
                            : selectedFrame === "rounded"
                                ? "border-4 border-gray-800 rounded-xl"
                                : selectedFrame === "decorative"
                                    ? "border-8 border-dashed border-purple-500"
                                    : selectedFrame === "gradient"
                                        ? "border-8 border-gradient-to-r from-purple-400 to-pink-400 rounded-lg"
                                        : ""
                    }`}
                ></div>
            )}


            <div className="text-center space-y-2 mt-8">
                <p className="text-sm text-gray-600">Scanning will:</p>
                <p className="font-medium text-purple-600 break-all">{url}</p>
            </div>
        </div>
    );
};

export default QRPreview;
