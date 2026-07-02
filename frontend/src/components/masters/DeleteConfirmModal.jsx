const DeleteConfirmModal = ({
    open,
    onClose,
    onDelete,
    title = "Record"
}) => {

    if (!open) return null;

    return (

        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

            <div className="bg-white rounded-lg w-[420px] p-6">

                <h2 className="text-xl font-bold mb-3">

                    Delete {title}

                </h2>

                <p className="text-gray-600 mb-5">

                    Are you sure you want to delete this record?

                </p>

                <div className="flex justify-end gap-3">

                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded"
                    >
                        Delete
                    </button>

                </div>

            </div>

        </div>

    );

};

export default DeleteConfirmModal;