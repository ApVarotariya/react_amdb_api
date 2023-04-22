import React, { useState, useEffect } from "react";
import axios from "axios";
import MovieBox from "./MovieBox";
import CustomPagination from "./CustomPagination";

const LatestTrailers = () => {
  const [page, setPage] = useState(1);
  const [latestTrailers, setLatestTrailers] = useState([]);

  const fetchData = async () => {
    const latestTrailers = await axios.get(
      `https://api.themoviedb.org/3/person/popular?api_key=${process.env.REACT_APP_ACCESS_KEY}`
    );
    setLatestTrailers(latestTrailers.data.results);
    console.log(latestTrailers);
  };
  useEffect(() => {
    fetchData();
  }, [page]);
  return (
    <>
      <div className="container-fluid">
        <div className="row justify-content-around">
          <h1 className="text-center fw-lighter page_heading my-3 text-black">
            latestTrailers
          </h1>
          {latestTrailers?.map((c) => {
            console.log(c);
            return (
              <MovieBox
                key={c.id}
                id={c.id}
                title={c.name}
                poster={c.profile_path}
                vote_average={c.vote_average}
                media_type="person"
                overview={c.overview}
                vote_count={c.vote_count}
                popularity={c.popularity}
              />
            );
          })}
        </div>
        <CustomPagination setPage={setPage} />
      </div>
    </>
  );
};

export default LatestTrailers;
