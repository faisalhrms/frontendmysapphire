import React, { useState, useEffect, useRef } from 'react';
import { Briefcase, Users, CreditCard, FileText, Heart, Target, Zap, Shield, Coffee, Award, Sparkles, QrCode, Package, ArrowRight, LogIn } from 'lucide-react';
import logo from "@assets/images/brand-logos/desktop-white.svg";
import {useNavigate} from "react-router-dom";

export default function AboutUs() {
    const [isVisible, setIsVisible] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const heroRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        setIsVisible(true);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (heroRef.current) {
                const rect = heroRef.current.getBoundingClientRect();
                setMousePosition({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                });
            }
        };

        const hero = heroRef.current;
        if (hero) {
            hero.addEventListener('mousemove', handleMouseMove);
            return () => hero.removeEventListener('mousemove', handleMouseMove);
        }
    }, []);

    const modules = [
        {
            icon: <Briefcase className="w-8 h-8" />,
            title: "Project Management",
            description: "Stay updated on projects, timelines, and collaborate with your team seamlessly"
        },
        {
            icon: <CreditCard className="w-8 h-8" />,
            title: "ESS - Employee Self Service",
            description: "Access your discount card, generate QR codes, and manage your employee benefits"
        },
        {
            icon: <Package className="w-8 h-8" />,
            title: "Inventory Tracker",
            description: "Track and manage inventory levels, stock movements, and warehouse operations"
        },
        {
            icon: <QrCode className="w-8 h-8" />,
            title: "QR Code Generator",
            description: "Generate QR codes for various business needs and applications"
        },
        {
            icon: <FileText className="w-8 h-8" />,
            title: "Dynamic Forms",
            description: "Submit requests, applications, and feedback through easy-to-use digital forms"
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "Employee Directory",
            description: "Find and connect with colleagues across all departments and locations"
        }
    ];

    const values = [
        {
            icon: <Heart className="w-6 h-6" />,
            title: "Employee First",
            description: "Built with your needs in mind, making work life easier every day"
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Efficiency",
            description: "Streamline tasks and spend more time on what matters"
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Security",
            description: "Your data is protected with enterprise-grade security"
        },
        {
            icon: <Coffee className="w-6 h-6" />,
            title: "Simplicity",
            description: "Easy to use, accessible anywhere, anytime"
        }
    ];

    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: "'Gotham', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
            {/* Hero Section - Black & White with Animations */}
            <div ref={heroRef} className="relative overflow-hidden bg-black">
                {/* Login Button - Top Right */}
                <div className="absolute top-6 right-6 z-20">
                    <button
                        className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full text-sm transition-all duration-300 shadow-lg"
                        style={{ fontWeight: 500 }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#000000';
                            e.currentTarget.style.color = '#ffffff';
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.border = '2px solid #ffffff';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#ffffff';
                            e.currentTarget.style.color = '#000000';
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.border = 'none';
                        }}
                        onClick={() => navigate(`${import.meta.env.BASE_URL}`)}
                    >
                        <LogIn className="w-4 h-4" />
                        Login to Portal
                    </button>
                </div>

                {/* Animated grid background */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
                        backgroundSize: '50px 50px'
                    }}></div>
                </div>

                {/* Floating animated circles */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-5 animate-pulse"></div>
                    <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-5 animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-5 animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                {/* Mouse follower effect */}
                <div
                    className="absolute w-96 h-96 bg-white rounded-full filter blur-3xl opacity-10 pointer-events-none transition-all duration-300"
                    style={{
                        left: mousePosition.x - 192,
                        top: mousePosition.y - 192
                    }}
                ></div>

                <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
                    <div className={`text-center text-white transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="flex justify-center mb-8">
                            <img
                                src={logo}
                                alt="SAPPHIRE"
                                className="h-16 md:h-20 transition-all duration-300 hover:scale-110 animate-pulse"
                            />
                        </div>
                        <div className="inline-flex items-center gap-2 px-5 py-2 bg-white bg-opacity-10 backdrop-blur-sm rounded-full text-sm mb-8 animate-pulse" style={{ fontWeight: 500 }}>
                            <Sparkles className="w-4 h-4 text-white" />
                            <span>Your Employee Portal</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl mb-6 tracking-tight" style={{ fontWeight: 600, letterSpacing: '0.02em' }}>
                            Welcome to My SAPPHIRE
                        </h1>
                        <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed text-gray-300" style={{ fontWeight: 300 }}>
                            Your central hub for everything work-related. Empowering our team with tools and resources to succeed together.
                        </p>

                        {/* Animated scroll indicator */}
                        <div className="flex justify-center animate-bounce">
                            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center pt-2">
                                <div className="w-1 h-2 bg-white rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* What is My SAPPHIRE Section */}
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                        <div className="inline-block mb-4 px-4 py-2 bg-black text-white rounded-full text-sm" style={{ fontWeight: 500 }}>
                            About My SAPPHIRE
                        </div>
                        <h2 className="text-4xl md:text-5xl text-black mb-6" style={{ fontWeight: 600 }}>
                            Your Work, Simplified
                        </h2>
                        <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                            My SAPPHIRE is our internal employee portal designed exclusively for our team members. It's your one-stop destination for managing performance, tracking projects, accessing benefits, and staying connected with colleagues.
                        </p>
                        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                            We've built this platform to make your work life easier, more organized, and more efficient. Everything you need is now just a click away - from submitting forms to checking your performance metrics.
                        </p>
                        <div className="bg-black rounded-2xl p-6 border-2 border-black transform hover:scale-105 transition-all duration-300">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Target className="w-6 h-6 text-black" />
                                </div>
                                <div>
                                    <h3 className="text-white mb-2" style={{ fontWeight: 500 }}>Our Mission</h3>
                                    <p className="text-gray-300">To empower every team member with seamless access to tools, information, and resources that enhance productivity and job satisfaction.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                        <div className="grid grid-cols-2 gap-4">
                            {values.map((value, index) => (
                                <div
                                    key={index}
                                    className="bg-white shadow-lg p-6 rounded-2xl transition-all duration-300 border-2 border-black group cursor-pointer"
                                    style={{
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                        animationDelay: `${index * 100}ms`
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-8px) rotate(2deg)';
                                        e.currentTarget.style.boxShadow = '0 25px 30px -5px rgba(0, 0, 0, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0) rotate(0deg)';
                                        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                                    }}
                                >
                                    <div
                                        className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white mb-4 transition-all duration-300"
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'scale(1.1) rotate(10deg)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                                        }}
                                    >
                                        {value.icon}
                                    </div>
                                    <h3 className="text-black mb-2" style={{ fontWeight: 500 }}>{value.title}</h3>
                                    <p className="text-sm text-gray-600">{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modules Section */}
            <div className="bg-gray-50 py-20 relative overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle, black 1px, transparent 1px)',
                        backgroundSize: '30px 30px'
                    }}></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative">
                    <div className="text-center mb-16">
                        <div className="inline-block mb-4 px-4 py-2 bg-black text-white rounded-full text-sm" style={{ fontWeight: 500 }}>
                            What You Can Do
                        </div>
                        <h2 className="text-4xl md:text-5xl text-black mb-4" style={{ fontWeight: 600 }}>
                            Explore Our Modules
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            All the tools you need to manage your work, grow your career, and enjoy employee benefits
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {modules.map((module, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-500 cursor-pointer border-2 border-transparent group relative overflow-hidden"
                                style={{
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                    animationDelay: `${index * 100}ms`
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                                    e.currentTarget.style.boxShadow = '0 25px 30px -5px rgba(0, 0, 0, 0.3)';
                                    e.currentTarget.style.borderColor = '#000000';
                                    const iconDiv = e.currentTarget.querySelector('.module-icon');
                                    const arrow = e.currentTarget.querySelector('.module-arrow');
                                    if (iconDiv) {
                                        iconDiv.style.transform = 'scale(1.1) rotate(5deg)';
                                    }
                                    if (arrow) {
                                        arrow.style.transform = 'translateX(5px)';
                                        arrow.style.opacity = '1';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                                    e.currentTarget.style.borderColor = 'transparent';
                                    const iconDiv = e.currentTarget.querySelector('.module-icon');
                                    const arrow = e.currentTarget.querySelector('.module-arrow');
                                    if (iconDiv) {
                                        iconDiv.style.transform = 'scale(1) rotate(0deg)';
                                    }
                                    if (arrow) {
                                        arrow.style.transform = 'translateX(0)';
                                        arrow.style.opacity = '0';
                                    }
                                }}
                            >
                                {/* Hover gradient effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-800 opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl"></div>

                                <div className="module-icon w-16 h-16 bg-black rounded-xl flex items-center justify-center text-white mb-6 transition-all duration-300 relative z-10">
                                    {module.icon}
                                </div>
                                <h3 className="text-xl text-black mb-3 flex items-center justify-between relative z-10" style={{ fontWeight: 500 }}>
                                    {module.title}
                                    <ArrowRight className="module-arrow w-5 h-5 transition-all duration-300 opacity-0" />
                                </h3>
                                <p className="text-gray-600 leading-relaxed relative z-10">{module.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Why We Built This - Black & White */}
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="bg-black rounded-3xl p-12 md:p-16 text-white relative overflow-hidden border-2 border-black shadow-2xl">
                    {/* Animated background patterns */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full opacity-5 -mr-32 -mt-32 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full opacity-5 -ml-32 -mb-32 animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0" style={{
                            backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
                            backgroundSize: '40px 40px'
                        }}></div>
                    </div>

                    <div className="relative z-10 text-center max-w-3xl mx-auto">
                        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-6 transform hover:scale-110 hover:rotate-12 transition-all duration-300">
                            <Award className="w-8 h-8 text-black" />
                        </div>
                        <h2 className="text-3xl md:text-4xl mb-6" style={{ fontWeight: 600 }}>Built For You, By Us</h2>
                        <p className="text-lg mb-8 leading-relaxed text-gray-300">
                            My SAPPHIRE was created with one goal in mind: to make your work experience better. We listened to your feedback, understood your challenges, and built a platform that truly serves your needs. This is more than just a portal - it's your digital workplace companion.
                        </p>
                        <div className="grid md:grid-cols-3 gap-6 mt-12">
                            <div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-2xl p-6 border border-white border-opacity-20 transform hover:scale-105 hover:-rotate-1 transition-all duration-300">
                                <div className="text-3xl mb-2" style={{ fontWeight: 600 }}>24/7</div>
                                <p className="text-sm text-gray-300">Access Anytime, Anywhere</p>
                            </div>
                            <div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-2xl p-6 border border-white border-opacity-20 transform hover:scale-105 transition-all duration-300">
                                <div className="text-3xl mb-2" style={{ fontWeight: 600 }}>Secure</div>
                                <p className="text-sm text-gray-300">Your Data is Protected</p>
                            </div>
                            <div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-2xl p-6 border border-white border-opacity-20 transform hover:scale-105 hover:rotate-1 transition-all duration-300">
                                <div className="text-3xl mb-2" style={{ fontWeight: 600 }}>Always Improving</div>
                                <p className="text-sm text-gray-300">Regular Updates & Features</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Support Section */}
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="bg-gray-50 rounded-3xl p-12 text-center border-2 border-black">
                    <h2 className="text-3xl md:text-4xl text-black mb-4" style={{ fontWeight: 600 }}>
                        Need Help Getting Started?
                    </h2>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Our IT team is here to support you. Reach out if you have questions or need assistance navigating the portal.
                    </p>
                    <button
                        className="bg-black text-white px-10 py-4 rounded-full text-lg transition-all duration-300 shadow-lg"
                        style={{ fontWeight: 500 }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#ffffff';
                            e.currentTarget.style.color = '#000000';
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.3)';
                            e.currentTarget.style.border = '2px solid #000000';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#000000';
                            e.currentTarget.style.color = '#ffffff';
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                            e.currentTarget.style.border = 'none';
                        }}
                    >
                        Contact IT Support
                    </button>
                </div>
            </div>

            {/* Footer - Black & White */}
            <div className="bg-black text-white py-12 border-t-2 border-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-lg mb-2" style={{ fontWeight: 500 }}>
                        My SAPPHIRE - Internal Employee Portal
                    </p>
                    <p className="text-gray-400 text-sm">
                        For authorized employees only. © 2025 All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}