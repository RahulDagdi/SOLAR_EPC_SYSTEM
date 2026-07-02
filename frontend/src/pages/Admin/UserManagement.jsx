// import React, { useState, useEffect } from 'react';
// import DataTable from '../../components/DataTable';
// import Modal from '../../components/Modal';
// import toast from 'react-hot-toast';


import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import toast from 'react-hot-toast';
// import api from '../../services/api'; // path verify kar lena
import { userService } from '../../services/api';

import { useAuth } from "../../context/AuthContext";


const UserManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const { user } = useAuth();

  
  //  Role options admin 
const adminRoles = [
  "finance_manager",
  "project_manager",
  "hr_manager",
  "site_supervisor",
  "sales_executive",
  "accountant",
  "vendor"
];
  
  
  // const [formData, setFormData] = useState({});
 const [formData, setFormData] = useState({

name:"",
email:"",
password:"",
role:"",

companyName:"",
companyCode:"",
gstin:"",
pan:"",
address:"",
state:"",
city:"",
  isActive: true
});




  // const columns = [
  //   { header: 'Name', accessor: 'name' },
  //    { header: 'Email', accessor: 'email' }, 
  //    { header: 'Role', accessor: 'role', type: 'badge' },
  //   //  { header: 'Organization', accessor: 'organizationId' },
  //   // { header: 'Organization',  accessor: (row) => row.organizationId?.name || 'N/A'},
  //   { header: 'Organization', accessor: 'organizationName' },
  //     { header: 'Active', accessor: 'isActive', type: 'badge' },
  //      { header: 'Last Login', accessor: 'lastLogin', type: 'date' }
  //     ];

  const columns = [

{
header:"Name",
accessor:"name"
},

{
header:"Email",
accessor:"email"
},

{
header:"Role",
accessor:"role",
type:"badge"
},

...(user?.role==="super_admin"
?[
{
header:"Organization",
accessor:"organizationName"
}
]
:[]),

{
header:"Active",
accessor:"isActive",
type:"badge"
},

{
header:"Last Login",
accessor:"lastLogin",
type:"date"
}

];

  useEffect(() => { fetchData(); }, [pagination.page, searchTerm]);

// const fetchCompanies = async () => {

//  try{

//    const res = await companyService.getAll();

//    setCompanies(res.data.data);

//  }catch(err){

//    console.log(err);

//  }

// };

// useEffect(() => {

//  fetchData();
//  fetchCompanies();

// }, []);


useEffect(() => {
 fetchData();
}, []);
 
const fetchData = async () => {
  try {
    setLoading(true);

    const res = await userService.getAll({
      page: pagination.page,
      limit: pagination.limit,
      search: searchTerm
    });

    // setData(res.data.data);
    console.log(res.data.data);

setData(
  res.data.data.map(user => ({
    ...user,

    organizationName:
      user.organizationId?.name || 'N/A'
  }))
);



    setPagination(res.data.pagination);

  } catch (error) {
    toast.error('Failed to load users');
  } finally {
    setLoading(false);
  }
};


 const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });

  console.log(e.target.name, e.target.value);
};


const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("FORM DATA =>", formData);
    console.log("SENDING =>", formData);

  try {

    if (editingId) {

      await userService.update(editingId, {
        name: formData.name,
        email: formData.email,
        role: formData.role
      });

      toast.success('User updated');

    } else {

//     await userService.create({
//  name: formData.name,
//  email: formData.email,
//  password: formData.password,
//  role: formData.role,
//  organizationId: formData.organizationId
// });

await userService.create(formData);
      toast.success('User created');
    }

    setModalOpen(false);
    console.log("MODAL STATE =>", modalOpen);

    if (document.activeElement) {
      document.activeElement.blur();
    }

    setEditingId(null);

setFormData({

name:"",
email:"",
password:"",
role:"",

companyName:"",
companyCode:"",
gstin:"",
pan:"",
address:"",
state:"",
city:"",

isActive:true

});

    fetchData();

  } catch (error) {

    toast.error(
      error?.response?.data?.message || 'Operation failed'
    );
  }
};


  const handleEdit = (item) => { setEditingId(item._id); setFormData({ ...item }); setModalOpen(true); };

const handleDelete = async (id) => {
  try {

    await userService.delete(id);

    toast.success('User deleted');

    fetchData();

  } catch (error) {

    toast.error(
      error?.response?.data?.message || 'Delete failed'
    );
  }
};
 
  const handleBulkDelete = async (ids) => { toast.success(ids.length + ' records deleted'); fetchData(); };
  // const openAddModal = () => { setEditingId(null); setFormData({}); setModalOpen(true); };
const openAddModal = () => {
  setEditingId(null);

 setFormData({

name:"",
email:"",
password:"",
role:"",

companyName:"",
companyCode:"",
gstin:"",
pan:"",
address:"",
state:"",
city:"",

isActive:true

});

  setModalOpen(true);
};
  return (
    <div className="space-y-4">
      <DataTable
        title="User Management"
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
        title={editingId ? 'Edit User Management' : 'Add User Management'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* <p className="text-gray-500 text-center py-8">Form fields for User Management - Add your fields here</p> */}

<div className="grid grid-cols-2 gap-4">

  <div>
    <label>Name</label>
    <input
      type="text"
      name="name"
      value={formData.name || ''}
      onChange={handleChange}
      className="w-full border rounded p-2"
      required
    />
  </div>

  <div>
    <label>Email</label>
    <input
      type="email"
      name="email"
      value={formData.email || ''}
      onChange={handleChange}
      className="w-full border rounded p-2"
      required
    />
  </div>

  {!editingId && (
    <div>
      <label>Password</label>
      <input
        type="password"
        name="password"
        value={formData.password || ''}
        onChange={handleChange}
        className="w-full border rounded p-2"
        required
      />
    </div>
  )}

  <div>
    <label>Role</label>



 {/* <select
  name="role"
  value={formData.role || ""}
  onChange={handleChange}
      className="w-full border rounded p-2"
    >
   <option value="">Select Role</option>
  <option value="admin">Admin</option>
  <option value="finance_manager">Finance Manager</option>
  <option value="project_manager">Project Manager</option>
  <option value="hr_manager">HR Manager</option>
  <option value="site_supervisor">Site Supervisor</option>
  <option value="sales_executive">Sales Executive</option>
  <option value="accountant">Accountant</option>
  <option value="vendor">Vendor</option>
</select> */}

{/* <select
  name="role"
  value={formData.role}
  onChange={handleChange}
  className="w-full border rounded p-2"
>
  <option value="">Select Role</option>

  {user?.role === "super_admin" && (
    <option value="admin">Admin</option>
  )}

  <option value="finance_manager">Finance Manager</option>
  <option value="project_manager">Project Manager</option>
  <option value="hr_manager">HR Manager</option>
  <option value="site_supervisor">Site Supervisor</option>
  <option value="sales_executive">Sales Executive</option>
  <option value="accountant">Accountant</option>
  <option value="vendor">Vendor</option>
</select> */}

<select
  name="role"
  value={formData.role}
  onChange={handleChange}
  className="w-full border rounded p-2"
>
  <option value="">
    Select Role
  </option>

  {user?.role === "super_admin" && (
    <option value="admin">
      Admin
    </option>
  )}

  {adminRoles.map((role) => (
    <option
      key={role}
      value={role}
    >
      {role.replaceAll("_", " ")}
    </option>
  ))}
</select>
  </div>


{
user?.role==="super_admin" && (

<>

<hr className="my-4"/>

<h3 className="font-bold text-lg">
Company Details
</h3>

<div>

<label>Company Name</label>

<input
name="companyName"
value={formData.companyName}
onChange={handleChange}
required={user?.role==="super_admin"}
className="w-full border rounded p-2"
/>

</div>

<div>

<label>Company Code</label>

<input
name="companyCode"
value={formData.companyCode}
onChange={handleChange}
required={user?.role==="super_admin"}
className="w-full border rounded p-2"
/>

</div>

<div>

<label>GSTIN</label>

<input
name="gstin"
value={formData.gstin}
onChange={handleChange}
className="w-full border rounded p-2"
/>

</div>

<div>

<label>PAN</label>

<input
name="pan"
value={formData.pan}
onChange={handleChange}
className="w-full border rounded p-2"
/>

</div>

<div>

<label>State</label>

<input
name="state"
value={formData.state}
onChange={handleChange}
required={user?.role==="super_admin"}
className="w-full border rounded p-2"
/>

</div>

<div>

<label>City</label>

<input
name="city"
value={formData.city}
onChange={handleChange}
required={user?.role==="super_admin"}
className="w-full border rounded p-2"
/>

</div>

<div className="col-span-2">

<label>Address</label>

<textarea
name="address"
value={formData.address}
onChange={handleChange}
required={user?.role==="super_admin"}
className="w-full border rounded p-2"
/>

</div>

</>

)}




</div>

          <div className="flex items-center justify-end gap-3">
            <button type="button" onClick={() => { setModalOpen(false); setEditingId(null); }} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{editingId ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserManagement;
