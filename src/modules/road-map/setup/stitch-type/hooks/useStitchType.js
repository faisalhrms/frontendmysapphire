import {useState, useEffect} from "react";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {ROADMAP_SETUP} from "@modules/road-map/routes.js";
import {
    createStitchType,
    getStitchTypeById,
    updateStitchType
} from "@modules/road-map/setup/stitch-type/services/StitchTypeService.js";


export const useStitchType = (id) => {
    const navigate = useNavigate();
    const [stitchType, setStitchType] = useState(null);
    const {handleSubmit, control, setValue,watch ,formState: {errors, isSubmitting}} = useForm({
        defaultValues: {
            name: "",
            business_unit: "",
        }
    });
    const fetchStitchType = async (id) => {
        try {
            const res = await getStitchTypeById(id);
            setStitchType(res.data);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
      if (!id) return;
      (async () => {
        try {
          await fetchStitchType(id);
        } catch (err) {
          console.error(err);
        }
      })();
    }, [id]);
    useEffect(() => {
        if (stitchType) {
            setValue("name", stitchType.name);
            setValue("business_unit", stitchType.business_unit);
        }
    }, [stitchType, setValue]);
    const onSubmitHandler = async (data) => {
        try {
            if (id) {
                await updateStitchType(id, {stitchType: data});
            } else {
                await createStitchType({stitchType: data});
            }
         navigate(`${ROADMAP_SETUP.READ.path}?tab=stitch-type`);
        } catch (error) {
            console.error(error);
        }
    };
    return {handleSubmit, control, errors, isSubmitting, onSubmit: onSubmitHandler, stitchType,watch};
};
