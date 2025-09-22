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
                }
            });

            return new Promise((resolve) => {
                const format = (options.type || "png").replace("image/", "");
                qrCode.getRawData(format).then((buffer) => {
                    const qrBlob = new Blob([buffer], { type: `image/${format}` });
                    const qrUrl = URL.createObjectURL(qrBlob);

                    const qrImage = new Image();
                    qrImage.onload = async () => {
                        const qrSize = options.size || 200;
                        // Base padding: 30px for additionalText, 10px otherwise
                        const basePadding = options.additionalText ? 30 : 10;

                        const logoWidth = options.logo ? (options.logoWidth || 50) : 0;
                        const logoHeight = options.logo ? (options.logoHeight || 50) : 0;

                        let additionalSpaceForLogoText = 0;
                        if (options.logoText) {
                            const tempCanvas = document.createElement("canvas");
                            const tempCtx = tempCanvas.getContext("2d");
                            tempCtx.font = `${options.logoFontSize || 12}px ${options.logoFont || "Arial"}`;
                            const logoTextHeight = (options.logoFontSize || 12) * 1.2;
                            additionalSpaceForLogoText = logoTextHeight + 10;
                        }

                        const qrCenter = qrSize / 2;
                        const logoX = qrCenter - (logoWidth / 2);
                        const logoY = qrCenter - (logoHeight / 2);
                        const logoBottom = logoY + logoHeight;

                        let totalVerticalSpaceNeeded = 0;
                        if (options.logoText) {
                            totalVerticalSpaceNeeded = (logoBottom + additionalSpaceForLogoText + 10) - qrSize / 2;
                        } else if (options.logo) {
                            totalVerticalSpaceNeeded = (logoBottom + 10) - qrSize / 2;
                        }

                        // Add explicit space for additionalText
                        const additionalTextSpace = options.additionalText ? (options.fontSize || 16) * 1.2 + 20 : 0;

                        // Calculate total canvas height
                        const calculatedTotalHeight = qrSize + (basePadding * 2) + Math.max(0, totalVerticalSpaceNeeded) + additionalTextSpace;

                        const canvas = document.createElement("canvas");
                        const ctx = canvas.getContext("2d");
                        canvas.width = qrSize + basePadding * 2;
                        canvas.height = calculatedTotalHeight;

                        ctx.fillStyle = options.backgroundColor || "#ffffff";
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(qrImage, basePadding, basePadding, qrSize, qrSize);

                        if (options.frame !== "null") {
                            const framePadding = basePadding - 10;
                            ctx.lineWidth = 4;
                            switch (options.frame) {
                                case "basic":
                                    ctx.strokeStyle = "#000000";
                                    ctx.strokeRect(framePadding, framePadding, canvas.width - framePadding * 2, canvas.height - framePadding * 2);
                                    break;
                                case "none":
                                case "rounded":
                                    ctx.strokeStyle = "#000000";
                                    ctx.lineJoin = "round";
                                    ctx.strokeRect(framePadding, framePadding, canvas.width - framePadding * 2, canvas.height - framePadding * 2);
                                    break;
                                case "decorative":
                                    ctx.strokeStyle = "#0000ff";
                                    ctx.setLineDash([10, 5]);
                                    ctx.strokeRect(framePadding, framePadding, canvas.width - framePadding * 2, canvas.height - framePadding * 2);
                                    break;
                                case "gradient":
                                    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
                                    gradient.addColorStop(0, "red");
                                    gradient.addColorStop(1, "blue");
                                    ctx.strokeStyle = gradient;
                                    ctx.strokeRect(framePadding, framePadding, canvas.width - framePadding * 2, canvas.height - framePadding * 2);
                                    break;
                                default:
                                    break;
                            }
                        }

                        if (options.additionalText) {
                            const additionalTextFontSize = options.fontSize || 16;
                            ctx.font = `${additionalTextFontSize}px ${options.font || "Arial"}`;
                            ctx.fillStyle = options.textColor || "#000000";
                            ctx.textAlign = "center";
                            // Position text at the bottom with proper spacing
                            const textY = canvas.height - basePadding + (additionalTextFontSize / 2) - 5;
                            ctx.fillText(options.additionalText, canvas.width / 2, textY);
                        }

                        if (options.logo) {
                            const logoImg = new Image();
                            logoImg.crossOrigin = "anonymous";
                            logoImg.onload = () => {
                                let finalLogoWidth = logoWidth;
                                let finalLogoHeight = logoHeight;
                                const aspectRatio = logoImg.width / logoImg.height;

                                if (options.logoContain) {
                                    if (aspectRatio > logoWidth / logoHeight) {
                                        finalLogoHeight = logoWidth / aspectRatio;
                                    } else {
                                        finalLogoWidth = logoHeight * aspectRatio;
                                    }
                                }

                                const finalLogoX = qrCenter - (finalLogoWidth / 2);
                                const finalLogoY = qrCenter - (finalLogoHeight / 2);
                                const finalLogoBottom = finalLogoY + finalLogoHeight;

                                if (!options.logoTransparentBackground) {
                                    const logoBgPadding = 5;
                                    ctx.fillStyle = options.logoBackgroundColor || "#ffffff";
                                    ctx.fillRect(
                                        basePadding + finalLogoX - logoBgPadding,
                                        basePadding + finalLogoY - logoBgPadding,
                                        finalLogoWidth + (logoBgPadding * 2),
                                        finalLogoHeight + (logoBgPadding * 2)
                                    );
                                }

                                ctx.drawImage(logoImg, basePadding + finalLogoX, basePadding + finalLogoY, finalLogoWidth, finalLogoHeight);

                                if (options.logoText) {
                                    const logoTextFontSize = options.logoFontSize || 12;
                                    const logoTextFont = `${logoTextFontSize}px ${options.logoFont || "Arial"}`;
                                    ctx.font = logoTextFont;
                                    ctx.textAlign = "center";
                                    const textMeasurement = ctx.measureText(options.logoText);
                                    const textWidth = textMeasurement.width;
                                    const actualTextHeight = logoTextFontSize * 1.2;
                                    const textGapFromLogo = 5;
                                    const textY = basePadding + finalLogoBottom + textGapFromLogo + (actualTextHeight / 2);

                                    const bgPadding = 5;
                                    ctx.fillStyle = options.logoTextBackgroundColor || "#ffffff";
                                    ctx.fillRect(
                                        canvas.width / 2 - textWidth / 2 - bgPadding,
                                        textY - actualTextHeight / 2 - bgPadding,
                                        textWidth + (bgPadding * 2),
                                        actualTextHeight + (bgPadding * 2)
                                    );

                                    ctx.fillStyle = options.logoTextColor || "#000000";
                                    ctx.fillText(options.logoText, canvas.width / 2, textY);
                                }
                                resolve(canvas.toDataURL(`image/${format}`));
                            };
                            logoImg.src = options.logo;
                        } else {
                            if (options.logoText) {
                                const logoTextFontSize = options.logoFontSize || 12;
                                const logoTextFont = `${logoTextFontSize}px ${options.logoFont || "Arial"}`;
                                ctx.font = logoTextFont;
                                ctx.textAlign = "center";
                                const textMeasurement = ctx.measureText(options.logoText);
                                const textWidth = textMeasurement.width;
                                const actualTextHeight = logoTextFontSize * 1.2;
                                const textY = basePadding + qrSize / 2 + (actualTextHeight / 2) + 20;

                                const bgPadding = 5;
                                ctx.fillStyle = options.logoTextBackgroundColor || "#ffffff";
                                ctx.fillRect(
                                    canvas.width / 2 - textWidth / 2 - bgPadding,
                                    textY - actualTextHeight / 2 - bgPadding,
                                    textWidth + (bgPadding * 2),
                                    actualTextHeight + (bgPadding * 2)
                                );

                                ctx.fillStyle = options.logoTextColor || "#000000";
                                ctx.fillText(options.logoText, canvas.width / 2, textY);
                            }
                            resolve(canvas.toDataURL(`image/${format}`));
                        }
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