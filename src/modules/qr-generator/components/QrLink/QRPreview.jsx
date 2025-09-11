import { useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';

const QRPreview = ({ url, qrOptions, selectedFrame, logo, logoSize, logoBackground, logoText }) => {
    const ref = useRef(null);
    const qrCode = useRef(null);

    useEffect(() => {
        // Get pattern configuration
        const getPatternConfig = (pattern) => {
            switch (pattern) {
                case 'circle':
                    return { type: 'dots' };
                case 'rounded':
                    return { type: 'rounded' };
                case 'square':
                default:
                    return { type: 'square' };
            }
        };

        // Create QR code with styling
        qrCode.current = new QRCodeStyling({
            width: qrOptions.size || 300,
            height: qrOptions.size || 300,
            type: "canvas",
            data: url || "https://example.com",
            dotsOptions: {
                color: qrOptions.foregroundColor || '#000000',
                ...getPatternConfig(qrOptions.pattern)
            },
            backgroundOptions: {
                color: qrOptions.backgroundColor || '#ffffff',
            },
            cornersSquareOptions: {
                color: qrOptions.foregroundColor || '#000000',
                type: qrOptions.pattern === 'rounded' ? 'extra-rounded' : 'square'
            },
            cornersDotOptions: {
                color: qrOptions.foregroundColor || '#000000',
                type: qrOptions.pattern === 'circle' ? 'dot' : 'square'
            },
            qrOptions: {
                errorCorrectionLevel: qrOptions.errorCorrection || 'M'
            }
        });

        // Clear previous QR code and append new one
        if (ref.current) {
            ref.current.innerHTML = '';
            qrCode.current.append(ref.current);
        }
    }, [url, qrOptions]);

    return (
        <div className="relative inline-block">
            <div ref={ref} className="relative z-0"></div>

            {(logo || logoText) && (
                <div
                    className="absolute z-10 flex flex-col items-center bg-white justify-center"
                    style={{
                        transform: "translate(-50%, -50%)",
                        top: "50%",
                        left: "50%",
                        pointerEvents: "none",
                        width: `${logoSize}%`,
                        maxWidth: `${qrOptions.size * 0.3}px`,
                        borderRadius: logoBackground ? '6px' : '0',
                        padding: logoBackground ? '6px' : '0',
                    }}
                >
                    {logo && (
                        <img
                            src={logo}
                            alt="QR Logo"
                            style={{
                                width: '100%',
                                height: 'auto',
                                objectFit: "contain",
                            }}
                        />
                    )}

                    {logoText && (
                        <span className="font-bold text-xs text-gray-800 bg-white/90 px-2 py-1 rounded mt-1">
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
                                        ? "border-8 border-purple-500 rounded-lg"
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