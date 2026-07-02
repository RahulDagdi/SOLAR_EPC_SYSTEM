// import MasterPage from "./MasterPage";

// const CurrencyMaster=()=>{

// return(

// <MasterPage

// title="Currency Master"

// api="/masters/currencies"

// columns={[

// {

// title:"Currency",

// key:"currencyName"

// },

// {

// title:"Code",

// key:"currencyCode"

// },

// {

// title:"Symbol",

// key:"currencySymbol"

// }

// ]}

// fields={[

// {

// name:"currencyName",

// label:"Currency"

// },

// {

// name:"currencyCode",

// label:"Currency Code"

// },

// {

// name:"currencySymbol",

// label:"Symbol"

// }

// ]}

// />

// )

// }

// export default CurrencyMaster;


import MasterPage from "./MasterPage";

const CurrencyMaster = () => {
    return (
        <MasterPage
            title="Currency Master"
            api="/masters/currencies"
            columns={[
                { title: "Currency", key: "name" },
                { title: "Code", key: "code" },
                { title: "Symbol", key: "symbol" }
            ]}
            fields={[
                { name: "name", label: "Currency Name" },
                { name: "code", label: "Currency Code" },
                { name: "symbol", label: "Symbol" }
            ]}
        />
    );
};

export default CurrencyMaster;