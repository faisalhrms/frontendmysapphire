import QRCodeStyling from "qr-code-styling";

const useQRGenerator = () => {
    const generateQRDataURL = async (url, options = {}) => {
        try {
            const getPatternConfig = (pattern) => {
                switch (pattern) {
                    case "circle":
                        return { type: "dots" };
                    case "rounded":
                        return { type: "rounded" };
                    case "diamond":
                        return { type: "classy" };
                    case "star":
                        return { type: "classy-rounded" };
                    case "heart":
                        return { type: "extra-rounded" };
                    case "square":
                    default:
                        return { type: "square" };
                }
            };

            const qrCode = new QRCodeStyling({
                width: options.size || 200,
                height: options.size || 200,
                type: options.type || "png",

                data: url,
                backgroundOptions: {
                    color: options.backgroundColor || "#ffffff",
                },
                dotsOptions: {
                    color: options.foregroundColor || "#000000",
                    ...getPatternConfig(options.pattern),
                },
                cornersSquareOptions: {
                    color: options.foregroundColor || "#000000",
                },
                cornersDotOptions: {
                    color: options.foregroundColor || "#000000",
                },
                qrOptions: {
                    errorCorrectionLevel: options.errorCorrection || "M",
                },
                image: options.logo || undefined,
                imageOptions: {
                    crossOrigin: "anonymous",
                    margin: options.logoBackground ? 5 : 0,
                    imageSize: (options.logoSize || 20) / 100,
                },
            });

            return new Promise((resolve) => {
                const format = (options.type || "png").replace("image/", "");
                qrCode.getRawData(format).then((buffer) => {
                    const qrBlob = new Blob([buffer], { type: `image/${format}` });
                    const qrUrl = URL.createObjectURL(qrBlob);

                    const qrImage = new Image();
                    qrImage.onload = () => {
                        const qrSize = options.size || 200;
                        const padding = 30; // Padding around QR code
                        const textMargin = options.additionalText ? 70 : 0; // Add space only if text is provided

                        const canvas = document.createElement("canvas");
                        const ctx = canvas.getContext("2d");

                        // Set canvas size, include textMargin only if text is provided
                        canvas.width = qrSize + padding * 2;
                        canvas.height = qrSize + padding * 2 + textMargin;

                        // Fill full background with white
                        ctx.fillStyle = "#ffffff";
                        ctx.fillRect(0, 0, canvas.width, canvas.height);

                        // Draw QR code inside padded area
                        ctx.drawImage(qrImage, padding, padding, qrSize, qrSize);

                        // Apply frame outside QR
                        if (options.frame !== "null") {
                            const framePadding = padding - 10; // Distance of frame outside QR
                            ctx.lineWidth = 4;
                            // Set thickness of frame

                            switch (options.frame) {
                                case "basic":
                                    ctx.strokeStyle = "#000000"; // Black border
                                    ctx.strokeRect(
                                        framePadding, framePadding,
                                        qrSize + padding * 2 - framePadding * 2,
                                        qrSize + padding * 2 - framePadding * 2 + textMargin
                                    );
                                    break;
                                case "none":
                                    ctx.strokeStyle = "#42f55a"; // Black border
                                    ctx.lineJoin = "round";
                                    ctx.strokeRect(
                                        framePadding, framePadding,
                                        qrSize + padding * 2 - framePadding * 2,
                                        qrSize + padding * 2 - framePadding * 2 + textMargin
                                    );
                                case "rounded":
                                    ctx.strokeStyle = "#000000"; // Black border
                                    ctx.lineJoin = "round";
                                    ctx.strokeRect(
                                        framePadding, framePadding,
                                        qrSize + padding * 2 - framePadding * 2,
                                        qrSize + padding * 2 - framePadding * 2 + textMargin
                                    );
                                    break;
                                case "decorative":
                                    ctx.strokeStyle = "#0000ff"; // Blue dashed border
                                    ctx.setLineDash([10, 5]); // Dashed line
                                    ctx.strokeRect(
                                        framePadding, framePadding,
                                        qrSize + padding * 2 - framePadding * 2,
                                        qrSize + padding * 2 - framePadding * 2 + textMargin
                                    );
                                    break;
                                case "gradient":
                                    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
                                    gradient.addColorStop(0, "red");
                                    gradient.addColorStop(1, "blue");
                                    ctx.strokeStyle = gradient; // Gradient border
                                    ctx.strokeRect(
                                        framePadding, framePadding,
                                        qrSize + padding * 2 - framePadding * 2,
                                        qrSize + padding * 2 - framePadding * 2 + textMargin
                                    );
                                    break;
                                default:
                                    break;
                            }
                        }

                        // Draw additional text if provided
                        if (options.additionalText) {
                            ctx.font = `${options.fontSize || 16}px ${options.font || "Arial"}`;
                            ctx.fillStyle = options.textColor || "#000000";
                            ctx.textAlign = "center";
                            ctx.fillText(
                                options.additionalText,
                                canvas.width / 2,
                                qrSize + padding + (textMargin / 2) + (parseInt(options.fontSize) / 2 || 8)
                            );
                        }

                        resolve(canvas.toDataURL(`image/${format}`));
                    };

                    qrImage.src = qrUrl;
                });
            });
        } catch (error) {
            console.error("Error generating QR code:", error);
            return null;
        }
    };

    const downloadQR = (dataURL, filename, format = "png") => {
        const link = document.createElement("a");
        link.download = `${filename}.${format}`;
        link.href = dataURL;
        link.click();
    };

    return { generateQRDataURL, downloadQR };
};

export default useQRGenerator;