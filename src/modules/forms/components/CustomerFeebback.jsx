// import React, { useState } from 'react';
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
//     const handleSubmit = (e) => {
//         e.preventDefault();
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
//         <div className="bg-[#0B4F92] min-h-screen w-full flex flex-col text-white p-6">
//             <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-10 shadow-lg max-w-lg w-full">
//                 <h1 className="text-3xl font-bold text-center text- black mb-2">Feedback Form</h1>
//                 <p className="text-center text-gray-600 mb-6">We value your opinion and would love to hear from you!</p>
//
//                 <form onSubmit={handleSubmit} id="feedbackForm">
//                     <div className="mb-6">
//                         <label htmlFor="name" className="block mb-2 text-gray-800 font-semibold">Full Name *</label>
//                         <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500" />
//                     </div>
//
//                     <div className="mb-6">
//                         <label htmlFor="email" className="block mb-2 text-gray-800 font-semibold">Email Address *</label>
//                         <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500" />
//                     </div>
//
//                     <div className="mb-6">
//                         <label htmlFor="category" className="block mb-2 text-gray-800 font-semibold">Feedback Category *</label>
//                         <select id="category" name="category" required value={formData.category} onChange={handleChange} className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500">
//                             <option value="">Select a category</option>
//                             <option value="product">Product/Service</option>
//                             <option value="support">Customer Support</option>
//                             <option value="website">Website Experience</option>
//                             <option value="suggestion">Suggestion</option>
//                             <option value="complaint">Complaint</option>
//                             <option value="compliment">Compliment</option>
//                             <option value="other">Other</option>
//                         </select>
//                     </div>
//
//                     <div className="mb-6">
//                         <label className="block mb-2 text-gray-800 font-semibold">Overall Rating *</label>
//                         <div className="flex justify-center gap-2 mb-2">
//                             {[1, 2, 3, 4, 5].map((star) => (
//                                 <span key={star} className={`text-3xl cursor-pointer ${formData.rating >= star ? 'text-yellow-500' : 'text-gray-300'}`} onClick={() => handleRatingClick(star)}>★</span>
//                             ))}
//                         </div>
//                         <input type="hidden" id="rating" name="rating" value={formData.rating} required />
//                     </div>
//
//                     <div className="mb-6">
//                         <label className="block mb-2 text-gray-800 font-semibold">What aspects would you like to comment on? (Optional)</label>
//                         <div className="grid grid-cols-2 gap-4">
//                             {['quality', 'speed', 'usability', 'value'].map((aspect) => (
//                                 <div key={aspect} className="flex items-center p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
//                                     <input type="checkbox" id={aspect} name="aspects" value={aspect} checked={formData.aspects.includes(aspect)} onChange={handleChange} className="mr-2" />
//                                     <label htmlFor={aspect} className="text-gray-800">{aspect.charAt(0).toUpperCase() + aspect.slice(1)}</label>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//
//                     <div className="mb-6">
//                         <label htmlFor="message" className="block mb-2 text-gray-800 font-semibold">Your Feedback *</label>
//                         <textarea id="message" name="message" placeholder={placeholders[formData.category] || 'Please share your detailed feedback here...'} required value={formData.message} onChange={handleChange} className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 resize-none min-h-[120px]" />
//                     </div>
//
//                     <div className="mb-6">
//                         <label htmlFor="recommendation" className="block mb-2 text-gray-800 font-semibold">Would you recommend us to others?</label>
//                         <select id="recommendation" name="recommendation" value={formData.recommendation} onChange={handleChange} className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500">
//                             <option value="">Select an option</option>
//                             <option value="definitely">Definitely</option>
//                             <option value="probably">Probably</option>
//                             <option value="maybe">Maybe</option>
//                             <option value="probably-not">Probably Not</option>
//                             <option value="definitely-not">Definitely Not</option>
//                         </select>
//                     </div>
//
//                     <button type="submit" className="w-full p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold uppercase transition-transform transform hover:translate-y-[-3px] hover:shadow-lg">Submit Feedback</button>
//                 </form>
//
//                 {successMessageVisible && (
//                     <div className="mt-6 bg-green-500 text-white p-4 rounded-lg text-center">
//                         <h3 className="font-bold">Thank you for your feedback!</h3>
//                         <p>We appreciate your time and will review your feedback carefully.</p>
//                     </div>
//                 )}
//             </div>
//
//             <footer className="bg-white bg-opacity-10 backdrop-blur-lg text-white text-center p-6 rounded-lg mt-10 max-w-lg w-full">
//                 <div className="flex flex-col items-center gap-4">
//
//                     <div className="flex gap-4">
//                         {['📧', '📱', '🌐', '📞'].map((icon, index) => (
//                             <a key={index} href="#" className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-indigo-500 transition">{icon}</a>
//                         ))}
//                     </div>
//                     <p>&copy; 2025 Your Company Name. All rights reserved.</p>
//                 </div>
//             </footer>
//         </div>
//     );
// };
//
// export default CustomerFeedbackForm;
import React, { useState } from 'react';

const CustomerFeedbackForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        category: '',
        rating: '',
        aspects: [],
        message: '',
        recommendation: ''
    });
    const [successMessageVisible, setSuccessMessageVisible] = useState(false);
    const [selectedType, setSelectedType] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData((prevData) => {
                const newAspects = checked
                    ? [...prevData.aspects, value]
                    : prevData.aspects.filter((aspect) => aspect !== value);
                return { ...prevData, aspects: newAspects };
            });
        } else {
            setFormData((prevData) => ({ ...prevData, [name]: value }));
        }
    };

    const handleRatingClick = (rating) => {
        setFormData((prevData) => ({ ...prevData, rating }));
    };

    const handleSubmit = () => {
        if (!formData.rating) {
            alert('Please provide a rating before submitting.');
            return;
        }
        setSuccessMessageVisible(true);
        setTimeout(() => {
            setSuccessMessageVisible(false);
            setFormData({
                name: '',
                email: '',
                category: '',
                rating: '',
                aspects: [],
                message: '',
                recommendation: ''
            });
        }, 5000);
    };

    const placeholders = {
        product: 'Tell us about your experience with our product or service...',
        support: 'How was your experience with our customer support team?...',
        website: 'Share your thoughts about our website usability and design...',
        suggestion: 'What improvements or new features would you like to see?...',
        complaint: 'Please describe the issue you encountered in detail...',
        compliment: 'We\'d love to hear what you enjoyed about your experience...',
        other: 'Please share your feedback with us...'
    };

    return (
        <div
            className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative"
            style={{
                backgroundImage: 'url(https://res.cloudinary.com/dtsguaevl/image/upload/v1750245076/WhatsApp_Image_2025-06-18_at_16.10.05_b321f112_jb0afg.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >

            <div className="absolute inset-0 bg-black bg-opacity-40"></div>


            <div
                className="relative z-10 bg-white rounded-2xl p-8 shadow-2xl w-full max-w-3xl border border-white border-opacity-20">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Feedback Form</h1>
                <p className="text-center text-gray-600 mb-6">We value your opinion and would love to hear from you!</p>

                <div onSubmit={handleSubmit} id="feedbackForm">
                    <div className="mb-6">
                        <label htmlFor="name" className="block mb-2 text-gray-800 font-semibold">Full Name *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border-2  form-control form-control-lg border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-white bg-opacity-90"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="email" className="block mb-2 text-gray-800 font-semibold">Email Address
                            *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 border-2  form-control form-control-lg border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-white bg-opacity-90"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="category" className="block mb-2 text-gray-800 font-semibold">Feedback Category
                            *</label>
                        <select
                            id="category"
                            name="category"
                            required
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full p-2 border-2  form-control form-control-lg border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-white bg-opacity-90"
                        >
                            <option value="">Select a category</option>
                            <option value="product">Product/Service</option>
                            <option value="support">Customer Support</option>
                            <option value="website">Website Experience</option>
                            <option value="suggestion">Suggestion</option>
                            <option value="complaint">Complaint</option>
                            <option value="compliment">Compliment</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2 text-gray-800 font-semibold">Overall Rating *</label>
                        <div className="flex justify-center gap-2 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={`text-3xl cursor-pointer transition-all duration-300 hover:scale-110 ${
                                        formData.rating >= star ? 'text-warning ' : ' text-black'
                                    }`}
                                    onClick={() => handleRatingClick(star)}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <input type="hidden" id="rating" name="rating" value={formData.rating} required/>
                    </div>

                    <div className="mb-6">
                        <div className="mb-6">
                            <label className="block mb-2 text-gray-800 font-semibold">What aspects would you like to
                                comment on? (Optional)</label>
                            <div className="space-y-3">
                                {['quality', 'speed', 'usability', 'value'].map((aspect) => (
                                    <div key={aspect}
                                         className="flex items-center p-3 bg-gray-100 bg-opacity-80 rounded-lg hover:bg-gray-200 hover:bg-opacity-90 transition-all duration-300">
                                        <input
                                            type="checkbox"
                                            id={aspect}
                                            name="aspects"
                                            value={aspect}
                                            checked={formData.aspects.includes(aspect)}
                                            onChange={handleChange}
                                            className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor={aspect} className="text-gray-800 font-bold">
                                            {aspect.charAt(0).toUpperCase() + aspect.slice(1)}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="message" className="block mb-2 text-gray-800 font-semibold">Your Feedback
                            *</label>
                        <textarea
                            id="message"
                            name="message"
                            placeholder={placeholders[formData.category] || 'Please share your detailed feedback here...'}
                            required
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 resize-none min-h-[120px] bg-white bg-opacity-90"
                        />
                    </div>


                    <div className="mb-6">
                        <label htmlFor="fieldType" className="block mb-2 text-gray-800 font-semibold">Choose Field
                            Type</label>
                        <select
                            id="fieldType"
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="w-full p-2 border-2  form-control form-control-lg border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-white bg-opacity-90"
                        >
                            <option value="">-- Select Type --</option>
                            {[
                                'text', 'textarea', 'email', 'password', 'url', 'tel', 'number', 'range',
                                'checkbox', 'radio', 'date', 'datetime-local', 'time', 'month',
                                'week', 'file', 'color', 'hidden'
                            ].map((type) => (
                                <option key={type} value={type}>
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>


                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="w-[200px] mr-4 p-4 bg-primary text-white rounded-lg font-semibold uppercase transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-2xl hover:from-blue-700 hover:to-purple-700 active:translate-y-[0px]"
                    >
                        Submit Feedback
                    </button>

            </div>

            {successMessageVisible && (
                <div
                    className="mt-6 bg-green-500 bg-opacity-90 text-white p-4 rounded-lg text-center shadow-lg animate-pulse">
                    <h3 className="font-bold">Thank you for your feedback!</h3>
                    <p>We appreciate your time and will review your feedback carefully.</p>
                </div>
            )}
        </div>


    <div
        className="flex justify-between items-center w-full px-4 mt-10 py-2 bg-white bg-opacity-20 backdrop-blur-lg text-white rounded-lg border border-white border-opacity-20">
        <p className="text-sm">&copy; 2025 Your Company Name. All rights reserved.</p>

        <div className="flex gap-4">
            {['🌐'].map((icon, index) => (
                <a
                    key={index}
                    href="#"
                    className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
                >
                    {icon}
                </a>
            ))}
        </div>
    </div>

</div>
)
    ;
};

export default CustomerFeedbackForm;