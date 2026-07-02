import React,{useEffect,useState} from "react";
import {roleService} from "../../services/api";

const RoleManagement=()=>{

const [roles,setRoles]=useState([]);

useEffect(()=>{

loadRoles();

},[]);

const loadRoles=async()=>{

const res=await roleService.getAll();

setRoles(res.data.data);

};

return(

<div>

<h2 className="text-2xl font-bold mb-5">

Role Management

</h2>

<table className="table-auto w-full">

<thead>

<tr>

<th>Name</th>

</tr>

</thead>

<tbody>

{

roles.map(role=>(

<tr key={role._id}>

<td>{role.name}</td>

</tr>

))

}

</tbody>

</table>

</div>

);

};

export default RoleManagement;