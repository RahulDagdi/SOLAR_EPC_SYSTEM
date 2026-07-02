const MasterHeader = ({
    title,
    onAdd
}) => {

    return (

        <div className="flex justify-between items-center mb-6">

            <h1 className="text-2xl font-bold">

                {title}

            </h1>

            <button
                onClick={onAdd}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
            >
                + Add New
            </button>

        </div>

    );

};

export default MasterHeader;