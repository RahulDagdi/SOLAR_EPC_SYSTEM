import MasterPage from "./MasterPage";

const CustomerTypeMaster = () => {

    return (

        <MasterPage

            title="Customer Type Master"

            api="/masters/customer-types"

            columns={[

                {
                    title: "Customer Type",
                    key: "name"
                },

                {
                    title: "Code",
                    key: "code"
                }

            ]}

            fields={[

                {
                    name: "name",
                    label: "Customer Type"
                },

                {
                    name: "code",
                    label: "Code"
                }

            ]}

        />

    );

};

export default CustomerTypeMaster;