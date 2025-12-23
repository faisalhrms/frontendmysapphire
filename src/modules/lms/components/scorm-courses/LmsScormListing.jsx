import React, { useEffect, useState } from "react";
import api from "@config/axiosConfig";

function buildLaunchUrl(detail) {

    if (detail?.launch_url) return detail.launch_url;

    const base = import.meta.env.VITE_DJANGO_URL || window.location.origin;

    const storagePath = (detail?.storage_path || "").replace(/^\/+/, "");
    const launchPath = (detail?.launch_path || "").replace(/^\/+/, "");

    if (!storagePath || !launchPath) return "";
    const sp = storagePath.endsWith("/") ? storagePath : `${storagePath}/`;
    return `${base}/media/${sp}${launchPath}`;
}

export default function LmsScormListing() {
    const [packages, setPackages] = useState([]);
    const [selectedPkg, setSelectedPkg] = useState(null);
    const [storyUrl, setStoryUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const loadPackages = async () => {
        try {
            setError("");

            // Datatable list endpoint
            const res = await api.get("/lms/scorm-packages/datatable");
            setPackages(res.data?.data?.rows || []);
        } catch (err) {
            console.error("Failed loading scorm packages", err.response?.data || err);
            setError("Failed to load SCORM packages. Please try again.");
        }
    };



    const loadScormPlayer = async (id) => {
        try {
            setLoading(true);
            setError("");

            const res = await api.get(`/lms/scorm-packages/${id}/`);
            const detail = res.data?.data;

            const url = buildLaunchUrl(detail);
            if (!url) {
                setError("No playable content found (launch_path/storage_path missing).");
                setStoryUrl("");
                return;
            }

            setStoryUrl(url);
        } catch (err) {
            console.error("Failed loading scorm detail", err.response?.data || err);
            setError(err.response?.data?.message || "Failed to load SCORM content");
            setStoryUrl("");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPackages();
    }, []);

    const handleSelect = (pkg) => {
        setSelectedPkg(pkg);
        setStoryUrl("");
        loadScormPlayer(pkg.id);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {!selectedPkg ? (
                <div>
                    {error && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    {packages.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-gray-500">
                                No SCORM packages available. Please upload some SCORM packages.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {packages.map((pkg) => (
                                <div
                                    key={pkg.id}
                                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-200 dark:text-gray-200 dark:bg-bodybg"
                                    onClick={() => handleSelect(pkg)}
                                >
                                    <div className="p-8">
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                                                    <i className="ri-folder-zip-line text-primary text-xl"></i>
                                                </div>
                                            </div>

                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-800 mb-2 dark:text-gray-200">
                                                    {pkg.title}
                                                </h3>

                                                <div className="space-y-1">
                                                    <p className="text-sm text-gray-600">
                                                        <span className="font-medium">Version:</span>{" "}
                                                        <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                              {pkg.scorm_version || "-"}
                            </span>
                                                    </p>

                                                    <p className="text-sm text-gray-600">
                                                        <span className="font-medium">Active:</span>{" "}
                                                        <span
                                                            className={`px-2 py-1 rounded text-xs ${
                                                                pkg.is_active
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-gray-100 text-gray-700"
                                                            }`}
                                                        >
                              {pkg.is_active ? "Yes" : "No"}
                            </span>
                                                    </p>

                                                    {pkg.created_at && (
                                                        <p className="text-xs text-gray-500">
                                                            Created:{" "}
                                                            {new Date(pkg.created_at).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <div className="flex justify-end">
                        <span className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]">
                          Click to Play
                          <svg
                              className="w-4 h-4 ml-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                            ></path>
                          </svg>
                        </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 dark:text-gray-200 dark:bg-bodybg">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-gray-50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <button
                                    className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
                                    onClick={() => {
                                        setSelectedPkg(null);
                                        setStoryUrl("");
                                        setError("");
                                    }}
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                        ></path>
                                    </svg>
                                    <span>Back</span>
                                </button>
                                <h2 className="text-xl font-bold">{selectedPkg.title}</h2>
                            </div>

                            <div className="flex items-center space-x-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  ID: {selectedPkg.id}
                </span>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-6">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-start">
                                    <svg
                                        className="w-5 h-5 text-red-500 mr-2 mt-0.5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        ></path>
                                    </svg>
                                    <div>
                                        <p className="font-medium text-red-800">Error</p>
                                        <p className="text-red-600 text-sm mt-1">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-16">
                                <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                                <p className="mt-6 text-gray-600 font-medium">
                                    Loading SCORM content...
                                </p>
                            </div>
                        ) : storyUrl ? (
                            <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-lg dark:text-gray-200 dark:bg-bodybg border border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-medium">SCORM Player</h3>
                                        <div className="text-xs text-gray-500 font-mono">
                                            {new URL(storyUrl).hostname}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Interactive SCORM content loaded below.
                                    </p>
                                </div>

                                <div className="relative bg-gray-900 rounded-lg overflow-hidden border-4 border-gray-800 shadow-xl">
                                    <div className="absolute top-0 left-0 right-0 bg-gray-800 px-4 py-2 flex items-center justify-between z-10">
                                        <div className="flex items-center space-x-2">
                                            <div className="flex space-x-1">
                                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                            </div>
                                            <span className="text-xs text-gray-300 font-mono">
                        scorm-player
                      </span>
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {new URL(storyUrl).pathname}
                                        </div>
                                    </div>

                                    <iframe
                                        key={selectedPkg.id}
                                        src={storyUrl}
                                        title={`${selectedPkg.title} - SCORM Player`}
                                        className="w-full h-[75vh] border-0"
                                        allow="autoplay; fullscreen"
                                        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-downloads"
                                        style={{ marginTop: "40px" }}
                                        loading="eager"
                                        onError={(e) => {
                                            console.error("Iframe loading error:", e);
                                            setError(
                                                "Failed to load SCORM content. File might be missing or blocked by browser."
                                            );
                                        }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <h3 className="text-lg font-medium text-gray-700 mb-2">
                                    No Content Available
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    This SCORM package doesn't have playable content yet.
                                </p>
                                <button
                                    onClick={() => loadScormPlayer(selectedPkg.id)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                >
                                    Try Loading Again
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
