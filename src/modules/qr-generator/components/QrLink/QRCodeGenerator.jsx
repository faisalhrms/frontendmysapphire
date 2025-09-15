import { useState } from 'react';
import { Globe, MessageCircle, Facebook, Youtube, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';
import {useNavigate} from "react-router-dom";
const QRCodeGenerator = () => {
    const navigate = useNavigate();
    const [url, setUrl] = useState('');
    const [qrName, setQrName] = useState('');
    const [category, setCategory] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');
    const [selectedContentType, setSelectedContentType] = useState('url');
    const [facebookLink, setFacebookLink] = useState("");
    const [youtubeLink, setYoutubeLink] = useState("");

    const contentTypes = [
        {
            id: 'url',
            label: 'Website URL',
            icon: Globe,
            color: "bg-info text-white",
            description: "Link to any website or webpage"
        },
        {
            id: 'whatsapp',
            label: 'WhatsApp',
            icon: MessageCircle,
            color: "bg-green text-white",
            description: "Direct WhatsApp chat link"
        },
        {
            id: 'facebook',
            label: 'Facebook',
            icon: Facebook,
            color: "bg-blue text-white",
            description: "Facebook page or profile"
        },
        {
            id: 'youtube',
            label: 'YouTube',
            icon: Youtube,
            color: "bg-red text-white",
            description: "YouTube video or channel"
        },
    ];

    const handleCreateQR = () => {
        if (selectedContentType === 'url' && !url.trim()) return;
        if (selectedContentType === 'whatsapp' && !phoneNumber.trim()) return;
        if (selectedContentType === 'facebook' && !facebookLink.trim()) return;
        if (selectedContentType === 'youtube' && !youtubeLink.trim()) return;

        let qrData = {};
        if (selectedContentType === 'url') {
            qrData = { url: url.trim(), qrName, category };
        } else if (selectedContentType === 'whatsapp') {
            const whatsappUrl = `https://wa.me/${phoneNumber}${
                message ? `?text=${encodeURIComponent(message)}` : ''
            }`;
            qrData = { url: whatsappUrl, qrName, category };
        } else if (selectedContentType === 'facebook') {
            qrData = { url: facebookLink.trim(), qrName, category };
        } else if (selectedContentType === 'youtube') {
            qrData = { url: youtubeLink.trim(), qrName, category };
        }

        navigate('/module/qr/qr-customize', { state: qrData });
    };

    const isFormValid = () => {
        switch (selectedContentType) {
            case 'url': return url.trim();
            case 'whatsapp': return phoneNumber.trim();
            case 'facebook': return facebookLink.trim();
            case 'youtube': return youtubeLink.trim();
            default: return false;
        }
    };

    return (
        <div className="min-h-screen bg-gray-400">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">QR Generator Pro</h1>
                                <p className="text-sm text-gray-500">Create professional QR codes</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                                <Shield className="w-4 h-4" />
                                <span>Secure</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Zap className="w-4 h-4" />
                                <span>Instant</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-8">

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Content Type Selection */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Content Type</h3>
                            <div className="space-y-3">
                                {contentTypes.map((type) => {
                                    const Icon = type.icon;
                                    return (
                                        <button
                                            key={type.id}
                                            onClick={() => setSelectedContentType(type.id)}
                                            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-md ${
                                                selectedContentType === type.id
                                                    ? 'border-primary bg-blue-50 shadow-md'
                                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                            }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-10 h-10 rounded-lg ${type.color} flex items-center justify-center`}>
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{type.label}</div>
                                                    <div className="text-sm text-gray-500">{type.description}</div>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-8">
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {contentTypes.find(t => t.id === selectedContentType)?.label} Details
                                </h3>
                                <p className="text-gray-600">
                                    {contentTypes.find(t => t.id === selectedContentType)?.description}
                                </p>
                            </div>

                            <div className="space-y-6">
                                {/* URL Form */}
                                {selectedContentType === 'url' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Website URL *
                                            </label>
                                            <input
                                                type="url"
                                                placeholder="https://example.com"
                                                value={url}
                                                onChange={(e) => setUrl(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>
                                    </>
                                )}

                                {/* WhatsApp Form */}
                                {selectedContentType === 'whatsapp' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Phone Number *
                                            </label>
                                            <input
                                                type="tel"
                                                placeholder="+1234567890"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Pre-filled Message (Optional)
                                            </label>
                                            <textarea
                                                placeholder="Hello! I found you through your QR code."
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                rows={3}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none"
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Facebook Form */}
                                {selectedContentType === 'facebook' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Facebook URL *
                                        </label>
                                        <input
                                            type="url"
                                            placeholder="https://facebook.com/yourpage"
                                            value={facebookLink}
                                            onChange={(e) => setFacebookLink(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
                                        />
                                    </div>
                                )}

                                {/* YouTube Form */}
                                {selectedContentType === 'youtube' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            YouTube URL *
                                        </label>
                                        <input
                                            type="url"
                                            placeholder="https://youtube.com/watch?v=..."
                                            value={youtubeLink}
                                            onChange={(e) => setYoutubeLink(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                                        />
                                    </div>
                                )}

                                {/* Common Fields */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            QR Code Name (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="My QR Code"
                                            value={qrName}
                                            onChange={(e) => setQrName(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Category (Optional)
                                        </label>
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                                        >
                                            <option value="">Select category</option>
                                            <option value="business">Business</option>
                                            <option value="personal">Personal</option>
                                            <option value="marketing">Marketing</option>
                                            <option value="social">Social Media</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <div className="pt-4">
                                    <button
                                        onClick={handleCreateQR}
                                        disabled={!isFormValid()}
                                        className={`w-full py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-200 ${
                                            isFormValid()
                                                ? 'bg-primary shadow-lg hover:shadow-xl text-white'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                    >
                                        <span>Continue to Customize</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="mt-12 grid md:grid-cols-3 gap-6">
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                            <Zap className="w-6 h-6 text-blue-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Instant Generation</h4>
                        <p className="text-gray-600 text-sm">Create QR codes in seconds with our optimized engine</p>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                            <Shield className="w-6 h-6 text-green-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Secure & Private</h4>
                        <p className="text-gray-600 text-sm">Your data is processed securely without storage</p>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 text-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-purple-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">High Quality</h4>
                        <p className="text-gray-600 text-sm">Vector-based QR codes that scale perfectly</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRCodeGenerator;