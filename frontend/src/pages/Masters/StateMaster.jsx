// import { useEffect, useState } from "react";
// import axios from "axios";
// import MasterPage from "./MasterPage";

// const StateMaster = () => {

//     const [countries, setCountries] = useState([]);

//     useEffect(() => {

//         axios
//             .get("/api/masters/countries")
//             .then(res => {

//                 setCountries(res.data.data || []);

//             });

//     }, []);

//     return (

//         <MasterPage

//             title="State Master"

//             api="/masters/states"

//             columns={[
//                 {
//                     title: "State",
//                     key: "name"
//                 },
//                 {
//                     title: "State Code",
//                     key: "stateCode"
//                 },
//                 {
//                     title: "Country",
//                     key: "country.name"
//                 }
//             ]}

//             fields={[
//                 {
//                     name: "name",
//                     label: "State Name"
//                 },
//                 {
//                     name: "stateCode",
//                     label: "State Code"
//                 },
//                 {
//                     name: "country",
//                     label: "Country",
//                     type: "select",
//                     options: countries.map(c => ({
//                         label: c.name,
//                         value: c._id
//                     }))
//                 }
//             ]}

//         />

//     );

// };

// export default StateMaster;

import { useEffect, useState } from "react";
import axios from "axios";
import MasterPage from "./MasterPage";

const StateMaster = () => {

    const [countries, setCountries] = useState([]);

    useEffect(() => {

        axios
            .get("/api/masters/countries")
            .then(res => {

                setCountries(res.data.data || []);

            });

    }, []);

    return (

        <MasterPage

            title="State Master"

            api="/masters/states"

            columns={[
                {
                    title: "State",
                    key: "name"
                },
                {
                    title: "State Code",
                    key: "stateCode"
                },
                {
                    title: "Country",
                    key: "country.name"
                }
            ]}

            fields={[
                {
                    name: "name",
                    label: "State Name"
                },
                {
                    name: "stateCode",
                    label: "State Code"
                },
                {
                    name: "country",
                    label: "Country",
                    type: "select",
                    options: countries.map(item => ({
                        label: item.name,
                        value: item._id
                    }))
                }
            ]}

        />

    );

};

export default StateMaster;