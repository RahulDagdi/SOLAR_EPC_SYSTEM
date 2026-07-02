// import { useEffect, useState } from "react";

// const MasterFormModal = ({
//     open,
//     title,
//     fields = [],
//     initialData = {},
//     onClose,
//     onSubmit
// }) => {

//     const [form, setForm] = useState({});

//     useEffect(() => {

//         const data = {};

//         fields.forEach(field => {

//             if (
//                 field.type === "select" &&
//                 typeof initialData[field.name] === "object"
//             ) {
//                 data[field.name] = initialData[field.name]?._id || "";
//             } else {
//                 data[field.name] = initialData[field.name] || "";
//             }

//         });

//         setForm(data);

//     }, [initialData, fields]);

//     if (!open) return null;

//     const handleChange = (e) => {

//         const { name, value } = e.target;

//         setForm(prev => ({
//             ...prev,
//             [name]: value
//         }));

//     };

//     return (

//         <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

//             <div className="bg-white rounded-xl p-6 w-[600px]">

//                 <h2 className="text-xl font-bold mb-5">
//                     {title}
//                 </h2>

//                 <div className="grid grid-cols-2 gap-4">

//                     {fields.map(field => (

//                         <div key={field.name}>

//                             <label className="block mb-1">
//                                 {field.label}
//                             </label>

//                             {field.type === "select" ? (

//                                 <select
//                                     name={field.name}
//                                     value={form[field.name]}
//                                     onChange={handleChange}
//                                     className="border rounded w-full px-3 py-2"
//                                 >

//                                     <option value="">
//                                         Select {field.label}
//                                     </option>

//                                     {field.options?.map(option => (

//                                         <option
//                                             key={option.value}
//                                             value={option.value}
//                                         >
//                                             {option.label}
//                                         </option>

//                                     ))}

//                                 </select>

//                             ) : field.type === "textarea" ? (

//                                 <textarea
//                                     name={field.name}
//                                     value={form[field.name]}
//                                     onChange={handleChange}
//                                     className="border rounded w-full px-3 py-2"
//                                 />

//                             ) : (

//                                 <input
//                                     type={field.type || "text"}
//                                     name={field.name}
//                                     value={form[field.name]}
//                                     onChange={handleChange}
//                                     className="border rounded w-full px-3 py-2"
//                                 />

//                             )}

//                         </div>

//                     ))}

//                 </div>

//                 <div className="flex justify-end gap-3 mt-6">

//                     <button
//                         onClick={onClose}
//                         className="border px-4 py-2 rounded"
//                     >
//                         Cancel
//                     </button>

//                     <button
//                         onClick={() => onSubmit(form)}
//                         className="bg-blue-600 text-white px-5 py-2 rounded"
//                     >
//                         Save
//                     </button>

//                 </div>

//             </div>

//         </div>

//     );

// };

// export default MasterFormModal;

import { useEffect, useState } from "react";

const MasterFormModal = ({
    open,
    title,
    fields = [],
    initialData = {},
    onClose,
    onSubmit
}) => {

    const [form, setForm] = useState({});

    useEffect(() => {

        const data = {};

        fields.forEach(field => {

            if (
                field.type === "select" &&
                typeof initialData[field.name] === "object"
            ) {
                data[field.name] = initialData[field.name]?._id || "";
            } else {
                data[field.name] = initialData[field.name] || "";
            }

        });

        setForm(data);

    }, [initialData, fields]);

    if (!open) return null;

    const handleChange = (e) => {

        const { name, value, type } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: type === "number" ? value.replace(/[^0-9.-]/g, "") : value
        }));

    };

    return (

        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

            <div className="bg-white rounded-xl p-6 w-[600px]">

                <h2 className="text-xl font-bold mb-5">
                    {title}
                </h2>

                <div className="grid grid-cols-2 gap-4">

                    {fields.map(field => (

                        <div key={field.name}>

                            <label className="block mb-1">
                                {field.label}
                            </label>

                            {field.type === "select" ? (

                                <select
                                    name={field.name}
                                    value={form[field.name]}
                                    onChange={handleChange}
                                    className="border rounded w-full px-3 py-2"
                                >

                                    <option value="">
                                        Select {field.label}
                                    </option>

                                    {field.options?.map(option => (

                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>

                                    ))}

                                </select>

                            ) : field.type === "textarea" ? (

                                <textarea
                                    name={field.name}
                                    value={form[field.name]}
                                    onChange={handleChange}
                                    className="border rounded w-full px-3 py-2"
                                />

                            ) : (

                                <input
                                    type={field.type || "text"}
                                    name={field.name}
                                    value={form[field.name]}
                                    onChange={handleChange}
                                    className="border rounded w-full px-3 py-2"
                                />

                            )}

                        </div>

                    ))}

                </div>

                <div className="flex justify-end gap-3 mt-6">

                    <button
                        onClick={onClose}
                        className="border px-4 py-2 rounded"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => onSubmit(form)}
                        className="bg-blue-600 text-white px-5 py-2 rounded"
                    >
                        Save
                    </button>

                </div>

            </div>

        </div>

    );

};

export default MasterFormModal;