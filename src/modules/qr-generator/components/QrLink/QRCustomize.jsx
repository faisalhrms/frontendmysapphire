// // // import React, { useState, useRef } from 'react';
// // // import { Download, ArrowLeft } from 'lucide-react';
// // // import { useLocation, useNavigate } from 'react-router-dom';
// // // import QRPreview from './QRPreview';
// // // import PatternSelector from './PatternSelector';
// // // import ErrorCorrectionSelector from './ErrorCorrectionSelector';
// // // import ColorSelector from './ColorSelector';
// // // import FrameSelector from './FrameSelector';
// // // import LogoUpload from './LogoUpload';
// // // import useQRGenerator from '@modules/qr-generator/Hooks/useQRGenerator.js';
// // // import TextFormattingUI from "@modules/qr-generator/components/QrLink/TextFormatting.jsx";
// // //
// // // const CustomizeQR = () => {
// // //     const location = useLocation();
// // //     const navigate = useNavigate();
// // //     const { url: initialUrl, qrName: initialQrName, category: initialCategory } = location.state || {};
// // //
// // //     const [selectedPattern, setSelectedPattern] = useState('square');
// // //     const [errorCorrection, setErrorCorrection] = useState('M');
// // //     const [foregroundColor, setForegroundColor] = useState('#000000');
// // //     const [backgroundColor, setBackgroundColor] = useState('#ffffff');
// // //     const [selectedFrame, setSelectedFrame] = useState('none');
// // //     const [logoSize, setLogoSize] = useState(20);
// // //     const [qrSize, setQrSize] = useState(300);
// // //     const [qrFormat, setQrFormat] = useState('png');
// // //     const qrRef = useRef();
// // //     const [qrText, setQrText] = useState("My QR Text");
// // //     const [logoBackground, setLogoBackground] = useState(false);
// // //     const [logoText, setLogoText] = useState("");
// // //     const [selectedLogo, setSelectedLogo] = useState(null);
// // //     const [reviewText, setReviewText] = useState("");
// // //
// // //     const [selectedFont, setSelectedFont] = useState("Arial");
// // //     const [fontSize, setFontSize] = useState("16");
// // //     const [textColor, setTextColor] = useState("#000000");
// // //     const [additionalText, setAdditionalText] = useState("");
// // //
// // //     const { generateQRDataURL, downloadQR } = useQRGenerator();
// // //
// // //     const bodyPatterns = [
// // //         { id: 'square', name: 'Square', preview: '■■■' },
// // //         { id: 'circle', name: 'Circle', preview: '●●●' },
// // //         { id: 'rounded', name: 'Rounded', preview: '▢▢▢' },
// // //         { id: 'diamond', name: 'Diamond', preview: '♦♦♦' },
// // //         { id: 'star', name: 'Star', preview: '★★★' },
// // //         { id: 'heart', name: 'Heart', preview: '♥♥♥' },
// // //     ];
// // //
// // //     const errorCorrectionLevels = [
// // //         { id: 'L', name: 'Smallest', description: 'Less cluttered-looking pattern', image: 'https://me-qr.com/build/images/H.e9899973.png' },
// // //         { id: 'M', name: 'Medium', description: 'Balanced cluttered-looking pattern', image: 'https://me-qr.com/build/images/Q.ff9fdcdf.png' },
// // //         { id: 'Q', name: 'High', description: 'Optimal damage-resistant pattern', image: 'https://me-qr.com/build/images/M.06e46c88.png' },
// // //         { id: 'H', name: 'Best', description: 'Maximum damage-resistant pattern', image: 'https://me-qr.com/build/images/L.b30d70f1.png' },
// // //     ];
// // //
// // //     const frameOptions = [
// // //         { id: "none", name: "No Frame" },
// // //         { id: "basic", name: "Basic Border" },
// // //         { id: "rounded", name: "Rounded Border" },
// // //         { id: "decorative", name: "Decorative Frame" },
// // //         { id: "gradient", name: "Gradient Frame" },
// // //     ];
// // //     const handleDownloadQR = async () => {
// // //         if (!initialUrl) return;
// // //
// // //         const qrDataURL = await generateQRDataURL(initialUrl, {
// // //             size: parseInt(qrSize),
// // //             backgroundColor,
// // //             foregroundColor,
// // //             errorCorrection,
// // //             pattern: selectedPattern,
// // //             type: qrFormat === 'svg' ? 'svg' : `image/${qrFormat}`,
// // //             logo: selectedLogo,
// // //             logoSize,
// // //             logoBackground,
// // //             logoText,
// // //             frame: selectedFrame,
// // //             additionalText,
// // //             font: selectedFont,
// // //             fontSize,
// // //             textColor,
// // //         });
// // //
// // //         if (!qrDataURL) return;
// // //
// // //         downloadQR(qrDataURL, initialQrName || 'Untitled QR Code', qrFormat);
// // //     };
// // //
// // //     // const handleDownloadQR = async () => {
// // //     //     if (!initialUrl) return;
// // //     //
// // //     //     const qrDataURL = await generateQRDataURL(initialUrl, {
// // //     //         size: parseInt(qrSize),
// // //     //         backgroundColor,
// // //     //         foregroundColor,
// // //     //         errorCorrection,
// // //     //         pattern: selectedPattern,
// // //     //         type: qrFormat === 'svg' ? 'svg' : `image/${qrFormat}`,
// // //     //     });
// // //     //
// // //     //     if (!qrDataURL) return;
// // //     //
// // //     //     downloadQR(qrDataURL, initialQrName || 'Untitled QR Code', qrFormat);
// // //     // };
// // //
// // //     const handleBack = () => {
// // //         navigate('/module/qr/qr-link');
// // //     };
// // //
// // //     const qrOptions = {
// // //         size: 300,
// // //         backgroundColor,
// // //         foregroundColor,
// // //         errorCorrection,
// // //         pattern: selectedPattern,
// // //     };
// // //
// // //     if (!initialUrl) {
// // //         navigate('/module/qr/qr-link');
// // //         return null;
// // //     }
// // //
// // //     return (
// // //         <div className="relative mx-auto lg:flex lg:gap-8 p-4">
// // //             <button
// // //                 onClick={handleBack}
// // //                 className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-primary  mb-10 text-white rounded-lg border border-purple-400 shadow-md hover:from-purple-600 hover:to-purple-700 transition-all duration-200 z-10"
// // //             >
// // //                 <ArrowLeft className="w-4 h-4" />
// // //                 Back
// // //             </button>
// // //
// // //             <div className="lg:w-2/3 space-y-6 overflow-y-auto max-h-screen p-4 rounded-xl mt-10">
// // //                 <PatternSelector
// // //                     patterns={bodyPatterns}
// // //                     selectedPattern={selectedPattern}
// // //                     onSelect={setSelectedPattern}
// // //                 />
// // //                 <ErrorCorrectionSelector
// // //                     levels={errorCorrectionLevels}
// // //                     selected={errorCorrection}
// // //                     onSelect={setErrorCorrection}
// // //                 />
// // //                 <ColorSelector
// // //                     foregroundColor={foregroundColor}
// // //                     backgroundColor={backgroundColor}
// // //                     onForegroundChange={setForegroundColor}
// // //                     onBackgroundChange={setBackgroundColor}
// // //                 />
// // //                 <TextFormattingUI
// // //                     reviewText={additionalText}
// // //                     onReviewTextChange={setAdditionalText}
// // //                     font={selectedFont}
// // //                     onFontChange={setSelectedFont}
// // //                     fontSize={fontSize}
// // //                     onFontSizeChange={setFontSize}
// // //                     textColor={textColor}
// // //                     onTextColorChange={setTextColor}
// // //                     setAdditionalText={setAdditionalText}
// // //                     setTextColor={setTextColor}
// // //
// // //
// // //
// // //
// // //
// // //                 />
// // //
// // //                 <FrameSelector
// // //                     frames={frameOptions}
// // //                     selectedFrame={selectedFrame}
// // //                     onSelect={setSelectedFrame}
// // //                 />
// // //                 {/*<SizeControl size={qrSize} onSizeChange={setQrSize} />*/}
// // //                 <LogoUpload
// // //                     logoSize={logoSize}
// // //                     onLogoSizeChange={setLogoSize}
// // //                     selectedLogo={selectedLogo}
// // //                     onSelectLogo={setSelectedLogo}
// // //                     text={qrText}
// // //                     onTextChange={setQrText}
// // //                     logoBackground={logoBackground}
// // //                     onLogoBackgroundChange={setLogoBackground}
// // //                     logoText={logoText}
// // //                     onLogoTextChange={setLogoText}
// // //                 />
// // //             </div>
// // //             <div className="lg:w-1/3 flex flex-col mt-14 justify-center items-center p-4 space-y-4 mb-20 bg-white dark:text-gray-200 dark:bg-bodybg ">
// // //                 <QRPreview
// // //                     url={initialUrl}
// // //                     qrOptions={qrOptions}
// // //                     selectedFrame={selectedFrame}
// // //                     qrRef={qrRef}
// // //                     logo={selectedLogo}
// // //                     logoSize={logoSize}
// // //                     logoBackground={logoBackground}
// // //                     logoText={logoText}
// // //
// // //                     reviewText={reviewText}
// // //                     additionalText={additionalText }
// // //
// // //                 />
// // //
// // //                     <div
// // //                         style={{
// // //                             fontFamily: selectedFont,
// // //                             fontSize: `${fontSize}px`,
// // //                             color: textColor,
// // //                         }}
// // //                     >
// // //                         {additionalText}
// // //                     </div>
// // //
// // //                 <div className="w-full space-y-8">
// // //                     <div className="flex flex-col sm:flex-row gap-4">
// // //                         <div className="flex-1">
// // //                             <label className="block text-sm font-medium text-gray-700 mb-1">
// // //                                 Format
// // //                             </label>
// // //                             <select
// // //                                 value={qrFormat}
// // //                                 onChange={(e) => setQrFormat(e.target.value)}
// // //                                 className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
// // //                             >
// // //                                 <option value="png">PNG</option>
// // //                                 <option value="jpeg">JPEG</option>
// // //                                 <option value="svg">SVG</option>
// // //                             </select>
// // //                         </div>
// // //                         <div className="flex-1">
// // //                             <label className="block text-sm font-medium text-gray-700 mb-1">
// // //                                 Size
// // //                             </label>
// // //                             <select
// // //                                 value={qrSize}
// // //                                 onChange={(e) => setQrSize(e.target.value)}
// // //                                 className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
// // //                             >
// // //                                 <option value="100">100x100</option>
// // //                                 <option value="200">200x200</option>
// // //                                 <option value="300">300x300</option>
// // //                                 <option value="400">400x400</option>
// // //                                 <option value="400">500x500</option>
// // //                                 <option value="400">600x600</option>
// // //                                 <option value="400">700x700</option>
// // //                                 <option value="400">800x800</option>
// // //                                 <option value="400">900x900</option>
// // //                                 <option value="400">1000x1000</option>
// // //                             </select>
// // //                         </div>
// // //                     </div>
// // //                     <button
// // //                         onClick={handleDownloadQR}
// // //                         className="w-full text-white py-4 px-6 bg-primary rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
// // //                     >
// // //                         <Download className="w-5 h-5 inline-block mr-2"/>
// // //                         Download QR Code
// // //                     </button>
// // //                 </div>
// // //             </div>
// // //         </div>
// // //     );
// // // };
// // //
// // // export default CustomizeQR;
// // // import React, { useState, useRef, useEffect } from 'react';
// // // import { Download, ArrowLeft } from 'lucide-react';
// // // import { useLocation, useNavigate } from 'react-router-dom';
// // // import QRPreview from './QRPreview';
// // // import PatternSelector from './PatternSelector';
// // // import ErrorCorrectionSelector from './ErrorCorrectionSelector';
// // // import ColorSelector from './ColorSelector';
// // // import FrameSelector from './FrameSelector';
// // // import LogoUpload from './LogoUpload';
// // // import useQRGenerator from '@modules/qr-generator/Hooks/useQRGenerator.js';
// // // import TextFormattingUI from "@modules/qr-generator/components/QrLink/TextFormatting.jsx";
// // //
// // //
// // // const CustomizeQR = () => {
// // //     const location = useLocation();
// // //     const navigate = useNavigate();
// // //
// // //     const savedData = JSON.parse(localStorage.getItem("qrData") || "{}");
// // //     const { url: initialUrl, qrName: initialQrName, category: initialCategory } =
// // //     location.state || savedData || {};
// // //
// // //     useEffect(() => {
// // //         if (location.state?.url) {
// // //             localStorage.setItem("qrData", JSON.stringify(location.state));
// // //         }
// // //     }, [location.state]);
// // //
// // //     const [selectedPattern, setSelectedPattern] = useState('square');
// // //     const [errorCorrection, setErrorCorrection] = useState('M');
// // //     const [foregroundColor, setForegroundColor] = useState('#000000');
// // //     const [backgroundColor, setBackgroundColor] = useState('#ffffff');
// // //     const [selectedFrame, setSelectedFrame] = useState('none');
// // //     const [logoSize, setLogoSize] = useState(20);
// // //     const [qrSize, setQrSize] = useState(300);
// // //     const [qrFormat, setQrFormat] = useState('png');
// // //     const qrRef = useRef();
// // //     const [qrText, setQrText] = useState("My QR Text");
// // //     const [logoBackground, setLogoBackground] = useState(false);
// // //     const [logoText, setLogoText] = useState("");
// // //     const [selectedLogo, setSelectedLogo] = useState(null);
// // //     const [reviewText, setReviewText] = useState("");
// // //
// // //     const [selectedFont, setSelectedFont] = useState("Arial");
// // //     const [fontSize, setFontSize] = useState("16");
// // //     const [textColor, setTextColor] = useState("#000000");
// // //     const [additionalText, setAdditionalText] = useState("");
// // //
// // //     // const [externalColor, setExternalColor] = useState('#000000');
// // //     // const [internalColor, setInternalColor] = useState('#000000');
// // //     // const [externalGradient, setExternalGradient] = useState(false);
// // //     // const [internalGradient, setInternalGradient] = useState(false);
// // //     // const [selectedExternal, setSelectedExternal] = useState(null);
// // //     // const [selectedInternal, setSelectedInternal] = useState(null);
// // //
// // //     const { generateQRDataURL, downloadQR } = useQRGenerator();
// // //
// // //     const bodyPatterns = [
// // //         { id: 'square', name: 'Square', preview: '■■■' },
// // //         { id: 'circle', name: 'Circle', preview: '●●●' },
// // //         { id: 'rounded', name: 'Rounded', preview: '▢▢▢' },
// // //         { id: 'diamond', name: 'Diamond', preview: '♦♦♦' },
// // //         { id: 'star', name: 'Star', preview: '★★★' },
// // //         { id: 'heart', name: 'Heart', preview: '♥♥♥' },
// // //     ];
// // //
// // //     const errorCorrectionLevels = [
// // //         { id: 'L', name: 'Smallest', description: 'Less cluttered-looking pattern', image: 'https://me-qr.com/build/images/H.e9899973.png' },
// // //         { id: 'M', name: 'Medium', description: 'Balanced cluttered-looking pattern', image: 'https://me-qr.com/build/images/Q.ff9fdcdf.png' },
// // //         { id: 'Q', name: 'High', description: 'Optimal damage-resistant pattern', image: 'https://me-qr.com/build/images/M.06e46c88.png' },
// // //         { id: 'H', name: 'Best', description: 'Maximum damage-resistant pattern', image: 'https://me-qr.com/build/images/L.b30d70f1.png' },
// // //     ];
// // //
// // //     const frameOptions = [
// // //         { id: "none", name: "No Frame" },
// // //         { id: "basic", name: "Basic Border" },
// // //         { id: "rounded", name: "Rounded Border" },
// // //         { id: "decorative", name: "Decorative Frame" },
// // //         { id: "gradient", name: "Gradient Frame" },
// // //     ];
// // //
// // //     const handleDownloadQR = async () => {
// // //         if (!initialUrl) return;
// // //
// // //         const qrDataURL = await generateQRDataURL(initialUrl, {
// // //             size: parseInt(qrSize),
// // //             backgroundColor,
// // //             foregroundColor,
// // //             errorCorrection,
// // //             pattern: selectedPattern,
// // //             type: qrFormat === 'svg' ? 'svg' : `image/${qrFormat}`,
// // //             logo: selectedLogo,
// // //             logoSize,
// // //             logoBackground,
// // //             logoText,
// // //             frame: selectedFrame,
// // //             additionalText,
// // //             font: selectedFont,
// // //             fontSize,
// // //             textColor,
// // //         });
// // //
// // //         if (!qrDataURL) return;
// // //         downloadQR(qrDataURL, initialQrName || 'Untitled QR Code', qrFormat);
// // //     };
// // //
// // //     const handleBack = () => {
// // //         navigate('/module/qr/qr-link');
// // //     };
// // //
// // //     const qrOptions = {
// // //         size: 300,
// // //         backgroundColor,
// // //         foregroundColor,
// // //         errorCorrection,
// // //         pattern: selectedPattern,
// // //     };
// // //
// // //
// // //
// // //
// // //     return (
// // //         <div className="relative mx-auto lg:flex lg:gap-8 p-4">
// // //             {/*<button*/}
// // //             {/*    onClick={handleBack}*/}
// // //             {/*    className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-primary mb-10 text-white rounded-lg border border-purple-400 shadow-md hover:bg-primary/80 transition-all duration-200 z-10"*/}
// // //             {/*>*/}
// // //             {/*    <ArrowLeft className="w-4 h-4" />*/}
// // //             {/*    Back*/}
// // //             {/*</button>*/}
// // //
// // //             <div className="lg:w-2/3 space-y-6 overflow-y-auto max-h-screen p-4 rounded-xl mt-10">
// // //                 <PatternSelector
// // //                     patterns={bodyPatterns}
// // //                     selectedPattern={selectedPattern}
// // //                     onSelect={setSelectedPattern}
// // //                 />
// // //                 <ErrorCorrectionSelector
// // //                     levels={errorCorrectionLevels}
// // //                     selected={errorCorrection}
// // //                     onSelect={setErrorCorrection}
// // //                 />
// // //                 <ColorSelector
// // //                     foregroundColor={foregroundColor}
// // //                     backgroundColor={backgroundColor}
// // //                     onForegroundChange={setForegroundColor}
// // //                     onBackgroundChange={setBackgroundColor}
// // //                 />
// // //                 <TextFormattingUI
// // //                     reviewText={additionalText}
// // //                     onReviewTextChange={setAdditionalText}
// // //                     font={selectedFont}
// // //                     onFontChange={setSelectedFont}
// // //                     fontSize={fontSize}
// // //                     onFontSizeChange={setFontSize}
// // //                     textColor={textColor}
// // //                     onTextColorChange={setTextColor}
// // //                     setAdditionalText={setAdditionalText}
// // //                     setTextColor={setTextColor}
// // //                 />
// // //                 <FrameSelector
// // //                     frames={frameOptions}
// // //                     selectedFrame={selectedFrame}
// // //                     onSelect={setSelectedFrame}
// // //                 />
// // //
// // //                 <LogoUpload
// // //                     logoSize={logoSize}
// // //                     onLogoSizeChange={setLogoSize}
// // //                     selectedLogo={selectedLogo}
// // //                     onSelectLogo={setSelectedLogo}
// // //                     text={qrText}
// // //                     onTextChange={setQrText}
// // //                     logoBackground={logoBackground}
// // //                     onLogoBackgroundChange={setLogoBackground}
// // //                     logoText={logoText}
// // //                     onLogoTextChange={setLogoText}
// // //                 />
// // //
// // //
// // //
// // //             </div>
// // //
// // //             <div className="lg:w-1/3 flex flex-col mt-14 justify-center items-center p-4 space-y-4 mb-20 bg-white dark:text-gray-200 dark:bg-bodybg">
// // //
// // //                 <QRPreview
// // //                     url={initialUrl}
// // //                     qrOptions={qrOptions}
// // //                     selectedFrame={selectedFrame}
// // //                     qrRef={qrRef}
// // //                     qrFormat={qrFormat}
// // //                     logo={selectedLogo}
// // //                     logoSize={logoSize}
// // //                     logoBackground={logoBackground}
// // //                     logoText={logoText}
// // //                     reviewText={reviewText}
// // //                     additionalText={additionalText}
// // //
// // //                 />
// // //
// // //
// // //
// // //                 <div
// // //                     style={{
// // //                         fontFamily: selectedFont,
// // //                         fontSize: `${fontSize}px`,
// // //                         color: textColor,
// // //                     }}
// // //                 >
// // //                     {additionalText}
// // //                 </div>
// // //
// // //                 <div className="w-full space-y-8">
// // //                     <div className="flex flex-col sm:flex-row gap-4">
// // //                         <div className="flex-1">
// // //                             <label className="text-[0.875rem] mb-1 font-semibold">
// // //                                 Format
// // //                             </label>
// // //                             <select
// // //                                 value={qrFormat}
// // //                                 onChange={(e) => setQrFormat(e.target.value)}
// // //                                 className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
// // //                             >
// // //                                 <option value="png">PNG</option>
// // //                                 <option value="jpeg">JPEG</option>
// // //                                 <option value="svg">SVG</option>
// // //                             </select>
// // //                         </div>
// // //                         <div className="flex-1">
// // //                             <label className="text-[0.875rem] mb-1 font-semibold">
// // //                                 Size
// // //                             </label>
// // //                             <select
// // //                                 value={qrSize}
// // //                                 onChange={(e) => setQrSize(e.target.value)}
// // //                                 className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
// // //                             >
// // //                                 <option value="100">100x100</option>
// // //                                 <option value="200">200x200</option>
// // //                                 <option value="300">300x300</option>
// // //                                 <option value="400">400x400</option>
// // //                                 <option value="500">500x500</option>
// // //                                 <option value="600">600x600</option>
// // //                                 <option value="700">700x700</option>
// // //                                 <option value="800">800x800</option>
// // //                                 <option value="900">900x900</option>
// // //                                 <option value="1000">1000x1000</option>
// // //                             </select>
// // //                         </div>
// // //                     </div>
// // //                     <button
// // //                         onClick={handleDownloadQR}
// // //                         className="w-full text-white py-4 px-6 bg-primary rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
// // //                     >
// // //                         <Download className="w-5 h-5 inline-block mr-2" />
// // //                         Download QR Code
// // //                     </button>
// // //                 </div>
// // //             </div>
// // //         </div>
// // //     );
// // // };
// // //
// // // export default CustomizeQR;
// //
// // import React, { useState, useRef, useEffect } from "react";
// // import { Download, ArrowLeft } from "lucide-react";
// // import { useLocation, useNavigate } from "react-router-dom";
// // import QRPreview from "./QRPreview";
// // import PatternSelector from "./PatternSelector";
// // import ErrorCorrectionSelector from "./ErrorCorrectionSelector";
// // import ColorSelector from "./ColorSelector";
// // import FrameSelector from "./FrameSelector";
// // import LogoUpload from "./LogoUpload";
// // import useQRGenerator from "@modules/qr-generator/Hooks/useQRGenerator.js";
// // import TextFormattingUI from "@modules/qr-generator/components/QrLink/TextFormatting.jsx";
// //
// // const CustomizeQR = () => {
// //     const location = useLocation();
// //     const navigate = useNavigate();
// //
// //     const savedData = JSON.parse(localStorage.getItem("qrData") || "{}");
// //     const { url: initialUrl, qrName: initialQrName, category: initialCategory } =
// //     location.state || savedData || {};
// //
// //     useEffect(() => {
// //         if (location.state?.url) {
// //             localStorage.setItem("qrData", JSON.stringify(location.state));
// //         }
// //     }, [location.state]);
// //
// //     const [selectedPattern, setSelectedPattern] = useState("square");
// //     const [errorCorrection, setErrorCorrection] = useState("M");
// //     const [foregroundColor, setForegroundColor] = useState("#000000");
// //     const [backgroundColor, setBackgroundColor] = useState("#ffffff");
// //     const [selectedFrame, setSelectedFrame] = useState("none");
// //     const [logoSize, setLogoSize] = useState(20);
// //     const [qrSize, setQrSize] = useState(300);
// //     const [qrFormat, setQrFormat] = useState("png");
// //     const [selectedLogo, setSelectedLogo] = useState(null);
// //     const [logoBackground, setLogoBackground] = useState(false);
// //     const [logoText, setLogoText] = useState("");
// //     const [reviewText, setReviewText] = useState("");
// //     const [additionalText, setAdditionalText] = useState("");
// //     const [selectedFont, setSelectedFont] = useState("Arial");
// //     const [fontSize, setFontSize] = useState("16");
// //     const [textColor, setTextColor] = useState("#000000");
// //     const [error, setError] = useState("");
// //
// //     const qrRef = useRef();
// //
// //     const { generateQRDataURL, downloadQR } = useQRGenerator();
// //
// //     const bodyPatterns = [
// //         { id: "square", name: "Square", preview: "■■■" },
// //         { id: "circle", name: "Circle", preview: "●●●" },
// //         { id: "rounded", name: "Rounded", preview: "▢▢▢" },
// //         { id: "diamond", name: "Diamond", preview: "♦♦♦" },
// //         { id: "star", name: "Star", preview: "★★★" },
// //         { id: "heart", name: "Heart", preview: "♥♥♥" },
// //     ];
// //
// //     const errorCorrectionLevels = [
// //         {
// //             id: "L",
// //             name: "Smallest",
// //             description: "Less cluttered-looking pattern",
// //             image: "https://me-qr.com/build/images/H.e9899973.png",
// //         },
// //         {
// //             id: "M",
// //             name: "Medium",
// //             description: "Balanced cluttered-looking pattern",
// //             image: "https://me-qr.com/build/images/Q.ff9fdcdf.png",
// //         },
// //         {
// //             id: "Q",
// //             name: "High",
// //             description: "Optimal damage-resistant pattern",
// //             image: "https://me-qr.com/build/images/M.06e46c88.png",
// //         },
// //         {
// //             id: "H",
// //             name: "Best",
// //             description: "Maximum damage-resistant pattern",
// //             image: "https://me-qr.com/build/images/L.b30d70f1.png",
// //         },
// //     ];
// //
// //     const frameOptions = [
// //         { id: "none", name: "No Frame" },
// //         { id: "basic", name: "Basic Border" },
// //         { id: "rounded", name: "Rounded Border" },
// //         { id: "decorative", name: "Decorative Frame" },
// //         { id: "gradient", name: "Gradient Frame" },
// //     ];
// //
// //     const handleDownloadQR = async () => {
// //         // Use initialUrl if available, else fallback to a default URL
// //         const urlToUse = initialUrl || "https://example.com";
// //         setError(""); // Clear any previous errors
// //         const qrDataURL = await generateQRDataURL(urlToUse, {
// //             size: parseInt(qrSize),
// //             backgroundColor,
// //             foregroundColor,
// //             errorCorrection,
// //             pattern: selectedPattern,
// //             type: qrFormat === "svg" ? "svg" : `image/${qrFormat}`,
// //             logo: selectedLogo,
// //             logoSize,
// //             logoBackground,
// //             logoText,
// //             frame: selectedFrame,
// //             additionalText,
// //             font: selectedFont,
// //             fontSize,
// //             textColor,
// //         });
// //
// //         if (!qrDataURL) {
// //             setError("Failed to generate QR code. Please try again.");
// //             return;
// //         }
// //         downloadQR(qrDataURL, initialQrName || "Untitled QR Code", qrFormat);
// //     };
// //
// //     const handleBack = () => {
// //         navigate("/module/qr/qr-link");
// //     };
// //
// //     const qrOptions = {
// //         size: parseInt(qrSize),
// //         backgroundColor,
// //         foregroundColor,
// //         errorCorrection,
// //         pattern: selectedPattern,
// //     };
// //
// //     return (
// //         <div className="relative mx-auto lg:flex lg:gap-8 p-4">
// //             <button
// //                 onClick={handleBack}
// //                 className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-primary mb-10 text-white rounded-lg border border-purple-400 shadow-md hover:bg-primary/80 transition-all duration-200 z-10"
// //             >
// //                 <ArrowLeft className="w-4 h-4" />
// //                 Back
// //             </button>
// //
// //             <div className="lg:w-2/3 space-y-6 overflow-y-auto max-h-screen p-4 rounded-xl mt-10">
// //                 <PatternSelector
// //                     patterns={bodyPatterns}
// //                     selectedPattern={selectedPattern}
// //                     onSelect={setSelectedPattern}
// //                 />
// //                 <ErrorCorrectionSelector
// //                     levels={errorCorrectionLevels}
// //                     selected={errorCorrection}
// //                     onSelect={setErrorCorrection}
// //                 />
// //                 <ColorSelector
// //                     foregroundColor={foregroundColor}
// //                     backgroundColor={backgroundColor}
// //                     onForegroundChange={setForegroundColor}
// //                     onBackgroundChange={setBackgroundColor}
// //                 />
// //                 <div>
// //                     <label className="text-[0.875rem] mb-1 font-semibold">Review Text (optional)</label>
// //                     <input
// //                         type="text"
// //                         value={reviewText}
// //                         onChange={(e) => setReviewText(e.target.value)}
// //                         placeholder="Enter review text to display below QR"
// //                         className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
// //                     />
// //                 </div>
// //                 <TextFormattingUI
// //                     reviewText={additionalText}
// //                     onReviewTextChange={setAdditionalText}
// //                     font={selectedFont}
// //                     onFontChange={setSelectedFont}
// //                     fontSize={fontSize}
// //                     onFontSizeChange={setFontSize}
// //                     textColor={textColor}
// //                     onTextColorChange={setTextColor}
// //                     setAdditionalText={setAdditionalText}
// //                     setTextColor={setTextColor}
// //                 />
// //                 <FrameSelector
// //                     frames={frameOptions}
// //                     selectedFrame={selectedFrame}
// //                     onSelect={setSelectedFrame}
// //                 />
// //                 <LogoUpload
// //                     logoSize={logoSize}
// //                     onLogoSizeChange={setLogoSize}
// //                     selectedLogo={selectedLogo}
// //                     onSelectLogo={setSelectedLogo}
// //                     text={reviewText}
// //                     onTextChange={setReviewText}
// //                     logoBackground={logoBackground}
// //                     onLogoBackgroundChange={setLogoBackground}
// //                     logoText={logoText}
// //                     onLogoTextChange={setLogoText}
// //                 />
// //             </div>
// //
// //             <div className="lg:w-1/3 flex flex-col mt-14 justify-center items-center p-4 space-y-4 mb-20 bg-white dark:text-gray-200 dark:bg-bodybg">
// //                 {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
// //                 <QRPreview
// //                     url={initialUrl}
// //                     qrOptions={qrOptions}
// //                     selectedFrame={selectedFrame}
// //                     qrRef={qrRef}
// //                     qrFormat={qrFormat}
// //                     logo={selectedLogo}
// //                     logoSize={logoSize}
// //                     logoBackground={logoBackground}
// //                     logoText={logoText}
// //                     reviewText={reviewText}
// //                     additionalText={additionalText}
// //                 />
// //
// //                 <div
// //                     style={{
// //                         fontFamily: selectedFont,
// //                         fontSize: `${fontSize}px`,
// //                         color: textColor,
// //                     }}
// //                 >
// //                     {additionalText}
// //                 </div>
// //
// //                 <div className="w-full space-y-8">
// //                     <div className="flex flex-col sm:flex-row gap-4">
// //                         <div className="flex-1">
// //                             <label className="text-[0.875rem] mb-1 font-semibold">Format</label>
// //                             <select
// //                                 value={qrFormat}
// //                                 onChange={(e) => setQrFormat(e.target.value)}
// //                                 className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
// //                             >
// //                                 <option value="png">PNG</option>
// //                                 <option value="jpeg">JPEG</option>
// //                                 <option value="svg">SVG</option>
// //                             </select>
// //                         </div>
// //                         <div className="flex-1">
// //                             <label className="text-[0.875rem] mb-1 font-semibold">Size</label>
// //                             <select
// //                                 value={qrSize}
// //                                 onChange={(e) => setQrSize(e.target.value)}
// //                                 className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
// //                             >
// //                                 <option value="100">100x100</option>
// //                                 <option value="200">200x200</option>
// //                                 <option value="300">300x300</option>
// //                                 <option value="400">400x400</option>
// //                                 <option value="500">500x500</option>
// //                                 <option value="600">600x600</option>
// //                                 <option value="700">700x700</option>
// //                                 <option value="800">800x800</option>
// //                                 <option value="900">900x900</option>
// //                                 <option value="1000">1000x1000</option>
// //                             </select>
// //                         </div>
// //                     </div>
// //                     <button
// //                         onClick={handleDownloadQR}
// //                         className="w-full text-white py-4 px-6 bg-primary rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
// //                     >
// //                         <Download className="w-5 h-5 inline-block mr-2" />
// //                         Download QR Code
// //                     </button>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };
// //
// // export default CustomizeQR;
// import React, { useState, useRef, useEffect } from "react";
// import { Download, ArrowLeft } from "lucide-react";
// import { useLocation, useNavigate } from "react-router-dom";
// import QRPreview from "./QRPreview";
// import PatternSelector from "./PatternSelector";
// import ErrorCorrectionSelector from "./ErrorCorrectionSelector";
// import ColorSelector from "./ColorSelector";
// import FrameSelector from "./FrameSelector";
// import LogoUpload from "./LogoUpload";
// import useQRGenerator from "@modules/qr-generator/Hooks/useQRGenerator.js";
// import TextFormattingUI from "@modules/qr-generator/components/QrLink/TextFormatting.jsx";
//
// const CustomizeQR = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//
//     const savedData = JSON.parse(localStorage.getItem("qrData") || "{}");
//     const { facebookLink, url, qrName: initialQrName, category: initialCategory } =
//     location.state || savedData || {};
//
//     useEffect(() => {
//         if (location.state?.facebookLink || location.state?.url) {
//             localStorage.setItem("qrData", JSON.stringify(location.state));
//         }
//     }, [location.state]);
//
//     const [selectedPattern, setSelectedPattern] = useState("square");
//     const [errorCorrection, setErrorCorrection] = useState("M");
//     const [foregroundColor, setForegroundColor] = useState("#000000");
//     const [backgroundColor, setBackgroundColor] = useState("#ffffff");
//     const [selectedFrame, setSelectedFrame] = useState("none");
//     const [logoSize, setLogoSize] = useState(20);
//     const [qrSize, setQrSize] = useState(300);
//     const [qrFormat, setQrFormat] = useState("png");
//     const [selectedLogo, setSelectedLogo] = useState(null);
//     const [logoBackground, setLogoBackground] = useState(false);
//     const [logoText, setLogoText] = useState("");
//     const [reviewText, setReviewText] = useState("");
//     const [additionalText, setAdditionalText] = useState("");
//     const [selectedFont, setSelectedFont] = useState("Arial");
//     const [fontSize, setFontSize] = useState("16");
//     const [textColor, setTextColor] = useState("#000000");
//     const [error, setError] = useState("");
//
//     const qrRef = useRef();
//
//     const { generateQRDataURL, downloadQR } = useQRGenerator();
//
//     const bodyPatterns = [
//         { id: "square", name: "Square", preview: "■■■" },
//         { id: "circle", name: "Circle", preview: "●●●" },
//         { id: "rounded", name: "Rounded", preview: "▢▢▢" },
//         { id: "diamond", name: "Diamond", preview: "♦♦♦" },
//         { id: "star", name: "Star", preview: "★★★" },
//         { id: "heart", name: "Heart", preview: "♥♥♥" },
//     ];
//
//     const errorCorrectionLevels = [
//         {
//             id: "L",
//             name: "Smallest",
//             description: "Less cluttered-looking pattern",
//             image: "https://me-qr.com/build/images/H.e9899973.png",
//         },
//         {
//             id: "M",
//             name: "Medium",
//             description: "Balanced cluttered-looking pattern",
//             image: "https://me-qr.com/build/images/Q.ff9fdcdf.png",
//         },
//         {
//             id: "Q",
//             name: "High",
//             description: "Optimal damage-resistant pattern",
//             image: "https://me-qr.com/build/images/M.06e46c88.png",
//         },
//         {
//             id: "H",
//             name: "Best",
//             description: "Maximum damage-resistant pattern",
//             image: "https://me-qr.com/build/images/L.b30d70f1.png",
//         },
//     ];
//
//     const frameOptions = [
//         { id: "none", name: "No Frame" },
//         { id: "basic", name: "Basic Border" },
//         { id: "rounded", name: "Rounded Border" },
//         { id: "decorative", name: "Decorative Frame" },
//         { id: "gradient", name: "Gradient Frame" },
//     ];
//
//     const handleDownloadQR = async () => {
//         // Use facebookLink if available, else url, else fallback to default
//         const urlToUse = facebookLink || url || "https://example.com";
//         setError(""); // Clear any previous errors
//         const qrDataURL = await generateQRDataURL(urlToUse, {
//             size: parseInt(qrSize),
//             backgroundColor,
//             foregroundColor,
//             errorCorrection,
//             pattern: selectedPattern,
//             type: qrFormat === "svg" ? "svg" : `image/${qrFormat}`,
//             logo: selectedLogo,
//             logoSize,
//             logoBackground,
//             logoText,
//             frame: selectedFrame,
//             additionalText,
//             font: selectedFont,
//             fontSize,
//             textColor,
//         });
//
//         if (!qrDataURL) {
//             setError("Failed to generate QR code. Please try again.");
//             return;
//         }
//         downloadQR(qrDataURL, initialQrName || "Untitled QR Code", qrFormat);
//     };
//
//     const handleBack = () => {
//         navigate("/module/qr/qr-link");
//     };
//
//     const qrOptions = {
//         size: parseInt(qrSize),
//         backgroundColor,
//         foregroundColor,
//         errorCorrection,
//         pattern: selectedPattern,
//     };
//
//     return (
//         <div className="relative mx-auto lg:flex lg:gap-8 p-4">
//             <button
//                 onClick={handleBack}
//                 className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-primary mb-10 text-white rounded-lg border border-purple-400 shadow-md hover:bg-primary/80 transition-all duration-200 z-10"
//             >
//                 <ArrowLeft className="w-4 h-4" />
//                 Back
//             </button>
//
//             <div className="lg:w-2/3 space-y-6 overflow-y-auto max-h-screen p-4 rounded-xl mt-10">
//                 <PatternSelector
//                     patterns={bodyPatterns}
//                     selectedPattern={selectedPattern}
//                     onSelect={setSelectedPattern}
//                 />
//                 <ErrorCorrectionSelector
//                     levels={errorCorrectionLevels}
//                     selected={errorCorrection}
//                     onSelect={setErrorCorrection}
//                 />
//                 <ColorSelector
//                     foregroundColor={foregroundColor}
//                     backgroundColor={backgroundColor}
//                     onForegroundChange={setForegroundColor}
//                     onBackgroundChange={setBackgroundColor}
//                 />
//                 <div>
//                     <label className="text-[0.875rem] mb-1 font-semibold">Review Text (optional)</label>
//                     <input
//                         type="text"
//                         value={reviewText}
//                         onChange={(e) => setReviewText(e.target.value)}
//                         placeholder="Enter review text to display below QR"
//                         className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
//                     />
//                 </div>
//                 <TextFormattingUI
//                     reviewText={additionalText}
//                     onReviewTextChange={setAdditionalText}
//                     font={selectedFont}
//                     onFontChange={setSelectedFont}
//                     fontSize={fontSize}
//                     onFontSizeChange={setFontSize}
//                     textColor={textColor}
//                     onTextColorChange={setTextColor}
//                     setAdditionalText={setAdditionalText}
//                     setTextColor={setTextColor}
//                 />
//                 <FrameSelector
//                     frames={frameOptions}
//                     selectedFrame={selectedFrame}
//                     onSelect={setSelectedFrame}
//                 />
//                 <LogoUpload
//                     logoSize={logoSize}
//                     onLogoSizeChange={setLogoSize}
//                     selectedLogo={selectedLogo}
//                     onSelectLogo={setSelectedLogo}
//                     text={reviewText}
//                     onTextChange={setReviewText}
//                     logoBackground={logoBackground}
//                     onLogoBackgroundChange={setLogoBackground}
//                     logoText={logoText}
//                     onLogoTextChange={setLogoText}
//                 />
//             </div>
//
//             <div className="lg:w-1/3 flex flex-col mt-14 justify-center items-center p-4 space-y-4 mb-20 bg-white dark:text-gray-200 dark:bg-bodybg">
//                 {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
//                 <QRPreview
//                     url={facebookLink || url}
//                     qrOptions={qrOptions}
//                     selectedFrame={selectedFrame}
//                     qrRef={qrRef}
//                     qrFormat={qrFormat}
//                     logo={selectedLogo}
//                     logoSize={logoSize}
//                     logoBackground={logoBackground}
//                     logoText={logoText}
//                     reviewText={reviewText}
//                     additionalText={additionalText}
//                 />
//
//                 <div
//                     style={{
//                         fontFamily: selectedFont,
//                         fontSize: `${fontSize}px`,
//                         color: textColor,
//                     }}
//                 >
//                     {additionalText}
//                 </div>
//
//                 <div className="w-full space-y-8">
//                     <div className="flex flex-col sm:flex-row gap-4">
//                         <div className="flex-1">
//                             <label className="text-[0.875rem] mb-1 font-semibold">Format</label>
//                             <select
//                                 value={qrFormat}
//                                 onChange={(e) => setQrFormat(e.target.value)}
//                                 className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
//                             >
//                                 <option value="png">PNG</option>
//                                 <option value="jpeg">JPEG</option>
//                                 <option value="svg">SVG</option>
//                             </select>
//                         </div>
//                         <div className="flex-1">
//                             <label className="text-[0.875rem] mb-1 font-semibold">Size</label>
//                             <select
//                                 value={qrSize}
//                                 onChange={(e) => setQrSize(e.target.value)}
//                                 className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
//                             >
//                                 <option value="100">100x100</option>
//                                 <option value="200">200x200</option>
//                                 <option value="300">300x300</option>
//                                 <option value="400">400x400</option>
//                                 <option value="500">500x500</option>
//                                 <option value="600">600x600</option>
//                                 <option value="700">700x700</option>
//                                 <option value="800">800x800</option>
//                                 <option value="900">900x900</option>
//                                 <option value="1000">1000x1000</option>
//                             </select>
//                         </div>
//                     </div>
//                     <button
//                         onClick={handleDownloadQR}
//                         className="w-full text-white py-4 px-6 bg-primary rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
//                     >
//                         <Download className="w-5 h-5 inline-block mr-2" />
//                         Download QR Code
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default CustomizeQR;

import React, { useState, useRef, useEffect } from "react";
import { Download, ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import QRPreview from "./QRPreview";
import PatternSelector from "./PatternSelector";
import ErrorCorrectionSelector from "./ErrorCorrectionSelector";
import ColorSelector from "./ColorSelector";
import FrameSelector from "./FrameSelector";
import LogoUpload from "./LogoUpload";
import useQRGenerator from "@modules/qr-generator/Hooks/useQRGenerator.js";
import TextFormattingUI from "@modules/qr-generator/components/QrLink/TextFormatting.jsx";

const CustomizeQR = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const savedData = JSON.parse(localStorage.getItem("qrData") || "{}");
    const { whatsappLink, facebookLink, url, qrName: initialQrName, category: initialCategory, country, phoneNumber, message } =
    location.state || savedData || {};

    useEffect(() => {
        if (location.state?.whatsappLink || location.state?.facebookLink || location.state?.url) {
            localStorage.setItem("qrData", JSON.stringify(location.state));
        }
    }, [location.state]);

    const [selectedPattern, setSelectedPattern] = useState("square");
    const [errorCorrection, setErrorCorrection] = useState("M");
    const [foregroundColor, setForegroundColor] = useState("#000000");
    const [backgroundColor, setBackgroundColor] = useState("#ffffff");
    const [selectedFrame, setSelectedFrame] = useState("none");
    const [logoSize, setLogoSize] = useState(20);
    const [qrSize, setQrSize] = useState(300);
    const [qrFormat, setQrFormat] = useState("png");
    const [selectedLogo, setSelectedLogo] = useState(null);
    const [logoBackground, setLogoBackground] = useState(false);
    const [logoText, setLogoText] = useState("");
    const [reviewText, setReviewText] = useState("");
    const [additionalText, setAdditionalText] = useState("");
    const [selectedFont, setSelectedFont] = useState("Arial");
    const [fontSize, setFontSize] = useState("16");
    const [textColor, setTextColor] = useState("#000000");
    const [error, setError] = useState("");

    const qrRef = useRef();

    const { generateQRDataURL, downloadQR } = useQRGenerator();

    const bodyPatterns = [
        { id: "square", name: "Square", preview: "■■■" },
        { id: "circle", name: "Circle", preview: "●●●" },
        { id: "rounded", name: "Rounded", preview: "▢▢▢" },
        { id: "diamond", name: "Diamond", preview: "♦♦♦" },
        { id: "star", name: "Star", preview: "★★★" },
        { id: "heart", name: "Heart", preview: "♥♥♥" },
    ];

    const errorCorrectionLevels = [
        {
            id: "L",
            name: "Smallest",
            description: "Less cluttered-looking pattern",
            image: "https://me-qr.com/build/images/H.e9899973.png",
        },
        {
            id: "M",
            name: "Medium",
            description: "Balanced cluttered-looking pattern",
            image: "https://me-qr.com/build/images/Q.ff9fdcdf.png",
        },
        {
            id: "Q",
            name: "High",
            description: "Optimal damage-resistant pattern",
            image: "https://me-qr.com/build/images/M.06e46c88.png",
        },
        {
            id: "H",
            name: "Best",
            description: "Maximum damage-resistant pattern",
            image: "https://me-qr.com/build/images/L.b30d70f1.png",
        },
    ];

    const frameOptions = [
        { id: "none", name: "No Frame" },
        { id: "basic", name: "Basic Border" },
        { id: "rounded", name: "Rounded Border" },
        { id: "decorative", name: "Decorative Frame" },
        { id: "gradient", name: "Gradient Frame" },
    ];

    const constructWhatsAppLink = () => {
        if (phoneNumber && country) {
            const cleanNumber = phoneNumber.replace(/\D/g, "");
            const encodedMessage = encodeURIComponent(message || "");
            return `https://wa.me/${country.code}${cleanNumber}${message ? `?text=${encodedMessage}` : ""}`;
        }
        return null;
    };

    const handleDownloadQR = async () => {
        // Use whatsappLink, facebookLink, url, or construct WhatsApp link, or fallback to default
        const urlToUse =
            whatsappLink ||
            facebookLink ||
            url ||
            constructWhatsAppLink() ||
            "https://example.com";
        setError(""); // Clear any previous errors
        const qrDataURL = await generateQRDataURL(urlToUse, {
            size: parseInt(qrSize),
            backgroundColor,
            foregroundColor,
            errorCorrection,
            pattern: selectedPattern,
            type: qrFormat === "svg" ? "svg" : `image/${qrFormat}`,
            logo: selectedLogo,
            logoSize,
            logoBackground,
            logoText,
            frame: selectedFrame,
            additionalText,
            font: selectedFont,
            fontSize,
            textColor,
        });

        if (!qrDataURL) {
            setError("Failed to generate QR code. Please try again.");
            return;
        }
        downloadQR(qrDataURL, initialQrName || "Untitled QR Code", qrFormat);
    };

    const handleBack = () => {
        navigate("/module/qr/qr-link");
    };

    const qrOptions = {
        size: parseInt(qrSize),
        backgroundColor,
        foregroundColor,
        errorCorrection,
        pattern: selectedPattern,
    };

    return (
        <div className="relative mx-auto lg:flex lg:gap-8 p-4">
            <button
                onClick={handleBack}
                className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-primary mb-10 text-white rounded-lg border border-purple-400 shadow-md hover:bg-primary/80 transition-all duration-200 z-10"
            >
                <ArrowLeft className="w-4 h-4" />
                Back
            </button>

            <div className="lg:w-2/3 space-y-6 overflow-y-auto max-h-screen p-4 rounded-xl mt-10">
                <PatternSelector
                    patterns={bodyPatterns}
                    selectedPattern={selectedPattern}
                    onSelect={setSelectedPattern}
                />
                <ErrorCorrectionSelector
                    levels={errorCorrectionLevels}
                    selected={errorCorrection}
                    onSelect={setErrorCorrection}
                />
                <ColorSelector
                    foregroundColor={foregroundColor}
                    backgroundColor={backgroundColor}
                    onForegroundChange={setForegroundColor}
                    onBackgroundChange={setBackgroundColor}
                />
                <div>
                    <label className="text-[0.875rem] mb-1 font-semibold">Review Text (optional)</label>
                    <input
                        type="text"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Enter review text to display below QR"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                </div>
                <TextFormattingUI
                    reviewText={additionalText}
                    onReviewTextChange={setAdditionalText}
                    font={selectedFont}
                    onFontChange={setSelectedFont}
                    fontSize={fontSize}
                    onFontSizeChange={setFontSize}
                    textColor={textColor}
                    onTextColorChange={setTextColor}
                    setAdditionalText={setAdditionalText}
                    setTextColor={setTextColor}
                />
                <FrameSelector
                    frames={frameOptions}
                    selectedFrame={selectedFrame}
                    onSelect={setSelectedFrame}
                />
                <LogoUpload
                    logoSize={logoSize}
                    onLogoSizeChange={setLogoSize}
                    selectedLogo={selectedLogo}
                    onSelectLogo={setSelectedLogo}
                    text={reviewText}
                    onTextChange={setReviewText}
                    logoBackground={logoBackground}
                    onLogoBackgroundChange={setLogoBackground}
                    logoText={logoText}
                    onLogoTextChange={setLogoText}
                />
            </div>

            <div className="lg:w-1/3 flex flex-col mt-14 justify-center items-center p-4 space-y-4 mb-20 bg-white dark:text-gray-200 dark:bg-bodybg">
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <QRPreview
                    url={whatsappLink || facebookLink || url || constructWhatsAppLink()}
                    qrOptions={qrOptions}
                    selectedFrame={selectedFrame}
                    qrRef={qrRef}
                    qrFormat={qrFormat}
                    logo={selectedLogo}
                    logoSize={logoSize}
                    logoBackground={logoBackground}
                    logoText={logoText}
                    reviewText={reviewText}
                    additionalText={additionalText}
                />

                <div
                    style={{
                        fontFamily: selectedFont,
                        fontSize: `${fontSize}px`,
                        color: textColor,
                    }}
                >
                    {additionalText}
                </div>

                <div className="w-full space-y-8">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <label className="text-[0.875rem] mb-1 font-semibold">Format</label>
                            <select
                                value={qrFormat}
                                onChange={(e) => setQrFormat(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                            >
                                <option value="png">PNG</option>
                                <option value="jpeg">JPEG</option>
                                <option value="svg">SVG</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="text-[0.875rem] mb-1 font-semibold">Size</label>
                            <select
                                value={qrSize}
                                onChange={(e) => setQrSize(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                            >
                                <option value="100">100x100</option>
                                <option value="200">200x200</option>
                                <option value="300">300x300</option>
                                <option value="400">400x400</option>
                                <option value="500">500x500</option>
                                <option value="600">600x600</option>
                                <option value="700">700x700</option>
                                <option value="800">800x800</option>
                                <option value="900">900x900</option>
                                <option value="1000">1000x1000</option>
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={handleDownloadQR}
                        className="w-full text-white py-4 px-6 bg-primary rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
                    >
                        <Download className="w-5 h-5 inline-block mr-2" />
                        Download QR Code
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomizeQR;