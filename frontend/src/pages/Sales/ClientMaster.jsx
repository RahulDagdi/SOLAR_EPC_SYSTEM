import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { clientService } from '../../services/api';
import toast from 'react-hot-toast';

const ClientMaster = () => {
  const [data, setData] = useState([]);
  const [deletedData, setDeletedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showDeleted, setShowDeleted] = useState(false);

  const [formData, setFormData] = useState({
    clientName: '', clientCode: '', clientType: '', address: '', contactPerson: '',
    phone: '', email: '', gstin: '', pan: '', paymentTerms: '', creditLimit: ''
  });

  const columns = [
    { header: 'Client Code', accessor: 'clientCode' },
    { header: 'Name', accessor: 'clientName' },
    { header: 'Type', accessor: 'clientType', type: 'badge' },
    { header: 'Contact', accessor: 'contactPerson' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Email', accessor: 'email' },
    { header: 'Payment Terms', accessor: 'paymentTerms' },
  ];

  useEffect(() => {
    fetchData();
  }, [pagination.page, searchTerm, filterValue]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = { page: pagination.page, limit: pagination.limit, search: searchTerm };
      if (filterValue) params.clientType = filterValue;
      const res = await clientService.getAll(params);
      setData(res.data.data || []);
      setPagination(res.data.pagination || pagination);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const fetchDeleted = async () => {
    try {
      const res = await clientService.getDeleted();
      setDeletedData(res.data.data || []);
    } catch (error) {
      console.error('Fetch deleted error:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await clientService.update(editingId, formData);
        toast.success('Client updated successfully');
      } else {
        await clientService.create(formData);
        toast.success('Client created successfully');
      }
      setModalOpen(false);
      setEditingId(null);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      clientName: item.clientName || '',
      clientCode: item.clientCode || '',
      clientType: item.clientType || '',
      address: item.address || '',
      contactPerson: item.contactPerson || '',
      phone: item.phone || '',
      email: item.email || '',
      gstin: item.gstin || '',
      pan: item.pan || '',
      paymentTerms: item.paymentTerms || '',
      creditLimit: item.creditLimit || ''
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await clientService.delete(id);
      toast.success('Client deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const handleBulkDelete = async (ids) => {
    try {
      await clientService.bulkDelete(ids);
      toast.success(ids.length + ' clients deleted');
      fetchData();
    } catch (error) {
      toast.error('Bulk delete failed');
    }
  };

  const handleRestore = async (id) => {
    try {
      await clientService.restore(id);
      toast.success('Client restored successfully');
      fetchDeleted();
      fetchData();
    } catch (error) {
      toast.error('Restore failed');
    }
  };

  const resetForm = () => {
    setFormData({
      clientName: '', clientCode: '', clientType: '', address: '', contactPerson: '',
      phone: '', email: '', gstin: '', pan: '', paymentTerms: '', creditLimit: ''
    });
  };

  const openAddModal = () => {
    setEditingId(null);
    resetForm();
    setModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <DataTable
        title="Client Master"
        columns={columns}
        data={showDeleted ? deletedData : data}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => setPagination({ ...pagination, page })}
        onSearch={(term) => { setSearchTerm(term); setPagination({ ...pagination, page: 1 }); }}
        onAdd={openAddModal}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        onRestore={handleRestore}
        showRestore={true}
        deletedData={deletedData}
        onRefresh={fetchData}
        searchPlaceholder="Search clients..."
        addButtonLabel="Add Client"
        showActions={true}
        showBulkDelete={true}
        filterOptions={[
          { value: 'Industrial', label: 'Industrial' },
          { value: 'Commercial', label: 'Commercial' },
          { value: 'Govt', label: 'Govt' },
          { value: 'Residential', label: 'Residential' }
        ]}
        onFilterChange={(val) => { setFilterValue(val); setPagination({ ...pagination, page: 1 }); }}
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingId(null); resetForm(); }}
        title={editingId ? 'Edit Client' : 'Add Client'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client Name *</label>
              <input type="text" name="clientName" value={formData.clientName} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client Code *</label>
              <input type="text" name="clientCode" value={formData.clientCode} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client Type *</label>
              <select name="clientType" value={formData.clientType} onChange={handleChange} className="input-field" required>
                <option value="">Select Type</option>
                <option value="Industrial">Industrial</option>
                <option value="Commercial">Commercial</option>
                <option value="Govt">Govt</option>
                <option value="Residential">Residential</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person *</label>
              <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GSTIN</label>
              <input type="text" name="gstin" value={formData.gstin} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PAN</label>
              <input type="text" name="pan" value={formData.pan} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms (Days)</label>
              <input type="number" name="paymentTerms" value={formData.paymentTerms} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Credit Limit</label>
              <input type="number" name="creditLimit" value={formData.creditLimit} onChange={handleChange} className="input-field" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
              <textarea name="address" value={formData.address} onChange={handleChange} className="input-field" rows="3" required></textarea>
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

export default ClientMaster;
