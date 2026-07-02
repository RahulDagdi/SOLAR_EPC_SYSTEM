import MasterPage from "./MasterPage";

const ProjectSiteMaster = () => {

    return (

        <MasterPage

            title="Project Site Master"

            api="/masters/project-sites"

            columns={[
                { title: "Site Name", key: "name" },
                { title: "Code", key: "code" },
                { title: "Address", key: "address" }
            ]}

            fields={[
                { name: "name", label: "Site Name" },
                { name: "code", label: "Site Code" },
                { name: "address", label: "Address", type: "textarea" },
                { name: "description", label: "Description", type: "textarea" }
            ]}

        />

    );

};

export default ProjectSiteMaster;
