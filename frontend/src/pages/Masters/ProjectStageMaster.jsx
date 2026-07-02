import MasterPage from "./MasterPage";

const ProjectStageMaster = () => {

    return (

        <MasterPage

            title="Project Stage Master"

            api="/masters/project-stages"

            columns={[
                { title: "Stage", key: "name" },
                { title: "Code", key: "code" },
                { title: "Sequence", key: "sequence" }
            ]}

            fields={[
                { name: "name", label: "Stage Name" },
                { name: "code", label: "Code" },
                { name: "sequence", label: "Sequence No.", type: "number" },
                { name: "description", label: "Description", type: "textarea" }
            ]}

        />

    );

};

export default ProjectStageMaster;
