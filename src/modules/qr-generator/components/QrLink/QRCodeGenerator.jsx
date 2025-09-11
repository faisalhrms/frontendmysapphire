import { useState, useRef } from 'react';
import { Globe, Pyramid, Download } from 'lucide-react';

import ProgressBar from './ProgressBar';
import ContentTypeSelector from './ContentTypeSelector';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import QRPreview from './QRPreview';
import PatternSelector from './PatternSelector';
import ErrorCorrectionSelector from './ErrorCorrectionSelector';
import ColorSelector from './ColorSelector';
import FrameSelector from './FrameSelector';
import SizeControl from './SizeControl';
import LogoUpload from './LogoUpload';
import QRCodesTable from './QRCodesTable';
import useQRManager from '@modules/qr-generator/Hooks/useQRManager.js';
import useQRGenerator from '@modules/qr-generator/Hooks/useQRGenerator.js';

const QRCodeGenerator = () => {
    const [currentView, setCurrentView] = useState('input');
    const [url, setUrl] = useState('');
    const [qrName, setQrName] = useState('');
    const [category, setCategory] = useState('');
    const [selectedContentType, setSelectedContentType] = useState('url');
    const [selectedPattern, setSelectedPattern] = useState('square');
    const [errorCorrection, setErrorCorrection] = useState('M');
    const [foregroundColor, setForegroundColor] = useState('#000000');
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');
    const [selectedFrame, setSelectedFrame] = useState('none');
    const [logo, setLogo] = useState(null);
    const [logoSize, setLogoSize] = useState(20);
    const [logos, setLogos] = useState([]);
    const [selectedLogo, setSelectedLogo] = useState(null);
    const [qrSize, setQrSize] = useState(300);
    const [qrFormat, setQrFormat] = useState('png');
    const qrRef = useRef();
    const [qrText, setQrText] = useState("My QR Text");
    const [logoBackground, setLogoBackground] = useState(false);
    const [logoText, setLogoText] = useState("");

    const { qrCodes, addQRCode, deleteQRCode } = useQRManager();
    const { generateQRDataURL, downloadQR } = useQRGenerator();

    const bodyPatterns = [
        { id: 'square', name: 'Square', preview: '■■■' },
        { id: 'circle', name: 'Circle', preview: '●●●' },
        { id: 'rounded', name: 'Rounded', preview: '▢▢▢' },
        { id: 'diamond', name: 'Diamond', preview: '♦♦♦' },
        { id: 'star', name: 'Star', preview: '★★★' },
        { id: 'heart', name: 'Heart', preview: '♥♥♥' },
    ];

    const errorCorrectionLevels = [
        { id: 'L', name: 'Smallest', description: 'Less cluttered-looking pattern', image: 'https://me-qr.com/build/images/H.e9899973.png' },
        { id: 'M', name: 'Medium', description: 'Balanced cluttered-looking pattern', image: 'https://me-qr.com/build/images/Q.ff9fdcdf.png' },
        { id: 'Q', name: 'High', description: 'Optimal damage-resistant pattern', image: 'https://me-qr.com/build/images/M.06e46c88.png' },
        { id: 'H', name: 'Best', description: 'Maximum damage-resistant pattern', image: 'https://me-qr.com/build/images/L.b30d70f1.png' },
    ];

    const frameOptions = [
        { id: "none", name: "No Frame" },
        { id: "basic", name: "Basic Border" },
        { id: "rounded", name: "Rounded Border" },
        { id: "decorative", name: "Decorative Frame" },
        { id: "gradient", name: "Gradient Frame" },
    ];

    const categories = [
        { value: '', label: 'Content Category (optional)' },
        { value: 'website', label: 'Website' },
        { value: 'social', label: 'Social Media' },
        { value: 'business', label: 'Business' },
        { value: 'personal', label: 'Personal' },
        { value: 'event', label: 'Event' },
        { value: 'contact', label: 'Contact' },
    ];

    const contentTypes = [{ id: 'url', icon: Globe, label: 'URL / Link' }];

    const handleCreateQR = () => {
        if (!url.trim()) return;
        setCurrentView('customize');
    };

    const handleDownloadQR = async () => {
        const qrDataURL = await generateQRDataURL(url, {
            size: qrSize,
            backgroundColor,
            foregroundColor,
            errorCorrection,
            pattern: selectedPattern,
            type: qrFormat === 'svg' ? 'svg' : `image/${qrFormat}`,
        });

        if (!qrDataURL) return;

        const qrData = {
            url: url.trim(),
            name: qrName || 'Untitled QR Code',
            category: category || 'General',
            dataURL: qrDataURL,
            customization: {
                pattern: selectedPattern,
                errorCorrection,
                foregroundColor,
                backgroundColor,
                frame: selectedFrame,
                logo,
                size: qrSize,
                format: qrFormat,
            },
        };

        addQRCode(qrData);
        downloadQR(qrDataURL, qrData.name, qrFormat);

        setUrl('');
        setQrName('');
        setCategory('');
        setCurrentView('input');
    };

    const qrOptions = {
        size: qrSize,
        backgroundColor,
        foregroundColor,
        errorCorrection,
        pattern: selectedPattern,
    };

    if (currentView === 'customize') {

        return (

            <div className="mx-auto lg:flex lg:gap-8">
                <div className="lg:w-2/3 space-y-6 overflow-y-auto max-h-screen p-4 rounded-xl">
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
                    <FrameSelector
                        frames={frameOptions}
                        selectedFrame={selectedFrame}
                        onSelect={setSelectedFrame}
                    />
                    <SizeControl size={qrSize} onSizeChange={setQrSize} />
                    <LogoUpload
                        logos={logos}
                        selectedLogo={selectedLogo}
                        logoSize={logoSize}
                        onLogosChange={setLogos}
                        onSelectLogo={setSelectedLogo}
                        onLogoSizeChange={setLogoSize}
                        text={qrText}
                        onTextChange={setQrText}
                        logoBackground={logoBackground}
                        onLogoBackgroundChange={setLogoBackground}

                        logoText={logoText}
                        onLogoTextChange={setLogoText}
                    />

                </div>
                <div className="lg:w-1/3 flex flex-col justify-center items-center p-4 space-y-4 mb-20 bg-white">
                    <QRPreview
                        url={url}
                        qrOptions={qrOptions}
                        selectedFrame={selectedFrame}
                        qrRef={qrRef}
                        logo={selectedLogo}
                        logoSize={logoSize}
                        logoBackground={logoBackground}
                        logoText={logoText}
                    />
                    <div className="w-full space-y-8">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Format
                                </label>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Size
                                </label>
                                <select
                                    value={qrSize}
                                    onChange={(e) => setQrSize(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                >
                                    <option value="100">100x100</option>
                                    <option value="200">200x200</option>
                                    <option value="300">300x300</option>
                                    <option value="400">400x400</option>
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
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
            <div className="max-w-4xl mx-auto">
                <ProgressBar progress={33} />
                <ContentTypeSelector
                    contentTypes={contentTypes}
                    selectedType={selectedContentType}
                    onSelect={setSelectedContentType}
                />

                <div className="box custom-box">
                <div className="box-body">
                    <div className="space-y-4">
                        <FormInput
                            type="url"
                            placeholder="Put your link here"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="border-2"
                        />
                        <FormInput
                            placeholder="Name your QR (optional)"
                            value={qrName}
                            onChange={(e) => setQrName(e.target.value)}
                        />
                        <FormSelect
                            options={categories}
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        />
                        <div className="flex gap-4">
                            <button
                                onClick={handleCreateQR}
                                disabled={!url.trim()}
                                className={`py-3 px-6 rounded-lg font-semibold flex justify-between items-center ${
                                    url.trim() ? 'bg-primary text-white hover:bg-primary' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                Customize & Download QR
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 text-center"></p>
                    </div>
                </div>
            </div>


            </div>
        </div>
    );
};

export default QRCodeGenerator;