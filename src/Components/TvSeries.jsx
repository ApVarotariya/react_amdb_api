import React, { useState, useEffect } from "react";
import axios from "axios";
import MovieBox from "./MovieBox";

const API_TV_SERIES =
  "https://api.themoviedb.org/3/discover/tv?api_key=c94bf057fba6ebfedf3bab9d4ae67b1f&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_genres=${genreforURL}";

const TvSeries = () => {
  const [movies, setMovies] = useState([]);

  const fetchData = async () => {
    const movies = await axios.get(API_TV_SERIES);
    setMovies(movies.data.results);
    console.log(movies.data.results);
    console.log(movies);
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <div className="trending_page_main">
        <div className="row justify-content-around">
          <h1 className="text-center fw-lighter page_heading mb-5">
            TV Series
          </h1>
          {movies.map((movie) => {
            return <MovieBox key={movie.id} movie={movie} />;
          })}
        </div>
      </div>
    </>
  );
};

export default TvSeries;
