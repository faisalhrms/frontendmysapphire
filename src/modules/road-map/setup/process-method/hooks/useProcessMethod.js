import {useState, useEffect} from "react";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {ROADMAP_SETUP} from "@modules/road-map/routes.js";
import {
    createProcessMethod, getProcessMethodById,
    updateProcessMethod
} from "@modules/road-map/setup/process-method/services/ProcessMethodService.js";

export const useProcessMethod = (id) => {
    const navigate = useNavigate();
    const [processMethod, setProcessMethod] = useState(null);
    const {handleSubmit, control, setValue,watch ,formState: {errors, isSubmitting}} = useForm({
        defaultValues: {
            name: "",
            business_unit: "",
        }
    });
    const fetchProcessMethod = async (id) => {
        try {
            const res = await getProcessMethodById(id);
            setProcessMethod(res.data);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
      if (!id) return;
      (async () => {
        try {
          await fetchProcessMethod(id);
        } catch (err) {
          console.error(err);
        }
      })();
    }, [id]);
    useEffect(() => {
        if (processMethod) {
            setValue("name", processMethod.name);
            setValue("business_unit", processMethod.business_unit);
        }
    }, [processMethod, setValue]);
    const onSubmitHandler = async (data) => {
        try {
            if (id) {
                await updateProcessMethod(id, {processMethod: data});
            } else {
                await createProcessMethod({processMethod: data});
            }
         navigate(`${ROADMAP_SETUP.READ.path}?page=process-method`);
        } catch (error) {
            console.error(error);
        }
    };
    return {handleSubmit, control, errors, isSubmitting, onSubmit: onSubmitHandler, processMethod,watch};
};
