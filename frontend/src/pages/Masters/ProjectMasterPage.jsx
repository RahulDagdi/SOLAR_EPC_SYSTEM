import { useEffect, useState } from "react";
import api from "../../services/api";
import MasterPage from "./MasterPage";

const ProjectMasterPage = () => {

    const [clients, setClients] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {

        api.get("/clients").then(res => {
            setClients(res.data.data || []);
        }).catch(() => {});

        api.get("/users").then(res => {
            setUsers(res.data.data || []);
        }).catch(() => {});

    }, []);

    return (

        <MasterPage

            title="Project Master"

            api="/projects"

            columns={[
                { title: "Project Name", key: "projectName" },
                { title: "PO Number", key: "poNumber" },
                { title: "Status", key: "projectStatus" },
                { title: "Stage", key: "currentStage" }
            ]}

            fields={[
                { name: "projectName", label: "Project Name" },
                {
                    name: "clientId",
                    label: "Client",
                    type: "select",
                    options: clients.map(c => ({ label: c.clientName, value: c._id }))
                },
                { name: "poNumber", label: "PO Number" },
                { name: "poValue", label: "PO Value", type: "number" },
                { name: "systemSize", label: "System Size (kW)", type: "number" },
                { name: "siteLocation", label: "Site Location" },
                { name: "siteAddress", label: "Site Address", type: "textarea" },
                {
                    name: "projectManager",
                    label: "Project Manager",
                    type: "select",
                    options: users.map(u => ({ label: u.name, value: u._id }))
                },
                { name: "startDate", label: "Start Date", type: "date" },
                { name: "expectedHandoverDate", label: "Expected Handover Date", type: "date" },
                {
                    name: "projectStatus",
                    label: "Project Status",
                    type: "select",
                    options: [
                        { label: "Not Started", value: "Not Started" },
                        { label: "In Progress", value: "In Progress" },
                        { label: "On Hold", value: "On Hold" },
                        { label: "Completed", value: "Completed" },
                        { label: "Cancelled", value: "Cancelled" }
                    ]
                },
                {
                    name: "currentStage",
                    label: "Current Stage",
                    type: "select",
                    options: [
                        { label: "Engineering", value: "Engineering" },
                        { label: "Permits", value: "Permits" },
                        { label: "Procurement", value: "Procurement" },
                        { label: "Civil", value: "Civil" },
                        { label: "Installation", value: "Installation" },
                        { label: "Testing", value: "Testing" },
                        { label: "Net Metering", value: "Net Metering" },
                        { label: "Handover", value: "Handover" }
                    ]
                }
            ]}

        />

    );

};

export default ProjectMasterPage;