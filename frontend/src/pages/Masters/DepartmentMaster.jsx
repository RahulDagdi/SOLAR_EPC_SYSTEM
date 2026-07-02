import MasterPage from "./MasterPage";

const DepartmentMaster = () => {

    return (

        <MasterPage

            title="Department Master"

            api="/masters/departments"

            columns={[

                {
                    title:"Department",
                    key:"name"
                },

                {
                    title:"Code",
                    key:"code"
                },

                {
                    title:"Description",
                    key:"description"
                }

            ]}

            fields={[

                {
                    name:"name",
                    label:"Department Name"
                },

                {
                    name:"code",
                    label:"Department Code"
                },

                {
                    name:"description",
                    label:"Description"
                }

            ]}

        />

    );

};

export default DepartmentMaster;