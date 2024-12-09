// import React, { useEffect, useState } from "react";
// import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
// import { formatOptions } from "@helpers/formatters.js";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import serviceRequestSchema from "@modules/employee-self-services/schemas/ServiceRequestSchema.js";
// import { useServiceRequestForm } from "@modules/employee-self-services/hooks/ServiceRequestHook.js";
// import FormInput from "@components/form/FormInput.jsx";
// import FormRichTextarea from "@components/form/FormRichTextarea.jsx";
// import GalleryUpload from "@components/GalleryUpload.jsx";
// import FormButton from "@components/form/FormButton.jsx";
// import face5 from "@assets/images/faces/5.jpg";
// import AlertModal from "../../../components/AlertModal";

// const CreateTask = ({ serviceData, isSaveMode = false }) => {
//   const [isSavedAsDraft, setIsSavedAsDraft] = useState(false);
//   const [isSubmitted, setIsSubmitted] = useState(
//     serviceData?.is_submitted || false
//   );
//   const {
//     control,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     setValue,
//     watch,
//   } = useForm({
//     resolver: zodResolver(serviceRequestSchema(isSaveMode)),
//     defaultValues: {
//       status: "active",
//       ...serviceData,
//     },
//   });
//   const selectedDepartment = watch("department_id");
//   const selectedSubDepartment = watch("sub_department_id");

//   const { saveAsDraft, submitRequest } = useServiceRequestForm(
//     serviceData,
//     isSaveMode
//   );

//   useEffect(() => {
//     if (serviceData) {
//       Object.keys(serviceData).forEach((key) => {
//         setValue(key, serviceData[key]);
//       });
//       setIsSavedAsDraft(serviceData?.is_submitted === false);
//       setIsSubmitted(serviceData?.is_submitted || false); // Mark as draft if already saved as draft
//     }
//   }, [serviceData, setValue]);

//   const handleSaveDraft = async (data) => {
//     try {
//       const response = await saveAsDraft(data);
//       setIsSavedAsDraft(true); // Mark as saved draft
//     } catch (error) {
//       console.error("Error saving draft:", error);
//     }
//   };

//   const handleSubmitRequest = async () => {
//     if (!isSavedAsDraft) {
//       alert("Please save as draft before submitting.");
//       return;
//     }

//     try {
//       await submitRequest(serviceData.id);
//       setIsSavedAsDraft(false);
//       setIsSubmitted(true);
//     } catch (error) {
//       console.error("Error submitting request:", error);
//     }
//   };

//   // Handle form submission
//   const onSubmit = async (data) => {
//     const formattedData = {
//       ...data,

//       company_id: 1,
//       location_id: data.location_id,
//       sub_department_id: data.sub_department_id,
//       sr_type_id: data.sr_type_id,
//       user_to: data.user_to?.id,
//       user_cc: data.user_to?.id,
//     };

//     await submitRequest(formattedData);
//   };

//   return (

//     <form onSubmit={handleSubmit(handleSaveDraft)}>

//       <div className="grid grid-cols-12 gap-x-6 mt-4">
//         <div className="xxl:col-span-9">
//           <div className="mb-2 ">
//             <h2 className="text-2xl font-semibold text-gray-800">
//               Create task
//             </h2>
//           </div>
//           <div className="box">
//             <div className="box-header">
//               <div className="box-title">Create task</div>
//             </div>
//             <div className="box-body">
//               <div className="grid grid-cols-12 gap-4">
//                 <div className="xl:col-span-12 col-span-12">
//                   <label htmlFor="tolerance-issue" className="form-label">
//                     Request Title
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control bg-gray-100 border border-gray-300 rounded"
//                     id="tolerance-issue"
//                     placeholder="Tolerance Issue"
//                     disabled
//                   />
//                 </div>

//                 <div className="xl:col-span-6 col-span-6">
//                   <FormAsyncSelect
//                     label="Location"
//                     name="location_id"
//                     control={control}
//                     errors={errors}
//                     placeholder="Location"
//                     apiUrl="/select/locations"
//                     queryKeyBase="locations"
//                     clientSideSearch={true}
//                     preselectedOptions={formatOptions(serviceData, "location")}
//                   />
//                 </div>
//                 <div className="xl:col-span-6 col-span-6">
//                   <FormAsyncSelect
//                     label="SR Type"
//                     name="sr_type_id"
//                     control={control}
//                     errors={errors}
//                     placeholder="SR Type"
//                     apiUrl={`/select/sr-types?sub_department_id=${selectedSubDepartment}`} // Conditional URL based on sub-department
//                     queryKeyBase={`srtype_${selectedSubDepartment}`} // Unique key for sub-department changes
//                     clientSideSearch={true}
//                     preselectedOptions={formatOptions(serviceData, "srtype")}
//                     isDisabled={!selectedSubDepartment} // Disable if no sub-department selected
//                   />
//                 </div>
//                 <div className="xl:col-span-6 col-span-6">
//                   <FormAsyncSelect
//                     isMulti={true}
//                     name="user_ids mt-2"
//                     control={control}
//                     errors={errors}
//                     placeholder="Show Team"
//                     // apiUrl="/select/users"
//                     styles={{
//                       menu: (provided) => ({
//                         ...provided,
//                         zIndex: 20,
//                       }),
//                     }}
//                   />
//                 </div>
//                 <div className="xl:col-span-6 col-span-6">
//                   <FormInput
//                     type="date"
//                     name="need_by_date"
//                     control={control}
//                     errors={errors}
//                     placeholder="Need By Date"
//                   />
//                 </div>

//                 <div className="xl:col-span-6 col-span-6">
//                   <FormInput
//                     type="date"
//                     name="started_at"
//                     control={control}
//                     errors={errors}
//                     placeholder="Start Date"
//                   />
//                 </div>
//                 <div className="xl:col-span-6 col-span-6">
//                   <FormInput
//                     type="date"
//                     name="ended_at"
//                     control={control}
//                     errors={errors}
//                     placeholder="End Date"
//                   />
//                 </div>

//                 <div className="col-span-12">
//                   <FormRichTextarea
//                     name="description"
//                     control={control}
//                     errors={errors}
//                     placeholder="Description"
//                     editorOptions={{
//                       height: 300,
//                       buttonList: [
//                         ["bold", "italic", "underline", "strike"],
//                         ["font", "fontSize", "fontColor", "hiliteColor"],
//                         ["align", "list", "table"],
//                       ],
//                     }}
//                   />
//                 </div>

//                 <div className="col-span-12">
//                   <GalleryUpload
//                     currentValue={serviceData?.attachment_ids || []}
//                     files={serviceData?.attachments || []}
//                     inputName="attachment_ids"
//                     placeholder="Select Attachments"
//                     control={control}
//                     errors={errors}
//                   />
//                 </div>
//               </div>
//             </div>
//             <div className="px-6 py-4 border-t border-dashed dark:border-defaultborder/10 sm:flex justify-end">
//               {!isSubmitted && (
//                 <>
//                   <AlertModal>
//                     <FormButton
//                       isLoading={isSubmitting}
//                       text="create task"
//                       onClick={handleSubmit(handleSaveDraft)}
//                     />
//                   </AlertModal>
//                   <FormButton
//                     isLoading={isSubmitting}
//                     text="Submit"
//                     onClick={handleSubmit(handleSubmitRequest)}
//                   />
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//         <div className="xl:col-span-3 col-span-12 mt-11">
//           <div className="box">
//             <div className="box-body">
//               <div>
//                 <div className="font-semibold mb-1">Company :</div>
//                 <p className="text-[#8c9097] dark:text-white/50 mb-3">
//                   Sapphire Retail Limited.
//                 </p>

//                 <div className="font-semibold mb-1">Location:</div>
//                 <p className="text-[#8c9097] dark:text-white/50 mb-3">
//                   Head Office
//                 </p>
//                 <div className="font-semibold mb-1">SR NO:</div>
//                 <p className="text-[#8c9097] dark:text-white/50 mb-3">
//                   {" "}
//                   SRER011124-001
//                 </p>
//                 <div className="font-semibold mb-1">SR Type:</div>
//                 <p className="text-[#8c9097] dark:text-white/50 mb-3">
//                   {" "}
//                   Discount Related issues
//                 </p>
//                 <div className="font-semibold mb-1">Department :</div>
//                 <p className="text-[#8c9097] dark:text-white/50 mb-3">ERP:</p>
//                 <div className="font-semibold mb-1">Time Created:</div>
//                 <p className="text-[#8c9097] dark:text-white/50 mb-3">
//                   11/1/2024, 11:59:48 AM
//                 </p>
//                 <div className="font-semibold mb-1">Need By Date:</div>
//                 <p className="text-[#8c9097] dark:text-white/50 mb-3">
//                   2024-11-01
//                 </p>
//               </div>
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-sm"></div>
//             </div>
//           </div>
//         </div>
//       </div>

//     </form>

//   );
// };

// export default CreateTask;
// import React, { useEffect, useState } from "react";
// import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
// import { formatOptions } from "@helpers/formatters.js";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import serviceRequestSchema from "@modules/employee-self-services/schemas/ServiceRequestSchema.js";
// import { useServiceRequestForm } from "@modules/employee-self-services/hooks/ServiceRequestHook.js";
// import FormInput from "@components/form/FormInput.jsx";
// import FormRichTextarea from "@components/form/FormRichTextarea.jsx";
// import GalleryUpload from "@components/GalleryUpload.jsx";
// import FormButton from "@components/form/FormButton.jsx";
// import face5 from "@assets/images/faces/5.jpg";
// import AlertModal from "../../../components/AlertModal";

// const CreateTask = ({ serviceData, isSaveMode = false }) => {
//   const [isSavedAsDraft, setIsSavedAsDraft] = useState(false);
//   const [isSubmitted, setIsSubmitted] = useState(
//     serviceData?.is_submitted || false
//   );
//   const {
//     control,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     setValue,
//     watch,
//   } = useForm({
//     resolver: zodResolver(serviceRequestSchema(isSaveMode)),
//     defaultValues: {
//       status: "active",
//       ...serviceData,
//     },
//   });
//   const selectedDepartment = watch("department_id");
//   const selectedSubDepartment = watch("sub_department_id");

//   const { saveAsDraft, submitRequest } = useServiceRequestForm(
//     serviceData,
//     isSaveMode
//   );

//   useEffect(() => {
//     if (serviceData) {
//       Object.keys(serviceData).forEach((key) => {
//         setValue(key, serviceData[key]);
//       });
//       setIsSavedAsDraft(serviceData?.is_submitted === false);
//       setIsSubmitted(serviceData?.is_submitted || false);
//     }
//   }, [serviceData, setValue]);

//   const handleSaveDraft = async (data) => {
//     try {
//       const response = await saveAsDraft(data);
//       setIsSavedAsDraft(true);
//     } catch (error) {
//       console.error("Error saving draft:", error);
//     }
//   };

//   const handleSubmitRequest = async () => {
//     if (!isSavedAsDraft) {
//       alert("Please save as draft before submitting.");
//       return;
//     }

//     try {
//       await submitRequest(serviceData.id);
//       setIsSavedAsDraft(false);
//       setIsSubmitted(true);
//     } catch (error) {
//       console.error("Error submitting request:", error);
//     }
//   };

//   const onSubmit = async (data) => {
//     const formattedData = {
//       ...data,
//       company_id: 1,
//       location_id: data.location_id,
//       sub_department_id: data.sub_department_id,
//       sr_type_id: data.sr_type_id,
//       user_to: data.user_to?.id,
//       user_cc: data.user_to?.id,
//     };

//     await submitRequest(formattedData);
//   };

//   return (
//     <form onSubmit={handleSubmit(handleSaveDraft)}>
//       <div style={{ maxHeight: "500px", overflowY: "auto" }}>
//         <div className="grid grid-cols-12 gap-x-6 mt-4 b-white dark:bg-bodybg ">
//           <div className="xxl:col-span-9">

//             <div className="box bg-white ">
//               <div className="box-header">
//                 <div className="box-title">Create task</div>
//               </div>
//               <div className="box-body">
//                 <div className="grid grid-cols-12 gap-4">
//                   <div className="xl:col-span-12 col-span-12">
//                     <label htmlFor="tolerance-issue" className="form-label">
//                       Request Title
//                     </label>
//                     <input
//                       type="text"
//                       className="form-control bg-gray-100 border border-gray-300 rounded"
//                       id="tolerance-issue"
//                       placeholder="Tolerance Issue"
//                       disabled
//                     />
//                   </div>

//                   <div className="xl:col-span-6 col-span-6">
//                     <FormAsyncSelect
//                       label="Location"
//                       name="location_id"
//                       control={control}
//                       errors={errors}
//                       placeholder="Location"
//                       apiUrl="/select/locations"
//                       queryKeyBase="locations"
//                       clientSideSearch={true}
//                       preselectedOptions={formatOptions(serviceData, "location")}
//                     />
//                   </div>
//                   <div className="xl:col-span-6 col-span-6">
//                     <FormAsyncSelect
//                       label="SR Type"
//                       name="sr_type_id"
//                       control={control}
//                       errors={errors}
//                       placeholder="SR Type"
//                       apiUrl={`/select/sr-types?sub_department_id=${selectedSubDepartment}`}
//                       queryKeyBase={`srtype_${selectedSubDepartment}`}
//                       clientSideSearch={true}
//                       preselectedOptions={formatOptions(serviceData, "srtype")}
//                       isDisabled={!selectedSubDepartment}
//                     />
//                   </div>
//                   <div className="xl:col-span-6 col-span-6">
//                     <FormAsyncSelect
//                       isMulti={true}
//                       name="user_ids mt-2"
//                       control={control}
//                       errors={errors}
//                       placeholder="Show Team"
//                       styles={{
//                         menu: (provided) => ({
//                           ...provided,
//                           zIndex: 20,
//                         }),
//                       }}
//                     />
//                   </div>
//                   <div className="xl:col-span-6 col-span-6">
//                     <FormInput
//                       type="date"
//                       name="need_by_date"
//                       control={control}
//                       errors={errors}
//                       placeholder="Need By Date"
//                     />
//                   </div>

//                   <div className="xl:col-span-6 col-span-6">
//                     <FormInput
//                       type="date"
//                       name="started_at"
//                       control={control}
//                       errors={errors}
//                       placeholder="Start Date"
//                     />
//                   </div>
//                   <div className="xl:col-span-6 col-span-6">
//                     <FormInput
//                       type="date"
//                       name="ended_at"
//                       control={control}
//                       errors={errors}
//                       placeholder="End Date"
//                     />
//                   </div>

//                   <div className="col-span-12">
//                     <FormRichTextarea
//                       name="description"
//                       control={control}
//                       errors={errors}
//                       placeholder="Description"
//                       editorOptions={{
//                         height: 300,
//                         buttonList: [
//                           ["bold", "italic", "underline", "strike"],
//                           ["font", "fontSize", "fontColor", "hiliteColor"],
//                           ["align", "list", "table"],
//                         ],
//                       }}
//                     />
//                   </div>

//                   <div className="col-span-12">
//                     <GalleryUpload
//                       currentValue={serviceData?.attachment_ids || []}
//                       files={serviceData?.attachments || []}
//                       inputName="attachment_ids"
//                       placeholder="Select Attachments"
//                       control={control}
//                       errors={errors}
//                     />
//                   </div>
//                 </div>
//               </div>
//               <div className="px-6 py-4 border-t sticky top-0 z-10 border-dashed dark:border-defaultborder/10 sm:flex justify-end">
//                 {!isSubmitted && (
//                   <>
//                     <AlertModal>
//                       <FormButton
//                         isLoading={isSubmitting}
//                         text="create task"
//                         onClick={handleSubmit(handleSaveDraft)}
//                       />
//                     </AlertModal>
//                     <FormButton
//                       isLoading={isSubmitting}
//                       text="Submit"
//                       onClick={handleSubmit(handleSubmitRequest)}
//                     />
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//           <div className="xl:col-span-3 col-span-12 mt-11 dark:bg-bodybg  bg-white">
//             <div className="box">
//               <div className="box-body">
//                 <div>
//                   <div className="font-semibold mb-1">Company :</div>
//                   <p className="text-[#8c9097] dark:text-white/50 mb-3">
//                     Sapphire Retail Limited.
//                   </p>

//                   <div className="font-semibold mb-1">Location:</div>
//                   <p className="text-[#8c9097] dark:text-white/50 mb-3">
//                     Head Office
//                   </p>
//                   <div className="font-semibold mb-1">SR NO:</div>
//                   <p className="text-[#8c9097] dark:text-white/50 mb-3">
//                     {" "}
//                     SRER011124-001
//                   </p>
//                   <div className="font-semibold mb-1">SR Type:</div>
//                   <p className="text-[#8c9097] dark:text-white/50 mb-3">
//                     {" "}
//                     Discount Related issues
//                   </p>
//                   <div className="font-semibold mb-1">Department :</div>
//                   <p className="text-[#8c9097] dark:text-white/50 mb-3">ERP:</p>
//                   <div className="font-semibold mb-1">Time Created:</div>
//                   <p className="text-[#8c9097] dark:text-white/50 mb-3">
//                     11/1/2024, 11:59:48 AM
//                   </p>
//                   <div className="font-semibold mb-1">Need By Date:</div>
//                   <p className="text-[#8c9097] dark:text-white/50 mb-3">
//                     2024-11-01
//                   </p>
//                 </div>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-sm"></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default CreateTask;
import React, { useEffect, useState } from "react";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import { formatOptions } from "@helpers/formatters.js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import serviceRequestSchema from "@modules/employee-self-services/schemas/service-request/ServiceRequestSchema.js";
import { useServiceRequestForm } from "@modules/employee-self-services/hooks/service-request/ServiceRequestHook.js";
import FormInput from "@components/form/FormInput.jsx";
import FormRichTextarea from "@components/form/FormRichTextarea.jsx";
import GalleryUpload from "@components/GalleryUpload.jsx";
import FormButton from "@components/form/FormButton.jsx";
import AlertModal from "../../../components/AlertModal";

const CreateTask = ({ serviceData, isSaveMode = false }) => {
  const [isSavedAsDraft, setIsSavedAsDraft] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(
    serviceData?.is_submitted || false
  );
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(serviceRequestSchema(isSaveMode)),
    defaultValues: {
      status: "active",
      ...serviceData,
    },
  });

  const selectedDepartment = watch("department_id");
  const selectedSubDepartment = watch("sub_department_id");

  const { saveAsDraft, submitRequest } = useServiceRequestForm(
    serviceData,
    isSaveMode
  );

  useEffect(() => {
    if (serviceData) {
      Object.keys(serviceData).forEach((key) => {
        setValue(key, serviceData[key]);
      });
      setIsSavedAsDraft(serviceData?.is_submitted === false);
      setIsSubmitted(serviceData?.is_submitted || false);
    }
  }, [serviceData, setValue]);

  const handleSaveDraft = async (data) => {
    try {
      await saveAsDraft(data);
      setIsSavedAsDraft(true);
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  };

  const handleSubmitRequest = async () => {
    if (!isSavedAsDraft) {
      alert("Please save as draft before submitting.");
      return;
    }

    try {
      await submitRequest(serviceData.id);
      setIsSavedAsDraft(false);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting request:", error);
    }
  };

  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      company_id: 1,
      location_id: data.location_id,
      sub_department_id: data.sub_department_id,
      sr_type_id: data.sr_type_id,
      user_to: data.user_to?.id,
      user_cc: data.user_to?.id,
    };

    await submitRequest(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(handleSaveDraft)}>
      <div className="grid grid-cols-12 gap-x-6 mt-4 bg-white dark:bg-bodybg">
        <div className="xxl:col-span-9">
          <div className="box bg-white">
            <div className="box-header sticky top-0 z-10 bg-white dark:bg-bodybg">
              <div className="box-title">Create task</div>
            </div>
            
            <div className="box-body max-h-96  overflow-y-auto">
              <div className="grid grid-cols-12 gap-2">
                <div className="xl:col-span-12 col-span-12">
                  <label htmlFor="tolerance-issue" className="form-label">
                    Request Title
                  </label>
                  <input
                    type="text"
                    className="form-control bg-gray-100 border border-gray-300 rounded"
                    id="tolerance-issue"
                    placeholder="Tolerance Issue"
                    disabled
                  />
                </div>

                <div className="xl:col-span-6 col-span-6">
                  <FormAsyncSelect
                    label="Location"
                    name="location_id"
                    control={control}
                    errors={errors}
                    placeholder="Location"
                    apiUrl="/select/locations"
                    queryKeyBase="locations"
                    clientSideSearch={true}
                    preselectedOptions={formatOptions(serviceData, "location")}
                  />
                </div>

                <div className="xl:col-span-6 col-span-6">
                  <FormAsyncSelect
                    label="SR Type"
                    name="sr_type_id"
                    control={control}
                    errors={errors}
                    placeholder="SR Type"
                    apiUrl={`/select/sr-types?sub_department_id=${selectedSubDepartment}`}
                    queryKeyBase={`srtype_${selectedSubDepartment}`}
                    clientSideSearch={true}
                    preselectedOptions={formatOptions(serviceData, "srtype")}
                    isDisabled={!selectedSubDepartment}
                  />
                </div>

                <div className="xl:col-span-6 col-span-6">
                  <FormAsyncSelect
                    isMulti={true}
                    name="user_ids"
                    control={control}
                    errors={errors}
                    placeholder="Show Team"
                    styles={{
                      menu: (provided) => ({
                        ...provided,
                        zIndex: 20,
                      }),
                    }}
                  />
                </div>
                

                <div className="xl:col-span-6 col-span-6">
                  <FormInput
                    type="date"
                    name="need_by_date"
                    control={control}
                    errors={errors}
                    placeholder="Need By Date"
                  />
                </div>

                <div className="xl:col-span-6 col-span-6">
                  <FormInput
                    type="date"
                    name="started_at"
                    control={control}
                    errors={errors}
                    placeholder="Start Date"
                  />
                </div>

                <div className="xl:col-span-6 col-span-6">
                  <FormInput
                    type="date"
                    name="ended_at"
                    control={control}
                    errors={errors}
                    placeholder="End Date"
                  />
                </div>

                <div className="col-span-12">
                  <FormRichTextarea
                    name="description"
                    control={control}
                    errors={errors}
                    placeholder="Description"
                    editorOptions={{
                      height: 300,
                      buttonList: [
                        ["bold", "italic", "underline", "strike"],
                        ["font", "fontSize", "fontColor", "hiliteColor"],
                        ["align", "list", "table"],
                      ],
                    }}
                  />
                </div>

                <div className="col-span-12">
                  <GalleryUpload
                    currentValue={serviceData?.attachment_ids || []}
                    files={serviceData?.attachments || []}
                    inputName="attachment_ids"
                    placeholder="Select Attachments"
                    control={control}
                    errors={errors}
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-dashed dark:bg-bodybg dark:border-defaultborder/10 sm:flex justify-end sticky bottom-1 bg-white z-10">
              {!isSubmitted && (
                <>
                  <AlertModal>
                    <FormButton
                      isLoading={isSubmitting}
                      text="Create Task"
                      onClick={handleSubmit(handleSaveDraft)}
                    />
                  </AlertModal>
                  <FormButton
                    isLoading={isSubmitting}
                    text="Submit"
                    onClick={handleSubmit(handleSubmitRequest)}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        <div className="xl:col-span-3 col-span-12 mt-4 bg-white sticky top-4 h-96">
          <div className="box">
            <div className="box-body">
              <div>
                <div className="font-semibold mb-1">Company :</div>
                <p className="text-[#8c9097] dark:text-white/50 mb-3">
                  Sapphire Retail Limited.
                </p>

                <div className="font-semibold mb-1">Location:</div>
                <p className="text-[#8c9097] dark:text-white/50 mb-3">
                  Head Office
                </p>

                <div className="font-semibold mb-1">SR NO:</div>
                <p className="text-[#8c9097] dark:text-white/50 mb-3">
                  SRER011124-001
                </p>

                <div className="font-semibold mb-1">SR Type:</div>
                <p className="text-[#8c9097] dark:text-white/50 mb-3">
                  Discount Related issues
                </p>

                <div className="font-semibold mb-1">Department :</div>
                <p className="text-[#8c9097] dark:text-white/50 mb-3">ERP:</p>

                <div className="font-semibold mb-1">Time Created:</div>
                <p className="text-[#8c9097] dark:text-white/50 mb-3">
                  11/1/2024, 11:59:48 AM
                </p>

                <div className="font-semibold mb-1">Need By Date:</div>
                <p className="text-[#8c9097] dark:text-white/50 mb-3">
                  2024-11-01
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreateTask;
