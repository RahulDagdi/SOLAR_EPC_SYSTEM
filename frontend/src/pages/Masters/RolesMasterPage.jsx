import { useEffect, useState } from "react";
import api from "../../services/api";

const RolesMasterPage = () => {

    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [name, setName] = useState("");
    const [permissionsText, setPermissionsText] = useState("");

    const loadRoles = async () => {
        try {
            setLoading(true);
            const res = await api.get("/roles");
            setRoles(res.data.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRoles();
    }, []);

    const openAdd = () => {
        setEditingId(null);
        setName("");
        setPermissionsText("");
        setOpen(true);
    };

    const openEdit = (role) => {
        setEditingId(role._id);
        setName(role.name || "");
        setPermissionsText((role.permissions || []).join(", "));
        setOpen(true);
    };

    const handleSave = async () => {
        try {
            const permissions = permissionsText
                .split(",")
                .map(p => p.trim())
                .filter(p => p.length > 0);

            const payload = { name, permissions };

            if (editingId) {
                await api.put(`/roles/${editingId}`, payload);
            } else {
                await api.post("/roles", payload);
            }

            setOpen(false);
            loadRoles();
        } catch (error) {
            console.error(error);
            alert(error?.response?.data?.message || "Save failed. Please check the entered values.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this role?")) return;
        try {
            await api.delete(`/roles/${id}`);
            loadRoles();
        } catch (error) {
            console.error(error);
            alert(error?.response?.data?.message || "Delete failed. Please try again.");
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-2xl font-bold">Roles Master</h1>
                <button onClick={openAdd} className="bg-blue-600 text-white px-4 py-2 rounded">
                    + Add Role
                </button>
            </div>

            {loading ? (
                <div>Loading....</div>
            ) : (
                <table className="w-full border bg-white rounded-xl overflow-hidden">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left p-3">Role Name</th>
                            <th className="text-left p-3">Permissions</th>
                            <th className="text-left p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.map(role => (
                            <tr key={role._id} className="border-t">
                                <td className="p-3">{role.name}</td>
                                <td className="p-3">{(role.permissions || []).join(", ")}</td>
                                <td className="p-3 flex gap-3">
                                    <button onClick={() => openEdit(role)} className="text-blue-600">Edit</button>
                                    <button onClick={() => handleDelete(role._id)} className="text-red-600">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {open && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl p-6 w-[500px]">
                        <h2 className="text-xl font-bold mb-5">{editingId ? "Edit Role" : "Add Role"}</h2>

                        <label className="block mb-1">Role Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="border rounded w-full px-3 py-2 mb-4" />

                        <label className="block mb-1">Permissions (comma separated, e.g. read, write, delete)</label>
                        <textarea value={permissionsText} onChange={(e) => setPermissionsText(e.target.value)} className="border rounded w-full px-3 py-2" />

                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setOpen(false)} className="border px-4 py-2 rounded">Cancel</button>
                            <button onClick={handleSave} className="bg-blue-600 text-white px-5 py-2 rounded">Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RolesMasterPage;