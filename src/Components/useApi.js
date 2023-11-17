// useApi.js

import { useState, useEffect } from "react";

const useApi = (url, initialData = null) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("API URL:", url);

    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const result = await response.json();

        setData(result);
        console.log(result);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useApi;
