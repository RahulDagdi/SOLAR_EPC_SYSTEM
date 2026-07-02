// import StatusBadge from "./StatusBadge";

// const MasterTable = ({
//     columns = [],
//     data = [],
//     onEdit,
//     onDelete
// }) => {

//     const getValue = (obj, path) => {

//         return path
//             .split(".")
//             .reduce((o, key) => o?.[key], obj);

//     };

//     return (

//         <div className="bg-white rounded-xl shadow overflow-hidden">

//             <table className="w-full">

//                 <thead className="bg-gray-100">

//                     <tr>

//                         {columns.map((col) => (

//                             <th
//                                 key={col.key}
//                                 className="px-4 py-3 text-left"
//                             >
//                                 {col.title}
//                             </th>

//                         ))}

//                         <th className="px-4 py-3">
//                             Status
//                         </th>

//                         <th className="px-4 py-3">
//                             Action
//                         </th>

//                     </tr>

//                 </thead>

//                 <tbody>

//                     {data.map((row) => (

//                         <tr
//                             key={row._id}
//                             className="border-t"
//                         >

//                             {columns.map((col) => (

//                                 <td
//                                     key={col.key}
//                                     className="px-4 py-3"
//                                 >
//                                     {getValue(row, col.key)}
//                                 </td>

//                             ))}

//                             <td className="px-4 py-3">
//                                 <StatusBadge status={row.status} />
//                             </td>

//                             <td className="px-4 py-3 flex gap-2">

//                                 <button
//                                     onClick={() => onEdit(row)}
//                                     className="text-blue-600"
//                                 >
//                                     Edit
//                                 </button>

//                                 <button
//                                     onClick={() => onDelete(row)}
//                                     className="text-red-600"
//                                 >
//                                     Delete
//                                 </button>

//                             </td>

//                         </tr>

//                     ))}

//                 </tbody>

//             </table>

//         </div>

//     );

// };

// export default MasterTable;


import StatusBadge from "./StatusBadge";

const getNestedValue = (obj, path) => {
    return path.split(".").reduce((o, key) => o?.[key], obj);
};

const MasterTable = ({
    columns = [],
    data = [],
    onEdit,
    onDelete
}) => {

    return (

        <div className="bg-white rounded-xl shadow overflow-hidden">

            <table className="w-full">

                <thead className="bg-gray-100">

                    <tr>

                        {columns.map(col => (

                            <th
                                key={col.key}
                                className="px-4 py-3 text-left"
                            >
                                {col.title}
                            </th>

                        ))}

                        <th className="px-4 py-3">
                            Status
                        </th>

                        <th className="px-4 py-3">
                            Action
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {data.map(row => (

                        <tr
                            key={row._id}
                            className="border-t"
                        >

                            {columns.map(col => (

                                <td
                                    key={col.key}
                                    className="px-4 py-3"
                                >
                                    {getNestedValue(row, col.key)}
                                </td>

                            ))}

                            <td className="px-4 py-3">
                                <StatusBadge status={row.status} />
                            </td>

                            <td className="px-4 py-3 flex gap-2">

                                <button
                                    onClick={() => onEdit(row)}
                                    className="text-blue-600"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => onDelete(row)}
                                    className="text-red-600"
                                >
                                    Delete
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

};

export default MasterTable;