import React, { useState, useEffect } from "react";
import axios from "axios";
import MovieBox from "./MovieBox";
import CustomPagination from "./CustomPagination";
import useApi from "./useApi";
import { BASE_API_URL, API_URL_BOLLYWOOD_MOVIES } from "./README";

const BollyWoodMovies = () => {
  const [page, setPage] = useState(1);
  const { data, loading, error } = useApi(
    BASE_API_URL + API_URL_BOLLYWOOD_MOVIES(page)
  );
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <div className="container">
        <div className="row justify-content-around">
          <h1 className="text-center fw-lighter page_heading my-3 text-black">
            Bollywood Movies
          </h1>
          {data?.results?.map((c) => {
            return (
              <MovieBox
                key={c.id}
                id={c.id}
                title={c.title || c.original_name}
                poster={c.poster_path || c.backdrop_path}
                date={c.first_air_date || c.release_date}
                vote_average={c.vote_average}
                media_type="movie"
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

export default BollyWoodMovies;
