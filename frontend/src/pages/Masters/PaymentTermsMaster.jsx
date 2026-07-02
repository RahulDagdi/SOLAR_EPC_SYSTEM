import MasterPage from "./MasterPage";

const PaymentTermsMaster = () => {

    return (

        <MasterPage

            title="Payment Terms Master"

            api="/masters/payment-terms"

            columns={[
                { title: "Payment Term", key: "name" },
                { title: "Code", key: "code" },
                { title: "Days", key: "days" }
            ]}

            fields={[
                { name: "name", label: "Payment Term Name" },
                { name: "code", label: "Code" },
                { name: "days", label: "Credit Days", type: "number" },
                { name: "description", label: "Description", type: "textarea" }
            ]}

        />

    );

};

export default PaymentTermsMaster;
