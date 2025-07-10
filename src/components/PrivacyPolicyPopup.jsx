import React, { useState, useEffect } from 'react';
import { X, MapPin, Shield, ExternalLink, Eye, Database, Wifi } from 'lucide-react';
import {getDynamicButtonStyle} from "@helpers/styles.js";

export default function PrivacyPolicyPopup({primaryColor}) {
    const [showPopup, setShowPopup] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const { defaultStyle, hoverStyle } = getDynamicButtonStyle(primaryColor, true);
    const [dataPreferences, setDataPreferences] = useState({
        location: false,
        analytics: false,
        performance: false
    });

    useEffect(() => {
        const hasConsented = sessionStorage.getItem('privacy-consent');
        if (!hasConsented) {
            setTimeout(() => setShowPopup(true), 1000);
        }
    }, []);

    const handleAcceptAll = () => {
        const allAccepted = {
            location: true,
            analytics: true,
            performance: true
        };
        sessionStorage.setItem('privacy-consent', JSON.stringify(allAccepted));
        setShowPopup(false);
    };

    const handleRejectAll = () => {
        const onlyEssential = {
            location: false,
            analytics: false,
            performance: false
        };
        sessionStorage.setItem('privacy-consent', JSON.stringify(onlyEssential));
        setShowPopup(false);
    };

    const handleSavePreferences = () => {
        sessionStorage.setItem('privacy-consent', JSON.stringify(dataPreferences));
        setShowPopup(false);
    };

    const handleTogglePreference = (type) => {
        setDataPreferences(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    const handleClose = () => {
        setShowPopup(false);
    };

    const DataSettings = () => (
        <div className="space-y-6">
            <div className="text-center pb-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Collection Preferences</h3>
                <p className="text-sm text-gray-600">Choose what information you're comfortable sharing</p>
            </div>

            <div className="space-y-4">
                {[
                    {
                        key: 'location',
                        title: 'Location Data',
                        description: 'Access your location to provide personalized, location-based features and services',
                        icon: MapPin,
                        iconColor: 'text-info',
                        bgColor: 'bg-info/10'
                    },
                    {
                        key: 'analytics',
                        title: 'Usage Analytics',
                        description: 'Help us understand how you use our app to improve your experience',
                        icon: Database,
                        iconColor: 'text-success',
                        bgColor: 'bg-success/10'
                    },
                    {
                        key: 'performance',
                        title: 'Performance Data',
                        description: 'Collect performance metrics to optimize app speed and reliability',
                        icon: Wifi,
                        iconColor: 'text-cyan',
                        bgColor: 'bg-cyan/10'
                    }
                ].map((item) => (
                    <div key={item.key} className={`flex items-start justify-between p-4 ${item.bgColor} rounded-lg border border-gray-100`}>
                        <div className="flex items-start gap-3 flex-1">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                <item.icon className={`h-5 w-5 ${item.iconColor}`} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
                                <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                            </div>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                            <button
                                onClick={() => handleTogglePreference(item.key)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    dataPreferences[item.key] ? 'bg-[var(--primary)]' : 'bg-gray-300'
                                }`}
                            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                        dataPreferences[item.key] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                        <h4 className="font-medium text-amber-800 mb-1">Your Privacy Matters</h4>
                        <p className="text-sm text-amber-700">
                            All data is processed securely and you can change these preferences anytime.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="relative"
        >
            {/* Privacy Policy Popup */}
            {showPopup && (
                <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 bg-black bg-opacity-20 z-40 backdrop-blur-sm"/>

                    {/* Popup */}
                    <div className="fixed inset-0 z-50 flex items-end justify-center p-1 pointer-events-none">
                        <div className="w-full max-w-4xl pointer-events-auto">
                            <div
                                className="rounded-lg bg-white shadow-2xl transform transition-all duration-500 ease-out animate-slide-up">
                                {/* Header */}
                                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className="w-10 h-10 bg-info/10 rounded-full flex items-center justify-center">
                                            <Shield className="h-5 w-5 text-info"/>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">Privacy & Data
                                                Collection</h3>
                                            <p className="text-sm text-gray-500">Control your data sharing
                                                preferences</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleClose}
                                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                                        aria-label="Close popup"
                                    >
                                        <X className="h-5 w-5"/>
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    {!showDetails ? (
                                        <div className="space-y-6">
                                            <div className="flex items-start gap-4">
                                                <div
                                                    className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <MapPin className="h-6 w-6 text-success"/>
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-900 mb-3">We'd like to access
                                                        your location</h4>
                                                    <p className="text-gray-700 leading-relaxed mb-4">
                                                        To provide you with personalized experiences and location-based
                                                        features, we may collect:
                                                    </p>
                                                    <ul className="space-y-2 text-sm text-gray-600">
                                                        <li className="flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                                                            Your approximate location for local content and services
                                                        </li>
                                                        <li className="flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                                                            Usage analytics to improve our app performance
                                                        </li>
                                                        <li className="flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                                                            Technical data to ensure optimal functionality
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <p className="text-sm text-gray-600">
                                                    Your privacy is important to us. Read our{' '}
                                                    <a
                                                        href="#privacy-policy"
                                                        className="text-[var(--primary)] underline inline-flex items-center gap-1 transition-colors font-medium"
                                                    >
                                                        Privacy Policy
                                                        <ExternalLink className="h-3 w-3"/>
                                                    </a>
                                                    {' '}to learn more about how we protect your data.
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <DataSettings/>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col sm:flex-row gap-3 p-6 bg-gray-50 rounded-b-2xl">
                                    <button
                                        onClick={() => setShowDetails(!showDetails)}
                                        style={defaultStyle}
                                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor)}
                                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = defaultStyle.backgroundColor)}
                                        className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium rounded transition-colors border"
                                    >
                                        <Eye className="h-4 w-4"/>
                                        {showDetails ? 'Back' : 'Customize'}
                                    </button>

                                    <div className="flex flex-1 gap-3">
                                        <button
                                            onClick={showDetails ? handleSavePreferences : handleRejectAll}
                                            className={`flex-1 px-6 py-2.5 text-sm font-medium rounded transition-colors ${
                                                showDetails
                                                    ? 'bg-[var(--primary)] text-white disabled:opacity-50'
                                                    : 'border'
                                            }`}
                                            {...(!showDetails && {
                                                style: defaultStyle,
                                                onMouseEnter: (e) =>
                                                    (e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor),
                                                onMouseLeave: (e) =>
                                                    (e.currentTarget.style.backgroundColor = defaultStyle.backgroundColor),
                                            })}
                                        >
                                            {showDetails ? 'Save Preferences' : 'Not Now'}
                                        </button>


                                        {!showDetails && (
                                            <button
                                                onClick={handleAcceptAll}
                                                className="flex-1 px-6 py-2.5 text-white rounded text-sm font-medium transition-colors disabled:opacity-50 bg-[var(--primary)]"
                                            >
                                                Allow & Continue
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <style
                dangerouslySetInnerHTML={{
                    __html: `
            @keyframes slide-up {
              from {
                transform: translateY(100%);
                opacity: 0;
              }
              to {
                transform: translateY(0);
                opacity: 1;
              }
            }

            .animate-slide-up {
                    animation: slide-up 0.5s ease-out;
                }
          `,
                }}
            />
        </div>
    );
}