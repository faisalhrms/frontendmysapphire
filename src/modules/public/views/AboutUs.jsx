import React, { useEffect, useState } from "react";
import api from "@config/axiosConfig";

const AboutUs = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            const res = await api.get("/lms/scorm/");
            console.log(res.data)
            setCourses(res.data.results);
        } catch (err) {
            console.error("Failed loading courses", err);
        }
    };

    const openCourse = (course) => {
        setSelectedCourse(course);
    };

    return (
        <div className="p-4">
            {!selectedCourse && (
                <div>
                    <h2 className="text-xl font-bold mb-4">Available SCORM Trainings</h2>

                    {courses.length === 0 && (
                        <p>No SCORM courses found. Upload one in Django admin.</p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {courses.map((course) => (
                            <div
                                key={course.id}
                                className="p-4 border rounded-lg shadow hover:bg-gray-100 cursor-pointer"
                                onClick={() => openCourse(course)}
                            >
                                <h3 className="text-lg font-semibold">{course.title}</h3>
                                <p className="text-sm text-gray-600">
                                    Folder: {course.folder_path}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {selectedCourse && (
                <div className="mt-6">
                    <button
                        className="px-4 py-2 bg-gray-800 text-white rounded mb-4"
                        onClick={() => setSelectedCourse(null)}
                    >
                        ← Back to Courses
                    </button>

                    <h2 className="text-xl font-bold mb-2">{selectedCourse.title}</h2>

                    <iframe
                        title="SCORM Course"
                        src={`${import.meta.env.VITE_DJANGO_URL}/api/lms/media/${selectedCourse.folder_path}${selectedCourse.entry_file}`}
                        style={{
                            width: "100%",
                            height: "80vh",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                        }}
                        allowFullScreen
                    />
                </div>
            )}
        </div>
    );
};

export default AboutUs;
