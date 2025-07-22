import {useState, useEffect} from "react";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {
    createUnitCategory,
    getUnitCategoryById,
    updateUnitCategory
} from "@modules/road-map/setup/unit-category/services/UnitCategoryService.js";
import {ROADMAP_SETUP} from "@modules/road-map/routes.js";

export const useUnitCategory = (id) => {
    const navigate = useNavigate();
    const [unitCategory, setUnitCategory] = useState(null);
    const {handleSubmit, control, setValue, formState: {errors, isSubmitting}} = useForm({
        defaultValues: {
            name: "",
            business_unit: "",
            category_type: "",
        }
    });
    const fetchUnitCategory = async (id) => {
        try {
            const res = await getUnitCategoryById(id);
            setUnitCategory(res.data);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        if (id) {
            fetchUnitCategory(id);
        }
    }, [id]);
    useEffect(() => {
        if (unitCategory) {
            setValue("name", unitCategory.name);
            setValue("business_unit", unitCategory.business_unit);
            setValue("category_type", unitCategory.category_type);
        }
    }, [unitCategory, setValue]);
    const onSubmitHandler = async (data) => {
        try {
            if (id) {
                await updateUnitCategory(id, {unitCategory: data});
            } else {
                await createUnitCategory({unitCategory: data});
            }
            navigate(ROADMAP_SETUP.READ.path);
        } catch (error) {
            console.error(error);
        }
    };
    return {handleSubmit, control, errors, isSubmitting, onSubmit: onSubmitHandler, unitCategory};
};
