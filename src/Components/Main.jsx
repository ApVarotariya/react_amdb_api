import axios from "axios";
import React, { useState, useEffect } from "react";
import MovieBox from "./MovieBox";
import CustomPagination from "./CustomPagination";

const API_URL =
  "https://api.themoviedb.org/3/movie/popular?api_key=c94bf057fba6ebfedf3bab9d4ae67b1f&page=${page}";

const Main = () => {
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fetchData = async () => {
    setIsLoading(true);
    const movies = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=c94bf057fba6ebfedf3bab9d4ae67b1f&page=${page}`
    );
    setMovies(movies.data.results);
    // console.log(movies.data.results);
    // console.log(movies);
    setIsLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, [page]);

  return (
    <>
      <div className="moviecard_main">
        <div className="container-fluid">
          <div className="row">
            <h1 className="text-center fw-lighter page_heading mb-5">
              Popular Movies
            </h1>
            {movies.map((movie) => {
              return <MovieBox key={movie.id} movie={movie} />;
            })}
          </div>
          <CustomPagination setPage={setPage} />
        </div>
      </div>
    </>
  );
};

export default Main;
