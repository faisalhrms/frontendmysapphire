import {useState, useEffect} from "react";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {ROADMAP_SETUP} from "@modules/road-map/routes.js";
import {
    createCertificate, getCertificateById,
    updateCertificate
} from "@modules/road-map/setup/certificates/services/CertificateService.js";


export const useCertificate = (id) => {
    const navigate = useNavigate();
    const [certificate, setCertificate] = useState(null);
    const {handleSubmit, control, setValue,watch ,formState: {errors, isSubmitting}} = useForm({
        defaultValues: {
            name: "",
            certificate_type: "",
            media: null,
            media_id: null,
        }
    });
    const fetchCertificate = async (id) => {
        try {
            const res = await getCertificateById(id);
            setCertificate(res.data);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
      if (!id) return;
      (async () => {
        try {
          await fetchCertificate(id);
        } catch (err) {
          console.error(err);
        }
      })();
    }, [id]);
    useEffect(() => {
        if (certificate) {
            setValue("name", certificate.name);
            setValue("media", certificate?.media || "");
            setValue("media_id", certificate?.media_id || "");
            setValue("certificate_type", certificate?.certificate_type.id || "");
        }
    }, [certificate, setValue]);
    const onSubmitHandler = async (data) => {
        try {
            if (id) {
                await updateCertificate(id, {certificate: data});
            } else {
                await createCertificate({certificate: data});
            }
         navigate(`${ROADMAP_SETUP.READ.path}?page=certificate`);
        } catch (error) {
            console.error(error);
        }
    };
    return {handleSubmit, control, errors, isSubmitting, onSubmit: onSubmitHandler, certificate,watch};
};
