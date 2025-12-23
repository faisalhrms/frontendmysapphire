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
                LMS_ROUTES.CREATE.path,
                "link",
                "Courses",
                2,
                "bx-book",
                LMS_ROUTES.CREATE.permission
            ),


            generateSidebarItem(
                "",
                "sub",
                "Scorm",
                1,
                "bx-package",
                "",
                [
                    generateSidebarItem(
                        LMS_ROUTES.READ.path,
                        "link",
                        "Scorm listing",
                        1,
                        "bx-library",
                        LMS_ROUTES.READ.permission
                    ),
                    generateSidebarItem(
                        LMS_ROUTES.UPDATE.path,
                        "link",
                        "upload Scorm",
                        2,
                        "bx-upload",
                        LMS_ROUTES.UPDATE.permission
                    ),
                ]
            ),

            generateSidebarItem(
                "",
                "sub",
                "Course Offering",
                3,
                "bx-calendar",
                "",
                [
                    generateSidebarItem(
                        LMS_ROUTES.COURSE_OFFERING_LIST.path,
                        "link",
                        "Offerings List",
                        1,
                        "bx-list-ul",
                        LMS_ROUTES.COURSE_OFFERING_LIST.permission
                    ),

                ]
            ),


            generateSidebarItem(
                "",
                "sub",
                "Course Enrollment",
                4,
                "bx-user-check",
                "",
                [
                    generateSidebarItem(
                        LMS_ROUTES.COURSE_ENROLLMENT_LIST.path,
                        "link",
                        "Enrollments List",
                        1,
                        "bx-list-ul",
                        LMS_ROUTES.COURSE_ENROLLMENT_LIST.permission
                    ),

                ]
            ),
        ]
    ),
];
