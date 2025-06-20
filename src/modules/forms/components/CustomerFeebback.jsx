// import React, { useState } from 'react';
// import FormInput from "@components/form/FormInput.jsx";
//
// const CustomerFeedbackForm = () => {
//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         category: '',
//         rating: '',
//         aspects: [],
//         message: '',
//         recommendation: ''
//     });
//     const [successMessageVisible, setSuccessMessageVisible] = useState(false);
//     const [selectedType, setSelectedType] = useState('');
//     const [fields, setFields] = useState([]); // State for dynamic fields
//
//     const handleChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         if (type === 'checkbox') {
//             setFormData((prevData) => {
//                 const newAspects = checked
//                     ? [...prevData.aspects, value]
//                     : prevData.aspects.filter((aspect) => aspect !== value);
//                 return { ...prevData, aspects: newAspects };
//             });
//         } else {
//             setFormData((prevData) => ({ ...prevData, [name]: value }));
//         }
//     };
//
//     const handleRatingClick = (rating) => {
//         setFormData((prevData) => ({ ...prevData, rating }));
//     };
//
//     const handleSubmit = () => {
//         if (!formData.rating) {
//             alert('Please provide a rating before submitting.');
//             return;
//         }
//         setSuccessMessageVisible(true);
//         setTimeout(() => {
//             setSuccessMessageVisible(false);
//             setFormData({
//                 name: '',
//                 email: '',
//                 category: '',
//                 rating: '',
//                 aspects: [],
//                 message: '',
//                 recommendation: ''
//             });
//         }, 5000);
//     };
//
//     const addField = () => {
//         const newField = {
//             id: Date.now(),
//             label: '',
//             name: '',
//             short_description: '',
//             field_type: '',
//             order: 0,
//             required: false
//         };
//         setFields([...fields, newField]);
//     };
//
//     const updateField = (index, key, value) => {
//         const updatedFields = [...fields];
//         updatedFields[index][key] = value;
//         setFields(updatedFields);
//     };
//
//     const removeField = (index) => {
//         const updatedFields = fields.filter((_, i) => i !== index);
//         setFields(updatedFields);
//     };
//
//     const placeholders = {
//         product: 'Tell us about your experience with our product or service...',
//         support: 'How was your experience with our customer support team?...',
//         website: 'Share your thoughts about our website usability and design...',
//         suggestion: 'What improvements or new features would you like to see?...',
//         complaint: 'Please describe the issue you encountered in detail...',
//         compliment: 'We\'d love to hear what you enjoyed about your experience...',
//         other: 'Please share your feedback with us...'
//     };
//
//     return (
//         <div
//             className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative"
//             style={{
//                 backgroundImage: 'url(https://res.cloudinary.com/dtsguaevl/image/upload/v1750245076/WhatsApp_Image_2025-06-18_at_16.10.05_b321f112_jb0afg.jpg)',
//                 backgroundSize: 'cover',
//                 backgroundPosition: 'center',
//                 backgroundRepeat: 'no-repeat'
//             }}
//         >
//
//             <div className="absolute inset-0 bg-black bg-opacity-40"></div>
//
//             <div className="relative z-10 bg-white rounded-2xl p-8 shadow-2xl w-full max-w-3xl border border-white border-opacity-20">
//                 <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Feedback Form</h1>
//                 <p className="text-center text-gray-600 mb-6">We value your opinion and would love to hear from you!</p>
//
//                 <div onSubmit={handleSubmit} id="feedbackForm">
//                     <div className="mb-6">
//                         <label htmlFor="name" className="block mb-2 text-gray-800 font-semibold">Full Name *</label>
//                         <input
//                             type="text"
//                             id="name"
//                             name="name"
//                             required
//                             value={formData.name}
//                             onChange={handleChange}
//                             className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-white bg-opacity-90"
//                         />
//                     </div>
//
//                     <div className="mb-6">
//                         <label htmlFor="email" className="block mb-2 text-gray-800 font-semibold">Email Address *</label>
//                         <input
//                             type="email"
//                             id="email"
//                             name="email"
//                             required
//                             value={formData.email}
//                             onChange={handleChange}
//                             className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-white bg-opacity-90"
//                         />
//                     </div>
//
//
//
//
//                     <div className="mb-6">
//                         <button
//                             type="button"
//                             onClick={addField}
//                             className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
//                         >
//                             Add Dynamic Field
//                         </button>
//                     </div>
//
//
//                     <button
//                         type="button"
//                         onClick={handleSubmit}
//                         className="w-[200px] mr-4 p-4 bg-primary text-white rounded-lg font-semibold uppercase transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-2xl hover:from-blue-700 hover:to-purple-700 active:translate-y-[0px]"
//                     >
//                         Submit Feedback
//                     </button>
//
//                 </div>
//
//                 {successMessageVisible && (
//                     <div className="mt-6 bg-green-500 bg-opacity-90 text-white p-4 rounded-lg text-center shadow-lg animate-pulse">
//                         <h3 className="font-bold">Thank you for your feedback!</h3>
//                         <p>We appreciate your time and will review your feedback carefully.</p>
//                     </div>
//                 )}
//             </div>
//
//             <div className="flex justify-between items-center w-full px-4 mt-10 py-2 bg-white bg-opacity-20 backdrop-blur-lg text-white rounded-lg border border-white border-opacity-20">
//                 <p className="text-sm">&copy; 2025 Your Company Name. All rights reserved.</p>
//
//                 <div className="flex gap-4">
//                     {['🌐'].map((icon, index) => (
//                         <a
//                             key={index}
//                             href="#"
//                             className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
//                         >
//                             {icon}
//                         </a>
//                     ))}
//                 </div>
//             </div>
//
//         </div>
//     );
// };
//
// export default CustomerFeedbackForm;
