import {useState, useEffect} from "react";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {ROADMAP_SETUP} from "@modules/road-map/routes.js";
import {
    createProduct,
    getProductById,
    updateProduct
} from "@modules/road-map/setup/products/services/ProductService.js";


export const useProduct = (id) => {
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const {handleSubmit, control, setValue,watch ,formState: {errors, isSubmitting}} = useForm({
        defaultValues: {
            name: "",
            business_unit: "",
        }
    });
    const fetchProduct = async (id) => {
        try {
            const res = await getProductById(id);
            setProduct(res.data);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
      if (!id) return;
      (async () => {
        try {
          await fetchProduct(id);
        } catch (err) {
          console.error(err);
        }
      })();
    }, [id]);
    useEffect(() => {
        if (product) {
            setValue("name", product.name);
            setValue("business_unit", product.business_unit);
        }
    }, [product, setValue]);
    const onSubmitHandler = async (data) => {
        try {
            if (id) {
                await updateProduct(id, {product: data});
            } else {
                await createProduct({product: data});
            }
         navigate(`${ROADMAP_SETUP.READ.path}?tab=products`);
        } catch (error) {
            console.error(error);
        }
    };
    return {handleSubmit, control, errors, isSubmitting, onSubmit: onSubmitHandler, product,watch};
};
