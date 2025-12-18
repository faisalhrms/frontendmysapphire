import React, { useEffect, useState } from "react";
import api from "@config/axiosConfig";

export default function LmsListing() {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [storyUrl, setStoryUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const loadCourses = async () => {
        try {
            const res = await api.get("/lms/course/");
            setCourses(res.data.data || []);
        } catch (err) {
            console.error("Failed loading courses", err);
            setError("Failed to load courses. Please try again.");
        }
    };

    const loadStoryContent = async (courseId) => {
        try {
            setLoading(true);
            setError("");
            const res = await api.get(`/lms/course/${courseId}/play-video/`);
            const data = res.data.data;

            if (data.story_url) {
                let finalUrl = data.story_url;

                if (!finalUrl.startsWith("http")) {
                    finalUrl = `${import.meta.env.VITE_DJANGO_URL || window.location.origin}${finalUrl}`;
                }

                console.log("Loading story URL:", finalUrl);
                setStoryUrl(finalUrl);
            } else {
                setError("No playable content found for this course.");
                setStoryUrl("");
            }
        } catch (err) {
            console.error("Failed loading story content", err.response?.data || err.message);
            setError(err.response?.data?.message || "Failed to load course content");
            setStoryUrl("");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCourses();
    }, []);

    const handleSelectCourse = (course) => {
        setSelectedCourse(course);
        setStoryUrl("");
        loadStoryContent(course.id);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {!selectedCourse ? (
                <div>
                    {/*<div className="flex justify-between items-center mb-6">*/}
                    {/*    <h2 className="text-2xl font-bold text-gray-800">Available LMS Courses</h2>*/}

                    {/*</div>*/}

                    {error && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    {courses.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-gray-500">No courses available. Please upload some courses.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.map((course) => (
                                <div
                                    key={course.id}
                                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-200 dark:text-gray-200 dark:bg-bodybg"
                                    onClick={() => handleSelectCourse(course)}
                                >
                                    <div className="p-8">
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-800 mb-2 dark:text-gray-200 dark:bg-bodybg">{course.title}</h3>
                                                <div className="space-y-1">
                                                    <p className="text-sm text-gray-600">
                                                        <span className="font-medium">Status:</span>{" "}
                                                        <span className={`px-2 py-1 rounded text-xs ${course.extracted_path ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                            {course.extracted_path ? "Ready to Play" : "Not Extracted"}
                                                        </span>
                                                    </p>
                                                    {course.created_at && (
                                                        <p className="text-xs text-gray-500">
                                                            Created: {new Date(course.created_at).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <div className="flex justify-end">
                                                <span className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]">
                                                    Click to Play
                                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
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
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 dark:text-gray-200 dark:bg-bodybg ">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-gray-50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <button
                                    className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
                                    onClick={() => {
                                        setSelectedCourse(null);
                                        setStoryUrl("");
                                        setError("");
                                    }}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                                    </svg>
                                    <span>Back to Courses</span>
                                </button>
                                <h2 className="text-xl font-bold ">{selectedCourse.title}</h2>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                                    Course ID: {selectedCourse.id}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-6">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-red-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <div>
                                        <p className="font-medium text-red-800">Error Loading Course</p>
                                        <p className="text-red-600 text-sm mt-1">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-16">
                                <div className="relative">
                                    <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                                <p className="mt-6 text-gray-600 font-medium">Loading course content...</p>
                                <p className="text-sm text-gray-500 mt-2">Please wait while we prepare your learning experience</p>
                            </div>
                        ) : storyUrl ? (
                            <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-lg dark:text-gray-200 dark:bg-bodybg border border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-medium ">Course Player</h3>
                                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                                            </svg>
                                            <span>Interactive Content</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        This is an interactive course. Use the controls within the player to navigate through the content.
                                    </p>
                                </div>

                                {/* Iframe Container */}
                                <div className="relative bg-gray-900 rounded-lg overflow-hidden border-4 border-gray-800 shadow-xl">
                                    <div className="absolute top-0 left-0 right-0 bg-gray-800 px-4 py-2 flex items-center justify-between z-10">
                                        <div className="flex items-center space-x-2">
                                            <div className="flex space-x-1">
                                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                            </div>
                                            <span className="text-xs text-gray-300 font-mono">course-player</span>
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {new URL(storyUrl).hostname}
                                        </div>
                                    </div>

                                    <iframe
                                        key={selectedCourse.id}
                                        src={storyUrl}
                                        title={`${selectedCourse.title} - Course Player`}
                                        className="w-full h-[75vh] border-0"
                                        allow="autoplay; fullscreen; camera; microphone; display-capture"
                                        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-downloads"
                                        style={{ marginTop: "40px" }}
                                        loading="eager"
                                        onLoad={() => console.log("Iframe loaded successfully")}
                                        onError={(e) => {
                                            console.error("Iframe loading error:", e);
                                            setError("Failed to load course content. The file might be missing or corrupted.");
                                        }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-700 mb-2">No Content Available</h3>
                                <p className="text-gray-500 mb-6">
                                    This course doesn't have any playable content yet.
                                </p>
                                <button
                                    onClick={() => loadStoryContent(selectedCourse.id)}
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
