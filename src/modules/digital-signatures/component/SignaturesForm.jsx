// import { useForm } from "react-hook-form";
// import React, { useEffect } from "react";
// import FormInput from "@components/form/FormInput.jsx";
// import FormButton from "@components/form/FormButton.jsx";
// import GalleryUpload from "@components/GalleryUpload.jsx";
// import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
// const SignatureForm = ({ handleSubmitData, isEditMode = false,editData }) => {
//   const {
//     control,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     setValue,
//   } = useForm({
//     defaultValues: editData ? {
//       companyName: editData.company?.name || '',
//       employee_code: editData.employee_code || '',
//       name: editData.name || null, 
//       designation: editData.designation || '',
//       department: editData.department || null, 
//       website: editData.website || '',
//       phone: editData.phone || '',
//       mobile: editData.mobile || '',
//       email: editData.email || '',
//       address: editData.address || '',
//       attachment_ids: editData.attachment_ids || [],
//     } : {}
//   });

//   const data = {};

//   useEffect(() => {
//     if (data) {
//       Object.keys(data).forEach((key) => {
//         setValue(key, data[key]);
//       });
//     }
//   }, [data, setValue]);

//   const onSubmit = (formData) => {
//     handleSubmitData(formData, 1);
//   };

//   return (
//     <>
//       <div className="grid grid-cols-12 gap-x-6 ">
//         <div className="xxl:col-span-9">
//           <div className="box">
//             <div className="box-header">
//               <div className="box-title">SignatureForm</div>
//             </div>
//             <div className="box-body">
//               <form onSubmit={handleSubmit(onSubmit)}>
//                 <div className="grid grid-cols-12 gap-4">
//                   <div className="xl:col-span-4 col-span-12">
//                     <FormInput
//                       type="text"
//                       name="companyName"
//                       control={control}
//                       errors={errors}
//                       label={true}
//                       placeholder="Company Name"
//                     />
//                   </div>

//                   <div className="xl:col-span-4 col-span-12">
//                     <FormInput
//                       type="text"
//                       name="employee_code"
//                       control={control}
//                       errors={errors}
//                       label={true}
//                       placeholder="Employee Code"
//                     />
//                   </div>
//                   <div className="xl:col-span-4 col-span-12">
//                     <FormInput
//                       name="employee_code"
//                       control={control}
//                       errors={errors}
//                       placeholder="Employee "
//                       apiUrl="/select/employees/"
//                       queryKeyBase="employees"
//                       isMulti={false}
//                       preselectedOptions={[]}
                     
//                     />
//                   </div>
//                   <div className="xl:col-span-4 col-span-12">
//                     <FormInput
//                       type="text"
//                       name="designation"
//                       control={control}
//                       errors={errors}
//                       label={true}
//                       placeholder="Designation"
//                     />
//                   </div>
//                   <div className="xl:col-span-4 col-span-12">
//                     <FormInput
//                       name="department"
//                       control={control}
//                       errors={errors}
//                       placeholder="Department"
//                       apiUrl="/select/departments"
//                       queryKeyBase="departments"
//                       clientSideSearch={true}
//                     />
//                   </div>

//                   <div className="xl:col-span-4 col-span-12">
//                     <FormInput
//                       type="text"
//                       name="website"
//                       control={control}
//                       errors={errors}
//                       label={true}
//                       placeholder="Website"
//                     />
//                   </div>
//                   <div className="xl:col-span-4 col-span-12">
//                     <FormInput
//                       type="text"
//                       name="phone"
//                       control={control}
//                       errors={errors}
//                       label={true}
//                       placeholder="Phone number"
//                     />
//                   </div>
//                   <div className="xl:col-span-4 col-span-12">
//                     <FormInput
//                       type="text"
//                       name="mobile"
//                       control={control}
//                       errors={errors}
//                       label={true}
//                       placeholder="Mobile"
//                     />
//                   </div>
//                   <div className="xl:col-span-4 col-span-12">
//                     <FormInput
//                       type="email"
//                       name="email"
//                       control={control}
//                       errors={errors}
//                       label={true}
//                       placeholder="Email"
//                     />
//                   </div>

//                   <div className="xl:col-span-4 col-span-12">
//                     <FormInput
//                       type="text"
//                       name="address"
//                       control={control}
//                       errors={errors}
//                       label={true}
//                       placeholder="Address"
//                     />
//                   </div>

//                   {/* <div className="col-span-12">
//                     <GalleryUpload
//                       currentValue={data?.attachment_ids}
//                       files={data?.attachments}
//                       inputName="attachment_ids"
//                       placeholder="Select Attachments"
//                       control={control}
//                       errors={errors}
//                     />
//                   </div> */}
//                 </div>

//                 <div className="px-6 py-4 border-t border-dashed sm:flex justify-end">
//                   <FormButton isLoading={isSubmitting} type="submit" />
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//         <div className="xxl:col-span-3">
//           <div className="box">
//             <div className="box-header">
//               <div className="box-title"> Preview</div>
//             </div>

//             <div className="box-body border border-gray-300 rounded-md p-4 bg-gray-50">
//               <div className="mb-4 text-gray-700 font-semibold">Preview</div>
//               <div className="border border-dashed border-gray-300 rounded-md h-32 flex items-center justify-center bg-white"></div>
//               <div className="mt-4 flex justify-end gap-4">
                
//                 <button
//                   className="px-4 py-2 text-sm font-medium text-red-500 border border-red-500 rounded-md ti-btn-primary-full  focus:outline-none"
//                   onClick={() => console.log("Clear")}
//                 >
//                   Clear
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default SignatureForm;
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import FormInput from "@components/form/FormInput.jsx";
import FormButton from "@components/form/FormButton.jsx";
import GalleryUpload from "@components/GalleryUpload.jsx";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";

const SignatureForm = ({ handleSubmitData, isEditMode = false, editData }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm({
    defaultValues: editData
      ? {
          companyName: editData.company?.name || "",
          employee_code: editData.employee_code || "",
          name: editData.name || null,
          designation: editData.designation || "",
          department: editData.department || null,
          website: editData.website || "",
          phone: editData.phone || "",
          mobile: editData.mobile || "",
          email: editData.email || "",
          address: editData.address || "",
          attachment_ids: editData.attachment_ids || [],
        }
      : {},
  });

  const [previewData, setPreviewData] = useState({}); 

  useEffect(() => {
    const subscription = watch((formData) => {
      setPreviewData(formData); 
    });
    return () => subscription.unsubscribe(); 
  }, [watch]);

  const onSubmit = (formData) => {
    handleSubmitData(formData, 1);
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-9">
          <div className="box">
            <div className="box-header">
              <div className="box-title">SignatureForm</div>
            </div>
            <div className="box-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-12 gap-4">
                  <div className="xl:col-span-4 col-span-12">
                    <FormInput
                      type="text"
                      name="companyName"
                      control={control}
                      errors={errors}
                      label={true}
                      placeholder="Company Name"
                    />
                  </div>

                  <div className="xl:col-span-4 col-span-12">
                    <FormInput
                      type="text"
                      name="employee_code"
                      control={control}
                      errors={errors}
                      label={true}
                      placeholder="Employee Code"
                    />
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <FormInput
                      name="employee"
                      control={control}
                      errors={errors}
                      placeholder="Employee "
                      apiUrl="/select/employees/"
                      queryKeyBase="employees Name"
                      isMulti={false}
                      preselectedOptions={[]}
                    />
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <FormInput
                      type="text"
                      name="designation"
                      control={control}
                      errors={errors}
                      label={true}
                      placeholder="Designation"
                    />
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <FormInput
                      name="department"
                      control={control}
                      errors={errors}
                      placeholder="Department"
                      apiUrl="/select/departments"
                      queryKeyBase="departments"
                      clientSideSearch={true}
                    />
                  </div>

                  <div className="xl:col-span-4 col-span-12">
                    <FormInput
                      type="text"
                      name="website"
                      control={control}
                      errors={errors}
                      label={true}
                      placeholder="Website"
                    />
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <FormInput
                      type="text"
                      name="phone"
                      control={control}
                      errors={errors}
                      label={true}
                      placeholder="Phone number"
                    />
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <FormInput
                      type="text"
                      name="mobile"
                      control={control}
                      errors={errors}
                      label={true}
                      placeholder="Mobile"
                    />
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <FormInput
                      type="email"
                      name="email"
                      control={control}
                      errors={errors}
                      label={true}
                      placeholder="Email"
                    />
                  </div>

                  <div className="xl:col-span-4 col-span-12">
                    <FormInput
                      type="text"
                      name="address"
                      control={control}
                      errors={errors}
                      label={true}
                      placeholder="Address"
                    />
                  </div>

                  <div className="col-span-12">
                    <GalleryUpload
                      currentValue={previewData.attachment_ids}
                      files={previewData.attachments}
                      inputName="attachment_ids"
                      placeholder="Select Attachments"
                      control={control}
                      errors={errors}
                    />
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-dashed sm:flex justify-end">
                  <FormButton isLoading={isSubmitting} type="submit" />
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="xxl:col-span-3">
          <div className="box">
            <div className="box-header">
              <div className="box-title">Preview</div>
            </div>

            <div className="box-body border border-gray-300 rounded-md p-4 bg-gray-50">
              <div className="mb-4 text-gray-700 font-semibold">Preview</div>
              <div className="border border-dashed border-gray-300 rounded-md p-4 bg-white">
             
                {previewData.companyName && (
                  <div>
                    <strong>Company Name:</strong> {previewData.companyName}
                  </div>
                )}
                {previewData.employee_code && (
                  <div>
                    <strong>Employee Code:</strong> {previewData.employee_code}
                  </div>
                )}
                {previewData.designation && (
                  <div>
                    <strong>Designation:</strong> {previewData.designation}
                  </div>
                )}
                {previewData.department && (
                  <div>
                    <strong>Department:</strong> {previewData.department}
                  </div>
                )}
                {previewData.website && (
                  <div>
                    <strong>Website:</strong> {previewData.website}
                  </div>
                )}
                {previewData.phone && (
                  <div>
                    <strong>Phone:</strong> {previewData.phone}
                  </div>
                )}
                {previewData.mobile && (
                  <div>
                    <strong>Mobile:</strong> {previewData.mobile}
                  </div>
                )}
                {previewData.email && (
                  <div>
                    <strong>Email:</strong> {previewData.email}
                  </div>
                )}
                {previewData.address && (
                  <div>
                    <strong>Address:</strong> {previewData.address}
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-end gap-4">
                <button
                  className="px-4 py-2 text-sm font-medium text-red-500 border border-red-500 rounded-md ti-btn-primary-full  focus:outline-none"
                  onClick={() => setPreviewData({})} 
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignatureForm;
