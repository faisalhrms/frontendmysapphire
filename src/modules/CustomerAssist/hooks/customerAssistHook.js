import { useNavigate } from "react-router-dom";
import {
    getCustomerCaseById,
    submitCase, updateCustomerCase
} from "@modules/CustomerAssist/services/customerAssistService.js";
import { useCallback, useEffect, useState } from "react";
import {CUSTOMER_ASSIST_ROUTES} from "@modules/CustomerAssist/routes.js";

export const useCaseForm = (id) => {
    const navigate = useNavigate();

    const handleCaseSubmit = async (formData) => {
        try {
            if (id) {
                // Edit mode: only send remarks field for update
                const payload = { remarks: formData.remarks };
                // Use PATCH if backend supports partial update:
                // Assuming updateCustomerCase uses PUT; if your backend expects PATCH for partial, modify service accordingly.
                const updated = await updateCustomerCase(id, payload);
                // After successful update, navigate somewhere (e.g., list or detail)
                navigate(CUSTOMER_ASSIST_ROUTES.READ.path); // adjust path as needed
            } else {
                // Create mode: send full formData
                const response = await submitCase(formData);
                // After successful creation, navigate
                navigate(CUSTOMER_ASSIST_ROUTES.READ.path); // adjust path as needed
            }
        } catch (error) {
            console.error('Error submitting case:', error);
            // Optionally show a notification here if not already shown in service
        }
    };

    return { handleCaseSubmit };
};
export const useCase = (id) => {
    const [caseData, setCaseData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        const fetchCase = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getCustomerCaseById(id);
                setCaseData(data);
            } catch (error) {
                setError(error.message);
                console.log(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCase();
    }, [id]);

    return { caseData, isLoading, error };
};

// export const useCaseSearch = () => {
//     const [isSearching, setIsSearching] = useState(false);
//     const [searchError, setSearchError] = useState(null);
//
//     const searchCaseByValue = useCallback(async (searchValue, searchType) => {
//         setIsSearching(true);
//         setSearchError(null);
//
//         try {
//             const data = await searchCase(searchValue, searchType);
//             return data;
//         } catch (error) {
//             setSearchError(error.message);
//             throw error;
//         } finally {
//             setIsSearching(false);
//         }
//     }, []);
//
//     return { searchCaseByValue, isSearching, searchError };
// };
//
// export const useUpdateCaseStatus = () => {
//     const [isLoading, setLoading] = useState(false);
//
//     const handleStatusUpdate = useCallback(async (caseId, status) => {
//         setLoading(true);
//         try {
//             return await updateCaseStatus(caseId, status);
//         } catch (err) {
//             throw err;
//         } finally {
//             setLoading(false);
//         }
//     }, []);
//
//     return { handleStatusUpdate, isLoading };
// };
//
// export const useCaseActions = () => {
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState(null);
//
//     const executeAction = useCallback(async (action, ...params) => {
//         setIsLoading(true);
//         setError(null);
//
//         try {
//             let result;
//             switch (action) {
//                 case 'create':
//                     result = await createCase(params[0]);
//                     break;
//                 case 'update':
//                     result = await updateCase(params[0], params[1]);
//                     break;
//                 case 'updateStatus':
//                     result = await updateCaseStatus(params[0], params[1]);
//                     break;
//                 case 'search':
//                     result = await searchCase(params[0], params[1]);
//                     break;
//                 default:
//                     throw new Error(`Unknown action: ${action}`);
//             }
//             return result;
//         } catch (err) {
//             setError(err.message);
//             throw err;
//         } finally {
//             setIsLoading(false);
//         }
//     }, []);
//
//     return { executeAction, isLoading, error };
// };