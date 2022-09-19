import React, { useState, useEffect } from "react";
import axios from "axios";
import MovieBox from "./MovieBox";
import CustomPagination from "./CustomPagination";

const TrendingMovies = () => {
  const [page, setPage] = useState(1);
  const [trendingMovies, setTrendingMovies] = useState([]);

  const fetchData = async () => {
    const trendingMovies = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.REACT_APP_ACCESS_KEY}&page=${page}`
    );
    setTrendingMovies(trendingMovies.data.results);
    // console.log(trendingMovies.data.results);
  };
  useEffect(() => {
    fetchData();
  }, [page]);
  return (
    <>
      <div className="container-fluid">
        <div className="row justify-content-around">
          <h1 className="text-center fw-lighter page_heading mb-5">
            Popular Movies
          </h1>
          {trendingMovies.map((c) => {
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

export default TrendingMovies;
