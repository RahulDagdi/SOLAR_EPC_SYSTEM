// frontend/src/pages/Masters/SupplierMaster.jsx
import MasterPage from "./MasterPage";

const SupplierMaster = () => {

    return (

        <MasterPage

            title="Supplier Master"

            api="/vendors"

            columns={[
                { title: "Vendor Name", key: "vendorName" },
                { title: "Code", key: "vendorCode" },
                { title: "Category", key: "category" },
                { title: "Phone", key: "phone" },
                { title: "Status", key: "status" }
            ]}

            fields={[
                { name: "vendorName", label: "Supplier Name" },
                { name: "vendorCode", label: "Supplier Code" },
                {
                    name: "category",
                    label: "Category",
                    type: "select",
                    options: [
                        { label: "Civil", value: "Civil" },
                        { label: "Wiring", value: "Wiring" },
                        { label: "Mounting", value: "Mounting" },
                        { label: "Logistics", value: "Logistics" },
                        { label: "Other", value: "Other" }
                    ]
                },
                { name: "gstNumber", label: "GST Number" },
                { name: "pan", label: "PAN" },
                { name: "bankAccountNo", label: "Bank Account No." },
                { name: "ifscCode", label: "IFSC Code" },
                { name: "contactPerson", label: "Contact Person" },
                { name: "phone", label: "Phone" },
                { name: "email", label: "Email" },
                { name: "address", label: "Address", type: "textarea" }
            ]}

        />

    );

};

export default SupplierMaster;