// import QRCodeStyling from "qr-code-styling";
//
// const useQRGenerator = () => {
//     const generateQRDataURL = async (url, options = {}) => {
//         console.log("generateQRDataURL", (options.logoHeight*options.logoWidth || 20)/100);
//         try {
//             const getPatternConfig = (pattern) => {
//                 switch (pattern) {
//                     case "circle":
//                         return { type: "dots" };
//                     case "rounded":
//                         return { type: "rounded" };
//                     case "diamond":
//                         return { type: "classy" };
//                     case "star":
//                         return { type: "classy-rounded" };
//                     case "heart":
//                         return { type: "extra-rounded" };
//                     case "square":
//                     default:
//                         return { type: "square" };
//                 }
//             };
//
//             const qrCode = new QRCodeStyling({
//                 width: options.size || 200,
//                 height: options.size || 200,
//                 type: options.type || "png",
//
//                 data: url,
//                 backgroundOptions: {
//                     color: options.backgroundColor || "#ffffff",
//                 },
//                 dotsOptions: {
//                     color: options.foregroundColor || "#000000",
//                     ...getPatternConfig(options.pattern),
//                 },
//                 cornersSquareOptions: {
//                     color: options.foregroundColor || "#000000",
//                 },
//                 cornersDotOptions: {
//                     color: options.foregroundColor || "#000000",
//                 },
//                 qrOptions: {
//                     errorCorrectionLevel: options.errorCorrection || "M",
//                 },
//                 image: options.logo || undefined,
//                 imageOptions: {
//                     crossOrigin: "anonymous",
//                     margin: options.logoBackground ? 5 : 0,
//                     imageSize: (options.logoHeight*options.logoWidth || 20)/100,
//                 },
//             });
//
//             return new Promise((resolve) => {
//                 const format = (options.type || "png").replace("image/", "");
//                 qrCode.getRawData(format).then((buffer) => {
//                     const qrBlob = new Blob([buffer], { type: `image/${format}` });
//                     const qrUrl = URL.createObjectURL(qrBlob);
//
//                     const qrImage = new Image();
//                     qrImage.onload = () => {
//                         const qrSize = options.size || 200;
//                         const padding = 30; // Padding around QR code
//                         const textMargin = options.additionalText ? 70 : 0; // Add space only if text is provided
//
//                         const canvas = document.createElement("canvas");
//                         const ctx = canvas.getContext("2d");
//
//                         // Set canvas size, include textMargin only if text is provided
//                         canvas.width = qrSize + padding * 2;
//                         canvas.height = qrSize + padding * 2 + textMargin;
//
//                         // Fill full background with white
//                         ctx.fillStyle = "#ffffff";
//                         ctx.fillRect(0, 0, canvas.width, canvas.height);
//
//                         // Draw QR code inside padded area
//                         ctx.drawImage(qrImage, padding, padding, qrSize, qrSize);
//
//                         // Apply frame outside QR
//                         if (options.frame !== "null") {
//                             const framePadding = padding - 10; // Distance of frame outside QR
//                             ctx.lineWidth = 4;
//                             // Set thickness of frame
//
//                             switch (options.frame) {
//                                 case "basic":
//                                     ctx.strokeStyle = "#000000"; // Black border
//                                     ctx.strokeRect(
//                                         framePadding, framePadding,
//                                         qrSize + padding * 2 - framePadding * 2,
//                                         qrSize + padding * 2 - framePadding * 2 + textMargin
//                                     );
//                                     break;
//                                 case "none":
//                                     ctx.strokeStyle = "#42f55a"; // Black border
//                                     ctx.lineJoin = "round";
//                                     ctx.strokeRect(
//                                         framePadding, framePadding,
//                                         qrSize + padding * 2 - framePadding * 2,
//                                         qrSize + padding * 2 - framePadding * 2 + textMargin
//                                     );
//                                 case "rounded":
//                                     ctx.strokeStyle = "#000000"; // Black border
//                                     ctx.lineJoin = "round";
//                                     ctx.strokeRect(
//                                         framePadding, framePadding,
//                                         qrSize + padding * 2 - framePadding * 2,
//                                         qrSize + padding * 2 - framePadding * 2 + textMargin
//                                     );
//                                     break;
//                                 case "decorative":
//                                     ctx.strokeStyle = "#0000ff"; // Blue dashed border
//                                     ctx.setLineDash([10, 5]); // Dashed line
//                                     ctx.strokeRect(
//                                         framePadding, framePadding,
//                                         qrSize + padding * 2 - framePadding * 2,
//                                         qrSize + padding * 2 - framePadding * 2 + textMargin
//                                     );
//                                     break;
//                                 case "gradient":
//                                     const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
//                                     gradient.addColorStop(0, "red");
//                                     gradient.addColorStop(1, "blue");
//                                     ctx.strokeStyle = gradient; // Gradient border
//                                     ctx.strokeRect(
//                                         framePadding, framePadding,
//                                         qrSize + padding * 2 - framePadding * 2,
//                                         qrSize + padding * 2 - framePadding * 2 + textMargin
//                                     );
//                                     break;
//                                 default:
//                                     break;
//                             }
//                         }
//
//                         // Draw additional text if provided
//                         if (options.additionalText) {
//                             ctx.font = `${options.fontSize || 16}px ${options.font || "Arial"}`;
//                             ctx.fillStyle = options.textColor || "#000000";
//                             ctx.textAlign = "center";
//                             ctx.fillText(
//                                 options.additionalText,
//                                 canvas.width / 2,
//                                 qrSize + padding + (textMargin / 2) + (parseInt(options.fontSize) / 2 || 8)
//                             );
//                         }
//
//                         // Draw logo text
//                         if (options.logoText) {
//                             const basePadding = 30;
//                             const logoImageSize = options.logo ? ((options.logoHeight*options.logoWidth || 20)/100) * qrSize : 0;
//                             const logoImageCenterY = qrSize / 2; // Y center of the QR code itself
//                             const logoImageTop = logoImageCenterY - (logoImageSize / 2); // Top of the logo within the QR area
//                             const logoImageBottom = logoImageTop + logoImageSize; // Bottom of the logo within the QR area
//
//                             const logoTextFontSize =  12;
//                             const logoTextFont = `${logoTextFontSize}px Arial`;
//                             ctx.font = logoTextFont;
//                             ctx.textAlign = "center";
//
//                             const textMeasurement = ctx.measureText(options.logoText);
//                             const textWidth = textMeasurement.width;
//                             // Recalculate textHeight based on the actual font being used
//                             // This is a rough estimation, can be more precise with DOM elements
//                             const actualTextHeight = logoTextFontSize * 1.2;
//
//                             const textGapFromLogo = 5; // Small gap between logo and text
//                             let textY;
//
//                             if (options.logo) {
//                                 // Position relative to the logo if logo exists
//                                 textY = basePadding + logoImageBottom + textGapFromLogo + (actualTextHeight / 2);
//                             } else {
//                                 // If no logo, center it in the QR code area (or another suitable default)
//                                 textY = basePadding + qrSize / 2 + (actualTextHeight / 2) + 20; // Default position if no logo
//                             }
//
//                             // Draw white background rectangle for logo text
//                             const bgPadding = 5; // Padding around the text for its background
//                             ctx.fillStyle =  "#ffffff";
//                             ctx.fillRect(
//                                 canvas.width / 2 - textWidth / 2 - bgPadding,
//                                 textY - actualTextHeight / 2 - bgPadding,
//                                 textWidth + (bgPadding * 2),
//                                 actualTextHeight + (bgPadding * 2)
//                             );
//
//                             // Draw the logo text on top of the background
//                             ctx.fillStyle =  "#000000";
//                             ctx.fillText(options.logoText, canvas.width / 2, textY);
//                         }
//
//                         resolve(canvas.toDataURL(`image/${format}`));
//                     };
//
//                     qrImage.src = qrUrl;
//                 });
//             });
//         } catch (error) {
//             console.error("Error generating QR code:", error);
//             return null;
//         }
//     };
//
//     const downloadQR = (dataURL, filename, format = "png") => {
//         const link = document.createElement("a");
//         link.download = `${filename}.${format}`;
//         link.href = dataURL;
//         link.click();
//     };
//
//     return { generateQRDataURL, downloadQR };
// };
//
// export default useQRGenerator;







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
                        const basePadding = 30;

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

                        const calculatedTotalHeight = qrSize + (basePadding * 2) + Math.max(0, totalVerticalSpaceNeeded);

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
                            ctx.fillText(options.additionalText, canvas.width / 2, canvas.height - basePadding + (parseInt(additionalTextFontSize) / 2 || 8) - 10);
                        }

                        if (options.logo) {
                            const logoImg = new Image();
                            logoImg.crossOrigin = "anonymous";
                            logoImg.onload = () => {
                                // Calculate the best fit for the logo
                                let finalLogoWidth = logoWidth;
                                let finalLogoHeight = logoHeight;
                                const aspectRatio = logoImg.width / logoImg.height;

                                if (options.logoContain) { // Fit logo within the specified box
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