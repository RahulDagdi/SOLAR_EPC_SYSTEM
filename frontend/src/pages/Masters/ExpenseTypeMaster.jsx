import MasterPage from "./MasterPage";

const ExpenseTypeMaster = () => {

    return (

        <MasterPage

            title="Expense Type Master"

            api="/masters/expense-types"

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

export default ExpenseTypeMaster;
