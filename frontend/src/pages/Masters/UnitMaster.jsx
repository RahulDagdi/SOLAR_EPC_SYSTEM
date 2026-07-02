import MasterPage from "./MasterPage";

const UnitMaster = () => {

    return (

        <MasterPage

            title="Unit Master"

            api="/masters/units"

            columns={[
                {
                    title: "Name",
                    key: "name"
                },

                {
                    title: "Code",
                    key: "code"
                },

                {
                    title: "Description",
                    key: "description"
                }
            ]}

            fields={[
                {
                    name: "name",
                    label: "Name"
                },

                {
                    name: "code",
                    label: "Code"
                },

                {
                    name: "description",
                    label: "Description",
                    type: "textarea"
                }
            ]}

        />

    );

};

export default UnitMaster;
