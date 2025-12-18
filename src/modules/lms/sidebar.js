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
                1,
                "bx-book",
                LMS_ROUTES.CREATE.permission
            ),
            generateSidebarItem(
                LMS_ROUTES.READ.path,
                "link",
                "Course Listing",
                2,
                "bx-library",
                LMS_ROUTES.READ.permission
            ),
        ]
    ),
];
