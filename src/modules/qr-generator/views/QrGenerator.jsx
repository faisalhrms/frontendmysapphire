// import React, { useState, useEffect, useRef } from 'react';
// import {
//     ArrowLeft,
//     Download,
//     Eye,
//     Trash2,
//     Edit3,
//     Calendar,
//     Globe,
//     Wifi,
//     MessageSquare,
//     FileText,
//     MapPin,
//     Music,
//     Upload,
//     Pyramid
// } from 'lucide-react';
// import QRCode from "qrcode";
// import { QRCodeCanvas } from "qrcode.react";
// import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
//
//
// // Custom Hook for QR Management
// const useQRManager = () => {
//     const [qrCodes, setQrCodes] = useState([]);
//
//     const addQRCode = (qrData) => {
//         const newQR = {
//             id: Date.now(),
//             ...qrData,
//             createdAt: new Date().toISOString()
//         };
//         setQrCodes(prev => [...prev, newQR]);
//         return newQR;
//     };
//
//     const updateQRCode = (id, updatedData) => {
//         setQrCodes(prev => prev.map(qr =>
//             qr.id === id ? { ...qr, ...updatedData } : qr
//         ));
//     };
//
//     const deleteQRCode = (id) => {
//         setQrCodes(prev => prev.filter(qr => qr.id !== id));
//     };
//
//     const getQRCode = (id) => {
//         return qrCodes.find(qr => qr.id === id);
//     };
//
//     return {
//         qrCodes,
//         addQRCode,
//         updateQRCode,
//         deleteQRCode,
//         getQRCode
//     };
// };
//
// // Custom Hook for QR Generation
// const useQRGenerator = () => {
//     const generateQRDataURL = async (url, options = {}) => {
//         try {
//             const qrDataURL = await QRCode.toDataURL(url, {
//                 errorCorrectionLevel: options.errorCorrection || 'M',
//                 width: options.size || 200,
//                 margin: 2,
//                 color: {
//                     dark: options.foregroundColor || '#000000',
//                     light: options.backgroundColor || '#ffffff'
//                 }
//             });
//             return qrDataURL;
//         } catch (error) {
//             console.error('Error generating QR code:', error);
//             return null;
//         }
//     };
//
//     const downloadQR = (dataURL, filename) => {
//         const link = document.createElement('a');
//         link.download = `${filename}.png`;
//         link.href = dataURL;
//         link.click();
//     };
//
//     return { generateQRDataURL, downloadQR };
// };
//
// // Header Component
// const Header = ({ title, subtitle, onBack, showBack = false }) => (
//     <div className="flex items-center gap-4 mb-6">
//         {showBack && (
//             <button
//                 onClick={onBack}
//                 className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg shadow-sm border hover:bg-primary"
//             >
//                 <ArrowLeft className="w-4 h-4" />
//                 Back
//             </button>
//         )}
//         <div>
//             <h1 className="text-2xl md:text-4xl font-bold text-gray-800">{title}</h1>
//             {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
//         </div>
//     </div>
// );
//
// // Progress Bar Component
// const ProgressBar = ({ progress = 33 }) => (
//     <div className="flex items-center mb-6">
//         <div className="flex-1 bg-purple-200 h-2 rounded-full">
//             <div
//                 className="bg-purple-600 h-2 rounded-full transition-all duration-300"
//                 style={{ width: `${progress}%` }}
//             ></div>
//         </div>
//     </div>
// );
//
// // Content Type Selector Component
// const ContentTypeSelector = ({ contentTypes, selectedType, onSelect }) => (
//     <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
//         {contentTypes.map((type) => {
//             const Icon = type.icon;
//             return (
//                 <button
//                     key={type.id}
//                     onClick={() => onSelect(type.id)}
//                     className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
//                         type.id === selectedType
//                             ? 'border-purple-500 bg-purple-50'
//                             : 'border-gray-200 hover:border-purple-300'
//                     }`}
//                 >
//                     <Icon className={`w-6 h-6 mx-auto mb-2 ${type.id === selectedType ? 'text-purple-600' : 'text-gray-400'}`} />
//                     <div className="text-xs font-medium">{type.label}</div>
//                 </button>
//             );
//         })}
//     </div>
// );
//
// // Form Input Component
// const FormInput = ({ type = "text", placeholder, value, onChange, className = "", ...props }) => (
//     <input
//         type={type}
//         placeholder={placeholder}
//         value={value}
//         onChange={onChange}
//         className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm ${className}`}
//         {...props}
//     />
// );
//
// // Form Select Component
// const FormSelect = ({ options, value, onChange, className = "" }) => (
//     <select
//         value={value}
//         onChange={onChange}
//         className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm ${className}`}
//     >
//         {options.map((option) => (
//             <option key={option.value} value={option.value}>
//                 {option.label}
//             </option>
//         ))}
//     </select>
// );
//
// // QR Preview Component
// const QRPreview = ({ url, qrOptions, selectedFrame, qrRef }) => {
//     const frameClasses = {
//         none: 'border-dashed border-gray-200',
//         basic: 'border-gray-400',
//         rounded: 'border-gray-400 rounded-2xl',
//         decorative: 'border-4 border-purple-400 border-dashed',
//         gradient: 'border-4 border-gradient-to-r from-purple-400 to-pink-400'
//     };
//
//     return (
//         <div className="rounded-xl  p-6">
//             <div className=" box custom-box">
//                 <div className="box-body">
//             <div className="flex justify-center mb-6">
//                 <div className={`bg-white p-8 rounded-lg shadow-inner border-2 ${frameClasses[selectedFrame]}`}>
//                     <div ref={qrRef}>
//                         <QRCodeCanvas
//                             value={url || 'https://example.com'}
//                             size={qrOptions.size}
//                             bgColor={qrOptions.backgroundColor}
//                             fgColor={qrOptions.foregroundColor}
//                             level={qrOptions.errorCorrection}
//                             marginSize={2}
//                         />
//                     </div>
//                 </div>
//             </div>
//             <div className="text-center space-y-2">
//                 <p className="text-sm text-gray-600">Scanning will open:</p>
//                 <p className="font-medium text-purple-600 break-all">{url}</p>
//             </div>
//            </div>
//             </div>
//         </div>
//     );
// };
//
// // Pattern Selector Component
// const PatternSelector = ({ patterns, selectedPattern, onSelect }) => (
//     <div className="bg-white rounded-xl shadow-lg p-6">
//         <h3 className="text-lg font-semibold mb-4">Body Patterns</h3>
//         <div className="grid grid-cols-3 gap-3">
//             {patterns.map((pattern) => (
//                 <button
//                     key={pattern.id}
//                     onClick={() => onSelect(pattern.id)}
//                     className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
//                         selectedPattern === pattern.id
//                             ? 'border-purple-500 bg-purple-50'
//                             : 'border-gray-200 hover:border-purple-300'
//                     }`}
//                 >
//                     <div className="text-2xl mb-2">{pattern.preview}</div>
//                     <div className="text-xs font-medium">{pattern.name}</div>
//                 </button>
//             ))}
//         </div>
//     </div>
// );
//
// // Error Correction Selector Component
// const ErrorCorrectionSelector = ({ levels, selected, onSelect }) => (
//     <div className="bg-white rounded-xl shadow-lg p-6">
//         <h3 className="text-lg font-semibold mb-4">Scannability Level (Error Correction)</h3>
//         <div className="space-y-3">
//             {levels.map((level) => (
//                 <label key={level.id} className="flex items-center space-x-3 cursor-pointer">
//                     <input
//                         type="radio"
//                         name="errorCorrection"
//                         value={level.id}
//                         checked={selected === level.id}
//                         onChange={(e) => onSelect(e.target.value)}
//                         className="w-4 h-4 text-purple-600"
//                     />
//                     <div className="flex-1">
//                         <div className="font-medium">{level.name}</div>
//                         <div className="text-sm text-gray-600">{level.description}</div>
//                     </div>
//                 </label>
//             ))}
//         </div>
//     </div>
// );
//
// // Color Picker Component
// const ColorPicker = ({ label, color, onColorChange }) => (
//     <div>
//         <label className="block text-sm font-medium mb-2">{label}</label>
//         <div className="flex items-center gap-3">
//             <input
//                 type="color"
//                 value={color}
//                 onChange={(e) => onColorChange(e.target.value)}
//                 className="w-12 h-12 rounded-lg cursor-pointer border-2"
//             />
//             <input
//                 type="text"
//                 value={color}
//                 onChange={(e) => onColorChange(e.target.value)}
//                 className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//             />
//         </div>
//     </div>
// );
//
// // Color Selector Component
// const ColorSelector = ({ foregroundColor, backgroundColor, onForegroundChange, onBackgroundChange }) => (
//     <div className="bg-white rounded-xl shadow-lg p-6">
//         <h3 className="text-lg font-semibold mb-4">Colors</h3>
//         <div className="grid grid-cols-2 gap-4">
//             <ColorPicker
//                 label="Foreground"
//                 color={foregroundColor}
//                 onColorChange={onForegroundChange}
//             />
//             <ColorPicker
//                 label="Background"
//                 color={backgroundColor}
//                 onColorChange={onBackgroundChange}
//             />
//         </div>
//     </div>
// );
//
// // Frame Selector Component
// const FrameSelector = ({ frames, selectedFrame, onSelect }) => (
//     <div className="bg-white rounded-xl shadow-lg p-6">
//         <h3 className="text-lg font-semibold mb-4">Frame</h3>
//         <div className="grid grid-cols-2 gap-3">
//             {frames.map((frame) => (
//                 <button
//                     key={frame.id}
//                     onClick={() => onSelect(frame.id)}
//                     className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
//                         selectedFrame === frame.id
//                             ? 'border-purple-500 bg-purple-50 text-purple-700'
//                             : 'border-gray-200 hover:border-purple-300 text-gray-700'
//                     }`}
//                 >
//                     {frame.name}
//                 </button>
//             ))}
//         </div>
//     </div>
// );
//
// // Size Control Component
// const SizeControl = ({ size, onSizeChange, min = 100, max = 400 }) => (
//     <div className="bg-white rounded-xl shadow-lg p-6">
//         <h3 className="text-lg font-semibold mb-4">Size</h3>
//         <div className="space-y-3">
//             <input
//                 type="range"
//                 min={min}
//                 max={max}
//                 value={size}
//                 onChange={(e) => onSizeChange(parseInt(e.target.value))}
//                 className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//             />
//             <div className="flex justify-between text-sm text-gray-600">
//                 <span>{min}px</span>
//                 <span className="font-medium">{size}px</span>
//                 <span>{max}px</span>
//             </div>
//         </div>
//     </div>
// );
//
// // Logo Upload Component
// const LogoUpload = ({ logo, onLogoChange }) => (
//     <div className="bg-white rounded-xl shadow-lg p-6">
//         <h3 className="text-lg font-semibold mb-4">Logo</h3>
//         <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
//             <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => {
//                     const file = e.target.files[0];
//                     if (file) {
//                         const reader = new FileReader();
//                         reader.onload = (event) => onLogoChange(event.target.result);
//                         reader.readAsDataURL(file);
//                     }
//                 }}
//                 className="hidden"
//                 id="logo-upload"
//             />
//             <label htmlFor="logo-upload" className="cursor-pointer">
//                 {logo ? (
//                     <div className="space-y-2">
//                         <img src={logo} alt="Logo" className="w-16 h-16 mx-auto rounded" />
//                         <p className="text-sm text-green-600">Logo uploaded!</p>
//                     </div>
//                 ) : (
//                     <div className="space-y-2">
//                         <div className="w-12 h-12 mx-auto bg-gray-200 rounded-lg flex items-center justify-center">
//                             <Upload className="w-6 h-6 text-gray-400" />
//                         </div>
//                         <p className="text-sm text-gray-600">Click to upload logo</p>
//                     </div>
//                 )}
//             </label>
//         </div>
//     </div>
// );
//
// // QR Codes Table Component
// const QRCodesTable = ({ qrCodes, onEdit, onDelete, onDownload }) => {
//     if (qrCodes.length === 0) return null;
//
//     return (
//         <div className="bg-white rounded-xl shadow-lg p-6">
//             <h2 className="text-xl font-semibold mb-4">Your QR Codes</h2>
//             <div className="overflow-x-auto">
//                 <table className="w-full">
//                     <thead>
//                     <tr className="border-b">
//                         <th className="text-left py-3 px-4">Preview</th>
//                         <th className="text-left py-3 px-4">Name</th>
//                         <th className="text-left py-3 px-4">URL</th>
//                         <th className="text-left py-3 px-4">Category</th>
//                         <th className="text-left py-3 px-4">Created</th>
//                         <th className="text-left py-3 px-4">Actions</th>
//                     </tr>
//                     </thead>
//                     <tbody>
//                     {qrCodes.map((qr) => (
//                         <tr key={qr.id} className="border-b hover:bg-gray-50">
//                             <td className="py-3 px-4">
//                                 <img src={qr.dataURL} alt="QR Code" className="w-12 h-12" />
//                             </td>
//                             <td className="py-3 px-4 font-medium">{qr.name}</td>
//                             <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">{qr.url}</td>
//                             <td className="py-3 px-4">
//                   <span className="px-2 py-1 bg-gray-100 rounded text-xs capitalize">
//                     {qr.category}
//                   </span>
//                             </td>
//                             <td className="py-3 px-4 text-sm text-gray-600">
//                                 {new Date(qr.createdAt).toLocaleDateString()}
//                             </td>
//                             <td className="py-3 px-4">
//                                 <div className="flex items-center gap-2">
//                                     <button
//                                         onClick={() => onEdit(qr)}
//                                         className="p-2 text-blue-600 hover:bg-blue-50 rounded"
//                                         title="Edit"
//                                     >
//                                         <Edit3 className="w-4 h-4" />
//                                     </button>
//                                     <button
//                                         onClick={() => onDownload(qr)}
//                                         className="p-2 text-green-600 hover:bg-green-50 rounded"
//                                         title="Download"
//                                     >
//                                         <Download className="w-4 h-4" />
//                                     </button>
//                                     <button
//                                         onClick={() => onDelete(qr.id)}
//                                         className="p-2 text-red-600 hover:bg-red-50 rounded"
//                                         title="Delete"
//                                     >
//                                         <Trash2 className="w-4 h-4" />
//                                     </button>
//                                 </div>
//                             </td>
//                         </tr>
//                     ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };
//
// // Main QR Generator Component
// const QRCodeGenerator = () => {
//     const [currentView, setCurrentView] = useState('input'); // 'input' or 'customize'
//     const [url, setUrl] = useState('');
//     const [qrName, setQrName] = useState('');
//     const [category, setCategory] = useState('');
//     const [selectedContentType, setSelectedContentType] = useState('url');
//     const qrRef = useRef();
//
//     // Customization options
//     const [selectedPattern, setSelectedPattern] = useState('square');
//     const [errorCorrection, setErrorCorrection] = useState('M');
//     const [foregroundColor, setForegroundColor] = useState('#000000');
//     const [backgroundColor, setBackgroundColor] = useState('#ffffff');
//     const [selectedFrame, setSelectedFrame] = useState('none');
//     const [logo, setLogo] = useState(null);
//     const [qrSize, setQrSize] = useState(200);
//
//     // Custom hooks
//     const { qrCodes, addQRCode, deleteQRCode } = useQRManager();
//     const { generateQRDataURL, downloadQR } = useQRGenerator();
//
//     // Static data
//     const bodyPatterns = [
//         { id: 'square', name: 'Square', preview: '■■■' },
//         { id: 'circle', name: 'Circle', preview: '●●●' },
//         { id: 'rounded', name: 'Rounded', preview: '▢▢▢' },
//         { id: 'diamond', name: 'Diamond', preview: '♦♦♦' },
//         { id: 'star', name: 'Star', preview: '★★★' },
//         { id: 'heart', name: 'Heart', preview: '♥♥♥' }
//     ];
//
//     const errorCorrectionLevels = [
//         { id: 'L', name: 'Low (~7%)', description: 'Good for clean environments' },
//         { id: 'M', name: 'Medium (~15%)', description: 'Balanced option' },
//         { id: 'Q', name: 'Quartile (~25%)', description: 'Good for outdoor use' },
//         { id: 'H', name: 'High (~30%)', description: 'Maximum durability' }
//     ];
//
//     const frameOptions = [
//         { id: 'none', name: 'No Frame' },
//         { id: 'basic', name: 'Basic Border' },
//         { id: 'rounded', name: 'Rounded Border' },
//         { id: 'decorative', name: 'Decorative Frame' },
//         { id: 'gradient', name: 'Gradient Frame' }
//     ];
//
//     const categories = [
//         { value: '', label: 'Content Category (optional)' },
//         { value: 'website', label: 'Website' },
//         { value: 'social', label: 'Social Media' },
//         { value: 'business', label: 'Business' },
//         { value: 'personal', label: 'Personal' },
//         { value: 'event', label: 'Event' },
//         { value: 'contact', label: 'Contact' }
//     ];
//
//     const contentTypes = [
//         { id: 'url', icon: Globe, label: 'URL / Link' },
//
//     ];
//
//     const handleCreateQR = () => {
//         if (!url.trim()) return;
//         setCurrentView('customize');
//     };
//
//     const handleDownloadQR = async () => {
//         const qrOptions = {
//             errorCorrection,
//             size: qrSize,
//             foregroundColor,
//             backgroundColor
//         };
//
//         const qrDataURL = await generateQRDataURL(url, qrOptions);
//         if (!qrDataURL) return;
//
//         const qrData = {
//             url: url.trim(),
//             name: qrName || 'Untitled QR Code',
//             category: category || 'General',
//             dataURL: qrDataURL,
//             customization: {
//                 pattern: selectedPattern,
//                 errorCorrection,
//                 foregroundColor,
//                 backgroundColor,
//                 frame: selectedFrame,
//                 logo,
//                 size: qrSize
//             }
//         };
//
//         addQRCode(qrData);
//         downloadQR(qrDataURL, qrData.name);
//
//         // Reset form
//         setUrl('');
//         setQrName('');
//         setCategory('');
//         setCurrentView('input');
//     };
//
//     const handleEditQR = (qr) => {
//         setUrl(qr.url);
//         setQrName(qr.name);
//         setCategory(qr.category);
//         setSelectedPattern(qr.customization.pattern);
//         setErrorCorrection(qr.customization.errorCorrection);
//         setForegroundColor(qr.customization.foregroundColor);
//         setBackgroundColor(qr.customization.backgroundColor);
//         setSelectedFrame(qr.customization.frame);
//         setQrSize(qr.customization.size || 200);
//         setCurrentView('customize');
//     };
//
//     const handleDownloadExisting = (qr) => {
//         downloadQR(qr.dataURL, qr.name);
//     };
//
//     const qrOptions = {
//         size: qrSize,
//         backgroundColor,
//         foregroundColor,
//         errorCorrection
//     };
//
//     if (currentView === 'customize') {
//         return (
//             <div className="min-h-screen  mt-4 p-4">
//                 <div className="max-w-6xl mx-auto">
//                     <Header
//                         showBack={true}
//                         onBack={() => setCurrentView('input')}
//                     />
//
//                     <div className="grid lg:grid-cols-2 gap-8">
//                         <QRPreview
//                             url={url}
//                             qrOptions={qrOptions}
//                             selectedFrame={selectedFrame}
//                             qrRef={qrRef}
//                         />
//
//                         <div className="space-y-6">
//                             <PatternSelector
//                                 patterns={bodyPatterns}
//                                 selectedPattern={selectedPattern}
//                                 onSelect={setSelectedPattern}
//                             />
//
//                             <ErrorCorrectionSelector
//                                 levels={errorCorrectionLevels}
//                                 selected={errorCorrection}
//                                 onSelect={setErrorCorrection}
//                             />
//
//                             <ColorSelector
//                                 foregroundColor={foregroundColor}
//                                 backgroundColor={backgroundColor}
//                                 onForegroundChange={setForegroundColor}
//                                 onBackgroundChange={setBackgroundColor}
//                             />
//
//                             <FrameSelector
//                                 frames={frameOptions}
//                                 selectedFrame={selectedFrame}
//                                 onSelect={setSelectedFrame}
//                             />
//
//                             <SizeControl
//                                 size={qrSize}
//                                 onSizeChange={setQrSize}
//                             />
//
//                             <LogoUpload
//                                 logo={logo}
//                                 onLogoChange={setLogo}
//                             />
//
//                             <button
//                                 onClick={handleDownloadQR}
//                                 className="w-full  text-white py-4 px-6 bg-primary rounded-xl font-semibold  transition-all transform hover:scale-105 shadow-lg"
//                             >
//                                 <Download className="w-5 h-5 inline-block mr-2" />
//                                 Download QR Code
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     }
//
//     return (
//         <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
//             <div className="max-w-4xl mx-auto">
//                 <IconPageHeader
//                     title="QR Code Generator"
//
//                     description="Create custom QR codes with advanced styling options"
//                     icon={Pyramid}
//                 />
//
//                 <ProgressBar progress={33}/>
//
//                     <ContentTypeSelector
//                         contentTypes={contentTypes}
//                         selectedType={selectedContentType}
//                         onSelect={setSelectedContentType}
//                     />
//                 <div className=" box custom-box">
//                     <div className="box-body">
//                         <div className="space-y-4">
//                             <FormInput
//                                 type="url"
//                                 placeholder="Put your link here"
//                                 value={url}
//                                 onChange={(e) => setUrl(e.target.value)}
//                                 className="border-2"
//                             />
//
//                             <FormInput
//                                 placeholder="Name your QR (optional)"
//                                 value={qrName}
//                                 onChange={(e) => setQrName(e.target.value)}
//                             />
//
//                             <FormSelect
//                                 options={categories}
//                                 value={category}
//                                 onChange={(e) => setCategory(e.target.value)}
//                             />
//
//                             <div className="flex gap-4">
//                                 <button
//                                     onClick={handleCreateQR}
//                                     disabled={!url.trim()}
//                                     className={`flex-1 py-3 px-6 rounded-lg font-semibold ${
//                                         url.trim()
//                                             ? 'bg-primary  text-white hover:bg-primary '
//                                             : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                                     }`}
//                                 >
//                                     Customize & Download QR
//                                 </button>
//
//                                 <button
//                                     className="px-6 py-3 border-2 border-purple-200 rounded-lg font-semibold text-purple-600 hover:bg-purple-50 transition-colors">
//                                     ⭐ Try Pro Version*
//                                 </button>
//                             </div>
//
//                             <p className="text-xs text-gray-500 text-center">*All QR Codes Ads-free</p>
//                         </div>
//                     </div>
//                 </div>
//
//                     <QRCodesTable
//                         qrCodes={qrCodes}
//                         onEdit={handleEditQR}
//                         onDelete={deleteQRCode}
//                         onDownload={handleDownloadExisting}
//                     />
//                 </div>
//             </div>
//             );
//             };
//
//             export default QRCodeGenerator;
import QRCodeGenerator from "@modules/qr-generator/components/QrLink/QRCodeGenerator.jsx";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import {Pyramid} from "lucide-react";

const App = () => {
    return (
        <div>
            <IconPageHeader
                title="QR Code Generator"
                description="Create custom QR codes with advanced styling options"
                icon={Pyramid}
            />
            <QRCodeGenerator />
        </div>
    );
};

export default App;