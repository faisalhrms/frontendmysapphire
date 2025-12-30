import { generateSidebarItem } from "@helpers/formatters.js";
import { LMS_ROUTES } from "@modules/lms/routes.js";

export let sidebarMenu = [
    generateSidebarItem(
        "",
        "sub",
        "LMS",
        1,
        "bx-book-open",
        "",
        [
            generateSidebarItem(
                LMS_ROUTES.SCORM.path,
                "link",
                "Scorm",
                1,
                "bx-package",
                LMS_ROUTES.SCORM.permission

            ),
            generateSidebarItem(
                "",
                "sub",
                "Courses",
                2,
                "bx-calendar",
                "",
                [
                    generateSidebarItem(
                        LMS_ROUTES.COURSES.path,
                        "link",
                        "Courses",
                        1,
                        "bx-book",
                        LMS_ROUTES.COURSES.permission
                    ),
                    generateSidebarItem(
                        LMS_ROUTES.COURSE_OFFERING_LIST.path,
                        "link",
                        "Offerings",
                        2,
                        "bx-list-ul",
                        LMS_ROUTES.COURSE_OFFERING_LIST.permission
                    ),
                    generateSidebarItem(
                        LMS_ROUTES.COURSE_ENROLLMENT_LIST.path,
                        "link",
                        "Enrollments",
                        3,
                        "bx-list-ul",
                        LMS_ROUTES.COURSE_ENROLLMENT_LIST.permission
                    ),
                ]
            ),
        ]
    ),
];
