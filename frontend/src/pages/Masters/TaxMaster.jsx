import MasterPage from "./MasterPage";

const TaxMaster = () => {

    return (

        <MasterPage

            title="Tax Master"

            api="/masters/taxes"

            columns={[
                { title: "Tax Name", key: "name" },
                { title: "Code", key: "code" },
                { title: "Percentage", key: "percentage" }
            ]}

            fields={[
                { name: "name", label: "Tax Name" },
                { name: "code", label: "Code" },
                { name: "percentage", label: "Percentage (%)", type: "number" },
                { name: "description", label: "Description", type: "textarea" }
            ]}

        />

    );

};

export default TaxMaster;
