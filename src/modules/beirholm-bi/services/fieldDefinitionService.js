import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const fieldDefinitionService = [
    { value: 'product', label: 'Product' },
    { value: 'currency', label: 'Currency' },
    { value: 'exporter', label: 'Exporter' },
    { value: 'importer', label: 'Importer' },
    { value: 'country', label: 'Country' },
    { value: 'unit', label: 'Unit' },
    { value: 'ratio', label: 'Ratio' },
    { value: 'color_type', label: 'Color Type' },
    { value: 'Agent', label: 'Agent' },
    { value: 'mltcd', label: 'MLTCD' },
    { value: 'construction', label: 'Construction' },
    { value: 'continent', label: 'Continent' },
    { value: 'league', label: 'League' },
    { value: 'classification', label: 'Classification' },
    { value: 'usd', label: 'USD' },
];

export const createFieldDefinition = async (digitalProfilesData) => {
  try {
    const response = await api.post("field/definition/", digitalProfilesData);
    Notify.success("Successfully Created!");

    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to create Field Definition");
    throw error;
  }
};
// export const getFieldDefinitionAll = async () => {
//   try {
//     return await api.get("field-definition/datatable/");
//   } catch (error) {
//     Notify.error(error.response?.data?.message || "Failed to fetch Field Definitions");
//     throw error;
//   }
// };

export const getFieldDefinitionAll = async () => {
  try {
    const response = await api.get("field/definition/datatable/");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to fetch Field Definition");
    throw error;
  }
};

export const getFieldDefinitionById = async (id) => {
  try {
    const response = await api.get(`field/definition/${id}/`);
    return response?.data?.data;
  } catch (error) {
    Notify.error(
      error.response?.data?.message || "Failed to fetch Field Definition details"
    );
    throw error;
  }
};

export const updateFieldDefinition = async (id, FieldDefinition) => {
  try {
    const response = await api.put(`field/definition/${id}/`, FieldDefinition);
    Notify.success("Updated Successfully!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to update Field Definition");
    throw error;
  }
};

export const deleteSLAById = async (id) => {
  try {
    const response = await api.delete(`field/definition/${id}/`);
    Notify.success("Deleted Successfully!");
    return response.data;
  } catch (error) {
    Notify.error(
      error.response?.data?.message || "Failed to delete Field Definition details"
    );
    throw error;
  }
};
