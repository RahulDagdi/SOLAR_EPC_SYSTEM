import MasterPage from "./MasterPage";

const DesignationMaster = () => {

    return (

        <MasterPage

            title="Designation Master"

            api="/masters/designations"

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

export default DesignationMaster;
