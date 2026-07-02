import { useEffect, useState } from "react";
import axios from "axios";
import MasterPage from "./MasterPage";

const BOQItemMaster = () => {

    const [units, setUnits] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {

        axios.get("/api/masters/units").then(res => {
            setUnits(res.data.data || []);
        });

        axios.get("/api/masters/material-categories").then(res => {
            setCategories(res.data.data || []);
        });

    }, []);

    return (

        <MasterPage

            title="BOQ Item Master"

            api="/masters/boq-items"

            columns={[
                { title: "Item Name", key: "name" },
                { title: "Code", key: "code" },
                { title: "Rate", key: "rate" }
            ]}

            fields={[
                { name: "name", label: "Item Name" },
                { name: "code", label: "Item Code" },
                {
                    name: "unit",
                    label: "Unit",
                    type: "select",
                    options: units.map(u => ({ label: u.name, value: u._id }))
                },
                {
                    name: "category",
                    label: "Material Category",
                    type: "select",
                    options: categories.map(c => ({ label: c.name, value: c._id }))
                },
                { name: "rate", label: "Rate", type: "number" },
                { name: "description", label: "Description", type: "textarea" }
            ]}

        />

    );

};

export default BOQItemMaster;
