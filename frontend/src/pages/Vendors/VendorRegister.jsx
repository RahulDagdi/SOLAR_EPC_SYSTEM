import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import toast from 'react-hot-toast';

const VendorRegister = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

  const columns = [{ header: 'Vendor Code', accessor: 'vendorCode' }, { header: 'Vendor Name', accessor: 'vendorName' }, { header: 'Category', accessor: 'category', type: 'badge' }, { header: 'Contact', accessor: 'contactPerson' }, { header: 'Phone', accessor: 'phone' }, { header: 'Status', accessor: 'status', type: 'badge' }];

  useEffect(() => { fetchData(); }, [pagination.page, searchTerm]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setData([]);
      setPagination({ page: 1, limit: 10, total: 0, totalPages: 1 });
    } catch (error) { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.success(editingId ? 'Updated successfully' : 'Created successfully');
    setModalOpen(false); setEditingId(null); fetchData();
  };

  const handleEdit = (item) => { setEditingId(item._id); setFormData({ ...item }); setModalOpen(true); };
  const handleDelete = async (id) => { toast.success('Deleted successfully'); fetchData(); };
  const handleBulkDelete = async (ids) => { toast.success(ids.length + ' records deleted'); fetchData(); };
  const openAddModal = () => { setEditingId(null); setFormData({}); setModalOpen(true); };

  return (
    <div className="space-y-4">
      <DataTable
        title="Vendor Register"
        columns={columns}
        data={data}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => setPagination({ ...pagination, page })}
        onSearch={(term) => { setSearchTerm(term); setPagination({ ...pagination, page: 1 }); }}
        onAdd={openAddModal}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        onRefresh={fetchData}
        searchPlaceholder="Search..."
        addButtonLabel="Add New"
        showActions={true}
        showBulkDelete={true}
      />
      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingId(null); }}
        title={editingId ? 'Edit Vendor Register' : 'Add Vendor Register'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-gray-500 text-center py-8">Form fields for Vendor Register - Add your fields here</p>
          <div className="flex items-center justify-end gap-3">
            <button type="button" onClick={() => { setModalOpen(false); setEditingId(null); }} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{editingId ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default VendorRegister;
