

import { Link } from "react-router-dom";

const masters = [

    {
        name: "Country",
        path: "/masters/countries"
    },

    {
        name: "State",
        path: "/masters/states"
    },

    // {
    //     name: "District",
    //     path: "/masters/districts"
    // },

    {
        name: "City",
        path: "/masters/cities"
    },

    {
        name: "Currency",
        path: "/masters/currencies"
    },

    {
        name: "Customer Type",
        path: "/masters/customer-types"
    },

    {
        name: "Industry Segment",
        path: "/masters/industry-segments"
    },

    {
        name: "MSME Status",
        path: "/masters/msme-status"
    },

    {
        name: "Customer Status",
        path: "/masters/customer-status"
    },

    {
        name: "Department",
        path: "/masters/departments"
    },

    {
        name: "Designation",
        path: "/masters/designations"
    },

    {
        name: "Unit",
        path: "/masters/units"
    },

    {
        name: "Material Category",
        path: "/masters/material-categories"
    },

    {
        name: "Work Type",
        path: "/masters/work-types"
    },

    {
        name: "Expense Type",
        path: "/masters/expense-types"
    },

    {
        name: "Payment Terms",
        path: "/masters/payment-terms"
    },

    {
        name: "Tax",
        path: "/masters/taxes"
    },

    {
        name: "Project Stage",
        path: "/masters/project-stages"
    },

    {
        name: "Approval Level",
        path: "/masters/approval-levels"
    },

    {
        name: "Project Site",
        path: "/masters/project-sites"
    },

    {
        name: "BOQ Item",
        path: "/masters/boq-items"
    },

    {
        name: "Customer Master",
        path: "/sales/clients"
    },

    {
        name: "Supplier Master",
        path: "/vendors"
    },

    {
        name: "Vendor Master",
        path: "/vendors"
    },

    {
        name: "Employee Master",
        path: "/hr/employees"
    },

    {
        name: "Project Master",
        path: "/projects"
    },

    {
        name: "Roles Master",
        path: "/admin/roles"
    }

];

const MastersDashboard = () => {

    return (

        <div className="p-6">

            <h1 className="text-3xl font-bold mb-8">
                Masters
            </h1>

            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-5">

                {
                    masters.map((item)=>(

                        <Link
                            key={item.name}
                            to={item.path}
                            className="border rounded-xl shadow hover:shadow-lg transition p-6 bg-white"
                        >

                            <h2 className="text-lg font-semibold">
                                {item.name}
                            </h2>

                        </Link>

                    ))
                }

            </div>

        </div>

    );

};

export default MastersDashboard;