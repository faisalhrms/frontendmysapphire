// // // // import { useEffect, useRef } from 'react';
// // // // import QRCodeStyling from "qr-code-styling";
// // // //
// // // // const QRPreview = ({ url, qrOptions, selectedFrame, logo, logoSize, logoBackground, logoText }) => {
// // // //     const ref = useRef(null);
// // // //     const qrCode = useRef(null);
// // // //
// // // //     const getPatternConfig = (pattern) => {
// // // //         console.log('Selected pattern:', pattern);
// // // //         switch (pattern) {
// // // //             case "circle":
// // // //                 return { type: "dots" };
// // // //             case "rounded":
// // // //                 return { type: "rounded" };
// // // //             case "diamond":
// // // //                 return { type: "dot" };
// // // //             case "star":
// // // //                 return { type: "classy-rounded" };
// // // //             case "heart":
// // // //                 return { type: "extra-rounded" };
// // // //             case "square":
// // // //             default:
// // // //                 return { type: "square" };
// // // //         }
// // // //     };
// // // //
// // // //     useEffect(() => {
// // // //         qrCode.current = new QRCodeStyling({
// // // //             width: qrOptions.size || 300,
// // // //             height: qrOptions.size || 300,
// // // //             type: "canvas",
// // // //             data: url || "https://example.com",
// // // //             dotsOptions: {
// // // //                 color: qrOptions.foregroundColor || '#000000',
// // // //                 ...getPatternConfig(qrOptions.pattern)
// // // //             },
// // // //             backgroundOptions: {
// // // //                 color: qrOptions.backgroundColor || '#ffffff',
// // // //             },
// // // //             cornersSquareOptions: {
// // // //                 color: qrOptions.foregroundColor || '#000000',
// // // //                 ...getPatternConfig(qrOptions.pattern)
// // // //             },
// // // //             cornersDotOptions: {
// // // //                 color: qrOptions.foregroundColor || '#000000',
// // // //                 ...getPatternConfig(qrOptions.pattern)
// // // //             },
// // // //             qrOptions: {
// // // //                 errorCorrectionLevel: qrOptions.errorCorrection || 'M'
// // // //             }
// // // //         });
// // // //
// // // //         if (ref.current) {
// // // //             qrCode.current.append(ref.current);
// // // //         } else {
// // // //             console.warn('Canvas ref is not available during initial render');
// // // //         }
// // // //
// // // //     }, []);
// // // //
// // // //     useEffect(() => {
// // // //         if (qrCode.current) {
// // // //             const patternConfig = getPatternConfig(qrOptions.pattern);
// // // //             qrCode.current.update({
// // // //                 data: url || "https://example.com",
// // // //                 width: qrOptions.size || 300,
// // // //                 height: qrOptions.size || 300,
// // // //                 dotsOptions: {
// // // //                     color: qrOptions.foregroundColor || '#000000',
// // // //                     ...patternConfig
// // // //                 },
// // // //                 backgroundOptions: {
// // // //                     color: qrOptions.backgroundColor || '#ffffff',
// // // //                 },
// // // //                 cornersSquareOptions: {
// // // //                     color: qrOptions.foregroundColor || '#000000',
// // // //                     ...patternConfig
// // // //                 },
// // // //                 cornersDotOptions: {
// // // //                     color: qrOptions.foregroundColor || '#000000',
// // // //                     ...patternConfig
// // // //                 },
// // // //                 qrOptions: {
// // // //                     errorCorrectionLevel: qrOptions.errorCorrection || 'M'
// // // //                 }
// // // //             });
// // // //         } else {
// // // //             console.warn('QR code instance not initialized during update');
// // // //         }
// // // //     }, [url, qrOptions]);
// // // //
// // // //     const frameStyles = {
// // // //         none: "p-1 p-4 border-8 border-dashed border-secondary rounded-lg",
// // // //         basic: "p-3 border-4 border-gray-800",
// // // //         rounded: "p-3 border-4 border-gray-800 rounded-xl",
// // // //         decorative: "p-4 border-8 border-dashed border-gray-500 rounded-lg",
// // // //         gradient: "p-3 border-4 rounded-lg border-transparent bg-gradient-to-r from-primary to-pink",
// // // //     };
// // // //
// // // //     return (
// // // //         <div className="relative flex flex-col items-center">
// // // //             <div className={`relative inline-block ${frameStyles[selectedFrame || "none"]}`}>
// // // //                 <div ref={ref} className="relative z-0"></div>
// // // //
// // // //                 {(logo || logoText) && (
// // // //                     <div
// // // //                         className="absolute z-10 flex flex-col items-center bg-white justify-center"
// // // //
// // // //                         style={{
// // // //                             transform: "translate(-50%, -50%)",
// // // //                             top: "50%",
// // // //                             left: "50%",
// // // //                             pointerEvents: "none",
// // // //                             width: `${logoSize + 20}%`,
// // // //                             height: `${logoSize + 10}%`,
// // // //                             maxWidth: `${qrOptions.size * 0.5}px`,
// // // //                             maxHeight: `${qrOptions.size * 0.3}px`,
// // // //                             borderRadius: logoBackground ? '6px' : '0',
// // // //                             padding: logoBackground ? '6px' : '0',
// // // //                         }}
// // // //                     >
// // // //                         {logo && (
// // // //                             <img
// // // //                                 src={logo}
// // // //                                 alt="QR Logo"
// // // //                                 style={{
// // // //                                     width: '300%',
// // // //                                     height: '300%',
// // // //                                     objectFit: "contain",
// // // //                                 }}
// // // //                             />
// // // //                         )}
// // // //                         {logoText && (
// // // //                             <span className="font-bold text-xs text-gray-800 bg-white/90 px-2 py-1 rounded mt-1">
// // // //                                 {logoText}
// // // //                             </span>
// // // //                         )}
// // // //                     </div>
// // // //                 )}
// // // //
// // // //
// // // //                 {selectedFrame !== "none" && (
// // // //                     <div
// // // //                         className={`absolute inset-0 pointer-events-none z-20 ${
// // // //                             selectedFrame === "basic"
// // // //                                 ? "border-4 border-gray-800"
// // // //                                 : selectedFrame === "rounded"
// // // //                                     ? "border-4 border-gray-800 rounded-xl"
// // // //                                     : selectedFrame === "decorative"
// // // //                                         ? "border-8 border-dashed border-primary"
// // // //                                         : selectedFrame === "gradient"
// // // //                                             ? "border-2 border-primary"
// // // //                                             : ""
// // // //                         }`}
// // // //                     ></div>
// // // //                 )}
// // // //             </div>
// // // //
// // // //
// // // //             <div className="text-center space-y-2 mt-8">
// // // //                 <p className="text-[0.875rem] mb-1 font-semibold">Scanning will:</p>
// // // //                 <p className="font-medium text-purple-600 break-all">{url}</p>
// // // //             </div>
// // // //         </div>
// // // //     );
// // // // };
// // // //
// // // // export default QRPreview;
// // // //
// // // //
// // // //
// // // import { useEffect, useRef } from 'react';
// // // import { useLocation } from 'react-router-dom';
// // // import QRCodeStyling from 'qr-code-styling';
// // //
// // // const QRPreview = ({
// // //                        url,                // ✅ New prop
// // //                        qrOptions,
// // //                        selectedFrame,
// // //                        logo,
// // //                        logoSize,
// // //                        logoBackground,
// // //                        logoText,
// // //                        qrRef,             // ✅ Passed ref
// // //                        reviewText,
// // //                        additionalText
// // //                    }) => {
// // //     const ref = useRef(null);
// // //     const qrCode = useRef(null);
// // //     const { state } = useLocation();
// // //
// // //     // ✅ Use url prop if provided, else fallback to state, else default
// // //     const youtubeLink = url || state?.youtubeLink || 'https://example.com';
// // //     const qrName = state?.qrName || 'qr-code';
// // //     const category = state?.category || '';
// // //
// // //     const getPatternConfig = (pattern) => {
// // //         switch (pattern) {
// // //             case 'circle': return { type: 'dots' };
// // //             case 'rounded': return { type: 'rounded' };
// // //             case 'diamond': return { type: 'dot' };
// // //             case 'star': return { type: 'classy-rounded' };
// // //             case 'heart': return { type: 'extra-rounded' };
// // //             case 'square':
// // //             default: return { type: 'square' };
// // //         }
// // //     };
// // //
// // //     useEffect(() => {
// // //         qrCode.current = new QRCodeStyling({
// // //             width: qrOptions.size || 300,
// // //             height: qrOptions.size || 300,
// // //             type: 'canvas',
// // //             data: youtubeLink,
// // //             dotsOptions: {
// // //                 color: qrOptions.foregroundColor || '#000000',
// // //                 ...getPatternConfig(qrOptions.pattern)
// // //             },
// // //             backgroundOptions: {
// // //                 color: qrOptions.backgroundColor || '#ffffff',
// // //             },
// // //             cornersSquareOptions: {
// // //                 color: qrOptions.foregroundColor || '#000000',
// // //                 ...getPatternConfig(qrOptions.pattern)
// // //             },
// // //             cornersDotOptions: {
// // //                 color: qrOptions.foregroundColor || '#000000',
// // //                 ...getPatternConfig(qrOptions.pattern)
// // //             },
// // //             qrOptions: {
// // //                 errorCorrectionLevel: qrOptions.errorCorrection || 'M'
// // //             }
// // //         });
// // //
// // //         if (ref.current) {
// // //             qrCode.current.append(ref.current);
// // //         }
// // //
// // //         // ✅ Expose qrRef if provided
// // //         if (qrRef) {
// // //             qrRef.current = qrCode.current;
// // //         }
// // //     }, [youtubeLink, qrOptions]);
// // //
// // //     useEffect(() => {
// // //         if (qrCode.current) {
// // //             const patternConfig = getPatternConfig(qrOptions.pattern);
// // //             qrCode.current.update({
// // //                 data: youtubeLink,
// // //                 width: qrOptions.size || 300,
// // //                 height: qrOptions.size || 300,
// // //                 dotsOptions: {
// // //                     color: qrOptions.foregroundColor || '#000000',
// // //                     ...patternConfig
// // //                 },
// // //                 backgroundOptions: {
// // //                     color: qrOptions.backgroundColor || '#ffffff',
// // //                 },
// // //                 cornersSquareOptions: {
// // //                     color: qrOptions.foregroundColor || '#000000',
// // //                     ...patternConfig
// // //                 },
// // //                 cornersDotOptions: {
// // //                     color: qrOptions.foregroundColor || '#000000',
// // //                     ...patternConfig
// // //                 },
// // //                 qrOptions: {
// // //                     errorCorrectionLevel: qrOptions.errorCorrection || 'M'
// // //                 }
// // //             });
// // //         }
// // //     }, [youtubeLink, qrOptions]);
// // //
// // //     const frameStyles = {
// // //         none: 'p-1 p-4 border-8 border-dashed border-secondary rounded-lg',
// // //         basic: 'p-3 border-4 border-gray-800',
// // //         rounded: 'p-3 border-4 border-gray-800 rounded-xl',
// // //         decorative: 'p-4 border-8 border-dashed border-gray-500 rounded-lg',
// // //         gradient: 'p-3 border-4 rounded-lg border-transparent bg-gradient-to-r from-primary to-pink',
// // //     };
// // //
// // //     return (
// // //         <div className="relative flex flex-col items-center">
// // //             <div className={`relative inline-block ${frameStyles[selectedFrame || 'none']}`}>
// // //                 <div ref={ref} className="relative z-0"></div>
// // //
// // //                 {(logo || logoText) && (
// // //                     <div
// // //                         className="absolute z-10 flex flex-col items-center bg-white justify-center"
// // //                         style={{
// // //                             transform: 'translate(-50%, -50%)',
// // //                             top: '50%',
// // //                             left: '50%',
// // //                             pointerEvents: 'none',
// // //                             width: `${logoSize + 20}%`,
// // //                             height: `${logoSize + 10}%`,
// // //                             maxWidth: `${qrOptions.size * 0.5}px`,
// // //                             maxHeight: `${qrOptions.size * 0.3}px`,
// // //                             borderRadius: logoBackground ? '6px' : '0',
// // //                             padding: logoBackground ? '6px' : '0',
// // //                         }}
// // //                     >
// // //                         {logo && (
// // //                             <img
// // //                                 src={logo}
// // //                                 alt="QR Logo"
// // //                                 style={{
// // //                                     width: '300%',
// // //                                     height: '300%',
// // //                                     objectFit: 'contain',
// // //                                 }}
// // //                             />
// // //                         )}
// // //                         {logoText && (
// // //                             <span className="font-bold text-xs text-gray-800 bg-white/90 px-2 py-1 rounded mt-1">
// // //                                 {logoText}
// // //                             </span>
// // //                         )}
// // //                     </div>
// // //                 )}
// // //             </div>
// // //
// // //             <div className="text-center space-y-2 mt-8">
// // //                 <p className="text-[0.875rem] mb-1 font-semibold">Scanning will:</p>
// // //                 <p className="font-medium text-purple-600 break-all">{youtubeLink}</p>
// // //                 {reviewText && <p className="text-gray-600 text-sm">{reviewText}</p>}
// // //                 {additionalText && <p className="text-gray-500 text-xs">{additionalText}</p>}
// // //             </div>
// // //         </div>
// // //     );
// // // };
// // //
// // // export default QRPreview;
// // import { useEffect, useRef } from "react";
// // import { useLocation } from "react-router-dom";
// // import QRCodeStyling from "qr-code-styling";
// //
// // const QRPreview = ({
// //                        url,
// //                        qrOptions,
// //                        selectedFrame,
// //                        logo,
// //                        logoSize,
// //                        logoBackground,
// //                        logoText,
// //                        qrRef,
// //                        reviewText,
// //                        additionalText,
// //                    }) => {
// //     const ref = useRef(null);
// //     const qrCode = useRef(null);
// //     const { state } = useLocation();
// //
// //     // Use url prop if provided, else fallback to state, else default
// //     const youtubeLink = url || state?.youtubeLink || "https://example.com";
// //     const qrName = state?.qrName || "qr-code";
// //     const category = state?.category || "";
// //
// //     const getPatternConfig = (pattern) => {
// //         switch (pattern) {
// //             case "circle":
// //                 return { type: "dots" };
// //             case "rounded":
// //                 return { type: "rounded" };
// //             case "diamond":
// //                 return { type: "dot" };
// //             case "star":
// //                 return { type: "classy-rounded" };
// //             case "heart":
// //                 return { type: "extra-rounded" };
// //             case "square":
// //             default:
// //                 return { type: "square" };
// //         }
// //     };
// //
// //     useEffect(() => {
// //         if (!youtubeLink) return;
// //
// //         qrCode.current = new QRCodeStyling({
// //             width: qrOptions.size || 300,
// //             height: qrOptions.size || 300,
// //             type: "canvas",
// //             data: youtubeLink,
// //             dotsOptions: {
// //                 color: qrOptions.foregroundColor || "#000000",
// //                 ...getPatternConfig(qrOptions.pattern),
// //             },
// //             backgroundOptions: {
// //                 color: qrOptions.backgroundColor || "#ffffff",
// //             },
// //             cornersSquareOptions: {
// //                 color: qrOptions.foregroundColor || "#000000",
// //                 ...getPatternConfig(qrOptions.pattern),
// //             },
// //             cornersDotOptions: {
// //                 color: qrOptions.foregroundColor || "#000000",
// //                 ...getPatternConfig(qrOptions.pattern),
// //             },
// //             qrOptions: {
// //                 errorCorrectionLevel: qrOptions.errorCorrection || "M",
// //             },
// //         });
// //
// //         if (ref.current) {
// //             qrCode.current.append(ref.current);
// //         }
// //
// //         if (qrRef) {
// //             qrRef.current = qrCode.current;
// //         }
// //     }, [youtubeLink, qrOptions]);
// //
// //     useEffect(() => {
// //         if (qrCode.current && youtubeLink) {
// //             const patternConfig = getPatternConfig(qrOptions.pattern);
// //             qrCode.current.update({
// //                 data: youtubeLink,
// //                 width: qrOptions.size || 300,
// //                 height: qrOptions.size || 300,
// //                 dotsOptions: {
// //                     color: qrOptions.foregroundColor || "#000000",
// //                     ...patternConfig,
// //                 },
// //                 backgroundOptions: {
// //                     color: qrOptions.backgroundColor || "#ffffff",
// //                 },
// //                 cornersSquareOptions: {
// //                     color: qrOptions.foregroundColor || "#000000",
// //                     ...patternConfig,
// //                 },
// //                 cornersDotOptions: {
// //                     color: qrOptions.foregroundColor || "#000000",
// //                     ...patternConfig,
// //                 },
// //                 qrOptions: {
// //                     errorCorrectionLevel: qrOptions.errorCorrection || "M",
// //                 },
// //             });
// //         }
// //     }, [youtubeLink, qrOptions]);
// //
// //     const frameStyles = {
// //         none: "p-1 p-4 border-8 border-dashed border-secondary rounded-lg",
// //         basic: "p-3 border-4 border-gray-800",
// //         rounded: "p-3 border-4 border-gray-800 rounded-xl",
// //         decorative: "p-4 border-8 border-dashed border-gray-500 rounded-lg",
// //         gradient: "p-3 border-4 rounded-lg border-transparent bg-gradient-to-r from-primary to-pink",
// //     };
// //
// //     return (
// //         <div className="relative flex flex-col items-center">
// //             <div className={`relative inline-block ${frameStyles[selectedFrame || "none"]}`}>
// //                 <div ref={ref} className="relative z-0"></div>
// //
// //                 {(logo || logoText) && (
// //                     <div
// //                         className="absolute z-10 flex flex-col items-center bg-white justify-center"
// //                         style={{
// //                             transform: "translate(-50%, -50%)",
// //                             top: "50%",
// //                             left: "50%",
// //                             pointerEvents: "none",
// //                             width: `${logoSize}%`,
// //                             height: `${logoSize}%`,
// //                             maxWidth: `${qrOptions.size * 0.3}px`,
// //                             maxHeight: `${qrOptions.size * 0.3}px`,
// //                             borderRadius: logoBackground ? "6px" : "0",
// //                             padding: logoBackground ? "6px" : "0",
// //                         }}
// //                     >
// //                         {logo && (
// //                             <img
// //                                 src={logo}
// //                                 alt="QR Logo"
// //                                 style={{
// //                                     width: "100%",
// //                                     height: "100%",
// //                                     objectFit: "contain",
// //                                 }}
// //                             />
// //                         )}
// //                         {logoText && (
// //                             <span className="font-bold text-xs text-gray-800 bg-white/90 px-2 py-1 rounded mt-1">
// //                 {logoText}
// //               </span>
// //                         )}
// //                     </div>
// //                 )}
// //             </div>
// //
// //             <div className="text-center space-y-2 mt-8">
// //                 <p className="text-[0.875rem] mb-1 font-semibold">Scanning will open:</p>
// //                 <p className="font-medium text-purple-600 break-all">{youtubeLink}</p>
// //                 {reviewText && <p className="text-gray-600 text-sm">{reviewText}</p>}
// //                 {additionalText && <p className="text-gray-500 text-xs">{additionalText}</p>}
// //             </div>
// //         </div>
// //     );
// // };
// //
// // export default QRPreview;
//
// import { useEffect, useRef } from "react";
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
//     // Use url prop if provided, else fallback to state.facebookLink or state.youtubeLink, else default
//     const link = url || state?.facebookLink || state?.youtubeLink || "https://example.com";
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
//                 errorCorrectionLevel: qrOptions.errorCorrection || "M",
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
//                     errorCorrectionLevel: qrOptions.errorCorrection || "M",
//                 },
//             });
//         }
//     }, [link, qrOptions]);
//
//     const frameStyles = {
//         none: "p-1 p-4 border-8 border-dashed border-secondary rounded-lg",
//         basic: "p-3 border-4 border-gray-800",
//         rounded: "p-3 border-4 border-gray-800 rounded-xl",
//         decorative: "p-4 border-8 border-dashed border-gray-500 rounded-lg",
//         gradient: "p-3 border-4 rounded-lg border-transparent bg-gradient-to-r from-primary to-pink",
//     };
//
//     return (
//         <div className="relative flex flex-col items-center">
//             <div className={`relative inline-block ${frameStyles[selectedFrame || "none"]}`}>
//                 <div ref={ref} className="relative z-0"></div>
//
//                 {(logo || logoText) && (
//                     <div
//                         className="absolute z-10 flex flex-col items-center bg-white justify-center"
//                         style={{
//                             transform: "translate(-50%, -50%)",
//                             top: "50%",
//                             left: "50%",
//                             pointerEvents: "none",
//                             width: `${logoSize}%`,
//                             height: `${logoSize}%`,
//                             maxWidth: `${qrOptions.size * 0.3}px`,
//                             maxHeight: `${qrOptions.size * 0.3}px`,
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
//                                     height: "100%",
//                                     objectFit: "contain",
//                                 }}
//                             />
//                         )}
//                         {logoText && (
//                             <span className="font-bold text-xs text-gray-800 bg-white/90 px-2 py-1 rounded mt-1">
//                 {logoText}
//               </span>
//                         )}
//                     </div>
//                 )}
//             </div>
//
//             <div className="text-center space-y-2 mt-8">
//                 <p className="text-[0.875rem] mb-1 font-semibold">Scanning will open:</p>
//                 <p className="font-medium text-purple-600 break-all">{link}</p>
//                 {reviewText && <p className="text-gray-600 text-sm">{reviewText}</p>}
//                 {additionalText && <p className="text-gray-500 text-xs">{additionalText}</p>}
//             </div>
//         </div>
//     );
// };
//
// export default QRPreview;

import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import QRCodeStyling from "qr-code-styling";

const QRPreview = ({
                       url,
                       qrOptions,
                       selectedFrame,
                       logo,
                       logoSize,
                       logoBackground,
                       logoText,
                       qrRef,
                       reviewText,
                       additionalText,
                   }) => {
    const ref = useRef(null);
    const qrCode = useRef(null);
    const { state } = useLocation();

    // Construct WhatsApp link if phoneNumber and country are available
    const constructWhatsAppLink = () => {
        if (state?.phoneNumber && state?.country) {
            const cleanNumber = state.phoneNumber.replace(/\D/g, "");
            const encodedMessage = encodeURIComponent(state.message || "");
            return `https://wa.me/${state.country.code}${cleanNumber}${state.message ? `?text=${encodedMessage}` : ""}`;
        }
        return null;
    };

    // Use url prop, then state.whatsappLink, then construct WhatsApp link, then state.facebookLink, state.youtubeLink, or default
    const link =
        url ||
        state?.whatsappLink ||
        constructWhatsAppLink() ||
        state?.facebookLink ||
        state?.youtubeLink ||
        "https://example.com";
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
            width: qrOptions.size || 300,
            height: qrOptions.size || 300,
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
                errorCorrectionLevel: qrOptions.errorCorrection || "M",
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
                    errorCorrectionLevel: qrOptions.errorCorrection || "M",
                },
            });
        }
    }, [link, qrOptions]);

    const frameStyles = {
        none: "p-1 p-4 border-8 border-dashed border-secondary rounded-lg",
        basic: "p-3 border-4 border-gray-800",
        rounded: "p-3 border-4 border-gray-800 rounded-xl",
        decorative: "p-4 border-8 border-dashed border-gray-500 rounded-lg",
        gradient: "p-3 border-4 rounded-lg border-transparent bg-gradient-to-r from-primary to-pink",
    };

    return (
        <div className="relative flex flex-col items-center">
            <div className={`relative inline-block ${frameStyles[selectedFrame || "none"]}`}>
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
                            height: `${logoSize}%`,
                            maxWidth: `${qrOptions.size * 0.3}px`,
                            maxHeight: `${qrOptions.size * 0.3}px`,
                            borderRadius: logoBackground ? "6px" : "0",
                            padding: logoBackground ? "6px" : "0",
                        }}
                    >
                        {logo && (
                            <img
                                src={logo}
                                alt="QR Logo"
                                style={{
                                    width: "100%",
                                    height: "100%",
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
            </div>

            <div className="text-center space-y-2 mt-8">
                <p className="text-[0.875rem] mb-1 font-semibold">Scanning will open:</p>
                <p className="font-medium text-purple-600 break-all">{link}</p>
                {reviewText && <p className="text-gray-600 text-sm">{reviewText}</p>}
                {additionalText && <p className="text-gray-500 text-xs">{additionalText}</p>}
            </div>
        </div>
    );
};

export default QRPreview;