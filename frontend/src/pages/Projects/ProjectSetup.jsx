import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { projectService } from '../../services/api';
import toast from 'react-hot-toast';

const ProjectSetup = () => {
  const [data, setData] = useState([]);
  const [deletedData, setDeletedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    projectName: '', clientId: '', poNumber: '', poValue: '', systemSize: '',
    siteLocation: '', siteAddress: '', projectManager: '', startDate: '', expectedHandoverDate: '',
    projectStatus: 'Not Started', currentStage: 'Engineering'
  });

  const columns = [
    { header: 'Project Name', accessor: 'projectName' },
    { header: 'PO Number', accessor: 'poNumber' },
    { header: 'PO Value', accessor: 'poValue', type: 'currency' },
    { header: 'System Size', accessor: 'systemSize' },
    { header: 'Site Location', accessor: 'siteLocation' },
    { header: 'Status', accessor: 'projectStatus', type: 'badge' },
    { header: 'Current Stage', accessor: 'currentStage', type: 'badge' },
    { header: 'Progress', accessor: 'overallProgress' },
  ];

  useEffect(() => { fetchData(); }, [pagination.page, searchTerm, filterValue]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = { page: pagination.page, limit: pagination.limit, search: searchTerm };
      if (filterValue) params.status = filterValue;
      const res = await projectService.getAll(params);
      setData(res.data.data || []);
      setPagination(res.data.pagination || pagination);
    } catch (error) { toast.error('Failed to load projects'); }
    finally { setLoading(false); }
  };

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) { await projectService.update(editingId, formData); toast.success('Updated'); }
      else { await projectService.create(formData); toast.success('Created'); }
      setModalOpen(false); setEditingId(null); resetForm(); fetchData();
    } catch (error) { toast.error(error.response?.data?.message || 'Failed'); }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({ ...item });
    setModalOpen(true);
  };

  const handleDelete = async (id) => { try { await projectService.delete(id); toast.success('Deleted'); fetchData(); } catch (e) { toast.error('Delete failed'); } };
  const handleBulkDelete = async (ids) => { try { await projectService.bulkDelete(ids); toast.success(ids.length + ' deleted'); fetchData(); } catch (e) { toast.error('Bulk delete failed'); } };
  const handleRestore = async (id) => { try { await projectService.restore(id); toast.success('Restored'); fetchData(); } catch (e) { toast.error('Restore failed'); } };
  const resetForm = () => { setFormData({ projectName: '', clientId: '', poNumber: '', poValue: '', systemSize: '', siteLocation: '', siteAddress: '', projectManager: '', startDate: '', expectedHandoverDate: '', projectStatus: 'Not Started', currentStage: 'Engineering' }); };
  const openAddModal = () => { setEditingId(null); resetForm(); setModalOpen(true); };

  return (
    <div className="space-y-4">
      <DataTable title="Project Setup" columns={columns} data={data} loading={loading} pagination={pagination}
        onPageChange={(page) => setPagination({ ...pagination, page })}
        onSearch={(term) => { setSearchTerm(term); setPagination({ ...pagination, page: 1 }); }}
        onAdd={openAddModal} onEdit={handleEdit} onDelete={handleDelete} onBulkDelete={handleBulkDelete}
        onRestore={handleRestore} showRestore={true} onRefresh={fetchData}
        searchPlaceholder="Search projects..." addButtonLabel="Add Project" showActions={true} showBulkDelete={true}
        filterOptions={[
          { value: 'Not Started', label: 'Not Started' },
          { value: 'In Progress', label: 'In Progress' },
          { value: 'On Hold', label: 'On Hold' },
          { value: 'Completed', label: 'Completed' },
          { value: 'Cancelled', label: 'Cancelled' }
        ]}
        onFilterChange={(val) => { setFilterValue(val); setPagination({ ...pagination, page: 1 }); }}
      />
      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingId(null); resetForm(); }} title={editingId ? 'Edit Project' : 'Add Project'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label><input type="text" name="projectName" value={formData.projectName} onChange={handleChange} className="input-field" required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">PO Number *</label><input type="text" name="poNumber" value={formData.poNumber} onChange={handleChange} className="input-field" required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">PO Value (Rs) *</label><input type="number" name="poValue" value={formData.poValue} onChange={handleChange} className="input-field" required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">System Size (kWp) *</label><input type="number" name="systemSize" value={formData.systemSize} onChange={handleChange} className="input-field" required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Site Location *</label><input type="text" name="siteLocation" value={formData.siteLocation} onChange={handleChange} className="input-field" required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Site Address</label><input type="text" name="siteAddress" value={formData.siteAddress} onChange={handleChange} className="input-field" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Project Manager ID</label><input type="text" name="projectManager" value={formData.projectManager} onChange={handleChange} className="input-field" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Client ID</label><input type="text" name="clientId" value={formData.clientId} onChange={handleChange} className="input-field" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label><input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="input-field" required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Expected Handover *</label><input type="date" name="expectedHandoverDate" value={formData.expectedHandoverDate} onChange={handleChange} className="input-field" required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select name="projectStatus" value={formData.projectStatus} onChange={handleChange} className="input-field">
                <option value="Not Started">Not Started</option><option value="In Progress">In Progress</option>
                <option value="On Hold">On Hold</option><option value="Completed">Completed</option><option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Current Stage</label>
              <select name="currentStage" value={formData.currentStage} onChange={handleChange} className="input-field">
                <option value="Engineering">Engineering</option><option value="Permits">Permits</option>
                <option value="Procurement">Procurement</option><option value="Civil">Civil</option>
                <option value="Installation">Installation</option><option value="Testing">Testing</option>
                <option value="Net Metering">Net Metering</option><option value="Handover">Handover</option>
              </select>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4">
            <button type="button" onClick={() => { setModalOpen(false); setEditingId(null); resetForm(); }} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{editingId ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectSetup;
