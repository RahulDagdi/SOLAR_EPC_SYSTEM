import MasterPage from "./MasterPage";

const IndustrySegmentMaster = () => {

    return (

        <MasterPage

            title="Industry Segment Master"

            api="/masters/industry-segments"

            columns={[

                {
                    title: "Industry",
                    key: "name"
                },

                {
                    title: "Code",
                    key: "code"
                }

            ]}

            fields={[

                {
                    name: "name",
                    label: "Industry Name"
                },

                {
                    name: "code",
                    label: "Industry Code"
                }

            ]}

        />

    );

};

export default IndustrySegmentMaster;