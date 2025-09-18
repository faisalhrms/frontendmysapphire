// import React, { useEffect, useRef } from "react";
// import { useLocation } from "react-router-dom";
// import QRCodeStyling from "qr-code-styling";
//
// const QRPreview = ({
//                        url,
//                        qrOptions,
//                        selectedFrame,
//                        logo,
//                        logoSize,
//                        logoBackground,
//                        logoText,
//                        qrRef,
//                        reviewText,
//                        additionalText,
//                    }) => {
//     const ref = useRef(null);
//     const qrCode = useRef(null);
//     const { state } = useLocation();
//
//
//     const constructWhatsAppLink = () => {
//         if (state?.phoneNumber && state?.country) {
//             const cleanNumber = state.phoneNumber.replace(/\D/g, "");
//             if (cleanNumber.length < 7) return null;
//             const encodedMessage = encodeURIComponent(state.message || "");
//             return `https://wa.me/${state.country.code}${cleanNumber}${state.message ? `?text=${encodedMessage}` : ""}`;
//         }
//         return null;
//     };
//
//
//     const normalizeYouTubeLink = (link) => {
//         if (!link) return null;
//         let normalized = link.trim();
//         if (!normalized.startsWith("http")) {
//             normalized = `https://${normalized}`;
//         }
//         if (normalized.includes("youtube.com/watch?v=")) {
//             const videoId = normalized.split("v=")[1]?.split("&")[0];
//             if (videoId) return `https://youtu.be/${videoId}`;
//         } else if (normalized.includes("youtu.be/")) {
//             return normalized;
//         }
//         return normalized;
//     };
//
//     const getValidLink = () => {
//         let link = url || state?.whatsappLink || constructWhatsAppLink() || state?.facebookLink || state?.youtubeLink;
//         if (state?.youtubeLink) {
//             link = normalizeYouTubeLink(link);
//         }
//         if (!link || !link.startsWith("http")) {
//             link = `https://${link}`;
//         }
//         return link || "https://example.com";
//     };
//
//     const link = getValidLink();
//
//     const qrName = state?.qrName || "qr-code";
//     const category = state?.category || "";
//
//     const getPatternConfig = (pattern) => {
//         switch (pattern) {
//             case "circle":
//                 return { type: "dots" };
//             case "rounded":
//                 return { type: "rounded" };
//             case "diamond":
//                 return { type: "dot" };
//             case "star":
//                 return { type: "classy-rounded" };
//             case "heart":
//                 return { type: "extra-rounded" };
//             case "square":
//             default:
//                 return { type: "square" };
//         }
//     };
//
//     useEffect(() => {
//         if (!link) return;
//
//         qrCode.current = new QRCodeStyling({
//             width: qrOptions.size || 300,
//             height: qrOptions.size || 300,
//             type: "canvas",
//             data: link,
//             dotsOptions: {
//                 color: qrOptions.foregroundColor || "#000000",
//                 ...getPatternConfig(qrOptions.pattern),
//             },
//             backgroundOptions: {
//                 color: qrOptions.backgroundColor || "#ffffff",
//             },
//             cornersSquareOptions: {
//                 color: qrOptions.foregroundColor || "#000000",
//                 ...getPatternConfig(qrOptions.pattern),
//             },
//             cornersDotOptions: {
//                 color: qrOptions.foregroundColor || "#000000",
//                 ...getPatternConfig(qrOptions.pattern),
//             },
//             qrOptions: {
//                 errorCorrectionLevel: qrOptions.errorCorrection || "Q",
//             },
//         });
//
//         if (ref.current) {
//             qrCode.current.append(ref.current);
//         }
//
//         if (qrRef) {
//             qrRef.current = qrCode.current;
//         }
//     }, [link, qrOptions]);
//
//     useEffect(() => {
//         if (qrCode.current && link) {
//             const patternConfig = getPatternConfig(qrOptions.pattern);
//             qrCode.current.update({
//                 data: link,
//                 width: qrOptions.size || 300,
//                 height: qrOptions.size || 300,
//                 dotsOptions: {
//                     color: qrOptions.foregroundColor || "#000000",
//                     ...patternConfig,
//                 },
//                 backgroundOptions: {
//                     color: qrOptions.backgroundColor || "#ffffff",
//                 },
//                 cornersSquareOptions: {
//                     color: qrOptions.foregroundColor || "#000000",
//                     ...patternConfig,
//                 },
//                 cornersDotOptions: {
//                     color: qrOptions.foregroundColor || "#000000",
//                     ...patternConfig,
//                 },
//                 qrOptions: {
//                     errorCorrectionLevel: qrOptions.errorCorrection || "Q",
//                 },
//             });
//         }
//     }, [link, qrOptions]);
//
//     const frameStyles = {
//         null: "",
//         none: "p-3 border-4 border-dashed border-gray-800 ",
//         basic: "p-3 border-4 border-gray-800",
//         rounded: "p-3 border-4 border-gray-800 rounded-xl",
//         decorative: "p-4 border-8 border-dashed border-primary rounded-lg",
//         gradient: "p-3 border-4 rounded-lg border-transparent bg-gradient-to-r from-primary to-pink",
//     };
//
//     return (
//         <div className="relative flex flex-col items-center">
//             <div className={`relative inline-block ${frameStyles[selectedFrame || "null"]}`}>
//                 <div ref={ref} className="relative z-0"></div>
//
//                 {(logo || logoText) && (
//                     <div
//                         className={`absolute z-10 flex flex-col items-center justify-center ${
//                             logoBackground ? "bg-white" : ""
//                         }`}
//                         style={{
//                             transform: "translate(-50%, -50%)",
//                             top: "50%",
//                             left: "50%",
//                             pointerEvents: "none",
//                             width: `${logoSize}%`,
//                             height: '30%',
//                             borderRadius: logoBackground ? "6px" : "0",
//                             padding: logoBackground ? "6px" : "0",
//                         }}
//                     >
//                         {logo && (
//                             <img
//                                 src={logo}
//                                 alt="QR Logo"
//                                 style={{
//                                     width: "100%",
//                                     height: "70%",
//                                     objectFit: "contain",
//                                 }}
//                             />
//                         )}
//                         {logoText && (
//                             <span className="font-bold text-xs text-gray-800 px-2 py-1 text-center w-full truncate">
//       {logoText}
//     </span>
//                         )}
//                     </div>
//
//
//                 )}
//             </div>
//
//             <div className="text-center space-y-2 mt-8">
//                 <p className="text-[0.875rem]  font-semibold dark:text-gray-200 dark:bg-bodybg">Scanning will open:</p>
//                 <p className="font-medium text-purple-600 break-all dark:text-gray-200 dark:bg-bodybg">{link}</p>
//                 {reviewText && <p className="text-gray-600 text-sm dark:text-gray-200 dark:bg-bodybg">{reviewText}</p>}
//                 {additionalText &&
//                     <p className="text-gray-500 text-xs dark:text-gray-200 dark:bg-bodybg">{additionalText}</p>}
//             </div>
//         </div>
//     );
// };
//
// export default QRPreview;

import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import QRCodeStyling from "qr-code-styling";

const QRPreview = ({
                       url,
                       qrOptions,
                       selectedFrame,
                       logo,
                       logoWidth,
                       logoHeight,
                       logoBackground,
                       logoText,
                       qrRef,
                       reviewText,
                       additionalText,
                   }) => {
    const ref = useRef(null);
    const qrCode = useRef(null);
    const { state } = useLocation();

    const constructWhatsAppLink = () => {
        if (state?.phoneNumber && state?.country) {
            const cleanNumber = state.phoneNumber.replace(/\D/g, "");
            if (cleanNumber.length < 7) return null;
            const encodedMessage = encodeURIComponent(state.message || "");
            return `https://wa.me/${state.country.code}${cleanNumber}${state.message ? `?text=${encodedMessage}` : ""}`;
        }
        return null;
    };

    const normalizeYouTubeLink = (link) => {
        if (!link) return null;
        let normalized = link.trim();
        if (!normalized.startsWith("http")) {
            normalized = `https://${normalized}`;
        }
        if (normalized.includes("youtube.com/watch?v=")) {
            const videoId = normalized.split("v=")[1]?.split("&")[0];
            if (videoId) return `https://youtu.be/${videoId}`;
        } else if (normalized.includes("youtu.be/")) {
            return normalized;
        }
        return normalized;
    };

    const getValidLink = () => {
        let link = url || state?.whatsappLink || constructWhatsAppLink() || state?.facebookLink || state?.youtubeLink;
        if (state?.youtubeLink) {
            link = normalizeYouTubeLink(link);
        }
        if (!link || !link.startsWith("http")) {
            link = `https://${link}`;
        }
        return link || "https://example.com";
    };

    const link = getValidLink();

    const qrName = state?.qrName || "qr-code";
    const category = state?.category || "";

    const getPatternConfig = (pattern) => {
        switch (pattern) {
            case "circle":
                return { type: "dots" };
            case "rounded":
                return { type: "rounded" };
            case "diamond":
                return { type: "dot" };
            case "star":
                return { type: "classy-rounded" };
            case "heart":
                return { type: "extra-rounded" };
            case "square":
            default:
                return { type: "square" };
        }
    };

    useEffect(() => {
        if (!link) return;

        qrCode.current = new QRCodeStyling({
            width: qrOptions.size || 320,
            height: qrOptions.size || 320,
            type: "canvas",
            data: link,
            dotsOptions: {
                color: qrOptions.foregroundColor || "#000000",
                ...getPatternConfig(qrOptions.pattern),
            },
            backgroundOptions: {
                color: qrOptions.backgroundColor || "#ffffff",
            },
            cornersSquareOptions: {
                color: qrOptions.foregroundColor || "#000000",
                ...getPatternConfig(qrOptions.pattern),
            },
            cornersDotOptions: {
                color: qrOptions.foregroundColor || "#000000",
                ...getPatternConfig(qrOptions.pattern),
            },
            qrOptions: {
                errorCorrectionLevel: qrOptions.errorCorrection || "Q",
            },
        });

        if (ref.current) {
            qrCode.current.append(ref.current);
        }

        if (qrRef) {
            qrRef.current = qrCode.current;
        }
    }, [link, qrOptions]);

    useEffect(() => {
        if (qrCode.current && link) {
            const patternConfig = getPatternConfig(qrOptions.pattern);
            qrCode.current.update({
                data: link,
                width: qrOptions.size || 300,
                height: qrOptions.size || 300,
                dotsOptions: {
                    color: qrOptions.foregroundColor || "#000000",
                    ...patternConfig,
                },
                backgroundOptions: {
                    color: qrOptions.backgroundColor || "#ffffff",
                },
                cornersSquareOptions: {
                    color: qrOptions.foregroundColor || "#000000",
                    ...patternConfig,
                },
                cornersDotOptions: {
                    color: qrOptions.foregroundColor || "#000000",
                    ...patternConfig,
                },
                qrOptions: {
                    errorCorrectionLevel: qrOptions.errorCorrection || "Q",
                },
            });
        }
    }, [link, qrOptions]);

    const frameStyles = {
        null: "",
        none: "p-3 border-4 border-dashed border-gray-800 ",
        basic: "p-3 border-4 border-gray-800",
        rounded: "p-3 border-4 border-gray-800 rounded-xl",
        decorative: "p-4 border-8 border-dashed border-primary rounded-lg",
        gradient: "p-3 border-4 rounded-lg border-transparent bg-gradient-to-r from-primary to-pink",
    };

    return (
        <div className="relative flex flex-col items-center">
            <div className={`relative inline-block ${frameStyles[selectedFrame || "null"]}`}>
                <div ref={ref} className="relative z-0"></div>

                {(logo || logoText) && (
                    <div
                        className="absolute z-10 flex flex-col items-center justify-center"
                        style={{
                            transform: "translate(-50%, -50%)",
                            top: "50%",
                            left: "50%",
                            pointerEvents: "none",
                            // width: `${logoWidth}%`,
                            // height: logoBackground ? `${logoHeight * 1.1}px` : `${logoHeight}%`,
                            backgroundColor: logoBackground ? "white" : "transparent",
                        }}
                    >
                        {logo && (
                            <img
                                src={logo}
                                alt="QR Logo"
                                style={{
                                    width: `${logoWidth}%`,
                                    height: `${logoHeight}px`,
                                    objectFit: "contain",

                                }}

                            />
                        )}
                        {logoText && (
                            <span className="font-bold   bg-white text-xs text-gray-800 px-2 py-1 text-center w-full truncate">
                                {logoText}
                            </span>
                        )}
                    </div>
                )}
            </div>

            <div className="text-center space-y-2 mt-8">
                <p className="text-[0.875rem] font-semibold dark:text-gray-200 dark:bg-bodybg">Scanning will open:</p>
                <p className="font-medium text-purple-600 break-all dark:text-gray-200 dark:bg-bodybg">{link}</p>
                {reviewText && <p className="text-gray-600 text-sm dark:text-gray-200 dark:bg-bodybg">{reviewText}</p>}
                {additionalText && (
                    <p className="text-gray-500 text-xs dark:text-gray-200 dark:bg-bodybg">{additionalText}</p>
                )}
            </div>
        </div>
    );
};

export default QRPreview;