import {useState, useEffect} from "react";
import api from "@config/axiosConfig.js";

export const usePreselectedOption = (url, id) => {
  const [option, setOption] = useState(null);
  useEffect(() => {
    if (id) {
      api.get(url, {params: {id}})
        .then(res => {
          if (res.data?.data?.length > 0) {
            setOption(res.data.data[0]);
          }
        })
        .catch(err => {});
    }
  }, [id, url]);
  return option;
};
