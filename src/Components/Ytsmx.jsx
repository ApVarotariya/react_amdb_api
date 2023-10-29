import axios from "axios";
import React, { useEffect, useState } from "react";
import CustomPagination from "./CustomPagination";

const YtsmxStream = () => {
  const [stream, setStream] = useState();
  const [page, setPage] = useState(1);
  const [numOfPages, setNumOfPages] = useState();

  const fetchStream = async () => {
    const { data } = await axios.get(
      `https://yts.mx/api/v2/list_movies.json?page=${page}`
    );
    setStream(data.data);
    const numOfPages =
      Math.floor(data.data.movie_count / 20) +
      (data.data.movie_count % 20 > 0 ? 1 : 0);
    setNumOfPages(numOfPages);
    console.log(data.data);
  };

  useEffect(() => {
    fetchStream();
  }, [page]);

  return (
    <>
      <CustomPagination setPage={setPage} numOfPages={numOfPages} />
    </>
  );
};

export default YtsmxStream;
