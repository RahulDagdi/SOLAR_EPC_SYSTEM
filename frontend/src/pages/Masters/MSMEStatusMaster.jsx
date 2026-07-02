import MasterPage from "./MasterPage";

const MSMEStatusMaster = () => {

    return (

        <MasterPage

            title="MSME Status Master"

            api="/masters/msme-status"

            columns={[

                {
                    title: "MSME Status",
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
                    label: "MSME Status"
                },

                {
                    name: "code",
                    label: "Code"
                }

            ]}

        />

    );

};

export default MSMEStatusMaster;