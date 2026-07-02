import MasterPage from "./MasterPage";

const EmployeeMasterPage = () => {

    return (

        <MasterPage

            title="Employee Master"

            api="/hr/employees"

            columns={[
                { title: "Employee ID", key: "employeeId" },
                { title: "Name", key: "name" },
                { title: "Role", key: "role" },
                { title: "Department", key: "department" },
                { title: "Phone", key: "phone" }
            ]}

            fields={[
                { name: "employeeId", label: "Employee ID" },
                { name: "name", label: "Full Name" },
                { name: "role", label: "Job Role" },
                { name: "department", label: "Department" },
                { name: "phone", label: "Phone" },
                { name: "email", label: "Email" },
                { name: "dateOfJoining", label: "Date of Joining", type: "date" },
                { name: "aadhaar", label: "Aadhaar No." },
                { name: "pan", label: "PAN" },
                { name: "bankAccount", label: "Bank Account No." },
                { name: "ifscCode", label: "IFSC Code" },
                { name: "bankName", label: "Bank Name" },
                { name: "basicSalary", label: "Basic Salary", type: "number" },
                { name: "hra", label: "HRA", type: "number" },
                { name: "travelAllowance", label: "Travel Allowance", type: "number" }
            ]}

        />

    );

};

export default EmployeeMasterPage;

