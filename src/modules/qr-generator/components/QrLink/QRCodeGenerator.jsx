import { useState } from 'react';
import { Globe, MessageCircle,Facebook ,Youtube } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import ProgressBar from './ProgressBar';
import ContentTypeSelector from './ContentTypeSelector';
import FormInput from './FormInput';


import useQRManager from '@modules/qr-generator/Hooks/useQRManager.js';
import useQRGenerator from '@modules/qr-generator/Hooks/useQRGenerator.js';
import WhatsAppForm from "@modules/qr-generator/components/WhatAppsQR/WhatsAppForm.jsx";
import FacebookForm from "@modules/qr-generator/components/facebook/FaceBookForm.jsx";
import YouTubeForm from "@modules/qr-generator/components/youtube/YouTubeForm.jsx";

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


    const { addQRCode } = useQRManager();
    const { generateQRDataURL, downloadQR } = useQRGenerator();
    const contentTypes = [
        {
            id: 'url',
            label: 'URL / Link',
            icon: Globe
        },
        {
            id: 'whatsapp',
            label: 'WhatsApp',
            icon: "https://me-qr.com/build/images/whatsAppLogotype.a6873f12.svg",
            color: "text-success"
        },
        {
            id: 'facebook',
            label: 'FaceBook',
            icon: "https://me-qr.com/build/images/faceBookLogotype.dbceffdc.svg",
            color: "text-blue"
        },
        {
            id: 'youtube',
            label: 'YouTube',
            icon: "https://me-qr.com/build/images/youTubeLogotype.a0ebc6ae.svg",
            color: "text-red"
        },
    ];

    const handleCreateQR = () => {
        if (selectedContentType === 'url' && !url.trim()) return;
        if (selectedContentType === 'whatsapp' && !phoneNumber.trim()) return;

        let qrData = {};
        if (selectedContentType === 'url') {
            qrData = { url: url.trim(), qrName, category };
        } else if (selectedContentType === 'whatsapp') {
            const whatsappUrl = `https://wa.me/${phoneNumber}${
                message ? `?text=${encodeURIComponent(message)}` : ''
            }`;
            qrData = { url: whatsappUrl, qrName, category };
        }

        navigate('/module/qr/qr-customize', { state: qrData });
    };

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
                        <div className=" space-y-6 p-8 bg-white dark:text-gray-200 dark:bg-bodybg ">
                            {selectedContentType === 'url' && (
                                <>
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

                                    <div className="flex gap-4">
                                        <button
                                            onClick={handleCreateQR}
                                            disabled={!url.trim()}
                                            className={`py-3 px-6 rounded-lg font-semibold flex justify-between items-center ${
                                                url.trim()
                                                    ? 'bg-primary text-white hover:bg-primary'
                                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            }`}
                                        >
                                            Customize & Download QR
                                        </button>
                                    </div>
                                </>
                            )}

                            {selectedContentType === 'whatsapp' && (
                                <WhatsAppForm
                                    phoneNumber={phoneNumber}
                                    setPhoneNumber={setPhoneNumber}
                                    message={message}
                                    setMessage={setMessage}
                                />
                            )}
                            {selectedContentType === 'facebook' && (
                                <FacebookForm
                                    facebookLink={facebookLink}
                                    setFacebookLink={setFacebookLink}
                                    qrName={qrName}
                                    setQrName={setQrName}
                                    category={category}
                                    setCategory={setCategory}
                                />
                            )}
                            {selectedContentType === 'youtube' && (
                                <YouTubeForm
                                    youtubeLink={youtubeLink}
                                    setFyoutubeLink={setYoutubeLink}
                                    qrName={qrName}
                                    setQrName={setQrName}
                                    category={category}
                                    setCategory={setCategory}
                                />
                            )}

                            <p className="text-xs text-gray-500 text-center"></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRCodeGenerator;
