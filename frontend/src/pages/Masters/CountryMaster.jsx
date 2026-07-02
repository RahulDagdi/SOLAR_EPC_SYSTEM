import MasterPage from "./MasterPage";

const CountryMaster = () => {

    return (

        <MasterPage

            title="Country Master"

            api="/masters/countries"

            columns={[

                {

                    title:"Country",

                    key:"name"

                },

                {

                    title:"ISO Code",

                    key:"isoCode"

                },

                {

                    title:"Phone Code",

                    key:"phoneCode"

                }

            ]}

            fields={[

                {

                    name:"name",

                    label:"Country Name"

                },

                {

                    name:"isoCode",

                    label:"ISO Code"

                },

                {

                    name:"phoneCode",

                    label:"Phone Code"

                }

            ]}

        />

    );

};

export default CountryMaster;