import EnrollmentList from "@modules/lms/views/course-enrollment/EnrollmentList.jsx";
import EnrollmentForm from "@modules/lms/views/course-enrollment/EnrollmentForm.jsx";
import EnrollmentView from "@modules/lms/views/course-enrollment/EnrollmentView.jsx";
import OfferingList from "@modules/lms/views/course-offerings/OfferingList.jsx";
import OfferingForm from "@modules/lms/views/course-offerings/OfferingForm.jsx";
import OfferingView from "@modules/lms/views/course-offerings/OfferingView.jsx";
import CoursesView from "@modules/lms/views/lms-course/CoureseView.jsx";
import ScromListing from "@modules/lms/views/scrom/Scromlisting.jsx";

import EnrollmentDatatable from "@modules/lms/components/course-offering/EnrollmentDatatable.jsx";

export const LMS_ROUTES = {
    SCORM: { path: "/module/lms/scorm" },
    COURSES: { path: "/module/lms/courses" },

    COURSE_OFFERING_CREATE: { path: "/module/lms/course-offerings/create" },
    COURSE_OFFERING_LIST: { path: "/module/lms/course-offerings" },
    COURSE_OFFERING_VIEW: { path: "/module/lms/course-offerings/detail/:id" },
    COURSE_OFFERING_EDIT: { path: "/module/lms/course-offerings/edit/:id" },

    COURSE_ENROLLMENT_CREATE: { path: "/module/lms/course-enrollments/create" },
    COURSE_ENROLLMENT_LIST: { path: "/module/lms/course-enrollments" },
    COURSE_ENROLLMENT_VIEW: { path: "/module/lms/course-enrollments/detail/:id" },
    COURSE_ENROLLMENT_EDIT: { path: "/module/lms/course-enrollments/edit/:id" },

    COURSE_ENROLLMENT_DATATABLE: { path: "/module/lms/course-enrollments/datatable" },
};

export const COURSE_OFFERING_ROUTES = {
    create: LMS_ROUTES.COURSE_OFFERING_CREATE.path,
    list: LMS_ROUTES.COURSE_OFFERING_LIST.path,

    viewPath: LMS_ROUTES.COURSE_OFFERING_VIEW.path,
    editPath: LMS_ROUTES.COURSE_OFFERING_EDIT.path,

    view: (id) => `/module/lms/course-offerings/detail/${id}`,
    edit: (id) => `/module/lms/course-offerings/edit/${id}`,
};

export const COURSE_ENROLLMENT_ROUTES = {
    create: LMS_ROUTES.COURSE_ENROLLMENT_CREATE.path,
    list: LMS_ROUTES.COURSE_ENROLLMENT_LIST.path,

    viewPath: LMS_ROUTES.COURSE_ENROLLMENT_VIEW.path,
    editPath: LMS_ROUTES.COURSE_ENROLLMENT_EDIT.path,

    view: (id) => `/module/lms/course-enrollments/detail/${id}`,
    edit: (id) => `/module/lms/course-enrollments/edit/${id}`,


    datatable: (offeringId) =>
        offeringId
            ? `${LMS_ROUTES.COURSE_ENROLLMENT_DATATABLE.path}?offering_id=${offeringId}`
            : LMS_ROUTES.COURSE_ENROLLMENT_DATATABLE.path,
};

export const MODULE_ROUTES = [
    { path: LMS_ROUTES.SCORM.path, component: ScromListing },
    { path: LMS_ROUTES.COURSES.path, component: CoursesView },

    { path: LMS_ROUTES.COURSE_OFFERING_LIST.path, component: OfferingList },
    { path: LMS_ROUTES.COURSE_OFFERING_CREATE.path, component: OfferingForm },
    { path: LMS_ROUTES.COURSE_OFFERING_EDIT.path, component: OfferingForm },
    { path: LMS_ROUTES.COURSE_OFFERING_VIEW.path, component: OfferingView },

    { path: LMS_ROUTES.COURSE_ENROLLMENT_LIST.path, component: EnrollmentList },
    { path: LMS_ROUTES.COURSE_ENROLLMENT_CREATE.path, component: EnrollmentForm },
    { path: LMS_ROUTES.COURSE_ENROLLMENT_EDIT.path, component: EnrollmentForm },
    { path: LMS_ROUTES.COURSE_ENROLLMENT_VIEW.path, component: EnrollmentView },


    { path: LMS_ROUTES.COURSE_ENROLLMENT_DATATABLE.path, component: EnrollmentDatatable },
];
