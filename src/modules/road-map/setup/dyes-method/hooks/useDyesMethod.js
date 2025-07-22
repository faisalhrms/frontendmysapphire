import {useState, useEffect} from "react";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {ROADMAP_SETUP} from "@modules/road-map/routes.js";
import {
    createDyesMethod,
    getDyesMethodById,
    updateDyesMethod
} from "@modules/road-map/setup/dyes-method/services/DyesMethodService.js";


export const useDyesMethod = (id) => {
    const navigate = useNavigate();
    const [dyesMethod, setDyesMethod] = useState(null);
    const {handleSubmit, control, setValue,watch ,formState: {errors, isSubmitting}} = useForm({
        defaultValues: {
            name: "",
            business_unit: "",
        }
    });
    const fetchDyesMethod = async (id) => {
        try {
            const res = await getDyesMethodById(id);
            setDyesMethod(res.data);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
      if (!id) return;
      (async () => {
        try {
          await fetchDyesMethod(id);
        } catch (err) {
          console.error(err);
        }
      })();
    }, [id]);
    useEffect(() => {
        if (dyesMethod) {
            setValue("name", dyesMethod.name);
            setValue("business_unit", dyesMethod.business_unit);
        }
    }, [dyesMethod, setValue]);
    const onSubmitHandler = async (data) => {
        try {
            if (id) {
                await updateDyesMethod(id, {dyesMethod: data});
            } else {
                await createDyesMethod({dyesMethod: data});
            }
         navigate(`${ROADMAP_SETUP.READ.path}?page=dyes-method`);
        } catch (error) {
            console.error(error);
        }
    };
    return {handleSubmit, control, errors, isSubmitting, onSubmit: onSubmitHandler, dyesMethod,watch};
};
