import MasterPage from "./MasterPage";

const DistrictMaster = () => {

    return (

        <MasterPage

            title="District Master"

            api="/masters/districts"

            columns={[

                {
                    title: "District",
                    key: "name"
                },

                {
                    title: "District Code",
                    key: "districtCode"
                }

            ]}

            fields={[

                {
                    name: "name",
                    label: "District Name"
                },

                {
                    name: "districtCode",
                    label: "District Code"
                }

            ]}

        />

    );

};

export default DistrictMaster;