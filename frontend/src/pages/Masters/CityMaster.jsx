// import MasterPage from "./MasterPage";

// const CityMaster = () => {

//     return (

//         <MasterPage

//             title="City Master"

//             api="/masters/cities"

//             columns={[

//                 {
//                     title: "City",
//                     key: "name"
//                 },

//                 {
//                     title: "City Code",
//                     key: "cityCode"
//                 }

//             ]}

//             fields={[

//                 {
//                     name: "name",
//                     label: "City Name"
//                 },

//                 {
//                     name: "cityCode",
//                     label: "City Code"
//                 }

//             ]}

//         />

//     );

// };

// export default CityMaster;


import { useEffect, useState } from "react";
import axios from "axios";
import MasterPage from "./MasterPage";

const CityMaster = () => {

    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);

    useEffect(() => {

        axios.get("/api/masters/countries")
            .then(res => setCountries(res.data.data || []));

        axios.get("/api/masters/states")
            .then(res => setStates(res.data.data || []));

    }, []);

    return (
    

        <MasterPage

            title="City Master"

            api="/masters/cities"

            columns={[


                   {
                    title: "City",
                    key: "name"
                },
                {
                    title: "City Code",
                    key: "cityCode"
                },
             
                {
                    title: "State",
                    key: "state.name"
                },
                   {
                    title: "Country",
                    key: "country.name"
                },
             
            ]}

            fields={[
          


                {
                    name: "name",
                    label: "City Name"
                },

                {
                    name: "cityCode",
                    label: "City Code"
                },

             

                {
                    name: "state",
                    label: "State",
                    type: "select",
                    options: states.map(s => ({
                        label: s.name,
                        value: s._id
                    }))
                },

                   {
                    name: "country",
                    label: "Country",
                    type: "select",
                    options: countries.map(c => ({
                        label: c.name,
                        value: c._id
                    }))
                },


            ]}

        />

    );

};

export default CityMaster;