import MasterPage from "./MasterPage";

const ApprovalLevelMaster = () => {

    return (

        <MasterPage

            title="Approval Level Master"

            api="/masters/approval-levels"

            columns={[
                { title: "Approval Level", key: "name" },
                { title: "Code", key: "code" },
                { title: "Level", key: "level" }
            ]}

            fields={[
                { name: "name", label: "Level Name" },
                { name: "code", label: "Code" },
                { name: "level", label: "Level No.", type: "number" },
                { name: "description", label: "Description", type: "textarea" }
            ]}

        />

    );

};

export default ApprovalLevelMaster;
