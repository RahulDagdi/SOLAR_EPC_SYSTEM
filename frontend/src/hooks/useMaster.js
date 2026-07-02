import { useEffect, useState } from "react";
import masterService from "../services/masterService";

const useMaster = (apiUrl) => {

    const [data, setData] = useState([]);

    const [loading, setLoading] = useState(true);

    const loadData = async () => {

        try {

            const res = await masterService.getAll(apiUrl);

            setData(res.data.data || []);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadData();

    }, []);

    return {

        data,

        loading,

        reload: loadData

    };

};

export default useMaster;