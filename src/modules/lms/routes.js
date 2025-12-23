import EnrollmentList from "@modules/lms/views/course-enrollment/EnrollmentList.jsx";
import EnrollmentForm from "@modules/lms/views/course-enrollment/EnrollmentForm.jsx";
import EnrollmentView from "@modules/lms/views/course-enrollment/EnrollmentView.jsx";
import OfferingList from "@modules/lms/views/course-offerings/OfferingList.jsx";
import OfferingForm from "@modules/lms/views/course-offerings/OfferingForm.jsx";
import OfferingView from "@modules/lms/views/course-offerings/OfferingView.jsx";
import CoursesView from "@modules/lms/views/lms-course/CoureseView.jsx";
import ScromListing from "@modules/lms/views/scrom/Scromlisting.jsx";
import ScromCourse from "@modules/lms/views/scrom/ScromCourse.jsx";



export const LMS_ROUTES = {
    READ: { path: "/module/lms/scrom-listing" },
    UPDATE: { path: "/module/lms/scrom" },
    CREATE: { path: "/module/lms/coursepage" },
    COURSE_OFFERING_CREATE: { path: "/module/lms/courseoffering" },
    COURSE_OFFERING_LIST: { path: "/module/lms/courseofferinglist" },
    COURSE_OFFERING_VIEW: { path: "/module/lms/courseofferingview/:id" },
    COURSE_OFFERING_EDIT: { path: "/module/lms/courseoffering/:id" },
    COURSE_ENROLLMENT_CREATE: { path: "/module/lms/courseenrollment" },
    COURSE_ENROLLMENT_LIST: { path: "/module/lms/courseenrollmentlist" },
    COURSE_ENROLLMENT_VIEW: { path: "/module/lms/courseenrollmentview/:id" },
    COURSE_ENROLLMENT_EDIT: { path: "/module/lms/courseenrollment/:id" },
};

export const COURSE_OFFERING_ROUTES = {
    create: LMS_ROUTES.COURSE_OFFERING_CREATE.path,
    list: LMS_ROUTES.COURSE_OFFERING_LIST.path,

    viewPath: LMS_ROUTES.COURSE_OFFERING_VIEW.path,
    editPath: LMS_ROUTES.COURSE_OFFERING_EDIT.path,

    view: (id) => `/module/lms/courseofferingview/${id}`,
    edit: (id) => `/module/lms/courseoffering/${id}`,
};

export const COURSE_ENROLLMENT_ROUTES = {
    create: LMS_ROUTES.COURSE_ENROLLMENT_CREATE.path,
    list: LMS_ROUTES.COURSE_ENROLLMENT_LIST.path,

    viewPath: LMS_ROUTES.COURSE_ENROLLMENT_VIEW.path,
    editPath: LMS_ROUTES.COURSE_ENROLLMENT_EDIT.path,

    view: (id) => `/module/lms/courseenrollmentview/${id}`,
    edit: (id) => `/module/lms/courseenrollment/${id}`,
};

export const MODULE_ROUTES = [

    { path: LMS_ROUTES.READ.path, component: ScromListing },
    { path: LMS_ROUTES.UPDATE.path, component: ScromCourse},
    { path: LMS_ROUTES.CREATE.path, component: CoursesView },
    { path: LMS_ROUTES.COURSE_OFFERING_LIST.path, component: OfferingList },
    { path: LMS_ROUTES.COURSE_OFFERING_CREATE.path, component: OfferingForm },
    { path: LMS_ROUTES.COURSE_OFFERING_EDIT.path, component: OfferingForm },
    { path: LMS_ROUTES.COURSE_OFFERING_VIEW.path, component: OfferingView },
    { path: LMS_ROUTES.COURSE_ENROLLMENT_LIST.path, component: EnrollmentList },
    { path: LMS_ROUTES.COURSE_ENROLLMENT_CREATE.path, component: EnrollmentForm },
    { path: LMS_ROUTES.COURSE_ENROLLMENT_EDIT.path, component: EnrollmentForm },
    { path: LMS_ROUTES.COURSE_ENROLLMENT_VIEW.path, component: EnrollmentView },
];
