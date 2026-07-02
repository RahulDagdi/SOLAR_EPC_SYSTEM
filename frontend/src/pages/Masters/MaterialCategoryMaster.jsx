import MasterPage from "./MasterPage";

const MaterialCategoryMaster = () => {

    return (

        <MasterPage

            title="Material Category Master"

            api="/masters/material-categories"

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

export default MaterialCategoryMaster;
