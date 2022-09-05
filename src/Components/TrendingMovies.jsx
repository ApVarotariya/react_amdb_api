import React, { useState, useEffect } from "react";
import axios from "axios";
import MovieBox from "./MovieBox";
import CustomPagination from "./CustomPagination";

const API_URL =
  "https://api.themoviedb.org/3/trending/all/day?api_key=c94bf057fba6ebfedf3bab9d4ae67b1f&page=${page}";

const TrendingMovies = () => {
  const [page, setPage] = useState(1);
  const [trendingMovies, setTrendingMovies] = useState([]);

  const fetchData = async () => {
    const trendingMovies = await axios.get(
      `https://api.themoviedb.org/3/trending/all/day?api_key=c94bf057fba6ebfedf3bab9d4ae67b1f&page=${page}`
    );
    setTrendingMovies(trendingMovies.data.results);
    // console.log(trendingMovies.data.results);
    // console.log(trendingMovies);
  };
  useEffect(() => {
    fetchData();
  }, [page]);
  return (
    <>
      <div className="container-fluid">
        <div className="row justify-content-around">
          <h1 className="text-center fw-lighter page_heading mb-5">
            Trending Movies
          </h1>
          {trendingMovies.map((movie) => {
            return <MovieBox key={movie.id} movie={movie} />;
          })}
        </div>
        <CustomPagination setPage={setPage} />
      </div>
    </>
  );
};

export default TrendingMovies;
