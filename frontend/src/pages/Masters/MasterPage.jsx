// import { useEffect, useState } from "react";
// import MasterHeader from "../../components/masters/MasterHeader";
// import MasterTable from "../../components/masters/MasterTable";
// import MasterFormModal from "../../components/masters/MasterFormModal";
// import DeleteConfirmModal from "../../components/masters/DeleteConfirmModal";

// import masterService from "../../services/masterService";

// const MasterPage = ({
//     title,
//     api,
//     columns,
//     fields
// }) => {

//     const [records, setRecords] = useState([]);

//     const [loading, setLoading] = useState(false);

//     const [open, setOpen] = useState(false);

//     const [deleteOpen, setDeleteOpen] = useState(false);

//     const [selected, setSelected] = useState(null);

//     const loadData = async () => {

//         try {

//             setLoading(true);

//             const res = await masterService.getAll(api);

//             setRecords(res.data.data || []);

//         } catch (error) {

//             console.error(error);

//         } finally {

//             setLoading(false);

//         }

//     };

//     useEffect(() => {

//         loadData();

//     }, []);

//     const handleSave = async (form) => {

//         try {

//             if (selected) {

//                 await masterService.update(
//                     api,
//                     selected._id,
//                     form
//                 );

//             } else {

//                 await masterService.create(
//                     api,
//                     form
//                 );

//             }

//             setOpen(false);

//             setSelected(null);

//             loadData();

//         } catch (error) {

//             console.error(error);

//         }

//     };

//     const handleDelete = async () => {

//         try {

//             await masterService.remove(
//                 api,
//                 selected._id
//             );

//             setDeleteOpen(false);

//             setSelected(null);

//             loadData();

//         } catch (error) {

//             console.error(error);

//         }

//     };

//     return (

//         <div className="p-6">

//             <MasterHeader

//                 title={title}

//                 onAdd={() => {

//                     setSelected(null);

//                     setOpen(true);

//                 }}

//             />

//             {

//                 loading ?

//                     <div>

//                         Loading....

//                     </div>

//                     :

//                     <MasterTable

//                         columns={columns}

//                         data={records}

//                         onEdit={(row)=>{

//                             setSelected(row);

//                             setOpen(true);

//                         }}

//                         onDelete={(row)=>{

//                             setSelected(row);

//                             setDeleteOpen(true);

//                         }}

//                     />

//             }

//             <MasterFormModal

//                 open={open}

//                 title={title}

//                 fields={fields}

//                 initialData={selected || {}}

//                 onClose={() => {

//                     setOpen(false);

//                     setSelected(null);

//                 }}

//                 onSubmit={handleSave}

//             />

//             <DeleteConfirmModal

//                 open={deleteOpen}

//                 title={title}

//                 onClose={() => setDeleteOpen(false)}

//                 onDelete={handleDelete}

//             />

//         </div>

//     );

// };

// export default MasterPage;

import { useEffect, useState } from "react";
import MasterHeader from "../../components/masters/MasterHeader";
import MasterTable from "../../components/masters/MasterTable";
import MasterFormModal from "../../components/masters/MasterFormModal";
import DeleteConfirmModal from "../../components/masters/DeleteConfirmModal";

import masterService from "../../services/masterService";

const MasterPage = ({
    title,
    api,
    columns,
    fields
}) => {

    const [records, setRecords] = useState([]);

    const [loading, setLoading] = useState(false);

    const [open, setOpen] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);

    const [selected, setSelected] = useState(null);

    const loadData = async () => {

        try {

            setLoading(true);

            const res = await masterService.getAll(api);

            setRecords(res.data.data || []);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadData();

    }, []);

    const [error, setError] = useState("");

    const handleSave = async (form) => {

        try {

            setError("");

            if (selected) {

                await masterService.update(
                    api,
                    selected._id,
                    form
                );

            } else {

                await masterService.create(
                    api,
                    form
                );

            }

            setOpen(false);

            setSelected(null);

            loadData();

        } catch (error) {

            console.error(error);

            const msg =
                error?.response?.data?.message ||
                "Save failed. Please check the entered values.";

            setError(msg);

            alert(msg);

        }

    };

    const handleDelete = async () => {

        try {

            await masterService.remove(
                api,
                selected._id
            );

            setDeleteOpen(false);

            setSelected(null);

            loadData();

        } catch (error) {

            console.error(error);

            const msg =
                error?.response?.data?.message ||
                "Delete failed. Please try again.";

            alert(msg);

        }

    };

    return (

        <div className="p-6">

            <MasterHeader
                title={title}
                onAdd={() => {
                    setSelected(null);
                    setOpen(true);
                }}
            />

            {
                loading ?
                    <div>Loading....</div>
                    :
                    <MasterTable
                        columns={columns}
                        data={records}
                        onEdit={(row)=>{
                            setSelected(row);
                            setOpen(true);
                        }}
                        onDelete={(row)=>{
                            setSelected(row);
                            setDeleteOpen(true);
                        }}
                    />
            }

            <MasterFormModal
                open={open}
                title={title}
                fields={fields}
                initialData={selected || {}}
                onClose={() => {
                    setOpen(false);
                    setSelected(null);
                }}
                onSubmit={handleSave}
            />

            <DeleteConfirmModal
                open={deleteOpen}
                title={title}
                onClose={() => setDeleteOpen(false)}
                onDelete={handleDelete}
            />

        </div>

    );

};

export default MasterPage;