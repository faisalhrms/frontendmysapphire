import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const productCountry = [
    { value: 'pakistan', label: 'Pakistan' },
    { value: 'india', label: 'India' },
    { value: 'vietnam', label: 'Vietnam' },
    { value: 'turkey', label: 'Turkey' },
];

const downloadFile = async (url, defaultFilename) => {
  try {
    const response = await api.get(url, { responseType: "blob" });
    const blob = response.data;
    const contentDisposition = response.headers["content-disposition"];
    let filename = defaultFilename;
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^"]+)"?/);
      if (match && match[1]) {
        filename = match[1];
      }
    }
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    const serverMessage =
      error.response?.data?.errors ||
      error.response?.data?.message ||
      "Download failed";
    Notify.error(serverMessage);
    throw error;
  }
};

const downloadSampleFile = async () => {
  const url = `/correction/file/download-sample-file/`;
  await downloadFile(url, "sample_file.xlsx");
};

const downloadRawFile = async (fileId) => {
  const url = `/correction/file/${fileId}/raw/download/`;
  await downloadFile(url, "raw_file.xlsx");
};

const downloadCleanFile = async (fileId) => {
  const url = `/correction/file/${fileId}/clean/download/`;
  await downloadFile(url, "clean_file.xlsx");
};

const uploadRawFile = async (formData) => {
  try {
    const response = await api.post("/correction/file/upload-excel/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    Notify.success("File uploaded successfully");
    return response.data;
  } catch (error) {
    const serverMessage =
      error.response?.data?.errors ||
      error.response?.data?.message ||
      "File upload failed";
    Notify.error(serverMessage);
    throw error;
  }
};

const reprocessJob = async (jobId) => {
  try {
    const response = await api.post(`/correction/file/${jobId}/reprocess/`);
    Notify.success("Reprocessing initiated");
    return response.data;
  } catch (error) {
    const serverMessage =
      error.response?.data?.errors ||
      error.response?.data?.message ||
      "Reprocessing failed";
    Notify.error(serverMessage);
    throw error;
  }
};

const getJobStatus = async (jobId) => {
  try {
    const response = await api.get(`/correction/file/${jobId}/status/`);
    return response.data;
  } catch (error) {
    const serverMessage =
      error.response?.data?.errors ||
      error.response?.data?.message ||
      "Failed to get job status";
    Notify.error(serverMessage);
    throw error;
  }
};

const downloadErrorFile = async (jobId) => {
  const url = `/correction/file/${jobId}/download-error-file/`;
  await downloadFile(url, "error_file.xlsx");
};

const uploadMissingRules = async (jobId, formData) => {
  try {
    const response = await api.post(`/correction/file/${jobId}/upload-missing-rules/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    Notify.success("Missing rules uploaded successfully");
    return response.data;
  } catch (error) {
    const serverMessage =
      error.response?.data?.errors ||
      error.response?.data?.message ||
      "Upload missing rules failed";
    Notify.error(serverMessage);
    throw error;
  }
};

const deleteFile = async (fileId) => {
  try {
    const response = await api.delete(`/correction/file/${fileId}/`);
    Notify.success("File deleted successfully");
    return response.data;
  } catch (error) {
    const serverMessage =
      error.response?.data?.errors ||
      error.response?.data?.message ||
      "Delete failed";
    Notify.error(serverMessage);
    throw error;
  }
};

const downloadBulkCleanFile = async (fileIds = []) => {
  const { data, headers } = await api.post(
    "/correction/file/clean/download/bulk/",
    { file_ids: fileIds },
    { responseType: "blob" }
  );
  const cd = headers["content-disposition"] || "";
  const m = cd.match(/filename\*=UTF-8''([^;]+)|filename[^=]*=\s*"?([^";]+)"?/i);
  const name = m ? decodeURIComponent(m[1] || m[2]) : fileIds.length ? "bulk_clean_data.zip" : "all_clean_data.csv";
  const url = URL.createObjectURL(data);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};




export default {
  uploadRawFile,
  reprocessJob,
  getJobStatus,
  downloadErrorFile,
  downloadRawFile,
  downloadCleanFile,
  uploadMissingRules,
  downloadSampleFile,
  downloadBulkCleanFile,
  deleteFile,
};
