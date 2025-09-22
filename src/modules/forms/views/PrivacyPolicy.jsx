import { Fragment, useEffect, useState } from 'react';

const PrivacyPolicy = () => {
    const [isFullscreen, setIsFullscreen] = useState(false);

    const userLocation = {
        country: 'International',
        countryCode: 'INTL',
        region: '',
        city: '',
        timezone: ''
    };
    const userIP = 'Unavailable';

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!(document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement));
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('msfullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('msfullscreenchange', handleFullscreenChange);
        };
    }, []);

    const toggleFullscreen = () => {
        const contentContainer = document.getElementById('content-container');

        if (!contentContainer) {
            console.error("Element with ID 'content-container' not found in the DOM.");
            return;
        }

        if (!isFullscreen) {
            if (contentContainer.requestFullscreen) {
                contentContainer.requestFullscreen();
            } else if (contentContainer.mozRequestFullScreen) {
                contentContainer.mozRequestFullScreen();
            } else if (contentContainer.webkitRequestFullscreen) {
                contentContainer.webkitRequestFullscreen();
            } else if (contentContainer.msRequestFullscreen) {
                contentContainer.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    };

    const getPrivacyPolicyContent = () => {
        return { jurisdiction: 'Global', content: getGlobalContent() };
    };

    const getGlobalContent = () => [
        {
            title: "1. Information Collection & Use",
            content: "We collect information you provide directly, information from your use of our services, and information from third parties. This includes personal identifiers, contact information, device information, and usage data to provide and improve our services."
        },
        {
            title: "2. Data Sharing & Disclosure",
            content: "We may share your information with service providers, business partners, and in response to legal requests. We do not sell personal information to third parties. All sharing is done with appropriate contractual protections and privacy safeguards."
        },
        {
            title: "3. Your Privacy Rights",
            content: "Depending on your location, you may have rights to access, correct, delete, or port your data. You may also have the right to object to or restrict certain processing. Contact us to exercise available rights or for questions about your privacy."
        },
        {
            title: "4. Data Security & Protection",
            content: "We implement industry-standard security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. We regularly review and update our security practices to maintain protection standards."
        },
        {
            title: "5. Policy Updates & Contact",
            content: "We may update this privacy policy periodically. Material changes will be communicated through our services or via email. For questions about this policy or our privacy practices, please contact our privacy team using the information provided."
        }
    ];

    const { jurisdiction, content } = getPrivacyPolicyContent();

    return (
        <Fragment>
            <div className="container mt-8">
                <div className="grid grid-cols-12 !mx-auto text-defaultsize">
                    <div className="xl:col-span-2 col-span-12"></div>
                    <div className="xl:col-span-8 col-span-12">
                        <div
                            className={isFullscreen ? ' box overflow-hidden terms-box box-fullscreen' : 'box overflow-hidden terms-box'}
                            id="content-container">
                            <div className="box-body !p-0">
                                <div className="p-4 terms-heading-cover flex items-center text-white bg-primary h5 font-semibold mb-0">
                                    <span>Privacy Policy</span>
                                    <div className="ms-auto text-white terms-fullscreen" onClick={toggleFullscreen}>
                                        <i className="ri-fullscreen-line"></i>
                                    </div>
                                </div>
                                <div id="terms-scroll" className="terms-conditions overflow-y-scroll">
                                    <div className="p-6 text-muted">
                                        <div className="mb-6">
                                            <h6 className="font-bold pb-3 text-default opacity-[0.8]">
                                                <span className="terms-heading dark:text-gray-200 dark:bg-bodybg">Privacy Policy </span>
                                            </h6>

                                            <p className="opacity-[0.7] mb-6 dark:text-gray-200 dark:bg-bodybg">
                                                This privacy policy explains how we collect, use, and protect your personal information when you use our services. The policy is applicable globally.
                                            </p>
                                        </div>

                                        {content.map((section, index) => (
                                            <div key={index} className="mb-6 dark:text-gray-200 dark:bg-bodybg">
                                                <p className="font-semibold text-muted mb-3 text-[.875rem] opacity-[0.8] ">
                                                    {section.title}
                                                </p>
                                                <p className="opacity-[0.7] mb-0 leading-relaxed">
                                                    {section.content}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default PrivacyPolicy;
