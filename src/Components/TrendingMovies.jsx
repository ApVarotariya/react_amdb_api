import React, { useState, useEffect } from "react";
import axios from "axios";
import MovieBox from "./MovieBox";
import CustomPagination from "./CustomPagination";

const PopularMovies = () => {
  const [page, setPage] = useState(1);
  const [popular, setPopular] = useState([]);

  const fetchData = async () => {
    const result = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.REACT_APP_ACCESS_KEY}&page=${page}`
    );
    setPopular(result.data.results);
  };
  useEffect(() => {
    fetchData();
  }, [page]);
  return (
    <>
      <div className="container-fluid">
        <div className="row justify-content-around">
          <h1 className="text-center fw-lighter page_heading my-3 text-black">
            Popular Movies
          </h1>
          {popular.map((c) => {
            return (
              <MovieBox
                key={c.id}
                id={c.id}
                title={c.title || c.original_name}
                poster={c.poster_path || c.backdrop_path}
                date={c.first_air_date || c.release_date}
                vote_average={c.vote_average}
                media_type={c.media_type}
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

export default PopularMovies;
