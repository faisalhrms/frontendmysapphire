import {
    createCompany,
    getCompanyById,
    getCompanies,
    updateCompany,
} from "@modules/company/services/companyService.js";

export const useCompanies = (page = 1, size = 8, search) => {
    return useQuery({
        queryKey: ['companies', page, size, search],
        queryFn: () => getCompanies(page, size, search),
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    });
};

export const useCompanyForm = (companyData, isEditMode) => {
    const navigate = useNavigate();

    const handleCompanySubmit = async (data) => {
        try {
            if (isEditMode) {
                await updateCompany(companyData.id, data);
            } else {
                await createCompany(data);
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    return { handleCompanySubmit };
};

export const useCompany = (id) => {
    const [companyData, setCompanyData] = useState(null);

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const data = await getCompanyById(id);
                setCompanyData(data);
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchCompany();
    }, [id]);

    return { companyData };
};
