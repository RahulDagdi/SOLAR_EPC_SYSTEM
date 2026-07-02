import MasterPage from "./MasterPage";

const WorkTypeMaster = () => {

    return (

        <MasterPage

            title="Work Type Master"

            api="/masters/work-types"

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

export default WorkTypeMaster;
