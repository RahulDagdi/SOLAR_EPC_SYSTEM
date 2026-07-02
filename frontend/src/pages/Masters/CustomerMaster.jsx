import MasterPage from "./MasterPage";

const CustomerMaster = () => {

    return (

        <MasterPage

            title="Customer Master"

            api="/clients"

            columns={[
                { title: "Client Name", key: "clientName" },
                { title: "Code", key: "clientCode" },
                { title: "Type", key: "clientType" },
                { title: "Phone", key: "phone" },
                { title: "Email", key: "email" }
            ]}

            fields={[
                { name: "clientName", label: "Client Name" },
                { name: "clientCode", label: "Client Code" },
                {
                    name: "clientType",
                    label: "Client Type",
                    type: "select",
                    options: [
                        { label: "Industrial", value: "Industrial" },
                        { label: "Commercial", value: "Commercial" },
                        { label: "Govt", value: "Govt" },
                        { label: "Residential", value: "Residential" }
                    ]
                },
                { name: "address", label: "Address", type: "textarea" },
                { name: "gstin", label: "GSTIN" },
                { name: "pan", label: "PAN" },
                { name: "contactPerson", label: "Contact Person" },
                { name: "phone", label: "Phone" },
                { name: "email", label: "Email" },
                { name: "paymentTerms", label: "Payment Terms (Days)", type: "number" },
                { name: "creditLimit", label: "Credit Limit", type: "number" }
            ]}

        />

    );

};

export default CustomerMaster;