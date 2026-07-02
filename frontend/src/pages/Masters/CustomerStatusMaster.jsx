import MasterPage from "./MasterPage";

const CustomerStatusMaster = () => {

    return (

        <MasterPage

            title="Customer Status Master"

            api="/masters/customer-status"

            columns={[

                {
                    title: "Customer Status",
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
                    label: "Customer Status"
                },

                {
                    name: "code",
                    label: "Code"
                }

            ]}

        />

    );

};

export default CustomerStatusMaster;