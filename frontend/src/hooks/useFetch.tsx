import { useEffect } from "react"
import { useState } from "react"
import { fetchData } from "../utils/api";

const useFetch = (endpoint : string) : { data: any, loading: boolean }=> {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDataAsync = async () => {
            setLoading(true)
            const response = await fetchData(endpoint);
            if(response.success){
                setData(response);
            }
            setLoading(false)
        }

        fetchDataAsync()

    }, [endpoint])


    return { data, loading }
}

export default useFetch