// src/layouts/sidebar.js  (or wherever your requisition sidebar lives)
import { generateSidebarItem } from "@helpers/formatters.js";
import { REQUISITION_ROUTES } from "@modules/requisition/routes.js";

export const sidebarMenu = [
    generateSidebarItem("", "sub", "Requisition", 15, "bx-briefcase-alt-2", "", [
        generateSidebarItem(
            REQUISITION_ROUTES.JOB_DESCRIPTION.READ.path,
            "link",
            "Job Desc",
            1,
            "",
            REQUISITION_ROUTES.JOB_DESCRIPTION.READ.permission
        ),

        generateSidebarItem(
            REQUISITION_ROUTES.REQUISITION.READ.path,
            "link",
            "Requisition",
            2,
            "",
            REQUISITION_ROUTES.REQUISITION.READ.permission
        ),
        generateSidebarItem(
            REQUISITION_ROUTES.REQUISITION.APPLICANT_BANK.path,
            "link",
            "Applicant Bank",
            3,
            "",
            REQUISITION_ROUTES.REQUISITION.APPLICANT_BANK.permission
        ),

        generateSidebarItem(
            REQUISITION_ROUTES.REQUISITION.OFFER_APPROVAL_INBOX.path,
            "link",
            "Offer Approval",
            4,
            "",
            REQUISITION_ROUTES.REQUISITION.OFFER_APPROVAL_INBOX.permission
        ),
        generateSidebarItem(
            REQUISITION_ROUTES.REQUISITION.MY_PENDING_FEEDBACK.path,
            "link",
            "My Pending Feedback",
            5,
            "",
            REQUISITION_ROUTES.REQUISITION.MY_PENDING_FEEDBACK.permission
        ),



    ]),
];
